import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processUserQuery } from "../src/service/assistant.service";
import {
  getActivePensionersResponse,
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
    const { month, year } = req.query;
    const formattedMonth = month && year ? `${month.padStart(2, "0")}/${year}` : undefined;

    // Call the insertData function
    const result = await getActivePensionersResponse(formattedMonth);
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
