import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import insertData from "../src/service/dataInsert.service";
const jwt = require("jsonwebtoken");
import { dataUploadlog } from "../src/service/pensionlog.service";




const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splits "Bearer TOKEN"

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
    
    //create a log for the data upload
    const { tableName, data, month, username } = req.body;
    if (!tableName || !Array.isArray(data) || data.length === 0) {
      dataUploadlog(username, month, "Failure");
    } else {
      dataUploadlog(username, month, "Success");
    }
    

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
    const result = await insertData(tableName.toLowerCase(), data, month);

    // Return success response
    context.res = {
      status: 200,
      body: { ...result },
    };
  } catch (error) {
    // Handle errors and return response
    context.res = {
      status: 200,
      body: { success: false, message: `Error: ${error.message}` },
    };
  }
};

export default httpTrigger;
