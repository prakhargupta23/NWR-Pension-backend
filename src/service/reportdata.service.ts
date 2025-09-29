import path from "path";
import fs from "fs";
import {
  generateCombinedEarningsBarChart,
  generatePieChart,
  generateRecoverableStackedChart,
  generateTargetVsActualBarChart,
} from "./graphs.service";
import { getGpt4oResponse } from "./ai.service";
import { compileFunction } from "vm";
const Earning = require("../Model/Earning.model");
const Expenditure = require("../Model/Expenditure.model");
const PhExpenditure = require("../Model/PhExpenditureModel");
const Recoverable = require("../Model/Recoverable.model");
const DepartmentRecoverable = require("../Model/DepartmentRecoverable.model");
const SuspenseRegister = require("../Model/SuspenseRegister.model");
const SettleMentCases = require("../Model/SettleMentCases.model");
const SavingThroughIc = require("../Model/SavingThroughIc.model");
const AuditObjections = require("../Model/AuditObjection.model");
const CompletionReport = require("../Model/CompletionReports");
const RailwayHQInspection = require("../Model/HRInspection.model");
const StockSheet = require("../Model/StockSheetsModel");
const AccountInspection = require("../Model/AccountInspection.model");

//Executive Summary Data(part-1)
export async function GetReportData(targetDate: string) {
  try {
    const [
      earnings,
      expenditures,
      phExpenditures,
      recoverables,
      departmentRecoverables,
      suspenseBalances,
      settlementCases,
      savingsThroughIc,
      completionReport,
      railwayHQInspection,
      auditObjection,
      stockSheet,
      accountInspection,
    ] = await Promise.all([
      Earning.findAll({ where: { date: targetDate }, raw: true }),
      Expenditure.findAll({ where: { date: targetDate }, raw: true }),
      PhExpenditure.findAll({ where: { date: targetDate }, raw: true }),
      Recoverable.findAll({ where: { date: targetDate }, raw: true }),
      DepartmentRecoverable.findAll({ where: { date: targetDate }, raw: true }),
      SuspenseRegister.findAll({ where: { date: targetDate }, raw: true }),
      SettleMentCases.findAll({ where: { date: targetDate }, raw: true }),
      SavingThroughIc.findAll({ where: { date: targetDate }, raw: true }),
      CompletionReport.findAll({ where: { date: targetDate }, raw: true }),
      RailwayHQInspection.findAll({ where: { date: targetDate }, raw: true }),
      AuditObjections.findAll({ where: { date: targetDate }, raw: true }),
      StockSheet.findAll({ where: { date: targetDate }, raw: true }),
      AccountInspection.findAll({ where: { date: targetDate }, raw: true }),
    ]);
    // console.log("retrived data from db");
    // console.log(JSON.stringify({
    //   earnings,
    //   expenditures,
    //   phExpenditures,
    //   recoverables,
    //   departmentRecoverables,
    //   suspenseBalances,
    //   settlementCases,
    //   savingsThroughIc,
    //   completionReport,
    //   railwayHQInspection,
    //   auditObjection,
    //   stockSheet,
    //   accountInspection
    // }, null, 2));

    const divisions = ["Jaipur", "Ajmer", "Bikaner", "Jodhpur"];

    // Calculate both summary performance and detailed analysis
    const [response, detailedAnalysis] = await Promise.all([
      calculateSummaryPerformance(earnings, expenditures, suspenseBalances),
      analyzeFinancialData(
        earnings,
        expenditures,
        phExpenditures,
        recoverables,
        departmentRecoverables,
        suspenseBalances,

        savingsThroughIc,
        completionReport,
        railwayHQInspection,
        auditObjection,
        stockSheet,
        accountInspection,
        settlementCases
      ),
    ]);

    const [
      combinedSummaryData,
      divisionWiseEarningsSummaryBarChart,
      divisionWiseEarningsSummaryPieChart,
      divisionWiseExpenditureSummaryPieChart,
      headsWiseEarningsSummaryPieChart,
      recoverablesSummaryStackedChart,
      takeawaysFromAi,
      summaryOfReport,
    ] = await Promise.all([
      GetCombinedSummaryData(
        earnings,
        expenditures,
        phExpenditures,
        recoverables,
        departmentRecoverables,
        suspenseBalances,
        settlementCases,
        savingsThroughIc,
        completionReport,
        railwayHQInspection,
        auditObjection,
        stockSheet,
        accountInspection
      ),
      generateTargetVsActualBarChart(
        earnings,
        "Target vs Actual Earnings per Division"
      ),
      generatePieChart(
        earnings,
        "Divisions Contribution to Total Earnings",
        "actualThisMonth",
        "division"
      ),
      generatePieChart(
        expenditures,
        "Divisions Contribution to Total Expenditure",
        "actualThisMonth",
        "division"
      ),
      generatePieChart(
        earnings,
        "Earning Heads Contribution to Total Earnings",
        "actualThisMonth",
        "subCategory"
      ),
      generateRecoverableStackedChart(
        recoverables,
        "division",
        "Recoverable (Accretion + Clearance) by DR & BR"
      ),
      getGpt4oResponse(
        `
             - You are a financial analyst.
             - You are given a set of data related to the financial performance of different divisions.
             - You need to analyze the data and provide 4 pointers with following requirements:
                1. Two pointer about the earnings data.
                2. One pointer about the suspense balance data.
                3. One pointer about the internal checks data.
             - You provided with the data in JSON format.
    
             - Respond in JSON format with the following structure:
              {
                "takeaways": [
                  "Takeaway 1",
                  "Takeaway 2",
                  "Takeaway 3",
                  "Takeaway 4"
                ]
              }
              
             - Each takeaway should be of around 15 words.
             - The takeaways should be related to the given month, which is ${targetDate}.
          `,
        {
          earnings,
          expenditures,
          suspenseBalances,
          savingsThroughInternalChecks: savingsThroughIc,
        }
      ),
      getGpt4oResponse(
        `
          - You are a senior financial analyst reviewing monthly division-wise performance.
          - You are given JSON data for various financial and compliance indicators:
            earnings, expenditures, phExpenditures, recoverables, departmentRecoverables, suspenseBalances,
            settlementCases, savingsThroughIc, completionReport, railwayHQInspection, auditObjection,
            stockSheet, and accountInspection.
      
          - Based on this data, provide insights in the following structure:
      
            1. Two key insights across all divisions (e.g. financial performance, recoveries, trends, etc.).
            2. One division-specific issue (mention the division name explicitly).
            3. Two recommended action points (practical, data-informed steps).
      
          - Each insight, issue, or action point should:
            - Be concise (approx. 15 words)
            - Include specific numbers or percentages where relevant
            - Reflect analysis for the given month: ${targetDate}
      
          - Format the response in JSON as:
            {
              "insights": [
                "Insight 1",
                "Insight 2",
                "Insight 3",
                "Insight 4",
                "Insight 5"
              ],
              "divisionIssues": [
                "Division-specific issue"
              ],
              "actionPoints": [
                "Action point 1",
                "Action point 2",
                "Action point 3",
                "Action point 4",
                "Action point 5"
              ]
            }
      
          - Each point should be concise (around 15 words), relevant, and reflect analysis for the given month: ${targetDate} and give around 5 points.
        `,
        {
          earnings,
          expenditures,
          phExpenditures,
          recoverables,
          departmentRecoverables,
          suspenseBalances,
          settlementCases,
          savingsThroughIc,
          completionReport,
          railwayHQInspection,
          auditObjection,
          stockSheet,
          accountInspection,
        }
      ),
    ]);

    // console.log("combinedSummaryData", combinedSummaryData);

    const reportData = {
      executiveSummaryData: response,
      detailedAnalysis, // Added the detailed analysis here
      ...combinedSummaryData,
      charts: {
        divisionWiseEarningsSummaryBarChart:
          divisionWiseEarningsSummaryBarChart.toString("base64"),
        divisionWiseEarningsSummaryPieChart:
          divisionWiseEarningsSummaryPieChart.toString("base64"),
        divisionWiseExpenditureSummaryPieChart:
          divisionWiseExpenditureSummaryPieChart.toString("base64"),
        headsWiseEarningsSummaryPieChart:
          headsWiseEarningsSummaryPieChart.toString("base64"),
        recoverablesSummaryStackedChart:
          recoverablesSummaryStackedChart.toString("base64"),
      },
      keyTakeaways: takeawaysFromAi["takeaways"],
      summaryOfReport: summaryOfReport["insights"],
    };

    return reportData;
  } catch (error) {
    console.error("Error in GetReportData:", error);
    throw error;
  }
}

type Division = "Jaipur" | "Ajmer" | "Bikaner" | "Jodhpur";

//type creation for combined summary table(part-2)
interface RecordWithDivision {
  division: Division;
  figure?: string;
  actualThisMonth?: number;
  actualForTheMonth?: number;
  targetThisMonth?: number;
  amount?: number;
  closingBalance?: number;
  closingOutstandings?: number;
  forTheMonth?: number;
  closingOutstanding?: number;
  parasOutstanding?: number;
}

type Metrics =
  | "Earnings"
  | "Expenditure"
  | "PH Expenditure"
  | "Recoverables"
  | "DW Recoverables"
  | "Suspense Balances"
  | "Settlement Cases"
  | "Savings through IC";

type MetricsData = Record<
  Metrics,
  Record<
    | Division
    | "Total/Avg"
    | "Best Performing Division"
    | "Worst Performing Division",
    number | string[]
  >
>;

type RatioMap = Record<
  Extract<Metrics, "Earnings" | "Expenditure" | "PH Expenditure">,
  Record<Division, number>
>;

//data for combined summary table(part-2)
export async function GetCombinedSummaryData(
  earnings: RecordWithDivision[],
  expenditures: RecordWithDivision[],
  phExpenditures: RecordWithDivision[],
  recoverables: RecordWithDivision[],
  departmentRecoverables: RecordWithDivision[],
  suspenseBalances: RecordWithDivision[],
  settlementCases: RecordWithDivision[],
  savingsThroughIc: RecordWithDivision[],
  completionReport: RecordWithDivision[],
  railwayHQInspection: RecordWithDivision[],
  auditObjection: RecordWithDivision[],
  stockSheet: RecordWithDivision[],
  accountInspection: RecordWithDivision[]
): Promise<{ combinedSummaryData: MetricsData }> {
  try {
    const divisions: Division[] = ["Jaipur", "Ajmer", "Bikaner", "Jodhpur"];

    const metricsData: any = {
      Earnings: {},
      Expenditure: {},
      "PH Expenditure": {},
      Recoverables: {},
      "DW Recoverables": {},
      "Suspense Balances": {},
      "Settlement Cases": {},
      "Savings through IC": {},
      "Railway HQ Inspection": {},
      "Audit Objection": {},
      "Stock Sheet": {},
      "Account Inspection": {},
      "Completion Reports": {},
    };

    const ratiosMap: RatioMap = {
      Earnings: { Jaipur: 0, Ajmer: 0, Bikaner: 0, Jodhpur: 0 },
      Expenditure: { Jaipur: 0, Ajmer: 0, Bikaner: 0, Jodhpur: 0 },
      "PH Expenditure": { Jaipur: 0, Ajmer: 0, Bikaner: 0, Jodhpur: 0 },
    };

    // console.log("settlementCases",settlementCases);
    // console.log("completionReport",completionReport);
    // console.log("railwayHQInspection",railwayHQInspection);
    // console.log("auditObjection",auditObjection);
    // console.log("stockSheet",stockSheet);
    // console.log("accountInspection",accountInspection);

    const byDivision = (records: RecordWithDivision[], division: Division) =>
      records.filter((r) => r.division === division);

    for (const division of divisions) {
      // Total Earnings
      const earn = byDivision(earnings, division);
      const actualEarn = earn.reduce((s, r) => s + (r.actualThisMonth || 0), 0);
      const targetEarn = earn.reduce((s, r) => s + (r.targetThisMonth || 0), 0);
      metricsData["Earnings"][division] = actualEarn;
      ratiosMap["Earnings"][division] =
        targetEarn > 0 ? (actualEarn / targetEarn) * 100 : 0;

      // Total Expenditure
      const exp = byDivision(expenditures, division);
      const actualExp = exp.reduce((s, r) => s + (r.actualThisMonth || 0), 0);
      const targetExp = exp.reduce((s, r) => s + (r.targetThisMonth || 0), 0);
      metricsData["Expenditure"][division] = actualExp;
      ratiosMap["Expenditure"][division] =
        targetExp > 0 ? (actualExp / targetExp) * 100 : 0;

      // PH Expenditure
      const ph = byDivision(phExpenditures, division);
      const actualPH = ph.reduce((s, r) => s + (r.actualForTheMonth || 0), 0);
      const targetPH = ph.reduce((s, r) => s + (r.targetThisMonth || 0), 0);
      metricsData["PH Expenditure"][division] = actualPH;
      ratiosMap["PH Expenditure"][division] =
        targetPH > 0 ? (actualPH / targetPH) * 100 : 0;

      // Recoverables
      metricsData["Recoverables"][division] = byDivision(
        recoverables,
        division
      ).reduce((s, r) => s + (r.closingBalance || 0), 0);

      // DW Recoverables
      metricsData["DW Recoverables"][division] = byDivision(
        departmentRecoverables,
        division
      ).reduce((s, r) => s + (r.closingBalance || 0), 0);

      // Suspense Balances
      metricsData["Suspense Balances"][division] = byDivision(
        suspenseBalances,
        division
      ).reduce((s, r) => s + (r.closingBalance || 0), 0);

      // Settlement Cases
      metricsData["Settlement Cases"][division] = byDivision(
        settlementCases,
        division
      ).reduce((s, r) => s + (r.closingOutstanding || 0), 0);

      // Savings through IC
      metricsData["Savings through IC"][division] = byDivision(
        savingsThroughIc,
        division
      ).reduce((s, r) => s + (r.forTheMonth || 0), 0);

      // Railway HQ Inspection
      metricsData["Railway HQ Inspection"][division] = byDivision(
        railwayHQInspection,
        division
      ).reduce((s, r) => s + (r.parasOutstanding || 0), 0);

      // Audit Objection
      metricsData["Audit Objection"][division] = byDivision(
        auditObjection,
        division
      ).reduce((s, r) => s + (r.closingBalance || 0), 0);

      // Stock Sheet
      metricsData["Stock Sheet"][division] = byDivision(
        stockSheet,
        division
      ).reduce((s, r) => s + (r.closingBalance || 0), 0);

      // Account Inspection
      metricsData["Account Inspection"][division] = byDivision(
        accountInspection,
        division
      ).reduce((s, r) => s + (r.closingBalance || 0), 0);

      //completion reports
      metricsData["Completion Reports"][division] = byDivision(
        completionReport,
        division
      ).reduce((s, r) => s + (r.closingBalance || 0), 0);
    }

    Object.entries(metricsData).forEach(([metricKey, data]) => {
      const metric = metricKey as Metrics;

      const rawValues: [Division, number][] = divisions.map((div) => [
        div,
        data[div] as number,
      ]);

      const isPercentBased = metric in ratiosMap;
      const compareValues: [Division, number][] = isPercentBased
        ? divisions.map((div) => [
            div,
            ratiosMap[metric as keyof RatioMap][div],
          ])
        : rawValues;

      const total = rawValues.reduce((s, [, v]) => s + v, 0);
      const average = total / divisions.length;

      data["Total"] = `${total}`;

      // Special handling for PH Expenditure
      if (metric === "PH Expenditure") {
        data["Best Performing Division"] = ["- -"];
        data["Worst Performing Division"] = ["- -"];
        return;
      }

      const compareNums = compareValues.map(([, v]) => v);
      const allZero = compareNums.every((v) => v === 0);

      const isLowerBetter =
        metric === "Recoverables" ||
        metric === "DW Recoverables" ||
        metric === "Suspense Balances" ||
        metric === "Settlement Cases";

      const max = Math.max(...compareNums);
      const min = Math.min(...compareNums);

      const best = compareValues
        .filter(([, v]) => v === (isLowerBetter ? min : max))
        .map(([d]) => d);

      const worst = compareValues
        .filter(([, v]) => v === (isLowerBetter ? max : min))
        .map(([d]) => d);

      data["Best Performing Division"] = allZero ? [] : best;
      data["Worst Performing Division"] = allZero ? [] : worst;
    });

    return {
      combinedSummaryData: metricsData,
    };
  } catch (error) {
    console.error("Error in GetCombinedSummaryData:", error);
    throw error;
  }
}

//graph and visuals(part-3)
interface SummaryPerformanceResult {
  totalEarnings: string;
  totalExpenditures: string;
  earningsAchievementPercent: string;
  expenditureAchievementPercent: string;
  highestPerformer: string;
  lowestPerformer: string;
}

export function calculateSummaryPerformance(
  earnings: RecordWithDivision[],
  expenditures: RecordWithDivision[],
  suspenseRegister: RecordWithDivision[]
): SummaryPerformanceResult {
  const divisions = ["Jaipur", "Ajmer", "Bikaner", "Jodhpur"];

  let totalEarnings = 0;
  let totalEarningTarget = 0;

  let totalExpenditures = 0;
  let totalExpenditureTarget = 0;

  const divisionEarnings: Record<string, number> = {};
  const divisionSuspenseBalances: Record<string, number> = {};

  divisions.forEach((division) => {
    const earningRecords = earnings.filter((r) => r.division === division);
    const expenditureRecords = expenditures.filter(
      (r) => r.division === division
    );
    const suspenseRecords = suspenseRegister.filter(
      (r) => r.division === division
    );

    const sumEarning = earningRecords.reduce(
      (sum, r) => sum + (r.actualThisMonth || 0),
      0
    );
    const sumEarningTarget = earningRecords.reduce(
      (sum, r) => sum + (r.targetThisMonth || 0),
      0
    );

    const sumExpenditure = expenditureRecords.reduce(
      (sum, r) => sum + (r.actualThisMonth || 0),
      0
    );
    const sumExpenditureTarget = expenditureRecords.reduce(
      (sum, r) => sum + (r.targetThisMonth || 0),
      0
    );

    const sumSuspense = suspenseRecords.reduce(
      (sum, r) => sum + (r.closingBalance || 0),
      0
    );

    divisionEarnings[division] = sumEarning;
    divisionSuspenseBalances[division] = sumSuspense;

    totalEarnings += sumEarning;
    totalEarningTarget += sumEarningTarget;

    totalExpenditures += sumExpenditure;
    totalExpenditureTarget += sumExpenditureTarget;
  });

  const earningsAchievementPercent =
    totalEarningTarget > 0
      ? ((totalEarnings / totalEarningTarget) * 100).toFixed(2) + "%"
      : "0%";

  const expenditureAchievementPercent =
    totalExpenditureTarget > 0
      ? ((totalExpenditures / totalExpenditureTarget) * 100).toFixed(2) + "%"
      : "0%";

  const highestPerformer = Object.entries(divisionEarnings).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  const lowestPerformer = Object.entries(divisionSuspenseBalances).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return {
    totalEarnings: `${totalEarnings} (Thousand)`,
    totalExpenditures: `${totalExpenditures} (Thousand)`,
    earningsAchievementPercent,
    expenditureAchievementPercent,
    highestPerformer,
    lowestPerformer,
  };
}

//detailed analysis data(part-4)

// type Division = "Jaipur" | "Ajmer" | "Bikaner" | "Jodhpur";

interface FinancialRecord {
  division?: Division;
  actualUpToLastMonth?: string;
  subCategory?: string;
  planHead?: string;
  suspenseHeads?: string;
  type?: string;
  category?: string;
  actualThisMonth?: number;
  targetThisMonth?: number;
  actualYTDThisMonth?: number;
  targetYTDThisMonth?: number;
  actualYTDThisMonthLastYear?: number;
  actualForTheMonth?: number;
  actualUpToTheMonth?: number;
  actualUpToTheMonthLastYear?: number;
  closingBalance?: number;
  forTheMonth?: number;
}

interface KeyHighlights {
  actualEarnings: string;
  targetEarnings: string;
  performanceTarget: string;
  performanceLY: string;
  recoveryVarianceTarget: string;
  recoveryVarianceLY: string;
}

interface EarningsVsTarget {
  highestEarningCategory: string;
  lowestEarningCategory: string;
  highestEarningTarget: string;
}

interface ExpenditureOverview {
  expenditure: Omit<FinancialRecord, "division">[];
  phExpenditure: Omit<FinancialRecord, "division">[];
}

interface DivisionAnalysis {
  keyHighlights: KeyHighlights;
  earningVsTarget: EarningsVsTarget;
  expenseOverview: ExpenditureOverview;
  division: string;
  recoverablesAnalysis: any;
  suspenseBalancesAnalysis: any;
  savingsThroughICAnalysis: any;
  barImage: any;
}

export async function analyzeFinancialData(
  earnings: FinancialRecord[],
  expenditures: FinancialRecord[],
  phExpenditures: FinancialRecord[],
  recoverables: FinancialRecord[],
  departmentRecoverables: FinancialRecord[],
  suspenseBalances: FinancialRecord[],
  savingsThroughIc: FinancialRecord[],
  completionReport: FinancialRecord[],
  railwayHQInspection: FinancialRecord[],
  auditObjection: FinancialRecord[],
  stockSheet: FinancialRecord[],
  accountInspection: FinancialRecord[],
  settlementCases: FinancialRecord[]
): Promise<DivisionAnalysis[]> {
  const result: {
    division: string;
    keyHighlights: any;
    earningVsTarget: any;
    expenseOverview: any;
    barImage: any;
    recoverablesAnalysis: any;
    suspenseBalancesAnalysis: any;
    savingsThroughICAnalysis: any;
    completionReport: any;
    railwayHQInspection: any;
    auditObjection: any;
    stockSheet: any;
    accountInspection: any;
    settlementCases: any;
  }[] = [];

  for (const division of [
    "Jaipur",
    "Ajmer",
    "Bikaner",
    "Jodhpur",
  ] as Division[]) {
    const divEarnings = earnings.filter((r) => r.division === division);
    const divExpenditures = expenditures.filter((r) => r.division === division);
    const divPhExpenditures = phExpenditures.filter(
      (r) => r.division === division
    );
    const divRecoverables = recoverables.filter((r) => r.division === division);
    const imageBuffer = await generateCombinedEarningsBarChart(
      earnings,
      "Target vs Actual Earnings – Current Month and Cumulative",
      division
    );
    const divDepartmentRecoverables = departmentRecoverables.filter(
      (r) => r.division === division
    );
    const divSuspenseBalances = suspenseBalances.filter(
      (r) => r.division === division
    );
    const divSavingsThroughIc = savingsThroughIc.filter(
      (r) => r.division === division
    );
    const divStockSheet = stockSheet.filter((r) => r.division === division);
    const divAccountInspection = accountInspection.filter(
      (r) => r.division === division
    );
    const divSettlementCases = settlementCases.filter(
      (r) => r.division === division
    );
    const divRailwayHQInspection = railwayHQInspection.filter(
      (r) => r.division === division
    );
    const divAuditObjection = auditObjection.filter(
      (r) => r.division === division
    );
    const divCompletionReport = completionReport.filter(
      (r) => r.division === division
    );

    result.push({
      division,
      keyHighlights: getKeyHighlights(divEarnings, divRecoverables),
      earningVsTarget: getEarningsVsTarget(divEarnings),
      expenseOverview: getExpenditureOverview(
        divExpenditures,
        divPhExpenditures
      ),
      recoverablesAnalysis: getRecoverablesAnalysis(
        divRecoverables,
        divDepartmentRecoverables
      ),
      suspenseBalancesAnalysis:
        getSuspenseBalancesAnalysis(divSuspenseBalances),
      completionReport: getcompletionReport(divCompletionReport),
      railwayHQInspection: getrailwayHQInspection(divRailwayHQInspection),
      auditObjection: getauditObjection(divAuditObjection),
      stockSheet: getstockSheet(divStockSheet),
      accountInspection: getaccountInspection(divAccountInspection),
      settlementCases: getsettlementCases(divSettlementCases),
      savingsThroughICAnalysis:
        getSavingsThroughICAnalysis(divSavingsThroughIc),
      barImage: imageBuffer.toString("base64"),
    });
  }

  return result;
}

function getKeyHighlights(
  earnings: FinancialRecord[],
  recoverables: FinancialRecord[]
): KeyHighlights {
  const actualEarnings = earnings.reduce(
    (sum, r) => sum + (r.actualYTDThisMonth || 0),
    0
  );
  const targetEarnings = earnings.reduce(
    (sum, r) => sum + (r.targetYTDThisMonth || 0),
    0
  );
  const lastYearEarnings = earnings.reduce(
    (sum, r) => sum + (r.actualYTDThisMonthLastYear || 0),
    0
  );

  return {
    actualEarnings: `₹${(actualEarnings / 100000).toFixed(2)} Lakhs`,
    targetEarnings: `₹${(targetEarnings / 100000).toFixed(2)} Lakhs → ${
      actualEarnings >= targetEarnings ? "Achieved" : "Underachieved"
    }`,
    performanceTarget:
      actualEarnings >= targetEarnings ? "Exceeded target" : "Below target",
    performanceLY:
      actualEarnings >= lastYearEarnings ? "Improved YOY" : "Declined YOY",
    recoveryVarianceTarget: `₹${(
      (actualEarnings - targetEarnings) /
      100000
    ).toFixed(2)}L`,
    recoveryVarianceLY: `₹${(
      (actualEarnings - lastYearEarnings) /
      100000
    ).toFixed(2)}L`,
  };
}

function getEarningsVsTarget(earnings: FinancialRecord[]): EarningsVsTarget {
  if (!earnings.length) {
    return {
      highestEarningCategory: "N/A",
      lowestEarningCategory: "N/A",
      highestEarningTarget: "₹0.00 Lakhs",
    };
  }

  let highest = earnings[0];
  let lowest = earnings[0];
  let totalTarget = highest.targetYTDThisMonth || 0;

  for (let i = 1; i < earnings.length; i++) {
    const record = earnings[i];
    totalTarget += record.targetYTDThisMonth || 0;

    if ((record.actualThisMonth || 0) > (highest.actualThisMonth || 0)) {
      highest = record;
    }
    if ((record.actualThisMonth || 0) < (lowest.actualThisMonth || 0)) {
      lowest = record;
    }
  }

  return {
    highestEarningCategory: highest.subCategory || "Uncategorized",
    lowestEarningCategory: lowest.subCategory || "Uncategorized",
    highestEarningTarget: `₹${(totalTarget / 100000).toFixed(2)} Lakhs`,
  };
}

function getExpenditureOverview(
  expenditures: FinancialRecord[],
  phExpenditures: FinancialRecord[]
): ExpenditureOverview {
  return {
    expenditure: expenditures.map((r) => ({
      subCategory: r.subCategory || "",
      targetThisMonth: r.targetThisMonth ?? 0,
      actualThisMonth: r.actualThisMonth ?? 0,
      targetYTDThisMonth: r.targetYTDThisMonth ?? 0,
      actualYTDThisMonth: r.actualYTDThisMonth ?? 0,
    })),
    phExpenditure: phExpenditures.map((r) => ({
      planHead: r.planHead || "",
      actualForTheMonth: r.actualForTheMonth ?? 0,
      actualUpToTheMonth: r.actualUpToTheMonth ?? 0,
      actualUpToTheMonthLastYear: r.actualUpToTheMonthLastYear ?? 0,
    })),
  };
}

interface RecoverablesAnalysis {
  totalClosingDR: number;
  totalClosingBR: number;
  highestCategoryDR: string;
  highestCategoryBR: string;
  highestDRValue: number;
  highestBRValue: number;
  totalDeptWise: number;
}

function getRecoverablesAnalysis(
  recoverables: FinancialRecord[],
  departmentRecoverables: FinancialRecord[]
): RecoverablesAnalysis {
  const drs = recoverables.filter((r) => r.type === "DR");
  const brs = recoverables.filter((r) => r.type === "BR");

  const totalClosingDR = drs.reduce(
    (sum, r) => sum + (r.closingBalance ?? 0),
    0
  );
  const totalClosingBR = brs.reduce(
    (sum, r) => sum + (r.closingBalance ?? 0),
    0
  );

  const highestDR = drs.reduce<FinancialRecord | null>((max, r) => {
    return (r.closingBalance ?? 0) > (max?.closingBalance ?? 0) ? r : max;
  }, null);

  const highestBR = brs.reduce<FinancialRecord | null>((max, r) => {
    return (r.closingBalance ?? 0) > (max?.closingBalance ?? 0) ? r : max;
  }, null);

  const totalDeptWise = departmentRecoverables.reduce(
    (sum, r) => sum + (r.closingBalance ?? 0),
    0
  );

  return {
    totalClosingDR,
    totalClosingBR,
    highestCategoryDR: highestDR?.category ?? "N/A",
    highestCategoryBR: highestBR?.category ?? "N/A",
    highestDRValue: highestDR?.closingBalance ?? 0,
    highestBRValue: highestBR?.closingBalance ?? 0,
    totalDeptWise,
  };
}

function getSuspenseBalancesAnalysis(suspenseBalances: FinancialRecord[]) {
  const result: Record<string, any> = {};

  const total = suspenseBalances.reduce(
    (sum, r) => sum + (r.closingBalance || 0),
    0
  );

  const table = suspenseBalances.map((r) => ({
    suspenseHeads: r.suspenseHeads || "N/A",
    closingBalance: r.closingBalance || 0,
  }));

  result["totalClosingSuspense"] = total;
  result["suspenseTable"] = table;

  return result;
}

function getSavingsThroughICAnalysis(savingsThroughIc: FinancialRecord[]) {
  const result: Record<string, any> = {};

  const total = savingsThroughIc.reduce(
    (sum, r) => sum + (r.forTheMonth || 0),
    0
  );

  const table = savingsThroughIc.map((r) => ({
    ActualUpToTheLastMonth: r.actualUpToLastMonth || "N/A",
    amount: r.forTheMonth || 0,
  }));

  result["totalSavings"] = total;
  result["savingsTable"] = table;

  return result;
}

function getcompletionReport(completionReport: any[]) {
  const result: Record<string, any> = {};

  if (!completionReport || completionReport.length === 0) {
    return {
      clearanceDept: "N/A",
      closingDept: "N/A",
      completionTable: [],
    };
  }

  let highest = completionReport[0].clearanceUpToMonth;
  let clearanceDept = "N/A";
  let highestclosingbalance = completionReport[0].closingBalance;
  let closingDept = "N/A";

  for (let i = 1; i < completionReport.length; i++) {
    if (completionReport[i].clearanceUpToMonth > highest) {
      highest = completionReport[i].clearanceUpToMonth;
      clearanceDept = completionReport[i].department;
    }

    if (completionReport[i].closingBalance > highestclosingbalance) {
      highestclosingbalance = completionReport[i].closingBalance;
      closingDept = completionReport[i].department;
    }
  }

  const table = completionReport.map((r) => ({
    department: r.department || "N/A",
    positionAsLastYearMonth: r.positionAsLastYearMonth || "N/A",
    accretionUpToMonth: r.accretionUpToMonth || "N/A",
    clearanceUpToMonth: r.clearanceUpToMonth || "N/A",
    closingBalance: r.closingBalance || "N/A",
    oldestCRPending: r.oldestCRPending || "N/A",
    // division: r.division || "N/A",
    // date: r.date || "N/A",
  }));

  result["clearanceDept"] = clearanceDept;
  result["closingDept"] = closingDept;
  result["completionTable"] = table;

  return result;
}

function getrailwayHQInspection(railwayHQInspection: any[]) {
  const table = railwayHQInspection.map((r) => ({
    yearOfReport: r.yearOfReport || "N/A",
    typeOfPara: r.typeOfPara || "N/A",
    totalParas: r.totalParas || "N/A",
    parasAtStartOfMonth: r.parasAtStartOfMonth || "N/A",
    closedDuringMonth: r.closedDuringMonth || "N/A",
    parasOutstanding: r.parasOutstanding || "N/A",
    remarks: r.remarks || "N/A",
    // division: r.division || "N/A",
    // date: r.date || "N/A",
  }));

  return { HQInspectionTable: table };
}

function getauditObjection(auditObjection: any[]) {
  const table = auditObjection.map((r) => ({
    suspenseHeads: r.suspenseHeads || "N/A",
    position: r.position || "N/A",
    positionLhr: r.positionLhr || "N/A",
    closingBalance: r.closingBalance || "N/A",
    reconciliationMonth: r.reconciliationMonth || "N/A",
    // division: r.division || "N/A",
    // date: r.date || "N/A",
  }));

  return { auditObjectionsTable: table };
}

function getstockSheet(stockSheet: any[]) {
  const result: Record<string, any> = {};

  if (!stockSheet || stockSheet.length === 0) {
    return {
      clearanceDept: "N/A",
      closingDept: "N/A",
      stockSheetTable: [],
    };
  }

  let highest = stockSheet[0].clearanceUpToMonth;
  let clearanceDept = "N/A";
  let highestclosingbalance = stockSheet[0].closingBalance;
  let closingDept = "N/A";

  for (let i = 1; i < stockSheet.length; i++) {
    if (stockSheet[i].clearanceUpToMonth > highest) {
      highest = stockSheet[i].clearanceUpToMonth;
      clearanceDept = stockSheet[i].department;
    }

    if (stockSheet[i].closingBalance > highestclosingbalance) {
      highestclosingbalance = stockSheet[i].closingBalance;
      closingDept = stockSheet[i].department;
    }
  }

  const table = stockSheet.map((r) => ({
    department: r.department || "N/A",
    openingBalanceAsLastYearMonth: r.openingBalanceAsLastYearMonth || "N/A",
    // division: r.division || "N/A",
    // date: r.date || "N/A",
    accretionUpToMonth: r.accretionUpToMonth || "N/A",
    clearanceUpToMonth: r.clearanceUpToMonth || "N/A",
    closingBalance: r.closingBalance || "N/A",
  }));

  result["clearanceDept"] = clearanceDept;
  result["closingDept"] = closingDept;
  result["stockSheetTable"] = table;

  return result;
}

function getaccountInspection(accountInspection: any[]) {
  const table = accountInspection.map((r) => ({
    typeOfReport: r.typeOfReport || "N/A",
    positionLhr: r.positionLhr || "N/A",
    openingBalance: r.openingBalance || "N/A",
    accretion: r.accretion || "N/A",
    clearanceOverOneYear: r.clearanceOverOneYear || "N/A",
    closingBalance: r.closingBalance || "N/A",
    clearanceLessThanOneYear: r.clearanceLessThanOneYear || "N/A",
    // division: r.division || "N/A",
    // date: r.date || "N/A",
  }));

  return { accountInspectionTable: table };
}

function getsettlementCases(settlementCases: any[]) {
  const table = settlementCases.map((r) => ({
    item: r.item || "N/A",
    openingBalanceOfMonth: r.openingBalanceOfMonth || "N/A",
    accretionDuringMonth: r.accretionDuringMonth || "N/A",
    clearedDuringMonth: r.clearedDuringMonth || "N/A",
    closingOutstanding: r.closingOutstanding || "N/A",
    // division: r.division || "N/A",
    // date: r.date || "N/A",
  }));

  return { settlementCasesTable: table };
}
