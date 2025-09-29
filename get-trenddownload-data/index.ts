import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processUserQuery } from "../src/service/assistant.service";
import {
  getActivePensionersResponse,
  getAgeData,
  getBasicAndCommutationData,
  getPieCsvDownloadData,
  getSbiMasterAndUnlinkedJoinData,
  getTrendCsvDownloadData,
} from "../src/service/debitscroll.service";
import { getAgeSqlData } from "../src/utils/sqlUtils";

const jwt = require("jsonwebtoken");
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    let { month, categoryType, pieDataType } = req.body.data;

    // Call the insertData function
    const result = await getTrendCsvDownloadData(
      categoryType,
      pieDataType,
      month
    );
    // Return success response
    context.res = {
      status: 200,
      body: result,
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
