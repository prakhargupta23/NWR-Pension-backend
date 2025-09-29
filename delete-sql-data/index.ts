import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import insertData, {
  deleteSqlData,
  getTableDetails,
} from "../src/service/dataInsert.service";
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // Call the insertData function
    const result = await deleteSqlData();

    // Return success response
    context.res = {
      status: 200,
      body: {
        ...result,
      },
    };
  } catch (error) {
    // Handle errors and return response
    context.res = {
      status: 500,
      body: { success: false, message: `Error: ${error.message}` },
    };
  }
};

export default httpTrigger;
