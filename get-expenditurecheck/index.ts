import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ReportVerification } from "../src/service/expenditurereport.service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  

  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    context.res = {
      status: 204,
      headers: headers,
      body: null
    };
    return;
  }

  try {
    const pdfBase64 = req.query.pdfBase64;
    if (!pdfBase64) {
      context.res = {
        status: 400,
        headers: headers,
        body: { success: false, message: `pdf is required,${pdfBase64}` },
      };
      return;
    }

    const answer = await ReportVerification(pdfBase64);
    console.log("Report data fetched successfully", answer);

    context.res = {
      status: 200,
      headers: headers,
      body: {
        success: true,
        data: answer,
      },
    };
  } catch (error) {
    context.res = {
      status: 500,
      headers: headers,
      body: {
        success: false,
        message: `Error: ${error.message}`,
      },
    };
  }
};

export default httpTrigger;
