import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processUserQuery } from "../src/service/assistant.service";
import { updateAiPrompt } from "../src/service/propmt.service";
import { createTransactionEntry } from "../src/service/transaction.service";
import { UploadDataLog } from "../src/service/pfalog.service";
const jwt = require("jsonwebtoken");
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splits "Bearer TOKEN"

    const username = req.body.username;
    console.log("username", username,req.body);

    if (!token) {
      context.res = {
        status: 401,
        body: "No token provided",
      };
      return;
    }

    let decoded = {};

    try {
      decoded = jwt.verify(token, process.env.secret);
    } catch (error) {
      context.res = {
        status: 401,
        body: { error: "Invalid or expired token" },
      };
      return;
    }
    console.log(req.body, "this is body");

    // Call the insertData function
    const result = await createTransactionEntry(req.body.data);
    UploadDataLog(username,"Success",req.body.data.selectedMonthYear,req.body.data.division);
    context.res = {
      status: 200,
      body: result,
    };
  } catch (error) {
    // Handle errors and return response
    const username = req.body.username;
    UploadDataLog(username,"Failure",req.body.data.selectedMonthYear,req.body.data.division);
    context.res = {
      status: 500,
      body: { success: false, message: `Error: ${error.message}` },
    };
  }
};

export default httpTrigger;
