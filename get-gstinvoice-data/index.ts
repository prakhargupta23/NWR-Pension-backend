import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { expenditureService } from "../src/service/expenditure.service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    console.log("Retrieving GST Invoice data");
    const result = await expenditureService.getGstInvoiceData();
    
    // Return success response
    context.res = {
      status: 200,
      body: {
        success: true,
        message: "GST Invoice data retrieved successfully",
        data: result,
      },
    };
  } catch (error) {
    console.error("Error retrieving GST Invoice data:", error);
    // Handle errors and return response
    context.res = {
      status: 500,
      body: { 
        success: false, 
        message: `Error retrieving GST Invoice data: ${error.message}` 
      },
    };
  }
};

export default httpTrigger; 