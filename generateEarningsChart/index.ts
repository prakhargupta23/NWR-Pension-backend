import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  generatePieChart,
  generateRecoverableStackedChart,
  generateTargetVsActualBarChart,
} from "../src/service/graphs.service";
// const Expenditure = require("../src/Model/Expenditure.model");

const Earning = require("../src/Model/Earning.model");

const Recoverable = require("../src/Model/Recoverable.model");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // const earnings = await Earning.findAll({ raw: true });

    const earnings = await Earning.findAll({ raw: true });

    // const imageBuffer = await generatePieChart(
    //   earnings,
    //   "Earning Heads Contribution to Total Earning (YTD)",
    //   "actualThisMonth",
    //   "subCategory"
    // );

    // const recoverableData = await Recoverable.findAll({ raw: true });

    // const imageBuffer = await generateRecoverableStackedChart(
    //   recoverableData,
    //   "division", // or "category"
    //   "Recoverable (Accretion + Clearance) by DR & BR"
    // );

    const imageBuffer = await generateTargetVsActualBarChart(
      earnings,
      "Target vs Actual Earnings per Division"
    );

    context.res = {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
      body: imageBuffer,
      isRaw: true,
    };
  } catch (err) {
    context.log.error("Chart generation failed", err);
    context.res = {
      status: 500,
      body: "Failed to generate chart",
    };
  }
};

export default httpTrigger;
