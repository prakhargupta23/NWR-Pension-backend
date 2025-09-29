import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import insertData, {
  getQueryData,
  getTableDetails,
} from "../src/service/dataInsert.service";
const jwt = require("jsonwebtoken");
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
    // Call the insertData function
    const result = await getQueryData(req.body.query);
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
