import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processUserQuery } from "../src/service/assistant.service";
import {
  getAgeData,
  getBasicAndCommutationData,
} from "../src/service/debitscroll.service";
import { getAgeSqlData } from "../src/utils/sqlUtils";

const jwt = require("jsonwebtoken");
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // Call the insertData function
    const result = await getAgeData(req.query.month);
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
    };
  }
};

export default httpTrigger;
