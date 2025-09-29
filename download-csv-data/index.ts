import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processUserQuery } from "../src/service/assistant.service";
import { getSbiMasterAndUnlinkedJoinDatalog } from "../src/service/pensionlog.service";
import {
  getActivePensionersResponse,
  getAgeData,
  getBasicAndCommutationData,
  getSbiMasterAndUnlinkedJoinData,
} from "../src/service/debitscroll.service";
import { getAgeSqlData } from "../src/utils/sqlUtils";

const jwt = require("jsonwebtoken");
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  console.log("Request received for getSbiMasterAndUnlinkedJoinData");
  const {username} = req.body;
  try {
    // Call the insertData function
    const result = await getSbiMasterAndUnlinkedJoinData();
    getSbiMasterAndUnlinkedJoinDatalog(username, "Success");
    // Return success response
    context.res = {
      status: 200,
      body: result,
    };
  } catch (error) {
    // Handle errors and return response
    getSbiMasterAndUnlinkedJoinDatalog(username, "Failure");
    context.res = {
      status: 500,
      body: { success: false, message: `Error: ${error.message}` },
    };
  }
};

export default httpTrigger;
