interface PensionDetails {
  currentPension: number;
  previousPension: number;
  difference: number;
}
interface SummaryOtherData {
  amount: any;
  contributed: any;
}
interface SummaryData {
  pensionData: PensionDetails;
  newPensioner: SummaryOtherData;
  stoppedPensioner: SummaryOtherData;
  basicOverPayment: SummaryOtherData;
  basicUnderPayment: SummaryOtherData;
  commutationOverPayment: SummaryOtherData;
  commutationUnderPayment: SummaryOtherData;
  regularToFamilyTransitionData: SummaryOtherData;
  ageCsvData: any;
}
export type { PensionDetails, SummaryData };
