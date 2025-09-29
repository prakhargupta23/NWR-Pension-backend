import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { GetReportData } from "../src/service/reportdata.service";
import { downloadReportLog } from "../src/service/pfalog.service"

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  

  try {
    const {date, username} = req.query;
    console.log("here it is", date,username);
    if (!date) {
      context.res = {
        status: 400,
        body: { success: false, message: "Date parameter is required" },
      };
      return;
    }


    const reportData = await GetReportData(date);
    // console.log("Report data fetched successfully", reportData);
    downloadReportLog(username,"Success",date);

    context.res = {
      status: 200,
      body: {
        success: true,
        data: reportData,
      },
    };
  } catch (error) {
    const {date, username} = req.query;
    downloadReportLog(username,"Failure",date);
    context.res = {
      status: 500,
      body: {
        success: false,
        message: `Error: ${error.message}`,
      },
    };
  }
};

export default httpTrigger;
