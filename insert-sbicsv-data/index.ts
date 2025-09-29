import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { insertSbiCsvData } from "../src/service/dataInsert.service";
import { insertSbiCsvlog } from "../src/service/pensionlog.service";
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // Extract tableName and dataArray from the request body
    const { data, username } = req.body;

    // Call the insertData function
    const result = await insertSbiCsvData(data);
    console.log("Result from insertSbiCsvData:", result);
    if(result.success) {
      // Log the successful insertion
      await insertSbiCsvlog(username, "Success");
    } else {
      // Log the failure
      await insertSbiCsvlog(username, "Failure");
    }
    // Return success response
    context.res = {
      status: 200,
      body: { ...result },
    };
  } catch (error) {
    console.log(error);

    // Handle errors and return response
    context.res = {
      status: 200,
      body: { success: false, message: `Error: ${error.message}` },
    };
  }
};

export default httpTrigger;
