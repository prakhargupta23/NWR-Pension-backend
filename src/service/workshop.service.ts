/**
 * Create a new transaction entry in the database
 * @param {Object} data - The transaction data object
 * @returns {Promise<{ success: boolean, message: string }>}
 */


const sequelize1 = require("../config/sequlize");
// const Earning = require("../Model/Earning.model");
const WorkingExpenditure = require("../Model/Workshop/WorkingExpenditure.model")
const PlanHead = require("../Model/Workshop/PlanHead.model");
const ManufacturingSuspense = require("../Model/Workshop/ManufacturingSuspense.model");
const WMSBalance = require("../Model/Workshop/WMSBalance.model");
const WMSClosingBalance = require("../Model/Workshop/WMSClosingBalance.model");
const WMSBalanceAnalysis = require("../Model/Workshop/WMSBalanceAnalysis.model");
const WmsStoreCharges = require("../Model/Workshop/WmsStoreCharges.model");
const PositionOfDirectPurchase = require("../Model/Workshop/PositionOfDirectPurchase.model");
const ComparativePositionOfOutturn = require("../Model/Workshop/ComparativePositionOfOutturn.model");
const PohUnitCost = require("../Model/Workshop/PohUnitCost.model");
const PostingAndReconciliation = require("../Model/Workshop/PostingAndReconciliation.model");
const ItemPositionInSuspenseRegister = require("../Model/Workshop/ItemPositionInSuspenseRegister.model");
const UnsanctionedExpenditure = require("../Model/Workshop/UnsanctionedExpenditure.model");
const InspectionPara = require("../Model/Workshop/InspectionPara.model");
const OutstandingAuditObjection = require("../Model/Workshop/OutstandingAuditObjection.model");
const AnalysisOfAuditReference = require("../Model/Workshop/AnalysisOfAuditReference.model");
const PositionOfAccountInspection = require("../Model/Workshop/PositionOfAccountInspection.model");
const AccountInspectionOfOffices = require("../Model/Workshop/AccountInspectionOfOffices.model");
const AccountInspectionReport = require("../Model/Workshop/AccountInspectionReport.model");
const AgeWiseAnalysisAccountsInspection = require("../Model/Workshop/AgeWiseAnalysisAccountsInspection.model");
const SavingsThroughInternalCheck = require("../Model/Workshop/SavingsThroughInternalCheck.model");
const HqRefPendingWithWorkshop = require("../Model/Workshop/HqRefPendingWithWorkshop.model");
const PositionOfReplyToHQDOLetter = require("../Model/Workshop/PositionOfReplyToHQDOLetter.model");
const NcsrpAndPensionPosition = require("../Model/Workshop/NcsrpAndPensionPosition.model");
const PosOfTransferOfServicecard = require("../Model/Workshop/PosOfTransferOfServicecard.model");
const PositionOfStockSheet = require("../Model/Workshop/PositionOfStockSheet.model");
const AgeWisePositionOfStockSheet = require("../Model/Workshop/AgeWisePositionOfStockSheet.model");
const DeptWisePositionStocksheet = require("../Model/Workshop/DeptWisePositionStocksheet.model");
const StaffReferencesOrCases = require("../Model/Workshop/StaffReferencesOrCases.model");
const ClearanceAndAdjustmentOfMA = require("../Model/Workshop/ClearanceAndAdjustmentOfMA.model");
const ProgressOfSalaryPayment = require("../Model/Workshop/ProgressOfSalaryPayment.model");
const ProgressOfEPayment = require("../Model/Workshop/ProgressOfEPayment.model");
const ProgressOfSalaryThroughBank = require("../Model/Workshop/ProgressOfSalaryThroughBank.model");
const ProgressOfSalaryThroughECS = require("../Model/Workshop/ProgressOfSalaryThroughECS.model");
const PlannedImplementationECS = require("../Model/Workshop/PlannedImplementationECS.model");
const ReportOnFacilityAugmentation = require("../Model/Workshop/ReportOnFacilityAugmentation.model");
const TestChecksBySS = require("../Model/Workshop/TestChecksBySS.model");
const TestChecksBySrISA = require("../Model/Workshop/TestChecksBySrISA.model");
const QuaterlyTestChecksByJAG = require("../Model/Workshop/QuaterlyTestChecksByJAG.model");
const RotationOfStaff = require("../Model/Workshop/RotationOfStaff.model");
const MiscellaneousItems = require("../Model/Workshop/MiscellaneousItems.model");
const CompletionReportsexpenditure = require("../Model/Workshop/CompletionReports.model");
const DrAndBr = require("../Model/Workshop/DrAndBr.model");
const PositionOfImpRecoverableItems = require("../Model/Workshop/PositionOfImpRecoverableItems.model");
const DeptWiseRecoverableItems = require("../Model/Workshop/DeptWiseRecoverableItems.model");
const PositionOfSpotChecking = require("../Model/Workshop/PositionOfSpotChecking.model");
const StatusOfRevisionOfPension = require("../Model/Workshop/StatusOfRevisionOfPension.model");
const AssistanceRequiredFromHO = require("../Model/Workshop/AssistanceRequiredFromHO.model");
const IncentivePayment = require("../Model/Workshop/IncentivePayment.model");
const TurnOverRatio = require("../Model/Workshop/TurnOverRatio.model");
const OnlineBillSubmissionStatus = require("../Model/Workshop/OnlineBillSubmissionStatus.model");
const ITImplementationStatus = require("../Model/Workshop/ITImplementationStatus.model");
const ScrapSale = require("../Model/Workshop/ScrapSale.model");
const WorkshopManufacturingSuspense = require("../Model/Workshop/WorkshopManufacturingSuspense.model");

// Helper function to get current date and time
const getCurrentDateTime = (): string => {
    const now = new Date();
    // Simple format: YYYY-MM-DD HH:MM:SS
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Helper coercion functions to ensure correct types with nulls for missing/empty values
// const toNullableString = (value: any): string | null => {
//     if (value === undefined || value === null) return null;
//     const str = String(value).trim();
//     return str.length === 0 ? null : str;
// };

const toNullableInteger = (value: any): number | null => {
    if (value === undefined || value === null) return null;
    const num = parseInt(String(value).trim(), 10);
    return Number.isNaN(num) ? null : num;
};

// Cast all values to string for most tables (except WorkingExpenditure and PlanHead)
const toStringValue = (value: any): string => {
    if (value === undefined || value === null) return '';
    
    // Handle special cases
    if (typeof value === 'number') {
        return value.toString();
    }
    
    if (typeof value === 'boolean') {
        return value.toString();
    }
    
    const str = String(value).trim();
    
    // Handle empty strings and whitespace-only strings
    if (str === '' || str.length === 0) {
        return '';
    }
    
    // Truncate if longer than 250 characters to avoid database issues
    return str.length > 250 ? str.substring(0, 250) : str;
};

// New helper function for tables that should convert empty strings to null (except WorkingExpenditure and PlanHead)
const toStringValueWithNull = (value: any): string | null => {
    if (value === undefined || value === null) return null;
    
    // Handle special cases
    if (typeof value === 'number') {
        return value.toString();
    }
    
    if (typeof value === 'boolean') {
        return value.toString();
    }
    
    const str = String(value).trim();
    
    // Handle "NIL" values - convert to null
    if (str.toUpperCase() === 'NIL') {
        return null;
    }
    
    // Handle empty strings and whitespace-only strings - return null for empty values
    if (str === '' || str.length === 0) {
        return null;
    }
    
    // Truncate if longer than 250 characters to avoid database issues
    return str.length > 250 ? str.substring(0, 250) : str;
};

// Helper function for fields that should never be null (like division and date)
const toStringValueRequired = (value: any): string => {
    if (value === undefined || value === null) return '';
    
    // Handle special cases
    if (typeof value === 'number') {
        return value.toString();
    }
    
    if (typeof value === 'boolean') {
        return value.toString();
    }
    
    const str = String(value).trim();
    
    // Handle "NIL" values - convert to empty string for required fields
    if (str.toUpperCase() === 'NIL') {
        return '';
    }
    
    // Handle empty strings and whitespace-only strings - return empty string for required fields
    if (str === '' || str.length === 0) {
        return '';
    }
    
    // Truncate if longer than 250 characters to avoid database issues
    return str.length > 250 ? str.substring(0, 250) : str;
};

interface SheetEntry {
    [key: string]: any;
}

interface SheetDataPayload {
    division: string;
    selectedMonthYear: string;
    workingExpenditure: SheetEntry[];
    planHead: SheetEntry[];
    manufacturingSuspense: SheetEntry[];
    wmsBalance: SheetEntry[];
    wmsClosingBalance: SheetEntry[];
    wmsBalanceAnalysis: SheetEntry[];
    wmsStoreCharges: SheetEntry[];
    positionofDirectPurchase: SheetEntry[];
    comparativePositionofOutturn: SheetEntry[];
    pohUnitCost: SheetEntry[];
    postingandReconciliation: SheetEntry[];
    itemPositioninSuspenseRegister: SheetEntry[];
    unsanctionedExpenditure: SheetEntry[];
    inspectionPara: SheetEntry[];
    outstandingAuditObjection: SheetEntry[];
    analysisOfAuditReference: SheetEntry[];
    positionOfAccountInspection: SheetEntry[];
    accountInspectionOfOffices: SheetEntry[];
    accountInspectionReport: SheetEntry[];
    ageWiseAnalysisAccountsInspection: SheetEntry[];
    savingsThroughInternalCheck: SheetEntry[];
    hqRefPendingWithWorkshop: SheetEntry[];
    positionOfReplyToHQDOLetter: SheetEntry[];
    ncsrpAndPensionPosition: SheetEntry[];
    posOfTransferOfServicecard: SheetEntry[];
    positionOfStockSheet: SheetEntry[];
    ageWisePositionOfStockSheet: SheetEntry[];
    deptWisePositionStocksheet: SheetEntry[];
    staffReferencesOrCases: SheetEntry[];
    clearanceAndAdjustmentOfMA: SheetEntry[];
    progressOfSalaryPayment: SheetEntry[];
    progressOfEPayment: SheetEntry[];
    progressOfSalaryThroughBank: SheetEntry[];
    progressOfSalaryThroughECS: SheetEntry[];
    plannedImplementationECS: SheetEntry[];
    reportOnFacilityAugmentation: SheetEntry[];
    testChecksBySS: SheetEntry[];
    testChecksBySrISA: SheetEntry[];
    quaterlyTestChecksByJAG: SheetEntry[];
    rotationOfStaff: SheetEntry[];
    miscellaneousItems: SheetEntry[];
    completionReports: SheetEntry[];
    drAndBr: SheetEntry[];
    positionOfImpRecoverableItems: SheetEntry[];
    deptWiseRecoverableItems: SheetEntry[];
    positionOfSpotChecking: SheetEntry[];
    statusOfRevisionOfPension: SheetEntry[];
    assistanceRequiredFromHO: SheetEntry[];
    incentivePayment: SheetEntry[];
    turnOverRatio: SheetEntry[];
    onlineBillSubmissionStatus: SheetEntry[];
    itImplementationStatus: SheetEntry[];
    scrapSale: SheetEntry[];
    workshopManufacturingSuspense: SheetEntry[];
}


export const createWorkshopEntry = async (data: SheetDataPayload) => {
    console.log("starting entry log")
    // await Promise.all([
    //     // Earning.sync({ alter: true }),
    //     WorkingExpenditure.sync({ alter: true }),

        
    // ]);
    console.log("vbnm")
    const createPromises = [];
      // Step 1: Delete existing records for the selected month/year
    if (data.selectedMonthYear) {
        await Promise.all([
        //   Earning.destroy({
        //     where: { date: data.selectedMonthYear, division: data.division },
        //   }),
        WorkingExpenditure.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PlanHead.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ManufacturingSuspense.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        WMSBalance.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        WMSClosingBalance.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        WMSBalanceAnalysis.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        WmsStoreCharges.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PositionOfDirectPurchase.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ComparativePositionOfOutturn.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PohUnitCost.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PostingAndReconciliation.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ItemPositionInSuspenseRegister.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        UnsanctionedExpenditure.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        InspectionPara.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        OutstandingAuditObjection.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        AnalysisOfAuditReference.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PositionOfAccountInspection.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        AccountInspectionOfOffices.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        AccountInspectionReport.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        AgeWiseAnalysisAccountsInspection.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        SavingsThroughInternalCheck.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        HqRefPendingWithWorkshop.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PositionOfReplyToHQDOLetter.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        NcsrpAndPensionPosition.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PosOfTransferOfServicecard.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PositionOfStockSheet.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        AgeWisePositionOfStockSheet.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        DeptWisePositionStocksheet.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        StaffReferencesOrCases.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ClearanceAndAdjustmentOfMA.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ProgressOfSalaryPayment.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ProgressOfEPayment.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ProgressOfSalaryThroughBank.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ProgressOfSalaryThroughECS.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PlannedImplementationECS.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ReportOnFacilityAugmentation.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        TestChecksBySS.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        TestChecksBySrISA.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        QuaterlyTestChecksByJAG.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        RotationOfStaff.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        MiscellaneousItems.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        CompletionReportsexpenditure.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        DrAndBr.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PositionOfImpRecoverableItems.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        DeptWiseRecoverableItems.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        PositionOfSpotChecking.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        StatusOfRevisionOfPension.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        AssistanceRequiredFromHO.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        IncentivePayment.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        TurnOverRatio.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        OnlineBillSubmissionStatus.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ITImplementationStatus.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        ScrapSale.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
        WorkshopManufacturingSuspense.destroy({
            where: { date: data.selectedMonthYear, division: data.division },
        }),
          
        ]);
    }
    // console.log("khj",data)
    // Ensure PlanHead table is up to date
    // await PlanHead.sync({ alter: true });

    //   if (Array.isArray(data.earning) && data.earning.length > 0) {
    //     console.log("went for the first");
  
    //     const earningsToInsert = data.earning.map((item) => ({
    //       division: item.division,
    //       date: item.date,
    //       actualLastFinancialYear: item.actualLastFinancialYear,
    //       targetThisMonth: item.targetThisMonth,
    //       actualThisMonthLastYear: item.actualThisMonthLastYear,
    //       actualThisMonth: item.actualThisMonth,
    //       targetYTDThisMonth: item.targetYTDThisMonth,
    //       actualYTDThisMonthLastYear: item.actualYTDThisMonthLastYear,
    //       actualYTDThisMonth: item.actualYTDThisMonth,
    //       subCategory: item.subCategory,
    //       figure: item.figure,
    //     }));
  
    //     createPromises.push(Earning.bulkCreate(earningsToInsert));
    //   }
    console.log("lkjhg",Array.isArray(data.workingExpenditure))
    if (Array.isArray(data.workingExpenditure) && data.workingExpenditure.length > 0) {
        console.log("went for the first");
  
        const WorkingExpenditureToInsert = data.workingExpenditure.map((item) => ({
           index: item.index,
           division: item.division,
           date: toStringValueRequired(item.date),
           figure: item.figure,
           DemandNo: item.DemandNo,
           Actual: item.Actual,
           RBG: item.RBG,
           BPfortheMonth: item.BPfortheMonth,
           ActualfortheMonthLastYear: item.ActualfortheMonthLastYear,
           ActualfortheMonthCurrentYear: item.ActualfortheMonthCurrentYear,
           BPtoendofMonth: item.BPtoendofMonth,
           ActualtoendofMonthLastYear: item.ActualtoendofMonthLastYear,
           ActualtotheEndofMonthCurrentYear: item.ActualtotheEndofMonthCurrentYear,
         }));
         console.log("Uploading WorkingExpenditureToInsert data:", WorkingExpenditureToInsert);
        createPromises.push(WorkingExpenditure.bulkCreate(WorkingExpenditureToInsert));
    }

    // Insert IncentivePayment data
    if (Array.isArray(data.incentivePayment) && data.incentivePayment.length > 0) {
        const incentivePaymentToInsert = data.incentivePayment.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            duringTheMonthLastYear: toStringValueWithNull(item.duringTheMonthLastYear),
            upToTheMonthLastYear: toStringValueWithNull(item.upToTheMonthLastYear),
            duringTheMonth: toStringValueWithNull(item.duringTheMonth),
            upToTheMonth: toStringValueWithNull(item.upToTheMonth),
            year: toStringValueWithNull(item.year),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(IncentivePayment.bulkCreate(incentivePaymentToInsert, { returning: false }));
        } catch (err) {
            console.error("IncentivePayment bulkCreate error:", err);
        }
    }

    // Insert TurnOverRatio data
    if (Array.isArray(data.turnOverRatio) && data.turnOverRatio.length > 0) {
        const turnOverRatioToInsert = data.turnOverRatio.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            year: toStringValueWithNull(item.year),
            OB: toStringValueWithNull(item.OB),
            totalCredits: toStringValueWithNull(item.totalCredits),
            closingBalance: toStringValueWithNull(item.closingBalance),
            TORAnnualTarget: toStringValueWithNull(item.TORAnnualTarget),
            TORupToMonth: toStringValueWithNull(item.TORupToMonth),
        }));
        try {
            createPromises.push(TurnOverRatio.bulkCreate(turnOverRatioToInsert, { returning: false }));
        } catch (err) {
            console.error("TurnOverRatio bulkCreate error:", err);
        }
    }

    // Insert OnlineBillSubmissionStatus data
    if (Array.isArray(data.onlineBillSubmissionStatus) && data.onlineBillSubmissionStatus.length > 0) {
        const onlineBillSubmissionStatusToInsert = data.onlineBillSubmissionStatus.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            billType: toStringValueWithNull(item.billType),
            online: toStringValueWithNull(item.online),
            offline: toStringValueWithNull(item.offline),
            total: toStringValueWithNull(item.total),
            percentage: toStringValueWithNull(item.percentage),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(OnlineBillSubmissionStatus.bulkCreate(onlineBillSubmissionStatusToInsert, { returning: false }));
        } catch (err) {
            console.error("OnlineBillSubmissionStatus bulkCreate error:", err);
        }
    }

    // Insert ITImplementationStatus data
    if (Array.isArray(data.itImplementationStatus) && data.itImplementationStatus.length > 0) {
        const itImplementationStatusToInsert = data.itImplementationStatus.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            wams: toStringValueWithNull(item.wams),
            yesorno: toStringValueWithNull(item.yesorno),
            targetDate: toStringValueWithNull(item.targetDate),
            actionPlanandRemarks: toStringValueWithNull(item.actionPlanandRemarks),
        }));
        try {
            createPromises.push(ITImplementationStatus.bulkCreate(itImplementationStatusToInsert, { returning: false }));
        } catch (err) {
            console.error("ITImplementationStatus bulkCreate error:", err);
        }
    }

    // Insert ScrapSale data
    if (Array.isArray(data.scrapSale) && data.scrapSale.length > 0) {
        const scrapSaleToInsert = data.scrapSale.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            target: toStringValueWithNull(item.target),
            actualDuringTheMonth: toStringValueWithNull(item.actualDuringTheMonth),
            actualUpToMonth: toStringValueWithNull(item.actualUpToMonth),
            actualLastYear: toStringValueWithNull(item.actualLastYear),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(ScrapSale.bulkCreate(scrapSaleToInsert, { returning: false }));
        } catch (err) {
            console.error("ScrapSale bulkCreate error:", err);
        }
    }

    // Insert WorkshopManufacturingSuspense data
    if (Array.isArray(data.workshopManufacturingSuspense) && data.workshopManufacturingSuspense.length > 0) {
        const workshopManufacturingSuspenseToInsert = data.workshopManufacturingSuspense.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            foriegnRailwayTransactions: toStringValueWithNull(item.foriegnRailwayTransactions),
            duringtheMonth: toStringValueWithNull(item.duringtheMonth),
            upToMonth: toStringValueWithNull(item.upToMonth),
        }));
        try {
            createPromises.push(WorkshopManufacturingSuspense.bulkCreate(workshopManufacturingSuspenseToInsert, { returning: false }));
        } catch (err) {
            console.error("WorkshopManufacturingSuspense bulkCreate error:", err);
        }
    }

    if (Array.isArray(data.planHead) && data.planHead.length > 0) {
        console.log("inserting planHead data");
        const planHeadToInsert = data.planHead.map((item) => ({
            index: item.index,
            division: item.division,
            date: toStringValueRequired(item.date),
            figure: item.figure,
            PlanHead: item.PlanHead,
            Actual: item.Actual !== undefined ? Number(item.Actual) : null,
            RBG: item.RBG !== undefined ? Number(item.RBG) : null,
            ActualfortheMonthLastYear: item.ActualfortheMonthLastYear !== undefined ? Number(item.ActualfortheMonthLastYear) : null,
            ActualfortheMonthCurrentYear: item.ActualfortheMonthCurrentYear !== undefined ? Number(item.ActualfortheMonthCurrentYear) : null,
        }));
        
        console.log("Uploading planHead data:", planHeadToInsert);
        try {
            await PlanHead.bulkCreate(planHeadToInsert);
        } catch (err) {
            console.error("PlanHead bulkCreate error:", err);
        }
    }

    // Insert Manufacturing Suspense data
    if (Array.isArray(data.manufacturingSuspense) && data.manufacturingSuspense.length > 0) {
        console.log("inserting manufacturingSuspense data");
        const manufacturingSuspenseToInsert = data.manufacturingSuspense.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            OpeningBalance: toStringValueWithNull(item.OpeningBalance),
            RBGDebit: toStringValueWithNull(item.RBGDebit),
            RBGCredit: toStringValueWithNull(item.RBGCredit),
            RBGNet: toStringValueWithNull(item.RBGNet),
            ExpendituretotheEndofMonthDebit: toStringValueWithNull(item.ExpendituretotheEndofMonthDebit),
            ExpendituretotheEndofMonthCredit: toStringValueWithNull(item.ExpendituretotheEndofMonthCredit),
            ExpendituretotheEndofMonthNet: toStringValueWithNull(item.ExpendituretotheEndofMonthNet),
            BalancetotheEndofMonthDebit: toStringValueWithNull(item.BalancetotheEndofMonthDebit),
            BalancetotheEndofMonthCredit: toStringValueWithNull(item.BalancetotheEndofMonthCredit),
            BalancetotheEndofMonthNet: toStringValueWithNull(item.BalancetotheEndofMonthNet),
        }));
        //console.log("Uploading manufacturingSuspense data:", manufacturingSuspenseToInsert);
        try {
            createPromises.push(ManufacturingSuspense.bulkCreate(manufacturingSuspenseToInsert, { returning: false }));
        } catch (err) {
            console.error("ManufacturingSuspense bulkCreate error:", err.errors, err.message);
        }
    }

    // Insert WMS Balance data
    if (Array.isArray(data.wmsBalance) && data.wmsBalance.length > 0) {
        console.log("inserting wmsBalance data");
        const wmsBalanceToInsert = data.wmsBalance.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            Particulars: toStringValueWithNull(item.Particulars),
            ActualLY: toStringValueWithNull(item.ActualLY),
            ActualLLY: toStringValueWithNull(item.ActualLLY),
            RGB: toStringValueWithNull(item.RGB),
            BPuptoMonth: toStringValueWithNull(item.BPuptoMonth),
            ActualfortheMonth: toStringValueWithNull(item.ActualfortheMonth),
            ActualtotheEndofMonth: toStringValueWithNull(item.ActualtotheEndofMonth),
        }));
        //console.log("Uploading wmsBalance data:", wmsBalanceToInsert);
        try {
            createPromises.push(WMSBalance.bulkCreate(wmsBalanceToInsert, { returning: false }));
        } catch (err) {
            console.error("WMSBalance bulkCreate error:", err);
        }
    }

    // Insert WMS Closing Balance data
    if (Array.isArray(data.wmsClosingBalance) && data.wmsClosingBalance.length > 0) {
        console.log("inserting wmsClosingBalance data");
        const wmsClosingBalanceToInsert = data.wmsClosingBalance.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            breakUp: toStringValueWithNull(item.breakUp),
            Amount: toStringValueWithNull(item.Amount),
        }));
        //console.log("Uploading wmsClosingBalance data:", wmsClosingBalanceToInsert);
        try {
            console.log("WMSClosingBalance data sample:", wmsClosingBalanceToInsert[0]);
            createPromises.push(WMSClosingBalance.bulkCreate(wmsClosingBalanceToInsert));
        } catch (err) {
            console.error("WMSClosingBalance bulkCreate error:", err);
            console.error("Error details:", err.message);
            console.error("First record that failed:", wmsClosingBalanceToInsert[0]);
        }
    }

    // Insert WMS Balance Analysis data
    if (Array.isArray(data.wmsBalanceAnalysis) && data.wmsBalanceAnalysis.length > 0) {
        console.log("inserting wmsBalanceAnalysis data");
        const wmsBalanceAnalysisToInsert = data.wmsBalanceAnalysis.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            previousYearNonth: toStringValueWithNull(item.previousYearNonth),
            previousYearOpeningBalance: toStringValueWithNull(item.previousYearOpeningBalance),
            previousYearDebit: toStringValueWithNull(item.previousYearDebit),
            previousYearCredit: toStringValueWithNull(item.previousYearCredit),
            previousYearClosingBalance: toStringValueWithNull(item.previousYearClosingBalance),
            currentYearNonth: toStringValueWithNull(item.currentYearNonth),
            currentYearOpeningBalance: toStringValueWithNull(item.currentYearOpeningBalance),
            currentYearDebit: toStringValueWithNull(item.currentYearDebit),
            currentYearCredit: toStringValueWithNull(item.currentYearCredit),
            currentYearClosingBalance: toStringValueWithNull(item.currentYearClosingBalance),
        }));
        //console.log("Uploading wmsBalanceAnalysis data:", wmsBalanceAnalysisToInsert);
        try {
            createPromises.push(WMSBalanceAnalysis.bulkCreate(wmsBalanceAnalysisToInsert, { returning: false }));
        } catch (err) {
            console.error("WMSBalanceAnalysis bulkCreate error:", err);
        }
    }

    // Insert WmsStoreCharges data
    if (Array.isArray(data.wmsStoreCharges) && data.wmsStoreCharges.length > 0) {
        const wmsStoreChargesToInsert = data.wmsStoreCharges.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            actualLLYMonth: toStringValueWithNull(item.actualLLYMonth),
            actualLLYAmount: toStringValueWithNull(item.actualLLYAmount),
            actualLYMonth: toStringValueWithNull(item.actualLYMonth),
            actualLYAmount: toStringValueWithNull(item.actualLYAmount),
            actualMonth: toStringValueWithNull(item.actualMonth),
            actualAmount: toStringValueWithNull(item.actualAmount),
        }));
        try {
            createPromises.push(WmsStoreCharges.bulkCreate(wmsStoreChargesToInsert));
        } catch (err) {
            console.error("WmsStoreCharges bulkCreate error:", err);
        }
    }
    // Insert PositionOfDirectPurchase data
    if (Array.isArray(data.positionofDirectPurchase) && data.positionofDirectPurchase.length > 0) {
        const positionOfDirectPurchaseToInsert = data.positionofDirectPurchase.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            actualLLYMonth: toStringValueWithNull(item.actualLLYMonth),
            actualLLYAmount: toStringValueWithNull(item.actualLLYAmount),
            actualLYMonth: toStringValueWithNull(item.actualLYMonth),
            actualLYAmount: toStringValueWithNull(item.actualLYAmount),
            actualMonth: toStringValueWithNull(item.actualMonth),
            actualAmount: toStringValueWithNull(item.actualAmount),
        }));
        try {
            createPromises.push(PositionOfDirectPurchase.bulkCreate(positionOfDirectPurchaseToInsert, { returning: false }));
        } catch (err) {
            console.error("PositionOfDirectPurchase bulkCreate error:", err);
        }
    }
    // Insert ComparativePositionOfOutturn data
    if (Array.isArray(data.comparativePositionofOutturn) && data.comparativePositionofOutturn.length > 0) {
        const comparativePositionOfOutturnToInsert = data.comparativePositionofOutturn.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: "No figure",
            nameOfActivity: toStringValueWithNull(item.nameOfActivity),
            targetAnnual: toStringValueWithNull(item.targetAnnual),
            targetUptotheMonth: toStringValueWithNull(item.targetUptotheMonth),
            outturnfortheMonth: toStringValueWithNull(item.outturnfortheMonth),
            outturnUptotheMonth: toStringValueWithNull(item.outturnUptotheMonth),
            outturnUptotheMonthofCorrospondingPeriod: toStringValueWithNull(item.outturnUptotheMonthofCorrospondingPeriod),
            difference: toStringValueWithNull(item.difference),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(ComparativePositionOfOutturn.bulkCreate(comparativePositionOfOutturnToInsert, { returning: false }));
        } catch (err) {
            console.error("ComparativePositionOfOutturn bulkCreate error:", err);
        }
    }
    // Insert PohUnitCost data
    if (Array.isArray(data.pohUnitCost) && data.pohUnitCost.length > 0) {
        const pohUnitCostToInsert = data.pohUnitCost.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            nameOfActivity: toStringValueWithNull(item.nameOfActivity),
            labour: toStringValueWithNull(item.labour),
            material: toStringValueWithNull(item.material),
            onCostLabour: toStringValueWithNull(item.onCostLabour),
            onCostStore: toStringValueWithNull(item.onCostStore),
            unitCostfortheMonth: toStringValueWithNull(item.unitCostfortheMonth),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(PohUnitCost.bulkCreate(pohUnitCostToInsert, { returning: false }));
        } catch (err) {
            console.error("PohUnitCost bulkCreate error:", err);
        }
    }
    // Insert PostingAndReconciliation data
    if (Array.isArray(data.postingandReconciliation) && data.postingandReconciliation.length > 0) {
        const postingAndReconciliationToInsert = data.postingandReconciliation.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            suspenseHeads: toStringValueWithNull(item.suspenseHeads),
            positionasperLHAR: toStringValueWithNull(item.positionasperLHAR),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretion: toStringValueWithNull(item.accretion),
            clearance: toStringValueWithNull(item.clearance),
            closingBalance: toStringValueWithNull(item.closingBalance),
            remarks: toStringValueWithNull(item.remarks),
        }));
        console.log("check for the data type posting and reconciliation")
        console.log(typeof postingAndReconciliationToInsert[0].accretion);
        try {
            createPromises.push(PostingAndReconciliation.bulkCreate(postingAndReconciliationToInsert, { returning: false }));
        } catch (err) {
            console.error("PostingAndReconciliation bulkCreate error:", err);
        }
    }
    // Insert ItemPositionInSuspenseRegister data
    if (Array.isArray(data.itemPositioninSuspenseRegister) && data.itemPositioninSuspenseRegister.length > 0) {
        const itemPositionInSuspenseRegisterToInsert = data.itemPositioninSuspenseRegister.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            SNo: toStringValueWithNull(item.SNo),
            suspenseHeads: toStringValueWithNull(item.suspenseHeads),
            positionasperLHARitem: toStringValueWithNull(item.positionasperLHARitem),
            positionasperLHARamount: toStringValueWithNull(item.positionasperLHARamount),
            openingBalanceitem: toStringValueWithNull(item.openingBalanceitem),
            openingBalanceamount: toStringValueWithNull(item.openingBalanceamount),
            accretionitem: toStringValueWithNull(item.accretionitem),
            accretionamount: toStringValueWithNull(item.accretionamount),
            clearanceitem: toStringValueWithNull(item.clearanceitem),
            clearanceamount: toStringValueWithNull(item.clearanceamount),
            closingBalanceitem: toStringValueWithNull(item.closingBalanceitem),
            closingBalanceamount: toStringValueWithNull(item.closingBalanceamount),
            oldestBalance: toStringValueWithNull(item.oldestBalance),
        }));
        try {
            createPromises.push(ItemPositionInSuspenseRegister.bulkCreate(itemPositionInSuspenseRegisterToInsert, { returning: false }));
        } catch (err) {
            console.error("ItemPositionInSuspenseRegister bulkCreate error:", err);
        }
    }

    // Insert UnsanctionedExpenditure data
    if (Array.isArray(data.unsanctionedExpenditure) && data.unsanctionedExpenditure.length > 0) {
        const unsanctionedExpenditureToInsert = data.unsanctionedExpenditure.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            SNo: toStringValueWithNull(item.SNo),
            suspenseHeads: toStringValueWithNull(item.suspenseHeads),
            positionasperLHARitem: toStringValueWithNull(item.positionasperLHARitem),
            positionasperLHARamount: toStringValueWithNull(item.positionasperLHARamount),
            openingBalanceitem: toStringValueWithNull(item.openingBalanceitem),
            openingBalanceamount: toStringValueWithNull(item.openingBalanceamount),
            accretionitem: toStringValueWithNull(item.accretionitem),
            accretionamount: toStringValueWithNull(item.accretionamount),
            clearanceitem: toStringValueWithNull(item.clearanceitem),
            clearanceamount: toStringValueWithNull(item.clearanceamount),
            closingBalanceitem: toStringValueWithNull(item.closingBalanceitem),
            closingBalanceamount: toStringValueWithNull(item.closingBalanceamount),
            oldestBalance: toStringValueWithNull(item.oldestBalance),
        }));
        try {
            createPromises.push(UnsanctionedExpenditure.bulkCreate(unsanctionedExpenditureToInsert, { returning: false }));
        } catch (err) {
            console.error("UnsanctionedExpenditure bulkCreate error:", err);
        }
    }

    // Insert InspectionPara data
    if (Array.isArray(data.inspectionPara) && data.inspectionPara.length > 0) {
        const inspectionParaToInsert = data.inspectionPara.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            typeOfPara: toStringValueWithNull(item.typeOfPara),
            totalNoOfParas: toStringValueWithNull(item.totalNoOfParas),
            noOfParasOutstandingatStart: toStringValueWithNull(item.noOfParasOutstandingatStart),
            noOfParasClosed: toStringValueWithNull(item.noOfParasClosed),
            noOfParasOutstandingatEnd: toStringValueWithNull(item.noOfParasOutstandingatEnd),
            accretionitem: toStringValueWithNull(item.yearofReport),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(InspectionPara.bulkCreate(inspectionParaToInsert, { returning: false }));
        } catch (err) {
            console.error("InspectionPara bulkCreate error:", err);
        }
    }

    // Insert OutstandingAuditObjection data
    if (Array.isArray(data.outstandingAuditObjection) && data.outstandingAuditObjection.length > 0) {
        const outstandingAuditObjectionToInsert = data.outstandingAuditObjection.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            SNo: toStringValueWithNull(item.SNo),
            typeOfAuditObjection: toStringValueWithNull(item.typeOfAuditObjection),
            positionasperLHY: toStringValueWithNull(item.positionasperLHY),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretion: toStringValueWithNull(item.accretion),
            clearenceOverOneYearOld: toStringValueWithNull(item.clearenceOverOneYearOld),
            clearenceLessthanOneYearOld: toStringValueWithNull(item.clearenceLessthanOneYearOld),
            totalClearence: toStringValueWithNull(item.totalClearence),
            closingBalance: toStringValueWithNull(item.closingBalance),
        }));
        try {
            createPromises.push(OutstandingAuditObjection.bulkCreate(outstandingAuditObjectionToInsert, { returning: false }));
        } catch (err) {
            console.error("OutstandingAuditObjection bulkCreate error:", err);
        }
    }

    // Insert AnalysisOfAuditReference data
    if (Array.isArray(data.analysisOfAuditReference) && data.analysisOfAuditReference.length > 0) {
        const analysisOfAuditReferenceToInsert = data.analysisOfAuditReference.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            SNo: toStringValueWithNull(item.SNo),
            typeOfAuditObjection: toStringValueWithNull(item.typeOfAuditObjection),
            closingBalance: toStringValueWithNull(item.closingBalance),
            overSixMonthOld: toStringValueWithNull(item.overSixMonthOld),
            overOneYearOld: toStringValueWithNull(item.overOneYearOld),
            overThreeYearOld: toStringValueWithNull(item.overThreeYearOld),
            lessThanSixMonthOld: toStringValueWithNull(item.lessThanSixMonthOld),
        }));
        try {
            createPromises.push(AnalysisOfAuditReference.bulkCreate(analysisOfAuditReferenceToInsert, { returning: false }));
        } catch (err) {
            console.error("AnalysisOfAuditReference bulkCreate error:", err);
        }
    }

    // Insert PositionOfAccountInspection data
    if (Array.isArray(data.positionOfAccountInspection) && data.positionOfAccountInspection.length > 0) {
        const positionOfAccountInspectionToInsert = data.positionOfAccountInspection.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            particular: toStringValueWithNull(item.particular),
            noOfInspectionsDue: toStringValueWithNull(item.noOfInspectionsDue),
            noOfOfficesInspected: toStringValueWithNull(item.noOfOfficesInspected),
            moneyValueInvolvedinInspections: toStringValueWithNull(item.moneyValueInvolvedinInspections),
            recoveries: toStringValueWithNull(item.recoveries),
            noOfInspectionsOutstanding: toStringValueWithNull(item.noOfInspectionsOutstanding),
            reasonsForArrears: toStringValueWithNull(item.reasonsForArrears),
        }));
        try {
            createPromises.push(PositionOfAccountInspection.bulkCreate(positionOfAccountInspectionToInsert, { returning: false }));
        } catch (err) {
            console.error("PositionOfAccountInspection bulkCreate error:", err);
        }
    }

    // Insert AccountInspectionOfOffices data
    if (Array.isArray(data.accountInspectionOfOffices) && data.accountInspectionOfOffices.length > 0) {
        const accountInspectionOfOfficesToInsert = data.accountInspectionOfOffices.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            figure: toStringValueWithNull(item.figure),
            SNo: toStringValueWithNull(item.SNo),
            doneBy: toStringValueWithNull(item.doneBy),
            targetfortheYear: toStringValueWithNull(item.targetfortheYear),
            duefortheMonth: toStringValueWithNull(item.duefortheMonth),
            dueUptotheMonth: toStringValueWithNull(item.dueUptotheMonth),
            donefortheMonth: toStringValueWithNull(item.donefortheMonth),
            doneUptotheMonth: toStringValueWithNull(item.doneUptotheMonth),
            arrearsfortheMonth: toStringValueWithNull(item.arrearsfortheMonth),
            arrearsUptotheMonth: toStringValueWithNull(item.arrearsUptotheMonth),
            officeInspected: toStringValueWithNull(item.officeInspected),
        }));
        try {
            createPromises.push(AccountInspectionOfOffices.bulkCreate(accountInspectionOfOfficesToInsert, { returning: false }));
        } catch (err) {
            console.error("AccountInspectionOfOffices bulkCreate error:", err);
        }
    }

    // Insert AccountInspectionReport data
    if (Array.isArray(data.accountInspectionReport) && data.accountInspectionReport.length > 0) {
        const accountInspectionReportToInsert = data.accountInspectionReport.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            SNo: toStringValueWithNull(item.SNo),
            typeOfReport: toStringValueWithNull(item.typeOfReport),
            positionLhr: toStringValueWithNull(item.positionLhr),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretion: toStringValueWithNull(item.accretion),
            clearanceOverOneYear: toStringValueWithNull(item.clearanceOverOneYear),
            clearanceLessThanOneYear: toStringValueWithNull(item.clearanceLessThanOneYear),
            totalClearance: toStringValueWithNull(item.totalClearance),
            closingBalance: toStringValueWithNull(item.closingBalance),
        }));
        try {
            createPromises.push(AccountInspectionReport.bulkCreate(accountInspectionReportToInsert, { returning: false }));
        } catch (err) {
            console.error("AccountInspectionReport bulkCreate error:", err);
        }
    }

    // Insert AgeWiseAnalysisAccountsInspection data
    if (Array.isArray(data.ageWiseAnalysisAccountsInspection) && data.ageWiseAnalysisAccountsInspection.length > 0) {
        const ageWiseAnalysisAccountsInspectionToInsert = data.ageWiseAnalysisAccountsInspection.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            SNo: toStringValueWithNull(item.SNo),
            typeOfReport: toStringValueWithNull(item.typeOfReport),
            closingBalance: toStringValueWithNull(item.closingBalance),
            over6MonthOld: toStringValueWithNull(item.over6MonthOld),
            overOneYearOld: toStringValueWithNull(item.overOneYearOld),
            overThreeYearsOld: toStringValueWithNull(item.overThreeYearsOld),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(AgeWiseAnalysisAccountsInspection.bulkCreate(ageWiseAnalysisAccountsInspectionToInsert, { returning: false }));
        } catch (err) {
            console.error("AgeWiseAnalysisAccountsInspection bulkCreate error:", err);
        }
    }

    // Insert SavingsThroughInternalCheck data
    if (Array.isArray(data.savingsThroughInternalCheck) && data.savingsThroughInternalCheck.length > 0) {
        const savingsThroughInternalCheckToInsert = data.savingsThroughInternalCheck.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            SNo: toStringValueWithNull(item.SNo),
            particulars: toStringValueWithNull(item.particulars),
            actualSavingUpToLastMonth: toStringValueWithNull(item.actualSavingUpToLastMonth),
            savingDuringMonth: toStringValueWithNull(item.savingDuringMonth),
            savingUpToTheMonth: toStringValueWithNull(item.savingUpToTheMonth),
        }));
        try {
            createPromises.push(SavingsThroughInternalCheck.bulkCreate(savingsThroughInternalCheckToInsert, { returning: false }));
        } catch (err) {
            console.error("SavingsThroughInternalCheck bulkCreate error:", err);
        }
    }

    // Insert HqRefPendingWithWorkshop data
    if (Array.isArray(data.hqRefPendingWithWorkshop) && data.hqRefPendingWithWorkshop.length > 0) {
        const hqRefPendingWithWorkshopToInsert = data.hqRefPendingWithWorkshop.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            SNo: toStringValueWithNull(item.SNo),
            letterNo: toStringValueWithNull(item.letterNo),
            letterDate: toStringValueWithNull(item.letterDate),
            subject: toStringValueWithNull(item.subject),
            addressedTo: toStringValueWithNull(item.addressedTo),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(HqRefPendingWithWorkshop.bulkCreate(hqRefPendingWithWorkshopToInsert, { returning: false }));
        } catch (err) {
            console.error("HqRefPendingWithWorkshop bulkCreate error:", err);
        }
    }

    // Insert PositionOfReplyToHQDOLetter data
    if (Array.isArray(data.positionOfReplyToHQDOLetter) && data.positionOfReplyToHQDOLetter.length > 0) {
        const positionOfReplyToHQDOLetterToInsert = data.positionOfReplyToHQDOLetter.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            SNo: toStringValueWithNull(item.SNo),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretion: toStringValueWithNull(item.accretion),
            clearance: toStringValueWithNull(item.clearance),
            closingBalance: toStringValueWithNull(item.closingBalance),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(PositionOfReplyToHQDOLetter.bulkCreate(positionOfReplyToHQDOLetterToInsert, { returning: false }));
        } catch (err) {
            console.error("PositionOfReplyToHQDOLetter bulkCreate error:", err);
        }
    }

    // Insert NcsrpAndPensionPosition data
    if (Array.isArray(data.ncsrpAndPensionPosition) && data.ncsrpAndPensionPosition.length > 0) {
        const ncsrpAndPensionPositionToInsert = data.ncsrpAndPensionPosition.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            SNo: toStringValueWithNull(item.SNo),
            natureOfWork: toStringValueWithNull(item.natureOfWork),
            positionAsPerLHYArrearReport: toStringValueWithNull(item.positionAsPerLHYArrearReport),
            extentOfArrearsLastMonth: toStringValueWithNull(item.extentOfArrearsLastMonth),
            accretion: toStringValueWithNull(item.accretion),
            clearance: toStringValueWithNull(item.clearance),
            closingBalance: toStringValueWithNull(item.closingBalance),
            increaseOrDecrease: toStringValueWithNull(item.increaseOrDecrease),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(NcsrpAndPensionPosition.bulkCreate(ncsrpAndPensionPositionToInsert, { returning: false }));
        } catch (err) {
            console.error("NcsrpAndPensionPosition bulkCreate error:", err);
        }
    }

    // Insert PosOfTransferOfServicecard data
    if (Array.isArray(data.posOfTransferOfServicecard) && data.posOfTransferOfServicecard.length > 0) {
        const posOfTransferOfServicecardToInsert = data.posOfTransferOfServicecard.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            Sno: toStringValueWithNull(item.Sno),
            description: toStringValueWithNull(item.description),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretion: toStringValueWithNull(item.accretion),
            clearance: toStringValueWithNull(item.clearance),
            closingBalance: toStringValueWithNull(item.closingBalance),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(PosOfTransferOfServicecard.bulkCreate(posOfTransferOfServicecardToInsert, { returning: false }));
        } catch (err) {
            console.error("PosOfTransferOfServicecard bulkCreate error:", err);
        }
    }

    // Insert PositionOfStockSheet data
    if (Array.isArray(data.positionOfStockSheet) && data.positionOfStockSheet.length > 0) {
        const positionOfStockSheetToInsert = data.positionOfStockSheet.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            item: toStringValueWithNull(item.item),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretionUpToMonth: toStringValueWithNull(item.accretionUpToMonth),
            clearanceUpToMonth: toStringValueWithNull(item.clearanceUpToMonth),
            closingBalance: toStringValueWithNull(item.closingBalance),
        }));
        try {
            createPromises.push(PositionOfStockSheet.bulkCreate(positionOfStockSheetToInsert, { returning: false }));
        } catch (err) {
            console.error("PositionOfStockSheet bulkCreate error:", err);
        }
    }

    // Insert AgeWisePositionOfStockSheet data
    if (Array.isArray(data.ageWisePositionOfStockSheet) && data.ageWisePositionOfStockSheet.length > 0) {
        const ageWisePositionOfStockSheetToInsert = data.ageWisePositionOfStockSheet.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            item: toStringValueWithNull(item.item),
            closingBalance: toStringValueWithNull(item.closingBalance),
            over3MonthsOld: toStringValueWithNull(item.over3MonthsOld),
            over6MonthsOld: toStringValueWithNull(item.over6MonthsOld),
            over1YearOld: toStringValueWithNull(item.over1YearOld),
            over3YearsOld: toStringValueWithNull(item.over3YearsOld),
        }));
        try {
            createPromises.push(AgeWisePositionOfStockSheet.bulkCreate(ageWisePositionOfStockSheetToInsert, { returning: false }));
        } catch (err) {
            console.error("AgeWisePositionOfStockSheet bulkCreate error:", err);
        }
    }

    // Insert DeptWisePositionStocksheet data
    if (Array.isArray(data.deptWisePositionStocksheet) && data.deptWisePositionStocksheet.length > 0) {
        const deptWisePositionStocksheetToInsert = data.deptWisePositionStocksheet.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            SNo: toStringValueWithNull(item.SNo),
            department: toStringValueWithNull(item.department),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretionUpToMonth: toStringValueWithNull(item.accretionUpToMonth),
            clearanceUpToMonth: toStringValueWithNull(item.clearanceUpToMonth),
            closingBalance: toStringValueWithNull(item.closingBalance),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(DeptWisePositionStocksheet.bulkCreate(deptWisePositionStocksheetToInsert, { returning: false }));
        } catch (err) {
            console.error("DeptWisePositionStocksheet bulkCreate error:", err);
        }
    }

    // Insert StaffReferencesOrCases data
    if (Array.isArray(data.staffReferencesOrCases) && data.staffReferencesOrCases.length > 0) {
        const staffReferencesOrCasesToInsert = data.staffReferencesOrCases.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            SNo: toStringValueWithNull(item.SNo),
            description: toStringValueWithNull(item.description),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretion: toStringValueWithNull(item.accretion),
            clearance: toStringValueWithNull(item.clearance),
            closingBalance: toStringValueWithNull(item.closingBalance),
        }));
        try {
            createPromises.push(StaffReferencesOrCases.bulkCreate(staffReferencesOrCasesToInsert, { returning: false }));
        } catch (err) {
            console.error("StaffReferencesOrCases bulkCreate error:", err);
        }
    }

    // Insert ClearanceAndAdjustmentOfMA data
    if (Array.isArray(data.clearanceAndAdjustmentOfMA) && data.clearanceAndAdjustmentOfMA.length > 0) {
        const clearanceAndAdjustmentOfMAToInsert = data.clearanceAndAdjustmentOfMA.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            openingBalance: toStringValueWithNull(item.openingBalance),
            accretion: toStringValueWithNull(item.accretion),
            clearance: toStringValueWithNull(item.clearance),
            closingBalance: toStringValueWithNull(item.closingBalance),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(ClearanceAndAdjustmentOfMA.bulkCreate(clearanceAndAdjustmentOfMAToInsert, { returning: false }));
        } catch (err) {
            console.error("ClearanceAndAdjustmentOfMA bulkCreate error:", err);
        }
    }

    if (Array.isArray(data.progressOfSalaryPayment) && data.progressOfSalaryPayment.length > 0) {
        const progressOfSalaryPaymentToInsert = data.progressOfSalaryPayment.map((item) => ({
            index: item.index,
            division: toStringValueRequired(item.division),
            date: toStringValueRequired(item.date),
            item: toStringValueWithNull(item.item),
            totalNoOfEmployees: toStringValueWithNull(item.totalNoOfEmployees),
            employeesThroughBank: toStringValueWithNull(item.employeesThroughBank),
            percentBankCurrentMonth: toStringValueWithNull(item.percentBankCurrentMonth),
            percentBankPrevMonth: toStringValueWithNull(item.percentBankPrevMonth),
            increaseOrDecrease: toStringValueWithNull(item.increaseOrDecrease),
            remarks: toStringValueWithNull(item.remarks),
        }));
        try {
            createPromises.push(ProgressOfSalaryPayment.bulkCreate(progressOfSalaryPaymentToInsert, { returning: false }));
            console.log("ProgressOfSalaryPayment bulkCreate success");
        } catch (err) {
            console.error("ProgressOfSalaryPayment bulkCreate error:", err);
        }
    }

     // Insert ProgressOfEPayment data
     if (Array.isArray(data.progressOfEPayment) && data.progressOfEPayment.length > 0) {
         const progressOfEPaymentToInsert = data.progressOfEPayment.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             totalNoOfStaff: toStringValueWithNull(item.totalNoOfStaff),
             paidThroughEMode: toStringValueWithNull(item.paidThroughEMode),
             percentAgeProgressStaff: toStringValueWithNull(item.percentAgeProgressStaff),
             totalBillsPaid: toStringValueWithNull(item.totalBillsPaid),
             paidThroughEModeBills: toStringValueWithNull(item.paidThroughEModeBills),
             percentAgeProgressBills: toStringValueWithNull(item.percentAgeProgressBills),
         }));
         try {
             createPromises.push(ProgressOfEPayment.bulkCreate(progressOfEPaymentToInsert, { returning: false }));
         } catch (err) {
             console.error("ProgressOfEPayment bulkCreate error:", err);
         }
     }
 
     // Insert ProgressOfSalaryThroughBank data
     if (Array.isArray(data.progressOfSalaryThroughBank) && data.progressOfSalaryThroughBank.length > 0) {
         const progressOfSalaryThroughBankToInsert = data.progressOfSalaryThroughBank.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             type: toStringValueWithNull(item.type),
             noOfStaffAB: toStringValueWithNull(item.noOfStaffAB),
             noOfStaffCD: toStringValueWithNull(item.noOfStaffCD),
             coverageAB: toStringValueWithNull(item.coverageAB),
             coverageCD: toStringValueWithNull(item.coverageCD),
             percentAB: toStringValueWithNull(item.percentAB),
             percentCD: toStringValueWithNull(item.percentCD),
         }));
         try {
             createPromises.push(ProgressOfSalaryThroughBank.bulkCreate(progressOfSalaryThroughBankToInsert, { returning: false }));
         } catch (err) {
             console.error("ProgressOfSalaryThroughBank bulkCreate error:", err);
         }
     }
 
     // Insert ProgressOfSalaryThroughECS data
     if (Array.isArray(data.progressOfSalaryThroughECS) && data.progressOfSalaryThroughECS.length > 0) {
         const progressOfSalaryThroughECSToInsert = data.progressOfSalaryThroughECS.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             type: toStringValueWithNull(item.type),
             numberOfCities: toStringValueWithNull(item.numberOfCities),
         }));
         try {
             createPromises.push(ProgressOfSalaryThroughECS.bulkCreate(progressOfSalaryThroughECSToInsert, { returning: false }));
         } catch (err) {
             console.error("ProgressOfSalaryThroughECS bulkCreate error:", err);
         }
     }
 
     // Insert PlannedImplementationECS data
     if (Array.isArray(data.plannedImplementationECS) && data.plannedImplementationECS.length > 0) {
         const plannedImplementationECSToInsert = data.plannedImplementationECS.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             description: toStringValueWithNull(item.description),
             numberOfCities: toStringValueWithNull(item.numberOfCities),
         }));
         try {
             createPromises.push(PlannedImplementationECS.bulkCreate(plannedImplementationECSToInsert, { returning: false }));
         } catch (err) {
             console.error("PlannedImplementationECS bulkCreate error:", err);
         }
     }
 
     // Insert ReportOnFacilityAugmentation data
     if (Array.isArray(data.reportOnFacilityAugmentation) && data.reportOnFacilityAugmentation.length > 0) {
         const reportOnFacilityAugmentationToInsert = data.reportOnFacilityAugmentation.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             description: toStringValueWithNull(item.description),
             existingAtStart: toStringValueWithNull(item.existingAtStart),
             additionsDuringMonth: toStringValueWithNull(item.additionsDuringMonth),
         }));
         console.log("check for the data type")
         console.log(typeof reportOnFacilityAugmentationToInsert[0].additionsDuringMonth);
         try {
             createPromises.push(ReportOnFacilityAugmentation.bulkCreate(reportOnFacilityAugmentationToInsert, { returning: false }));
         } catch (err) {
             console.error("ReportOnFacilityAugmentation bulkCreate error:", err);
         }
     }
 
     // Insert TestChecksBySS data
     if (Array.isArray(data.testChecksBySS) && data.testChecksBySS.length > 0) {
         const testChecksBySSToInsert = data.testChecksBySS.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             doneBy: toStringValueWithNull(item.doneBy),
             annualTarget: toStringValueWithNull(item.annualTarget),
             dueForTheMonth: toStringValueWithNull(item.dueForTheMonth),
             dueUpToTheMonth: toStringValueWithNull(item.dueUpToTheMonth),
             doneForTheMonth: toStringValueWithNull(item.doneForTheMonth),
             doneUpToTheMonth: toStringValueWithNull(item.doneUpToTheMonth),
             arrearsForTheMonth: toStringValueWithNull(item.arrearsForTheMonth),
             arrearsUpToTheMonth: toStringValueWithNull(item.arrearsUpToTheMonth),
             subject: toStringValueWithNull(item.subject),
         }));
         console.log("check for the data type")
         console.log(typeof testChecksBySSToInsert[0].annualTarget);
         try {
             createPromises.push(TestChecksBySS.bulkCreate(testChecksBySSToInsert, { returning: false }));
         } catch (err) {
             console.error("TestChecksBySS bulkCreate error:", err);
         }
     }
 
     // Insert TestChecksBySrISA data
     if (Array.isArray(data.testChecksBySrISA) && data.testChecksBySrISA.length > 0) {
         const testChecksBySrISAToInsert = data.testChecksBySrISA.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             doneBy: toStringValueWithNull(item.doneBy),
             annualTarget: toStringValueWithNull(item.annualTarget),
             dueForTheMonth: toStringValueWithNull(item.dueForTheMonth),
             dueUpToTheMonth: toStringValueWithNull(item.dueUpToTheMonth),
             doneForTheMonth: toStringValueWithNull(item.doneForTheMonth),
             doneUpToTheMonth: toStringValueWithNull(item.doneUpToTheMonth),
             arrearsForTheMonth: toStringValueWithNull(item.arrearsForTheMonth),
             arrearsUpToTheMonth: toStringValueWithNull(item.arrearsUpToTheMonth),
             subject: toStringValueWithNull(item.subject),
         }));
         try {
             createPromises.push(TestChecksBySrISA.bulkCreate(testChecksBySrISAToInsert, { returning: false }));
         } catch (err) {
             console.error("TestChecksBySrISA bulkCreate error:", err);
         }
     }
 
     // Insert QuaterlyTestChecksByJAG data
     if (Array.isArray(data.quaterlyTestChecksByJAG) && data.quaterlyTestChecksByJAG.length > 0) {
         const quaterlyTestChecksByJAGToInsert = data.quaterlyTestChecksByJAG.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             doneBy: toStringValueWithNull(item.doneBy),
             annualTarget: toStringValueWithNull(item.annualTarget),
             dueForTheMonth: toStringValueWithNull(item.dueForTheMonth),
             dueUpToTheMonth: toStringValueWithNull(item.dueUpToTheMonth),
             doneForTheMonth: toStringValueWithNull(item.doneForTheMonth),
             doneUpToTheMonth: toStringValueWithNull(item.doneUpToTheMonth),
             arrearsForTheMonth: toStringValueWithNull(item.arrearsForTheMonth),
             arrearsUpToTheMonth: toStringValueWithNull(item.arrearsUpToTheMonth),
             subject: toStringValueWithNull(item.subject),
         }));
         try {
             createPromises.push(QuaterlyTestChecksByJAG.bulkCreate(quaterlyTestChecksByJAGToInsert, { returning: false }));
         } catch (err) {
             console.error("QuaterlyTestChecksByJAG bulkCreate error:", err);
         }
     }
 
     // Insert RotationOfStaff data
     if (Array.isArray(data.rotationOfStaff) && data.rotationOfStaff.length > 0) {
         const rotationOfStaffToInsert = data.rotationOfStaff.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             SNo: toStringValueWithNull(item.SNo),
             item: toStringValueWithNull(item.item),
             statusAndRemarks: toStringValueWithNull(item.statusAndRemarks),
         }));
         try {
             createPromises.push(RotationOfStaff.bulkCreate(rotationOfStaffToInsert, { returning: false }));
         } catch (err) {
             console.error("RotationOfStaff bulkCreate error:", err);
         }
     }
 
     // Insert MiscellaneousItems data
     if (Array.isArray(data.miscellaneousItems) && data.miscellaneousItems.length > 0) {
         const miscellaneousItemsToInsert = data.miscellaneousItems.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             sNo: toStringValueWithNull(item.sNo),
             itemOfWork: toStringValueWithNull(item.itemOfWork),
             positionAsPerLHR: toStringValueWithNull(item.positionAsPerLHR),
             ob: toStringValueWithNull(item.ob),
             accretion: toStringValueWithNull(item.accretion),
             clearance: toStringValueWithNull(item.clearance),
             cb: toStringValueWithNull(item.cb),
             remarks: toStringValueWithNull(item.remarks),
         }));
         try {
             createPromises.push(MiscellaneousItems.bulkCreate(miscellaneousItemsToInsert, { returning: false }));
         } catch (err) {
             console.error("MiscellaneousItems bulkCreate error:", err);
         }
     }
 
     // Insert CompletionReportsexpenditure data
     if (Array.isArray(data.completionReports) && data.completionReports.length > 0) {
         const completionReportsToInsert = data.completionReports.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             positionAsPerLHR: toStringValueWithNull(item.positionAsPerLHR),
             openingBalanceOn1stApril: toStringValueWithNull(item.openingBalanceOn1stApril),
             accretionUpToMonth: toStringValueWithNull(item.accretionUpToMonth),
             clearanceUpToMonthDuringYear: toStringValueWithNull(item.clearanceUpToMonthDuringYear),
             closingBalanceAsOn: toStringValueWithNull(item.closingBalanceAsOn),
             remarks: toStringValueWithNull(item.remarks),
         }));
         try {
             createPromises.push(CompletionReportsexpenditure.bulkCreate(completionReportsToInsert, { returning: false }));
         } catch (err) {
             console.error("CompletionReportsexpenditure bulkCreate error:", err);
         }
     }
 
     // Insert DrAndBr data
     if (Array.isArray(data.drAndBr) && data.drAndBr.length > 0) {
         const drAndBrToInsert = data.drAndBr.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             figure: toStringValueWithNull(item.figure),
             srNo: toStringValueWithNull(item.srNo),
             category: toStringValueWithNull(item.category),
             openingBalanceNoOfItems: toStringValueWithNull(item.openingBalanceNoOfItems),
             openingBalanceAmount: toStringValueWithNull(item.openingBalanceAmount),
             accretionNoOfItems: toStringValueWithNull(item.accretionNoOfItems),
             accretionAmount: toStringValueWithNull(item.accretionAmount),
             clearanceNoOfItems: toStringValueWithNull(item.clearanceNoOfItems),
             clearanceAmount: toStringValueWithNull(item.clearanceAmount),
             closingBalanceNoOfItems: toStringValueWithNull(item.closingBalanceNoOfItems),
             closingBalanceAmount: toStringValueWithNull(item.closingBalanceAmount),
             billsOughtToHaveBeenPreferred: toStringValueWithNull(item.billsOughtToHaveBeenPreferred),
             billsActuallyIssued: toStringValueWithNull(item.billsActuallyIssued),
         }));
         try {
             createPromises.push(DrAndBr.bulkCreate(drAndBrToInsert, { returning: false }));
         } catch (err) {
             console.error("DrAndBr bulkCreate error:", err);
         }
     }
 
     // Insert PositionOfImpRecoverableItems data
     if (Array.isArray(data.positionOfImpRecoverableItems) && data.positionOfImpRecoverableItems.length > 0) {
         const positionOfImpRecoverableItemsToInsert = data.positionOfImpRecoverableItems.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             figure: toStringValueWithNull(item.figure),
             sn: toStringValueWithNull(item.sn),
             nameOfParty: toStringValueWithNull(item.nameOfParty),
             itemsCategory: toStringValueWithNull(item.itemsCategory),
             itemsDescription: toStringValueWithNull(item.itemsDescription),
             period: toStringValueWithNull(item.period),
             amount: toStringValueWithNull(item.amount),
             remarks: toStringValueWithNull(item.remarks),
         }));
         try {
             createPromises.push(PositionOfImpRecoverableItems.bulkCreate(positionOfImpRecoverableItemsToInsert, { returning: false }));
         } catch (err) {
             console.error("PositionOfImpRecoverableItems bulkCreate error:", err);
         }
     }
 
     // Insert DeptWiseRecoverableItems data
     if (Array.isArray(data.deptWiseRecoverableItems) && data.deptWiseRecoverableItems.length > 0) {
         const deptWiseRecoverableItemsToInsert = data.deptWiseRecoverableItems.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             figure: toStringValueWithNull(item.figure),
             srNo: toStringValueWithNull(item.srNo),
             department: toStringValueWithNull(item.department),
             openingBalanceItem: toStringValueWithNull(item.openingBalanceItem),
             openingBalanceAmount: toStringValueWithNull(item.openingBalanceAmount),
             accretionItem: toStringValueWithNull(item.accretionItem),
             accretionAmount: toStringValueWithNull(item.accretionAmount),
             clearanceItem: toStringValueWithNull(item.clearanceItem),
             clearanceAmount: toStringValueWithNull(item.clearanceAmount),
             closingBalanceItem: toStringValueWithNull(item.closingBalanceItem),
             closingBalanceAmount: toStringValueWithNull(item.closingBalanceAmount),
         }));
         try {
             createPromises.push(DeptWiseRecoverableItems.bulkCreate(deptWiseRecoverableItemsToInsert, { returning: false }));
         } catch (err) {
             console.error("DeptWiseRecoverableItems bulkCreate error:", err);
         }
     }
 
     // Insert PositionOfSpotChecking data
     if (Array.isArray(data.positionOfSpotChecking) && data.positionOfSpotChecking.length > 0) {
         const positionOfSpotCheckingToInsert = data.positionOfSpotChecking.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             figure: toStringValueWithNull(item.figure),
             spotCheckDuringMonth: toStringValueWithNull(item.spotCheckDuringMonth),
             spotCheckUpToMonth: toStringValueWithNull(item.spotCheckUpToMonth),
             recoveryDetectedDuringMonth: toStringValueWithNull(item.recoveryDetectedDuringMonth),
             recoveryDetectedUpToMonth: toStringValueWithNull(item.recoveryDetectedUpToMonth),
         }));
         try {
             createPromises.push(PositionOfSpotChecking.bulkCreate(positionOfSpotCheckingToInsert, { returning: false }));
         } catch (err) {
             console.error("PositionOfSpotChecking bulkCreate error:", err);
         }
     }
 
     // Insert StatusOfRevisionOfPension data
     if (Array.isArray(data.statusOfRevisionOfPension) && data.statusOfRevisionOfPension.length > 0) {
         const statusOfRevisionOfPensionToInsert = data.statusOfRevisionOfPension.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             figure: toStringValueWithNull(item.figure),
             category: toStringValueWithNull(item.category),
             totalNoOfCasesRequiringRevision: toStringValueWithNull(item.totalNoOfCasesRequiringRevision),
             noOfCasesReceivedInAccounts: toStringValueWithNull(item.noOfCasesReceivedInAccounts),
             noOfCasesRevisedUpToMonth: toStringValueWithNull(item.noOfCasesRevisedUpToMonth),
             noOfCasesReturnedUpToMonth: toStringValueWithNull(item.noOfCasesReturnedUpToMonth),
             balanceNoOfCasesUnderProcessInAccounts: toStringValueWithNull(item.balanceNoOfCasesUnderProcessInAccounts),
             remarks: toStringValueWithNull(item.remarks),
         }));
         try {
             createPromises.push(StatusOfRevisionOfPension.bulkCreate(statusOfRevisionOfPensionToInsert, { returning: false }));
         } catch (err) {
             console.error("StatusOfRevisionOfPension bulkCreate error:", err);
         }
     }
 
     // Insert AssistanceRequiredFromHO data
     if (Array.isArray(data.assistanceRequiredFromHO) && data.assistanceRequiredFromHO.length > 0) {
         const assistanceRequiredFromHOToInsert = data.assistanceRequiredFromHO.map((item) => ({
             index: item.index,
             division: toStringValueRequired(item.division),
             date: toStringValueRequired(item.date),
             figure: toStringValueWithNull(item.figure),
             sr: toStringValueWithNull(item.sr),
             suspenseHead: toStringValueWithNull(item.suspenseHead),
             item: toStringValueWithNull(item.item),
             amount: toStringValueWithNull(item.amount),
             year: toStringValueWithNull(item.year),
             totalForHead: toStringValueWithNull(item.totalForHead),
         }));
         try {
             createPromises.push(AssistanceRequiredFromHO.bulkCreate(assistanceRequiredFromHOToInsert, { returning: false }));
         } catch (err) {
             console.error("AssistanceRequiredFromHO bulkCreate error:", err);
         }
     }
     console.log("inserting result starts")
    try {
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
            message: "Failed to create entries. " + (error as any).message,
        };
    }
}

/**
 * Fetch workshop data from multiple tables
 * @param {string} division - The division to filter by
 * @param {string} date - The date to filter by
 * @returns {Promise<Object>} - Object containing data from all specified tables
 */
export const fetchWorkshopData = async (division: string, date: string) => {
    try {
        console.log(`Fetching workshop data for division: ${division}, date: ${date}`);

        // Fetch data from all specified tables
        const [
            manufacturingSuspenseData,
            itemPositionInSuspenseRegisterData,
            inspectionParaData,
            outstandingAuditObjectionData,
            analysisOfAuditReferenceData,
            positionOfStockSheetData,
            ageWisePositionOfStockSheetData
        ] = await Promise.all([
            ManufacturingSuspense.findAll({
                where: { division, date },
                attributes: { exclude: ['uuid'] },
                order: [['division', 'ASC'], ['date', 'ASC']]
            }),
            ItemPositionInSuspenseRegister.findAll({
                where: { division, date },
                attributes: { exclude: ['uuid'] },
                order: [['division', 'ASC'], ['date', 'ASC']]
            }),
            InspectionPara.findAll({
                where: { division, date },
                attributes: { exclude: ['uuid'] },
                order: [['division', 'ASC'], ['date', 'ASC']]
            }),
            OutstandingAuditObjection.findAll({
                where: { division, date },
                attributes: { exclude: ['uuid'] },
                order: [['division', 'ASC'], ['date', 'ASC']]
            }),
            AnalysisOfAuditReference.findAll({
                where: { division, date },
                attributes: { exclude: ['uuid'] },
                order: [['division', 'ASC'], ['date', 'ASC']]
            }),
            PositionOfStockSheet.findAll({
                where: { division, date },
                attributes: { exclude: ['uuid'] },
                order: [['division', 'ASC'], ['date', 'ASC']]
            }),
            AgeWisePositionOfStockSheet.findAll({
                where: { division, date },
                attributes: { exclude: ['uuid'] },
                order: [['division', 'ASC'], ['date', 'ASC']]
            })
        ]);

        // Convert Sequelize instances to plain objects
        const result = {
            manufacturingSuspense: manufacturingSuspenseData.map(item => item.toJSON()),
            itemPositionInSuspenseRegister: itemPositionInSuspenseRegisterData.map(item => item.toJSON()),
            inspectionPara: inspectionParaData.map(item => item.toJSON()),
            outstandingAuditObjection: outstandingAuditObjectionData.map(item => item.toJSON()),
            analysisOfAuditReference: analysisOfAuditReferenceData.map(item => item.toJSON()),
            positionOfStockSheet: positionOfStockSheetData.map(item => item.toJSON()),
            ageWisePositionOfStockSheet: ageWisePositionOfStockSheetData.map(item => item.toJSON())
        };

        console.log(`Successfully fetched workshop data. Records found:`);
        console.log(`- ManufacturingSuspense: ${manufacturingSuspenseData.length}`);
        console.log(`- ItemPositionInSuspenseRegister: ${itemPositionInSuspenseRegisterData.length}`);
        console.log(`- InspectionPara: ${inspectionParaData.length}`);
        console.log(`- OutstandingAuditObjection: ${outstandingAuditObjectionData.length}`);
        console.log(`- AnalysisOfAuditReference: ${analysisOfAuditReferenceData.length}`);
        console.log(`- PositionOfStockSheet: ${positionOfStockSheetData.length}`);
        console.log(`- AgeWisePositionOfStockSheet: ${ageWisePositionOfStockSheetData.length}`);

        return {
            success: true,
            data: result,
            message: 'Workshop data fetched successfully'
        };

    } catch (error) {
        console.error('Error fetching workshop data:', error);
        return {
            success: false,
            data: null,
            message: 'Failed to fetch workshop data',
            error: error.message
        };
    }
};

/**
 * Fetch all data from a specific workshop table
 * @param {string} tableName - The name of the table to fetch data from
 * @returns {Promise<Object>} - Object containing data from the specified table
 */
export const fetchAllDataFromTable = async (tableName: string) => {
    try {
        console.log(`Fetching all data from table: ${tableName}`);

        let data;
        let tableModel;

        // Map table names to their corresponding models
        switch (tableName.toLowerCase()) {
            case 'manufacturingsuspense':
                tableModel = ManufacturingSuspense;
                break;
            case 'itempositioninsuspenseregister':
                tableModel = ItemPositionInSuspenseRegister;
                break;
            case 'inspectionpara':
                tableModel = InspectionPara;
                break;
            case 'outstandingauditobjection':
                tableModel = OutstandingAuditObjection;
                break;
            case 'analysisofauditreference':
                tableModel = AnalysisOfAuditReference;
                break;
            case 'positionofstocksheet':
                tableModel = PositionOfStockSheet;
                break;
            case 'agewisepositionofstocksheet':
                tableModel = AgeWisePositionOfStockSheet;
                break;
            case 'unsanctionedexpenditure':
                tableModel = UnsanctionedExpenditure;
                break;
            case 'positionofaccountinspection':
                tableModel = PositionOfAccountInspection;
                break;
            case 'accountinspectionofoffices':
                tableModel = AccountInspectionOfOffices;
                break;
            case 'accountinspectionreport':
                tableModel = AccountInspectionReport;
                break;
            case 'agewiseanalysisaccountsinspection':
                tableModel = AgeWiseAnalysisAccountsInspection;
                break;
            case 'savingsthroughinternalcheck':
                tableModel = SavingsThroughInternalCheck;
                break;
            case 'hqrefpendingwithworkshop':
                tableModel = HqRefPendingWithWorkshop;
                break;
            case 'positionofreplytohqdoletter':
                tableModel = PositionOfReplyToHQDOLetter;
                break;
            case 'ncsrpandpensionposition':
                tableModel = NcsrpAndPensionPosition;
                break;
            case 'posoftransferofservicecard':
                tableModel = PosOfTransferOfServicecard;
                break;
            case 'deptwisepositionstocksheet':
                tableModel = DeptWisePositionStocksheet;
                break;
            case 'staffreferencesorcases':
                tableModel = StaffReferencesOrCases;
                break;
            case 'clearanceandadjustmentofma':
                tableModel = ClearanceAndAdjustmentOfMA;
                break;
            case 'progressofsalarypayment':
                tableModel = ProgressOfSalaryPayment;
                break;
            case 'progressofepayment':
                tableModel = ProgressOfEPayment;
                break;
            case 'progressofsalarythroughbank':
                tableModel = ProgressOfSalaryThroughBank;
                break;
            case 'progressofsalarythroughecs':
                tableModel = ProgressOfSalaryThroughECS;
                break;
            case 'plannedimplementationecs':
                tableModel = PlannedImplementationECS;
                break;
            case 'reportonfacilityaugmentation':
                tableModel = ReportOnFacilityAugmentation;
                break;
            case 'testchecksbyss':
                tableModel = TestChecksBySS;
                break;
            case 'testchecksbysrisa':
                tableModel = TestChecksBySrISA;
                break;
            case 'quaterlytestchecksbyjag':
                tableModel = QuaterlyTestChecksByJAG;
                break;
            case 'rotationofstaff':
                tableModel = RotationOfStaff;
                break;
            case 'miscellaneousitems':
                tableModel = MiscellaneousItems;
                break;
            case 'completionreports':
                tableModel = CompletionReportsexpenditure;
                break;
            case 'drandbr':
                tableModel = DrAndBr;
                break;
            case 'positionofimprecoverableitems':
                tableModel = PositionOfImpRecoverableItems;
                break;
            case 'deptwiserecoverableitems':
                tableModel = DeptWiseRecoverableItems;
                break;
            case 'positionofspotchecking':
                tableModel = PositionOfSpotChecking;
                break;
            case 'statusofrevisionofpension':
                tableModel = StatusOfRevisionOfPension;
                break;
            case 'assistancerequiredfromho':
                tableModel = AssistanceRequiredFromHO;
                break;
            case 'workingexpenditure':
                tableModel = WorkingExpenditure;
                break;
            case 'planhead':
                tableModel = PlanHead;
                break;
            case 'wmsbalance':
                tableModel = WMSBalance;
                break;
            case 'wmsclosingbalance':
                tableModel = WMSClosingBalance;
                break;
            case 'wmsbalanceanalysis':
                tableModel = WMSBalanceAnalysis;
                break;
            case 'wmsstorecharges':
                tableModel = WmsStoreCharges;
                break;
            case 'positionofdirectpurchase':
                tableModel = PositionOfDirectPurchase;
                break;
            case 'comparativepositionofoutturn':
                tableModel = ComparativePositionOfOutturn;
                break;
            case 'pohunitcost':
                tableModel = PohUnitCost;
                break;
            case 'postingandreconciliation':
                tableModel = PostingAndReconciliation;
                break;
            case 'incentivepayment':
                tableModel = IncentivePayment;
                break;
            case 'turnoverratio':
                tableModel = TurnOverRatio;
                break;
            case 'onlinebillsubmissionstatus':
                tableModel = OnlineBillSubmissionStatus;
                break;
            case 'itimplementationstatus':
                tableModel = ITImplementationStatus;
                break;
            case 'scrapsale':
                tableModel = ScrapSale;
                break;
            case 'workshopmanufacturingsuspense':
                tableModel = WorkshopManufacturingSuspense;
                break;
            default:
                return {
                    success: false,
                    data: null,
                    message: `Table '${tableName}' not found or not supported`,
                    error: 'Invalid table name'
                };
        }

        // Fetch all data from the specified table
        data = await tableModel.findAll({
            attributes: { exclude: ['uuid'] },
            order: [['division', 'ASC'], ['date', 'ASC']]
        });

        console.log(`Successfully fetched ${data.length} records from table: ${tableName}`);

        return {
            success: true,
            data: data.map(item => item.toJSON()),
            message: `Data fetched successfully from ${tableName}`,
            totalRecords: data.length
        };

    } catch (error) {
        console.error(`Error fetching data from table ${tableName}:`, error);
        return {
            success: false,
            data: null,
            message: `Failed to fetch data from ${tableName}`,
            error: (error as any).message
        };
    }
}
