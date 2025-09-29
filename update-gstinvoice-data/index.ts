import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { updateExpenditureReportData } from "../src/service/expenditure.service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    console.log("finance note data updating");
    const { row } = req.body;

    console.log(row)

    const result = await updateExpenditureReportData(row);
    
    // Return success response
    context.res = {
      status: 200,
      body: {
        success: true,
        message: "note data retrieved successfully",
        data: result,
      },
    };
  } catch (error) {
    console.error("Error retrieving note data:", error);
    // Handle errors and return response
    context.res = {
      status: 500,
      body: { 
        success: false, 
        message: `Error retrieving note data: ${error.message}` 
      },
    };
  }
};

export default httpTrigger; 