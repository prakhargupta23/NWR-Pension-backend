import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import {
  getNewPensionerResponse,
  getStoppedPensionersResponse,
} from "../src/service/debitscroll.service";
import { getPfaBarData } from "../src/service/pfa.service";
const jwt = require("jsonwebtoken");
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // Call the insertData function
    const result = await getPfaBarData(req.query.type, req.query.date);
    if (result.success) {
      // console.log(result.data)
      context.res = {
        status: 200,
        body: {
          success: true,
          message: "Data queried successfully",
          data: result.data,
        },
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
