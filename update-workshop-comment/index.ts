import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { createWorkshopComments } from "../src/service/comment.service";
const jwt = require("jsonwebtoken");
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
      context.res = {
        status: 401,
        body: "No token provided",
      };
      return;
    }
    console.log("uploading workshop comments")
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
    console.log("this is body", req.body);

    // Call the insertData function
    const result = await createWorkshopComments(req.body.data);

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
