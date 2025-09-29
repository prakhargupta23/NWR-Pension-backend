const Expenditure = require("../Model/Expenditure.model");
const Earning = require("../Model/Earning.model");
const PhExpenditure = require("../Model/PhExpenditureModel");
const Recoverable = require("../Model/Recoverable.model");
///// utils funciton for getting expenditure bar data for a particular month-------------/
export const getExpenditureByMonthForBarData = async (month) => {
  try {
    const results = await Expenditure.findAll({
      attributes: [
        "division",
        "actualLastFinancialYear",
        "targetThisMonth",
        "actualThisMonth",
        "actualThisMonthLastYear",
        "targetCurrentFinancialYear",
        "subCategory",
        "targetYTDThisMonth",
        "actualYTDThisMonthLastYear",
        "actualYTDThisMonth",
        "date",
      ],
    });

    return results;
  } catch (error) {
    console.error("Error fetching expenditure by month:", error);
    throw new Error(error);
  }
};

///// utils funciton for getting earning bar data for a particular month-------------/
export const getEarningByMonthForBarData = async (month) => {
  try {
    const results = await Earning.findAll({
      attributes: [
        "division",
        "actualLastFinancialYear",
        "targetThisMonth",
        "actualThisMonth",
        "actualThisMonthLastYear",
        "subCategory",
        "targetYTDThisMonth",
        "actualYTDThisMonthLastYear",
        "actualYTDThisMonth",
        "date",
      ],
    });

    return results;
  } catch (error) {
    console.error("Error fetching expenditure by month:", error);
    throw error;
  }
};

///// utils function for getting PH expenditure data for a particular month-------------/
export const getPHExpenditureByMonth = async (month) => {
  try {
    // Fetch raw data - always get all data
    const rawResults = await PhExpenditure.findAll({
      attributes: [
        "planHead",
        "actualLastYear",
        "division",
        "figure",
        "date",
        "targetLastYear",
        "actualForTheMonth",
        "actualUpToTheMonth",
        "actualUpToTheMonthLastYear"
      ]
    });

    // Transform to the desired format: { date: { division: sum of entries } }
    const groupedResults = {};
    
    // Group entries by date first
    rawResults.forEach(entry => {
      const date = entry.date;
      const division = entry.division;
      
      if (!groupedResults[date]) {
        groupedResults[date] = {};
      }
      
      if (!groupedResults[date][division]) {
        groupedResults[date][division] = {}; // Initialize an empty object
      }
      
      // Sum up the numeric values, initializing keys if they don't exist
      groupedResults[date][division].LFY = (groupedResults[date][division].LFY || 0) + Number(entry.actualLastYear || 0);
      groupedResults[date][division]["LFY Target"] = (groupedResults[date][division]["LFY Target"] || 0) + Number(entry.targetLastYear || 0);
      groupedResults[date][division].Actual = (groupedResults[date][division].Actual || 0) + Number(entry.actualForTheMonth || 0);
      groupedResults[date][division]["CFY YTD Actual"] = (groupedResults[date][division]["CFY YTD Actual"] || 0) + Number(entry.actualUpToTheMonth || 0);
      groupedResults[date][division]["LFY YTD Actual"] = (groupedResults[date][division]["LFY YTD Actual"] || 0) + Number(entry.actualUpToTheMonthLastYear || 0);
      
    });

    console.log("Data returned by getPHExpenditureByMonth:", groupedResults);
    return groupedResults;
  } catch (error) {
    console.error("Error fetching PH expenditure data:", error);
    throw error;
  }
};


export const getRecoverableData = async () => {
  try {
    const results = await Recoverable.findAll({
      attributes: [
        "uuid",
        "date",
        "figure",
        "division",
        "category",
        "type",
        "openingBalance",
        "accretionUptoTheMonth",
        "clearanceUptoMonth",
        "closingBalance",
      ],
    });
    
    return results;
  } catch (error) {
    console.error("Error fetching recoverable data:", error);
    throw error;
  }
};

