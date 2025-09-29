import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import insertData, { insertTrendData } from "../src/service/dataInsert.service";
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    console.log(req.body);

    // Extract tableName and dataArray from the request body
    const { tableName, data, month } = req.body;

    // Validate request body
    if (!tableName || !Array.isArray(data) || data.length === 0) {
      context.res = {
        status: 400,
        body: {
          success: false,
          message:
            "Invalid request. Provide tableName and a non-empty dataArray.",
        },
      };
      return;
    }

    // Call the insertData function
    const result = await insertTrendData(tableName.toLowerCase(), data, month);

    // Return success response
    context.res = {
      status: 200,
      body: {
        success: true,
        message: "Data inserted successfully",
        data: result,
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
