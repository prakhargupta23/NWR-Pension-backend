import {
  getEarningByMonthForBarData,
  getExpenditureByMonthForBarData,
  getPHExpenditureByMonth,
  getRecoverableData
} from "../utils/pfautils";
const Earning = require("../Model/Earning.model");
const Expenditure = require("../Model/Expenditure.model");
const PhExpenditure = require("../Model/PhExpenditureModel");
////// Function for getting the bar data of pfa pages -------------------------------/
export async function getPfaBarData(type: string, date: string) {
  try {
    let response;
    console.log("type")
    if (type === "Expenditure") {
      response = await getExpenditureByMonthForBarData(date);
    } else if (type === "Earning") {
      console.log("went for earning");
      response = await getEarningByMonthForBarData(date);
    } else if (type === "PHExpenditure") {
      response = await getPHExpenditureByMonth(date);
    } else if (type === "Recoverable") {
      response = await getRecoverableData();
    }

    if (response) {
      return {
        message: "Data has been fetched",
        success: true,
        data: response,
      };
    } else {
      return {
        message: "Unable to fetch the data",
        success: false,
        data: null,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
}

//// Function for getting the performance index data ----------------------------/
export async function PerformanceIndexData() {
  try {
    const [earnings, expenditures] = await Promise.all([
      Earning.findAll({
        raw: true,
      }),
      Expenditure.findAll({
        raw: true,
      }),
    ]);

    const sumFields = (records: any[]) => {
      const result: Record<string, number> = {};
      records.forEach((record) => {
        Object.entries(record).forEach(([key, value]) => {
          if (typeof value === "number") {
            result[key] = (result[key] || 0) + value;
          }
        });
      });
      return result;
    };

    const result: {
      sumearning: Record<string, Record<string, any>>;
      sumexpenditure: Record<string, Record<string, any>>;
      pei: Record<string, Record<string, any>>;
    } = {
      sumearning: {},
      sumexpenditure: {},
      pei: {},
    };

    const allDates = [
      ...earnings.map((record) => record.date),
      ...expenditures.map((record) => record.date),
    ].reduce((unique, date) => {
      return unique.includes(date) ? unique : [...unique, date];
    }, []);

    const divisions = ["Jaipur", "Ajmer", "Bikaner", "Jodhpur"];

    allDates.forEach((date) => {
      divisions.forEach((division) => {
        const divearnings = earnings.filter(
          (record) => record.division === division && record.date === date
        );
        const divexpenditures = expenditures.filter(
          (record) => record.division === division && record.date === date
        );

        const summedEarnings = sumFields(divearnings);
        const summedExpenditures = sumFields(divexpenditures);

        const pei: Record<string, number> = {};
        for (const key in summedExpenditures) {
          if (key === "targetCurrentFinancialYear") continue;

          const expenditureValue = summedExpenditures[key];
          const earningValue = summedEarnings[key];

          if (typeof earningValue === "number" && earningValue !== 0) {
            pei[key] = parseFloat(
              ((expenditureValue / earningValue) * 100).toFixed(2)
            );
          } else {
            pei[key] = 0;
          }
        }

        if (!result.sumearning[date]) result.sumearning[date] = {};
        if (!result.sumexpenditure[date]) result.sumexpenditure[date] = {};
        if (!result.pei[date]) result.pei[date] = {};

        result.sumearning[date][division] = summedEarnings;
        result.sumexpenditure[date][division] = summedExpenditures;
        result.pei[date][division] = pei;
      });
    });

    return result;
    // return {
    //   earning: summedEarnings,
    //   expenditure: summedExpenditures,
    //   pei,
    // };
  } catch (error) {
    console.error("Error in PerformanceIndexData:", error);
    throw error;
  }
}
