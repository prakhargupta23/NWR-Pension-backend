import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processUserQuery } from "../src/service/assistant.service";
import { getBasicAndCommutationData } from "../src/service/debitscroll.service";
import { expenditureService } from "../src/service/expenditure.service";
import sequelize from "../src/config/sequelize";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // Call the insertData function
    console.log("retrieve data")
    const result = await expenditureService.getExpenditureData();
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
    context.res = {
      status: 500,
      body: { success: false, message: `Error: ${error.message}` },
      headers: {
        "Access-Control-Allow-Origin": "https://nwr.expenditure.degreemaster.ai", // 👈 Add this
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
  }
};

export default httpTrigger;
