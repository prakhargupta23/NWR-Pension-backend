/**
 * Create a new transaction entry in the database
 * @param {Object} data - The transaction data object
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const sequelize = require("../config/sequlize");
const Earning = require("../Model/Earning.model");
const Expenditure = require("../Model/Expenditure.model");
const RecoverableModel = require("../Model/Recoverable.model");
const DWRecoverableModel = require("../Model/DepartmentRecoverable.model");
const SuspenseRegister = require("../Model/SuspenseRegister.model");
const CompletionReport = require("../Model/CompletionReports");
const StockSheet = require("../Model/StockSheetsModel");
const SettlementCase = require("../Model/SettleMentCases.model");
const SavingThroughIC = require("../Model/SavingThroughIc.model");
const HrInspection = require("../Model/HRInspection.model");
const Comment = require("../Model/Comment.model");
const AuditObjection = require("../Model/AuditObjection.model");
const AccountInspection = require("../Model/AccountInspection.model");
const phExpenditure = require("../Model/PhExpenditureModel");
interface SheetEntry {
  [key: string]: any;
}

interface SheetDataPayload {
  division: string;
  selectedMonthYear: string;

  accountInspection: SheetEntry[];
  auditObjection: SheetEntry[];
  completionReports: SheetEntry[];
  dwRecoverable: SheetEntry[];
  earning: SheetEntry[];
  expenditure: SheetEntry[];
  phExpenditure: SheetEntry[];
  rbinspection: SheetEntry[];
  recoverable: SheetEntry[];
  savingthroughic: SheetEntry[];
  settlementcases: SheetEntry[];
  stocksheets: SheetEntry[];
  suspenseBalance: SheetEntry[];
}

export const createTransactionEntry = async (data: SheetDataPayload) => {
  try {
    // Ensure tables exist (creates if they don't)
    await Promise.all([
      Earning.sync({ alter: true }),
      Expenditure.sync({ alter: true }),
      RecoverableModel.sync({ alter: true }),
      DWRecoverableModel.sync({ alter: true }),
      SuspenseRegister.sync({ alter: true }),
      CompletionReport.sync({ alter: true }),
      StockSheet.sync({ alter: true }),
      SettlementCase.sync({ alter: true }),
      SavingThroughIC.sync({ alter: true }),
      HrInspection.sync({ alter: true }),
      AuditObjection.sync({ alert: true }),
      AccountInspection.sync({ alert: true }),
      phExpenditure.sync({ alert: true }),
    ]);
    const createPromises = [];
    // Step 1: Delete existing records for the selected month/year
    if (data.selectedMonthYear) {
      await Promise.all([
        Earning.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        Expenditure.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        RecoverableModel.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        DWRecoverableModel.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        SuspenseRegister.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        CompletionReport.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        StockSheet.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        SettlementCase.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        SavingThroughIC.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        HrInspection.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        AuditObjection.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        AccountInspection.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
        phExpenditure.destroy({
          where: { date: data.selectedMonthYear, division: data.division },
        }),
      ]);
    }

    if (Array.isArray(data.earning) && data.earning.length > 0) {
      console.log("went for the first");

      const earningsToInsert = data.earning.map((item) => ({
        division: item.division,
        date: item.date,
        actualLastFinancialYear: item.actualLastFinancialYear,
        targetThisMonth: item.targetThisMonth,
        actualThisMonthLastYear: item.actualThisMonthLastYear,
        actualThisMonth: item.actualThisMonth,
        targetYTDThisMonth: item.targetYTDThisMonth,
        actualYTDThisMonthLastYear: item.actualYTDThisMonthLastYear,
        actualYTDThisMonth: item.actualYTDThisMonth,
        subCategory: item.subCategory,
        figure: item.figure,
      }));

      createPromises.push(Earning.bulkCreate(earningsToInsert));
    }
    if (
      Array.isArray(data.accountInspection) &&
      data.accountInspection.length > 0
    ) {
      console.log("Inserting Account Inspections");

      const accountInspectionsToInsert = data.accountInspection.map((item) => ({
        typeOfReport: item.typeOfReport,
        positionLhr: item.positionLhr,
        openingBalance: item.openingBalance,
        accretion: item.accretion,
        clearanceOverOneYear: item.clearanceOverOneYear,
        closingBalance: item.closingBalance,
        clearanceLessThanOneYear: item.clearanceLessThanOneYear,
        division: item.division,
        date: item.date,
      }));

      createPromises.push(
        AccountInspection.bulkCreate(accountInspectionsToInsert)
      );
    }
    if (Array.isArray(data.auditObjection) && data.auditObjection.length > 0) {
      console.log("Inserting Audit Objections");

      const auditObjectionsToInsert = data.auditObjection.map((item) => ({
        suspenseHeads: item.auditObjection,
        positionLhr: item.positionLhr,
        openingBalance: item.openingBalance,
        clearenceOverOneYear: item.clearenceOverOneYear,
        clearenceLessOneYear: item.clearenceLessOneYear,
        closingBalance: item.closingBalance, // Use the correct (typo) field name as per model
        division: item.division,

        accretion: item.accretion,
        date: item.date,
      }));

      createPromises.push(AuditObjection.bulkCreate(auditObjectionsToInsert));
    }

    if (Array.isArray(data.expenditure) && data.expenditure.length > 0) {
      console.log("went here");

      const expendituresToInsert = data.expenditure.map((item) => ({
        division: item.division,
        date: item.date,
        actualLastFinancialYear: item.actualLastFinancialYear,
        targetCurrentFinancialYear: item.targetCurrentFinancialYear,
        targetThisMonth: item.targetThisMonth,
        actualThisMonthLastYear: item.actualThisMonthLastYear,
        actualThisMonth: item.actualThisMonth,
        targetYTDThisMonth: item.targetYTDThisMonth,
        actualYTDThisMonthLastYear: item.actualYTDThisMonthLastYear,
        actualYTDThisMonth: item.actualYTDThisMonth,
        subCategory: item.subCategory,
        figure: item.figure,
      }));

      createPromises.push(Expenditure.bulkCreate(expendituresToInsert));
    }
    if (Array.isArray(data.recoverable) && data.recoverable.length > 0) {
      console.log("went for the last");

      const recoverablesToInsert = data.recoverable.map((item) => ({
        division: item.division,
        date: item.date,
        category: item.category,
        type: item.type,
        openingBalance: item.openingBalance,
        accretionUptoTheMonth: item.accretionUptoTheMonth,
        clearanceUptoMonth: item.clearanceUptoMonth,
        closingBalance: item.closingBalance,
        figure: item.figure,
      }));

      createPromises.push(RecoverableModel.bulkCreate(recoverablesToInsert));
    }
    // // ✅ Insert DW recoverables
    if (Array.isArray(data.dwRecoverable) && data.dwRecoverable.length > 0) {
      console.log("went for dw recoverables");
      const dwRecoverablesToInsert = data.dwRecoverable.map((item) => ({
        division: item.division,
        date: item.date,
        department: item.department,
        type: item.type,
        openingBalance: item.openingBalance,
        openingBalanceItem: item.openingBalanceItem,
        accretionUptoTheMonth: item.accretionUptoTheMonth,
        accretionUptoTheMonthItem: item.accretionUptoTheMonthItem,
        clearanceUptoMonth: item.clearanceUptoMonth,
        clearanceUptoMonthItem: item.clearanceUptoMonthItem,
        closingBalance: item.closingBalance,
        closingBalanceItem: item.closingBalanceItem,
      }));

      createPromises.push(
        DWRecoverableModel.bulkCreate(dwRecoverablesToInsert)
      );
    }
    if (
      Array.isArray(data.suspenseBalance) &&
      data.suspenseBalance.length > 0
    ) {
      console.log("went for suspense registers");
      const suspenseToInsert = data.suspenseBalance.map((item) => ({
        division: item.division,
        date: item.date,
        suspenseHeads: item.suspenseHeads,
        position: item.position,
        positionItem: item.positionItem,
        figure: item.figure,
        positionLhr: item.positionLhr,
        positionLhrItem: item.positionLhrItem,
        closingBalance: item.closingBalance,
        closingBalanceItem: item.closingBalanceItem,
        reconciliationMonth: item.reconciliationMonth,
      }));

      createPromises.push(SuspenseRegister.bulkCreate(suspenseToInsert));
    }

    /// This is for the  and completion reports
    if (
      Array.isArray(data.completionReports) &&
      data.completionReports.length > 0
    ) {
      console.log("Inserting completionreports");

      const completionReportsToInsert = data.completionReports.map((item) => ({
        department: item.department,
        positionAsLastYearMonth: item.positionAsLastYearMonth, // 01-04-2024 position
        accretionUpToMonth: item.accretionUpToMonth,
        clearanceUpToMonth: item.clearanceUpToMonth,
        closingBalance: item.closingBalance,
        oldestCRPending: item.oldestCrPending,
        division: item.division,

        date: item.date,
      }));

      createPromises.push(
        CompletionReport.bulkCreate(completionReportsToInsert)
      );
    }
    if (Array.isArray(data.phExpenditure) && data.phExpenditure.length > 0) {
      console.log("Inserting phexpenditure");

      const phExpenditureToInsert = data.phExpenditure.map((item) => ({
        planHead: item.planHead,
        actualLastYear: item.actualLastYear,
        division: item.division,
        figure: item.figure,
        date: item.date,
        targetLastYear: item.targetLastYear,
        actualForTheMonth: item.actualForTheMonth,
        actualUpToTheMonth: item.actualUpToTheMonth,
        actualUpToTheMonthLastYear: item.actualUpToTheMonthLastYear,
      }));

      createPromises.push(phExpenditure.bulkCreate(phExpenditureToInsert));
    }

    /// This is for the stocksheets
    if (Array.isArray(data.stocksheets) && data.stocksheets.length > 0) {
      console.log("Inserting stocksheets");

      const stockSheetsToInsert = data.stocksheets.map((item) => ({
        department: item.department,
        openingBalanceAsLastYearMonth: item.openingBalanceAsLastYearMonth, // 01-04-2024 opening balance
        accretionUpToMonth: item.accretionUpToMonth,
        clearanceUpToMonth: item.clearanceUpToMonth,
        closingBalance: item.closingBalance,
        remarks: item.remarks,
        division: item.division,

        date: item.date,
      }));

      createPromises.push(StockSheet.bulkCreate(stockSheetsToInsert));
    }

    /// This is for the settlement cases
    if (
      Array.isArray(data.settlementcases) &&
      data.settlementcases.length > 0
    ) {
      console.log("Inserting settlementcases");

      const settlementCasesToInsert = data.settlementcases.map((item) => ({
        item: item.item,
        division: item.division,

        date: item.date,
        openingBalanceOfMonth: item.openingBalanceMonth,

        accretionDuringMonth: item.accretionDuringMonth,
        clearedDuringMonth: item.clearedDuringMonth,
        closingOutstanding: item.closingOutstanding,
      }));

      createPromises.push(SettlementCase.bulkCreate(settlementCasesToInsert));
    }
    //// This is for the saving through ic
    if (
      Array.isArray(data.savingthroughic) &&
      data.savingthroughic.length > 0
    ) {
      console.log("Inserting savingthroughic");

      const savingThroughICToInsert = data.savingthroughic.map((item) => ({
        actualUpToLastMonth: item.actualUpToLastMonth,
        forTheMonth: item.forTheMonth,
        totalToEndOfMonth: item.totalToEndOfMonth,
        remarks: item.remarks?.toString(),
        division: item.division,
        figure: item.figure,
        date: item.date,
      }));

      createPromises.push(SavingThroughIC.bulkCreate(savingThroughICToInsert));
    }
    if (Array.isArray(data.rbinspection) && data.rbinspection.length > 0) {
      console.log("Inserting hrinspection");

      const rbInespectionToInsert = data.rbinspection.map((item) => ({
        yearOfReport: item.yearOfReport,
        typeOfPara: item.typeOfPara,
        totalParas: item.totalParas,
        parasAtStartOfMonth: item.parasAtStartOfMonth,
        closedDuringMonth: item.closedDuringMonth,
        parasOutstanding: item.parasOutstanding,
        remarks: item.remarks,
        division: item.division,

        date: item.date,
      }));

      createPromises.push(HrInspection.bulkCreate(rbInespectionToInsert));
    }

    const response = await Promise.all(createPromises);
    console.log("Insert results:", response);

    return {
      success: true,
      message: "Entries created successfully using bulkCreate.",
    };
  } catch (error) {
    console.error("Error creating entries:", error);
    return {
      success: false,
      message: "Failed to create entries. " + error.message,
    };
  }
};

export const fetchSheetsData = async (
  division: string,
  date: string,
  sheetName?: string
) => {
  console.log("this is sheetname");
  console.log(sheetName);

  try {
    const sheetTables = {
      Dwrecoverable: "departmentwiserecoverable",
      Auditobjection: "auditObjection",
      Completionreport: "completionreports",
      Accountinspection: "accountInspection",
      Hrinspection: "rbinespection",
      PHexpenditure: "phexpenditure",
      Recoverable: "recoverable",
      Savingthroughic: "savingthroughic",
      Settlementcase: "settlementcases",
      Stocksheet: "stocksheets",
      Suspenseregister: "suspenseregisters",
    };

    const sheetsToFetch = sheetName ? [sheetName] : Object.keys(sheetTables);

    const results: Array<{
      sheetName: string;
      data: any[];
      comment: any | null;
    }> = [];

    for (const sheet of sheetsToFetch) {
      const tableName = sheetTables[sheet as keyof typeof sheetTables];
      console.log("final tablename");

      if (!tableName) {
        console.warn(`Sheet ${sheet} not found in mapping.`);
        continue;
      }

      const dataQuery = `
      SELECT *
      FROM ${tableName}
      WHERE division = :division
        AND date = :date
    `;

      const [data] = await Promise.all([
        sequelize.query(dataQuery, {
          replacements: { division, date },
          type: sequelize.QueryTypes.SELECT,
        }),
      ]);

      results.push({
        sheetName: sheet, // what frontend expects
        data: data.map((item: any) => {
          const { uuid, division, date, createdAt, updatedAt, ...rest } = item;
          return rest;
        }),
        comment: null,
      });

      if (sheetName) return results; // if one sheet requested, return early
    }

    return results;
  } catch (error: any) {
    console.error("Error fetching sheets data:", error);
    return {
      message: "Failed to fetch data",
      error: error.message,
    };
  }
};
