import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processUserQuery } from "../src/service/assistant.service";
import { getBasicAndCommutationData } from "../src/service/debitscroll.service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // Call the insertData function
    console.log("Request received");
    const result = await getBasicAndCommutationData(req.query.category);
    // Return success response
    context.res = {
      status: 200,
      body: {
        success: true,
        message: "Data queried successfully",
        data: result,
      },
    };
  } catch (error) {
    // Handle errors and return response
    console.error("Error in get-basic-data function:", error.message);
    
    context.res = {
      status: 500,
      body: { success: false, message: `Error: ${error.message}` },
    };
  }
};

export default httpTrigger;
