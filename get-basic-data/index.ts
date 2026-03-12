import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processUserQuery } from "../src/service/assistant.service";
import { getBasicAndCommutationData } from "../src/service/debitscroll.service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // Call the insertData function
    const { category, month, year } = req.query;
    const formattedMonth = month && year ? `${month.padStart(2, "0")}/${year}` : undefined;

    console.log("Request received for category:", category, "month:", formattedMonth);
    const result = await getBasicAndCommutationData(category, formattedMonth);
    console.log("basic data result", result.length);
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
