import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import {
  getNewPensionerResponse,
  getStoppedPensionersResponse,
} from "../src/service/debitscroll.service";
import { getPfaBarData } from "../src/service/pfa.service";
import { getRecoverableData } from "../src/service/recoverable.service";
const jwt = require("jsonwebtoken");
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // Call the insertData function
    const result = await getRecoverableData(req.query.type, req.query.date);
    console.log("this is result");
    console.log(result);

    if (result.success) {
      context.res = {
        status: 200,
        body: result,
      };
    } else {
      // Handle errors and return response
      context.res = {
        status: 500,
        body: { success: false, message: `${result.message}` },
      };
    }
    // Return success response
  } catch (error) {
    // Handle errors and return response
    context.res = {
      status: 500,
      body: { success: false, message: `Error: ${error.message}` },
    };
  }
};

export default httpTrigger;
