import { AzureOpenAI } from "openai";
import { getQueryData } from "./dataInsert.service";
const axios = require("axios");

// Ensure required environment variables are set
const requiredEnvVars = ["azureOpenAiGpt4oKey", "azureOpenAiDalleUrl"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar])
    throw new Error(`Missing environment variable: ${envVar}`);
});

// Get environment variables
const azureOpenAIKey = process.env.azureOpenAiGpt4oKey!;
const azureOpenAIEndpoint = process.env.azureOpenAiDalleUrl!;
const azureOpenAIDeployment = "gpt-4o";
const openAIVersion = "2025-01-01-preview";

// Initialize OpenAI Assistants API
const openAIClient = new AzureOpenAI({
  endpoint: azureOpenAIEndpoint,
  apiVersion: openAIVersion,
  apiKey: azureOpenAIKey,
});

/**
 * Processes a user's request by:
 * 1. Generating an SQL query
 * 2. Fetching data from the Azure Function
 * 3. Generating JavaScript code to process the data
 * 4. Executing the generated code and returning the result
 */
export async function processUserQuery(
  userRequest: string,
  pageName: string,
  threadId?: string
): Promise<any> {
  let run;

  let sqlQuery;

  try {
    // 🔹 Step 1: Create Assistant with Function Calling & Code Execution

    // Fetch instructions from public JSON link
    const jsonUrl =
      "https://reshapestorage.blob.core.windows.net/reshape-public/railway.json"; // Replace with actual URL
    const response = await axios.get(jsonUrl);
    let instructionsFromJson;
    if (pageName === "pensionDashboard") {

      instructionsFromJson = response.data.instructions;
    } else {

      instructionsFromJson = response.data.pfaPrompt;
    }
    // Adjust if JSON structure is different

    const assistant = await openAIClient.beta.assistants.create({
      model: azureOpenAIDeployment,
      name: "SQL & Data Processor",
      instructions: instructionsFromJson,

      tools: [
        {
          type: "function",
          function: {
            name: "getQueryData",
            description: "Executes the SQL query and returns the results",
            parameters: {
              type: "object",
              properties: {
                sqlQuery: {
                  type: "string",
                  description: "SQL query to execute",
                },
              },
              required: ["sqlQuery"],
            },
          },
        },
        { type: "code_interpreter" },
      ],
    });

    var thread;

    if (!threadId) {
      thread = await openAIClient.beta.threads.create();
    } else {
      thread = await openAIClient.beta.threads.retrieve(threadId);
    }

    await openAIClient.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `I need to: ${userRequest}`,
    });

    console.log(`🟢 Running Assistant (it will call tools as needed)...`);

    run = await openAIClient.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    // 🔹 Step 3: Process Assistant's Tool Calls Until Completion
    while (run.status === "requires_action") {
      const toolCalls =
        run.required_action?.submit_tool_outputs?.tool_calls || [];

      let toolOutputs = [];

      for (const toolCall of toolCalls) {
        if (toolCall.function.name === "getQueryData") {
          sqlQuery = JSON.parse(toolCall.function.arguments).sqlQuery;
          console.log(`🔹 Assistant requested SQL execution:\n${sqlQuery}`);

          // Call the getQueryData function
          const queryResult = await getQueryData(sqlQuery);

          toolOutputs.push({
            tool_call_id: toolCall.id,
            output: JSON.stringify(queryResult),
          });
        }
      }

      // Submit all tool outputs at once
      if (toolOutputs.length > 0) {
        console.log("🔹 Submitting tool outputs...");
        run = await openAIClient.beta.threads.runs.submitToolOutputsAndPoll(
          thread.id,
          run.id,
          { tool_outputs: toolOutputs }
        );
      } else {
        console.log("❌ No tool outputs to submit.");
      }
    }

    // 🔹 Step 4: Get Final Response (Text & Image)
    let finalText = "";
    let finalImage = "";

    if (run.status === "completed") {
      const messages = await openAIClient.beta.threads.messages.list(thread.id);

      for await (const runMessageDatum of messages) {
        for (const item of runMessageDatum.content) {
          if (item.type === "text" && finalText == "") {
            finalText = item.text?.value;
          }

          if (item.type === "image_file" && finalImage == "") {
            console.log(`🔹 Fetching image file: ${item.image_file.file_id}`);
            // finalImage = item.image_file.file_id;

            // Fetch the image from OpenAI API
            const resp = await openAIClient.files.content(
              item.image_file.file_id
            );

            const arrayBuffer = await resp.arrayBuffer();

            // Convert array buffer to base64
            finalImage = Buffer.from(arrayBuffer).toString("base64");

            console.log(`🔹 Image fetched: ${finalImage.length} bytes`);

            // Convert image bytes to base64
            // finalImage = `data:image/png;base64,${imageBytes}`;

            // if (resp.status_code === 200) {
            //   const imageData = Buffer.from(resp.data).toString("base64");
            //   finalImage = `data:image/png;base64,${imageData}`;
            // } else {
            //   console.error("❌ Failed to fetch image");
            // }
          }
        }

        if (finalImage != "" || finalText != "") {
          break;
        }
      }

      if (!finalText && !finalImage)
        throw new Error("No valid response found.");

      return {
        reply: finalText,
        image: finalImage, // Return undefined if no image
        thread_id: !threadId ? thread.id : null,
        sqlQuery: sqlQuery,
      };
    } else {
      console.log(`❌ Assistant run failed: ${run.last_error?.message}`);

      // stop the assistant
      try {
        await openAIClient.beta.threads.runs.cancel(thread.id, run.id);
      } catch (e) {
        console.error("❌ Error while stopping assistant:", e);
      }

      throw new Error("Assistant run failed.");
    }
  } catch (error) {
    console.error("❌ Error processing user query:", error);

    // stop the assistant
    try {
      await openAIClient.beta.threads.runs.cancel(thread.id, run.id);
    } catch (e) {
      console.error("❌ Error while stopping assistant:", e);
    }

    throw new Error("Failed to process user query:" + sqlQuery + " " + error);
  }
}
