const ArpanModel = require("../Model/Arpan.model"); // Import models
const sequelize = require("../config/sequlize"); // Import your configured Sequelize instance
const SbiMaster = require("../Model/SbiMaster.model");
const zlib = require("zlib");
import { Logs } from "../Model/Logs.model";


import moment, { months } from "moment";
import {
  formatActivePensioners,
  formatAgeBracketData,
  formatAgeData,
  formatFamilyData,
  formatFamilyPensionTransitions,
  formatNewPensioners,
  formatStoppedPensioners,
  transformBasicAndCommutationData,
  transformCommutationData,
} from "../utils/debitscrollUtils";
import {
  getAgeSqlData,
  getNewPensionerData,
  getSqlDataBasedOnMonths,
  getUniqueMonths,
} from "../utils/sqlUtils";
import { Op } from "sequelize";
import {
  calculateOtherFromSummaryData,
  csvUtils,
  fetchSqlData,
} from "../utils/csvUtils";
import {
  filteredAgeSqlData,
  filteredOverPaymentUnderPaymentData,
  filteredOverPaymentUnderPaymentDataForCommutation,
  filteredStoppedPensioner,
  filterNewPensionerData,
  filterRegularToFamilyPensionData,
} from "../utils/filterData";
import { PensionDetails } from "../interfaces/csvInterfaces";

export function getAllValidMonths(months) {
  try {
    const validMonths = new Set(); // Store unique months

    months.forEach((month) => {
      if (month) {
        validMonths.add(month); // Add the current month

        // Extract month and year
        const [m, y] = month.split("/").map(Number);

        // Fix: Use ISO format (YYYY-MM-DD) with zero-padded month
        const prevMonth = moment(
          `${y}-${String(m).padStart(2, "0")}-01`,
          "YYYY-MM-DD"
        )
          .subtract(1, "month")
          .format("MM/YYYY");

        validMonths.add(prevMonth); // Add the previous month
      }
    });

    return Array.from(validMonths).sort((a, b) => {
      return moment(a, "MM/YYYY").diff(moment(b, "MM/YYYY"));
    });
  } catch (error) {
    throw new Error(error);
  }
}

////// Function for getting the basic and commutation data -------------------------------------------/
export async function getBasicAndCommutationData(category: string) {
  try {
    const response = await getUniqueMonths();
    //// Function for getting all the months inlcuding the previous one's
    const allMonths = getAllValidMonths(response);

    const allMonthsData = await getSqlDataBasedOnMonths(allMonths, category);
    // console.log("all months data", allMonthsData);
    if (category === "basic") {
      /// Function for formatting the data based on the requirements --------/
      const tranformedData = transformBasicAndCommutationData(
        allMonthsData,
        category
      );

      return tranformedData;
    } else {
      /// Function for formatting the data based on the requirements --------/
      const tranformedData = transformCommutationData(allMonthsData, category);

      return tranformedData;
    }
  } catch (error) {
    throw new Error(error);
  }
}


async function ageSqlData() {
  try {
    const query = `
    SELECT 
    s.ppoNumber,
    s.dateOfBirth,
    a.oldPPONo,
    a.newPPONo,
    a.month,
    a.totalPension
FROM arpan a
INNER JOIN sbi_master s
    ON s.ppoNumber = a.oldPPONo
    OR s.ppoNumber = a.newPPONo
  `;

    const mergedData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    return mergedData;
  } catch (error) {
    console.error("Error fetching age-related SQL data:", error);
    throw new Error("Error fetching data from the database");
  }
}
////// Function for getting the basic and commutation data -------------------------------------------/
export async function getAgeData(month: string) {
  try {
    const allMonthsData = await ageSqlData();

    const formatAgeDataResponse = formatAgeData(allMonthsData);

    /// Function for formatting the data based on the requirements --------/
    return formatAgeDataResponse;
  } catch (error) {
    throw new Error(error);
  }
}

/// Function for getting the new pensioner data --------------------------------/
////// Function for getting the basic and commutation data -------------------------------------------/
export async function getNewPensionerResponse() {
  try {
    const response = await getUniqueMonths();
    //// Function for getting all the months inlcuding the previous one's
    const allMonths = getAllValidMonths(response);

    const allMonthsData: any[] = await getNewPensionerData(allMonths);

    /// Function for formatting the data based on the requirements --------/
    const data = formatNewPensioners(allMonthsData);
    return data;
  } catch (error) {
    throw new Error("Some error has happened");
  }
}

////// Function for getting the basic and commutation data -------------------------------------------/
export async function getStoppedPensionersResponse() {
  try {
    const response = await getUniqueMonths();
    //// Function for getting all the months inlcuding the previous one's
    const allMonths = getAllValidMonths(response);

    const allMonthsData: any[] = await getNewPensionerData(allMonths);

    /// Function for formatting the data based on the requirements --------/
    const data = formatStoppedPensioners(allMonthsData);
    return data;
  } catch (error) {
    throw new Error("Some error has happened");
  }
}

////// Function for getting the basic and commutation data -------------------------------------------/
export async function getActivePensionersResponse() {
  try {
    const response = await getUniqueMonths();
    //// Function for getting all the months inlcuding the previous one's
    const allMonths = getAllValidMonths(response);

    const allMonthsData: any[] = await getNewPensionerData(allMonths);

    /// Function for formatting the data based on the requirements --------/
    const data = formatActivePensioners(allMonthsData);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

////// Function for getting the basic and commutation data -------------------------------------------/
export async function getFamilyPensionerTransitionResponse() {
  try {
    const response = await getUniqueMonths();
    //// Function for getting all the months inlcuding the previous one's
    const allMonths = getAllValidMonths(response);

    const allMonthsData: any[] = await getNewPensionerData(allMonths);

    /// Function for formatting the data based on the requirements --------/
    const data = formatFamilyPensionTransitions(allMonthsData);
    return data;
  } catch (error) {
    throw new Error("Some error has happened");
  }
}

////// Function for getting the basic and commutation data -------------------------------------------/
export async function getFamilyPensionData() {
  try {
    const response = await getUniqueMonths();
    //// Function for getting all the months inlcuding the previous one's
    const allMonths = getAllValidMonths(response);

    const allMonthsData: any[] = await getNewPensionerData(allMonths);

    /// Function for formatting the data based on the requirements --------/
    const data = formatFamilyData(allMonthsData);
    return data;
  } catch (error) {
    throw new Error("Some error has happened");
  }
}

////// Function for getting the basic and commutation data -------------------------------------------/

////// Function for getting the age bracket data -------------------------------------------/
export async function getAgeBracketData() {
  try {
    const response = await getUniqueMonths();
    //// Function for getting all the months inlcuding the previous one's
    const allMonths = getAllValidMonths(response);

    const allMonthsData = await getAgeSqlData(allMonths);
    const { arpanData, sbiData } = allMonthsData;

    const formatAgeDataResponse = formatAgeBracketData(arpanData, sbiData);

    /// Function for formatting the data based on the requirements --------/
    return formatAgeDataResponse;
  } catch (error) {
    throw new Error("Some error has happened");
  }
}

//// Function for linking the sbi_master and the unlinked data then downloading it ---------/

export async function getSbiMasterAndUnlinkedJoinData() {
  try {
    const startQuery = Date.now();

    const query = `
      SELECT s.*, a.*
      FROM sbi_master s
      INNER JOIN arpan a 
        ON s.ppoNumber IN (a.oldPPONo, a.newPPONo)
      WHERE a.basicCategory = 'unlinked'
         OR a.commutationCategory = 'unlinked'
    `;

    const mergedData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    const endQuery = Date.now();

    if (!mergedData || mergedData.length === 0) {
      throw new Error("No matching data found.");
    }

    // Deduplicate by PPO number
    const dedupedData = [];
    const seenPpoNumbers = new Set();

    mergedData.forEach((record) => {
      if (!seenPpoNumbers.has(record.ppoNumber)) {
        seenPpoNumbers.add(record.ppoNumber);
        dedupedData.push(record);
      }
    });

    // Separate into debitScroll and sbiMaster datasets
    const debitScroll = [];
    const sbiMaster = [];

    dedupedData.forEach((record) => {
      // Extract SBI Master fields
      const sbiRecord = {
        ppoNumber: record.ppoNumber,
        accountNumber: record.accountNumber,
        name: record.name,
        dateOfBirth: record.dateOfBirth,
        dateStart: record.dateStart,
        pensionType: record.pensionType,
        dateOfRetirement: record.dateOfRetirement,
        fileNo: record.fileNo,
        // ... Add other sbi_master fields if necessary
      };

      // Extract Debit Scroll / Arpan fields
      const debitScrollRecord = {
        newPPONo: record.newPPONo,
        oldPPONo: record.oldPPONo,
        currentPensionerName: record.currentPensionerName,
        monthOfPension: record.monthOfPension,
        basicPensionAmount: record.basicPensionAmount,
        deduction: record.deduction,
        residualPension: record.residualPension,
        fixMedicalAllowance: record.fixMedicalAllowance,
        additionalPension80Plus: record.additionalPension80Plus,
        daOnBasicPension: record.daOnBasicPension,
        totalPension: record.totalPension,
        basicCategory: record.basicCategory,
        commutationCategory: record.commutationCategory,
        month: record.month,
        // ... Add other arpan fields if necessary
      };

      // Push cleaned objects to their arrays
      sbiMaster.push(sbiRecord);
      debitScroll.push(debitScrollRecord);
    });

    const finalGroupedData = {
      debitScroll,
      sbiMaster,
    };

    // Compress the JSON response synchronously
    const startCompress = Date.now();
    const finalResponseString = JSON.stringify(finalGroupedData);
    const compressedResponse = zlib.gzipSync(finalResponseString);

    return compressedResponse;
  } catch (error) {
    console.error("Error fetching and exporting data:", error);
    throw new Error("Failed to export data");
  }
}

///// Function for getting the piechart csv download data -----------------------------/
export async function getPieCsvDownloadData(categoryType, pieDataType, month) {
  try {
    const startQuery = Date.now();

    // Determine the category and mismatch fields based on categoryType
    const isBasic = categoryType === "basic";
    const categoryField = isBasic ? "a.basicCategory" : "a.commutationCategory";
    const mismatchField = isBasic ? "a.basicMismatch" : "a.commutationMismatch";
    const mismatchType = isBasic ? "basicMismatch" : "commutationMismatch";
    // Construct the WHERE clause based on pieDataType
    let whereClause = `WHERE a.month = '${month}'`; // Ensure month filter is always applied
    if (pieDataType === "match") {
      whereClause += ` AND ${categoryField} = 'match'`; // Only get records where category is "match"
    } else if (pieDataType === "unlinked") {
      whereClause += ` AND ${categoryField} = 'unlinked'`; // Only get records where category is "unlinked"
    } else if (pieDataType === "underpaid" || pieDataType === "overpaid") {
      whereClause += ` AND ${mismatchField} <> 0`; // Fetch only records where mismatch is non-zero
    }
    // Select only relevant fields based on categoryType
    const selectedFields = isBasic
      ? "s.ppoNumber, s.accountNumber, s.name, s.dateOfBirth, s.dateStart, s.pensionType, s.dateOfRetirement, a.fileNo, a.oldPPONo, a.newPPONo, a.currentPensionerName, a.monthOfPension, a.basicPensionAmount, a.deduction, a.residualPension, a.fixMedicalAllowance, a.additionalPension80Plus, a.daOnBasicPension, a.totalPension, a.basicCategory, a.basicMismatch, a.month"
      : "s.ppoNumber, s.accountNumber, s.name, s.dateOfBirth, s.dateStart, s.pensionType, s.dateOfRetirement, a.fileNo, a.oldPPONo, a.newPPONo, a.currentPensionerName, a.monthOfPension, a.commutationCategory, a.commutationMismatch, a.month";

    const query = `
      SELECT ${selectedFields}
      FROM sbi_master s
      INNER JOIN arpan a 
        ON s.ppoNumber IN (a.oldPPONo, a.newPPONo)
      ${whereClause}
    `;

    const mergedData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    const endQuery = Date.now();

    if (!mergedData || mergedData.length === 0) {
      throw new Error("No matching data found for the specified month.");
    }

    // Post-query filtering for underpaid/overpaid
    let filteredData = mergedData;
    if (pieDataType === "underpaid") {
      filteredData = mergedData.filter((record) => record[mismatchType] < 0);
    } else if (pieDataType === "overpaid") {
      filteredData = mergedData.filter((record) => record[mismatchType] > 0);
    }

    const sbiMaster: any = [];
    const arpanData: any = [];

    filteredData.forEach((record) => {
      // Extract SBI Master fields
      const sbiRecord: any = {
        ppoNumber: record.ppoNumber,
        accountNumber: record.accountNumber,
        name: record.name,
        dateOfBirth: record.dateOfBirth,
        dateStart: record.dateStart,
        pensionType: record.pensionType,
        dateOfRetirement: record.dateOfRetirement,
        fileNo: record.fileNo,
        // ... Add other SBI Master fields if necessary
      };

      // Extract Arpan (debit scroll) fields
      const arpanRecord: any = {
        newPPONo: record.newPPONo,
        oldPPONo: record.oldPPONo,
        currentPensionerName: record.currentPensionerName,
        monthOfPension: record.monthOfPension,
        month: record.month,
      };

      if (isBasic) {
        arpanRecord.basicPensionAmount = record.basicPensionAmount ?? "";
        arpanRecord.deduction = record.deduction ?? "";
        arpanRecord.residualPension = record.residualPension ?? "";
        arpanRecord.fixMedicalAllowance = record.fixMedicalAllowance ?? "";
        arpanRecord.additionalPension80Plus =
          record.additionalPension80Plus ?? "";
        arpanRecord.daOnBasicPension = record.daOnBasicPension ?? "";
        arpanRecord.totalPension = record.totalPension ?? "";
        arpanRecord.basicCategory = record.basicCategory ?? "";
        arpanRecord.basicMismatch = record.basicMismatch ?? "";
      } else {
        arpanRecord.basicPensionAmount = record.basicPensionAmount ?? "";
        arpanRecord.deduction = record.deduction ?? "";
        arpanRecord.residualPension = record.residualPension ?? "";
        arpanRecord.fixMedicalAllowance = record.fixMedicalAllowance ?? "";
        arpanRecord.additionalPension80Plus =
          record.additionalPension80Plus ?? "";
        arpanRecord.daOnBasicPension = record.daOnBasicPension ?? "";
        arpanRecord.totalPension = record.totalPension ?? "";
        arpanRecord.commutationCategory = record.commutationCategory ?? "";
        arpanRecord.commutationMismatch = record.commutationMismatch ?? "";
      }

      // Push cleaned objects to arrays
      sbiMaster.push(sbiRecord);
      arpanData.push(arpanRecord);
    });

    const finalGroupedData = {
      sbiMaster,
      arpanData,
    };
    return finalGroupedData;
  } catch (error) {
    console.error("Error fetching and exporting data:", error);
    throw new Error("Failed to export data");
  }
}

///// Function for getting the piechart csv download data -----------------------------/
export async function getTrendCsvDownloadData(
  categoryType,
  pieDataType,
  month
) {
  try {
    const startQuery = Date.now();

    // Determine the category and mismatch fields based on categoryType
    const isBasic = categoryType === "basic";
    const categoryField = isBasic ? "a.basicCategory" : "a.commutationCategory";
    const mismatchField = isBasic ? "a.basicMismatch" : "a.commutationMismatch";
    const mismatchType = isBasic ? "basicMismatch" : "commutationMismatch";

    // Start with an empty WHERE clause
    let whereClause = ``;

    if (pieDataType === "match") {
      whereClause = `WHERE ${categoryField} = 'match'`;
    } else if (pieDataType === "unlinked") {
      whereClause = `WHERE ${categoryField} = 'unlinked'`;
    } else if (pieDataType === "underpaid" || pieDataType === "overpaid") {
      whereClause = `WHERE ${mismatchField} <> 0`;
    }

    // Select only relevant fields
    const selectedFields = isBasic
      ? `s.ppoNumber, s.accountNumber, s.name, s.dateOfBirth, s.dateStart, 
     s.pensionType, s.dateOfRetirement, a.fileNo, a.oldPPONo, a.newPPONo, 
     a.currentPensionerName, a.monthOfPension, a.basicPensionAmount, a.deduction, 
     a.residualPension, a.fixMedicalAllowance, a.additionalPension80Plus, 
     a.daOnBasicPension, a.totalPension, a.basicCategory, a.basicMismatch,a.month`
      : `s.ppoNumber, s.accountNumber, s.name, s.dateOfBirth, s.dateStart, 
     s.pensionType, s.dateOfRetirement, a.fileNo, a.oldPPONo, a.newPPONo, a.month,
     a.currentPensionerName, a.monthOfPension, a.commutationCategory, 
     a.commutationMismatch`;

    const query = `
  SELECT ${selectedFields}
  FROM sbi_master s
  INNER JOIN arpan a 
    ON s.ppoNumber IN (a.oldPPONo, a.newPPONo)
  ${whereClause}
   ORDER BY a.month DESC
`;

    const mergedData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log("this is megedata");
    console.log(mergedData);

    const endQuery = Date.now();

    if (!mergedData || mergedData.length === 0) {
      throw new Error("No matching data found for the specified month.");
    }

    // Post-query filtering for underpaid/overpaid
    let filteredData = mergedData;
    if (pieDataType === "underpaid") {
      filteredData = mergedData.filter((record) => record[mismatchType] < 0);
    } else if (pieDataType === "overpaid") {
      filteredData = mergedData.filter((record) => record[mismatchType] > 0);
    }

    const sbiMaster: any = [];
    const arpanData: any = [];

    filteredData.forEach((record) => {
      // Extract SBI Master fields
      const sbiRecord: any = {
        ppoNumber: record.ppoNumber,
        accountNumber: record.accountNumber,
        name: record.name,
        dateOfBirth: record.dateOfBirth,
        dateStart: record.dateStart,
        pensionType: record.pensionType,
        dateOfRetirement: record.dateOfRetirement,
        fileNo: record.fileNo,
        // ... Add other SBI Master fields if necessary
      };

      // Extract Arpan (debit scroll) fields
      const arpanRecord: any = {
        newPPONo: record.newPPONo,
        oldPPONo: record.oldPPONo,
        currentPensionerName: record.currentPensionerName,
        monthOfPension: record.monthOfPension,
        month: record.month,
      };

      if (isBasic) {
        arpanRecord.basicPensionAmount = record.basicPensionAmount ?? "";
        arpanRecord.deduction = record.deduction ?? "";
        arpanRecord.residualPension = record.residualPension ?? "";
        arpanRecord.fixMedicalAllowance = record.fixMedicalAllowance ?? "";
        arpanRecord.additionalPension80Plus =
          record.additionalPension80Plus ?? "";
        arpanRecord.daOnBasicPension = record.daOnBasicPension ?? "";
        arpanRecord.totalPension = record.totalPension ?? "";
        arpanRecord.basicCategory = record.basicCategory ?? "";
        arpanRecord.basicMismatch = record.basicMismatch ?? "";
      } else {
        arpanRecord.basicPensionAmount = record.basicPensionAmount ?? "";
        arpanRecord.deduction = record.deduction ?? "";
        arpanRecord.residualPension = record.residualPension ?? "";
        arpanRecord.fixMedicalAllowance = record.fixMedicalAllowance ?? "";
        arpanRecord.additionalPension80Plus =
          record.additionalPension80Plus ?? "";
        arpanRecord.daOnBasicPension = record.daOnBasicPension ?? "";
        arpanRecord.totalPension = record.totalPension ?? "";
        arpanRecord.commutationCategory = record.commutationCategory ?? "";
        arpanRecord.commutationMismatch = record.commutationMismatch ?? "";
      }

      // Push cleaned objects to arrays
      sbiMaster.push(sbiRecord);
      arpanData.push(arpanRecord);
    });

    const finalGroupedData = {
      sbiMaster,
      arpanData,
    };
    return finalGroupedData;
  } catch (error) {
    console.error("Error fetching and exporting data:", error);
    throw new Error("Failed to export data");
  }
}

///// Funciton for getting the debit scroll data -----------------------------/
function getPensionDetails(
  arpanData: any[],
  date: string,
  previousMonth: string
): PensionDetails {
  const pensionSummary: Record<string, number> = {};
  arpanData.forEach(({ totalPension, month }) => {
    pensionSummary[month] = (pensionSummary[month] || 0) + totalPension;
  });

  const currentPension = pensionSummary[date] || 0;
  const previousPension = pensionSummary[previousMonth] || 0;
  const difference = currentPension - previousPension;

  return { currentPension, previousPension, difference };
}
// Main function to get CSV comparison data
export async function getCsvComparisonData(date: string, username: string) {
  console.log("reached for downloading data");
  try {
    //// getting the previous months also ------------------------/
    const previousMonth = csvUtils.getPreviousMonth(date);
    const [arpanData, sbiMasterData] = await fetchSqlData(date, previousMonth);

    arpanData.sort((a, b) => {
      const [monthA, yearA] = a.month.split("/");
      const [monthB, yearB] = b.month.split("/");
      const dateA = new Date(Number(yearA), Number(monthA) - 1);
      const dateB = new Date(Number(yearB), Number(monthB) - 1);
      return dateA.getTime() - dateB.getTime();
    });

    const pensionSummary = getPensionDetails(arpanData, date, previousMonth);

    const newPensionerData = filterNewPensionerData(
      arpanData,
      previousMonth,
      date,
      pensionSummary.difference
    );
    const stoppedPensionerData = filteredStoppedPensioner(
      arpanData,
      previousMonth,
      date,
      pensionSummary.difference
    );

    const basicOverPaymentData = await filteredOverPaymentUnderPaymentData(
      date,
      previousMonth,
      "overpayment",
      pensionSummary.difference
    );
    const basicUnderPaymentData = await filteredOverPaymentUnderPaymentData(
      date,
      previousMonth,
      "underpayment",
      pensionSummary.difference
    );
    // console.log("this is basic");
    // console.log(basicOverPaymentData);

    const commutationOverPaymentData =
      await filteredOverPaymentUnderPaymentDataForCommutation(
        date,
        previousMonth,
        "overpayment",
        pensionSummary.difference
      );
    const commutationUnderPaymentData =
      await filteredOverPaymentUnderPaymentDataForCommutation(
        date,
        previousMonth,
        "underpayment",
        pensionSummary.difference
      );

    const regularToFamilyData = await filterRegularToFamilyPensionData(
      previousMonth,
      date,
      pensionSummary.difference
    );
    const ageData = await filteredAgeSqlData(
      arpanData,
      sbiMasterData,
      pensionSummary.difference
    );
    let summaryData = {
      pensionData: pensionSummary,
      newPensioner: {
        amount: newPensionerData.totalPension,
        contributed: newPensionerData.contributed,
      },
      stoppedPensioner: {
        amount: stoppedPensionerData.totalPension,
        contributed: stoppedPensionerData.contributed,
      },
      basicUnderPayment: {
        amount: basicUnderPaymentData.amount,
        contributed: basicUnderPaymentData.contributed,
      },
      basicOverPayment: {
        amount: basicOverPaymentData.amount,
        contributed: basicOverPaymentData.contributed,
      },
      commutationOverPayment: {
        amount: commutationOverPaymentData.amount,
        contributed: commutationOverPaymentData.contributed,
      },

      commutationUnderPayment: {
        amount: commutationUnderPaymentData.amount,
        contributed: commutationUnderPaymentData.contributed,
      },
      regularToFamilyTransitionData: {
        amount: regularToFamilyData.amount,
        contributed: regularToFamilyData.contributed,
      },
      ageCsvData: {
        amount: ageData.amount,
        contributed: ageData.contributed,
      },
    };

    
    const finalSummaryData = calculateOtherFromSummaryData(summaryData);

    //inserting the log for this task
    const ist = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const date1 = new Date(ist);

    const pad = (n: number) => (n < 10 ? "0" + n : n);

    const year = date1.getFullYear();
    const month = pad(date1.getMonth() + 1);
    const day = pad(date1.getDate());
    const hours = pad(date1.getHours());
    const minutes = pad(date1.getMinutes());
    const seconds = pad(date1.getSeconds());
    console.log("Date and Time:", year, month, day, hours, minutes, seconds);

    const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    const row = {
        user: username,
        task: "Unlinked data CSV download",
        createdAt: datetime,
    };
    console.log("starting putting log data");
    
    const transaction = await sequelize.transaction(); 
    try{
      await Logs.sync({ alter: true });
      console.log("Reached here");
                  
      await Logs.create(row, { transaction });
      console.log("Reached here2");
                  
      await transaction.commit();
      console.log("Log entry created successfully");
    }
    catch(error){
      console.error("Error creating log entry:", error);
      await transaction.rollback();
    }
    // end of putting log data
    return {
      summaryData: finalSummaryData,
      newPensionerData: newPensionerData.users,
      stoppedPensionerData: stoppedPensionerData.stoppedPensioners,
      regularToFamilyData: regularToFamilyData.users,
      basicOverPaymentData: basicOverPaymentData.filtered,
      basicUnderPaymentData: basicUnderPaymentData.filtered,
      commutationOverPaymentData: commutationOverPaymentData.filtered,
      commutationUnderPaymentData: commutationUnderPaymentData.filtered,
      ageData: ageData.users,
    };
  } catch (error) {
    console.error("Error fetching and exporting data:", error);
    throw new Error("Failed to export data");
  }
}
