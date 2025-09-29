import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { fetchAllDataFromTable } from "../src/service/workshop.service";
const jwt = require("jsonwebtoken");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // JWT Authentication
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splits "Bearer TOKEN"

    if (!token) {
      context.res = {
        status: 401,
        body: {
          success: false,
          message: "No token provided"
        },
      };
      return;
    }

    let decoded = {};

    try {
      decoded = jwt.verify(token, process.env.secret);
    } catch (error) {
      context.res = {
        status: 401,
        body: {
          success: false,
          message: "Invalid or expired token"
        },
      };
      return;
    }

    // Get table name from request
    const { tableName } = req.body || req.query || {};

    // Validate required parameter
    if (!tableName) {
      context.res = {
        status: 400,
        body: {
          success: false,
          message: "Table name parameter is required"
        },
      };
      return;
    }

    console.log(`Fetching all data from table: ${tableName}`);

    // Call the fetchAllDataFromTable function
    const result = await fetchAllDataFromTable(tableName);

    // Return response based on the result
    if (result.success) {
      context.res = {
        status: 200,
        body: {
          success: true,
          message: result.message,
          data: result.data,
          summary: {
            tableName: tableName,
            totalRecords: result.totalRecords
          }
        },
      };
    } else {
      context.res = {
        status: 500,
        body: {
          success: false,
          message: result.message,
          error: result.error
        },
      };
    }

  } catch (error) {
    console.error('Error in fetch-workshop-data function:', error);
    
    // Handle errors and return response
    context.res = {
      status: 500,
      body: {
        success: false,
        message: "Internal server error",
        error: error.message
      },
    };
  }
};

export default httpTrigger; 