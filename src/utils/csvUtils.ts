import { Op } from "sequelize";
import { PensionDetails, SummaryData } from "../interfaces/csvInterfaces";
import {
  filteredAgeSqlData,
  filteredOverPaymentUnderPaymentData,
  filteredOverPaymentUnderPaymentDataForCommutation,
  filteredStoppedPensioner,
  filterNewPensionerData,
  filterRegularToFamilyPensionData,
} from "./filterData";
const ArpanModel = require("../Model/Arpan.model");
const SbiMasterModel = require("../Model/SbiMaster.model");
export const csvUtils = {
  getPreviousMonth,

  generateOverPaymentAndUnderPaymentReport,

  generateEightyPlusTransitionReport,
  generateCommutationOverPaymentAndUnderPaymentReport,
};
export function getPreviousMonth(date: string): string {
  const [month, year] = date.split("/").map(Number);
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  return `${prevMonth.toString().padStart(2, "0")}/${prevYear}`;
}

export function calculateOtherFromSummaryData(summaryData: any) {
  if (!summaryData || typeof summaryData !== "object") {
    return {
      others: {
        amount: 0,
        contributed: 0,
      },
    };
  }

  const { pensionData, ...otherKeys } = summaryData ?? {};

  console.log("went before knowtotalamount");

  let knownTotalAmount = 0;

  for (const key of Object.keys(otherKeys)) {
    const item = summaryData[key];
    if (item && typeof item.amount === "number") {
      knownTotalAmount += item.amount;
    }
  }

  console.log(knownTotalAmount);

  const pensionDifference = pensionData?.difference ?? 0;

  const otherAmount = parseFloat(
    (pensionDifference - knownTotalAmount).toFixed(2)
  );

  const otherContributed =
    pensionDifference !== 0
      ? parseFloat((otherAmount / (pensionDifference / 100)).toFixed(2))
      : 0;

  return {
    ...summaryData,
    others: {
      amount: otherAmount,
      contributed: otherContributed,
    },
  };
}

function calculateCommutationPensionDiscrepancies(
  arpanData,
  date,
  previousMonth,
  key: "overpayment" | "underpayment",
  difference: any
): { amount: number; contributed: number } {
  const previousMonthData = arpanData.filter(
    (entry) => entry.month === previousMonth && entry.commutationMismatch !== 0
  );

  const currentMonthData = arpanData.filter(
    (entry) => entry.month === date && entry.commutationCategory === "mismatch"
  );

  const previousPpoMap = new Map<string, number>();
  previousMonthData.forEach(({ oldPPONo, newPPONo, commutationMismatch }) => {
    if (oldPPONo) previousPpoMap.set(oldPPONo, commutationMismatch);
    if (newPPONo) previousPpoMap.set(newPPONo, commutationMismatch);
  });

  let totalDifference = 0;
  let count = 0;

  currentMonthData.forEach(({ oldPPONo, newPPONo, commutationMismatch }) => {
    const previousMismatch =
      previousPpoMap.get(oldPPONo) ?? previousPpoMap.get(newPPONo);

    if (previousMismatch !== undefined) {
      const isCurrentlyOverpaid = commutationMismatch > 0;
      const wasPreviouslyOverpaid = previousMismatch > 0;

      const isCurrentlyUnderpaid = commutationMismatch < 0;
      const wasPreviouslyUnderpaid = previousMismatch < 0;

      const shouldInclude =
        (key === "overpayment" &&
          isCurrentlyOverpaid &&
          wasPreviouslyOverpaid) ||
        (key === "underpayment" &&
          isCurrentlyUnderpaid &&
          wasPreviouslyUnderpaid);

      if (shouldInclude && commutationMismatch !== previousMismatch) {
        const mismatchDiff = commutationMismatch - previousMismatch;
        totalDifference += mismatchDiff;
        count++;
      }
    }
  });

  const contributed =
    difference !== 0
      ? parseFloat((totalDifference / (difference / 100)).toFixed(2))
      : 0;

  return {
    amount: parseFloat(totalDifference.toFixed(2)),
    contributed: parseFloat(contributed.toFixed(2)),
  };
}

function getAgeCsvData(
  arpanData: any[],
  date: string,
  previousMonth: string,
  difference: number,
  sbiMasterData: { ppoNumber: string; dateOfBirth: string }[]
) {
  const categorizedData: Record<
    string,
    { totalPension: number; users: any[] }
  > = {};
  const monthWisePPO: Record<string, Set<string>> = {};
  const prevAges: Record<string, number> = {};

  const sbiMap = new Map(
    sbiMasterData.map((item) => [item.ppoNumber, item.dateOfBirth])
  );

  const enrichedArpanData = arpanData
    .map((entry) => {
      const dob =
        sbiMap.get(entry.oldPPONo) || sbiMap.get(entry.newPPONo) || null;
      return dob ? { ...entry, dateOfBirth: dob } : null;
    })
    .filter((entry): entry is any => entry !== null);

  const monthsWithData = new Set(enrichedArpanData.map((entry) => entry.month));

  enrichedArpanData.forEach((entry) => {
    const { month, dateOfBirth, totalPension, oldPPONo, newPPONo } = entry;

    const [entryMonth, entryYear] = month.split("/").map(Number);
    const [birthYear, birthMonth] = dateOfBirth.split("-").map(Number);

    let age = entryYear - birthYear;
    if (entryMonth < birthMonth) {
      age -= 1;
    }

    const prevMonth =
      entryMonth === 1
        ? `12/${entryYear - 1}`
        : `${String(entryMonth - 1).padStart(2, "0")}/${entryYear}`;

    prevAges[`${oldPPONo}_${month}`] = age;
    prevAges[`${newPPONo}_${month}`] = age;

    if (!monthsWithData.has(prevMonth)) {
      if (!monthWisePPO[month]) {
        monthWisePPO[month] = new Set();
      }
      monthWisePPO[month].add(oldPPONo);
      monthWisePPO[month].add(newPPONo);
      return;
    }

    if (!categorizedData[month]) {
      categorizedData[month] = {
        totalPension: 0,
        users: [],
      };
      monthWisePPO[month] = new Set();
    }

    const prevAgeKeyOldPpo = `${oldPPONo}_${prevMonth}`;
    const prevAgeKeyNewPpo = `${newPPONo}_${prevMonth}`;
    const prevAge =
      prevAges[prevAgeKeyOldPpo] ?? prevAges[prevAgeKeyNewPpo] ?? null;

    const isNewUser =
      !monthWisePPO[prevMonth]?.has(oldPPONo) &&
      !monthWisePPO[prevMonth]?.has(newPPONo);
    const hasAgedIntoNewBracket = prevAge !== null && prevAge < 80 && age >= 80;

    if (isNewUser || hasAgedIntoNewBracket) {
      if (age >= 80) {
        categorizedData[month].totalPension += totalPension;
        categorizedData[month].users.push({
          ...entry,
          age,
        });
      }
    }

    monthWisePPO[month].add(oldPPONo);
    monthWisePPO[month].add(newPPONo);
  });

  let results = Object.entries(categorizedData).map(([month, data]) => {
    const contributed =
      difference !== 0
        ? parseFloat((data.totalPension / (difference / 100)).toFixed(2))
        : 0;

    return {
      month,
      amount: data.totalPension ? data.totalPension.toFixed(2) : "",
      contributed,
    };
  });

  results.sort((a, b) => {
    const [aMonth, aYear] = a.month.split("/").map(Number);
    const [bMonth, bYear] = b.month.split("/").map(Number);
    return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
  });

  return results.length > 0 ? results[0] : { amount: "", contributed: "" };
}

// async function generateSummaryCsvData(
//   date: string,
//   previousMonth: string,
//   arpanData: any[],
//   sbiMasterData: any[]
// ): Promise<SummaryData> {
//   try {
//     const pensionSummary = getPensionDetails(arpanData, date, previousMonth);
//     const newPensionerData = calculateNewPensionerData(
//       arpanData,
//       date,
//       previousMonth,
//       pensionSummary.difference
//     );
//     const oldPensionersData = getStoppedPensionersCsvData(
//       arpanData,
//       date,
//       previousMonth,
//       pensionSummary.difference
//     );
//     const basicOverPaymentData = await filteredOverPaymentUnderPaymentData(
//       date,
//       previousMonth,
//       "overpayment",
//       pensionSummary.difference
//     );
//     const basicUnderpayment = await filteredOverPaymentUnderPaymentData(
//       date,
//       previousMonth,
//       "underpayment",
//       pensionSummary.difference
//     );
//     const commutationOverPaymentData =
//       await filteredOverPaymentUnderPaymentDataForCommutation(
//         date,
//         previousMonth,
//         "overpayment",
//         pensionSummary.difference
//       );
//     const commutationUnderpayment =
//       await filteredOverPaymentUnderPaymentDataForCommutation(
//         date,
//         previousMonth,
//         "underpayment",
//         pensionSummary.difference
//       );
//     const regularToFamilyTransitionData =
//       await getRegularToFamilyPensionerTransitionData(
//         arpanData,
//         date,
//         previousMonth,
//         pensionSummary.difference
//       );
//     const ageCsvData = filteredAgeSqlData(
//       arpanData,
//       sbiMasterData,
//       date,
//       pensionSummary.difference
//     );

//     return {
//       pensionData: pensionSummary,
//       newPensioner: newPensionerData,
//       stoppedPensioner: oldPensionersData,
//       basicUnderPayment: {
//         amount: basicUnderpayment.amount,
//         contributed: basicUnderpayment.contributed,
//       },
//       basicOverPayment: {
//         amount: basicOverPaymentData.amount,
//         contributed: basicOverPaymentData.contributed,
//       },
//       commutationOverPayment: {
//         amount: commutationOverPaymentData.amount,
//         contributed: commutationOverPaymentData.contributed,
//       },

//       commutationUnderPayment: {
//         amount: commutationUnderpayment.amount,
//         contributed: commutationUnderpayment.contributed,
//       },
//       regularToFamilyTransitionData: regularToFamilyTransitionData,
//       ageCsvData: {
//         amount: ageCsvData.amount,
//         contributed: ageCsvData.contributed,
//       },
//     };
//   } catch (error) {
//     console.error("Error generating summary CSV data:", error);
//     throw new Error("Failed to generate summary data");
//   }
// }

async function generateCommutationOverPaymentAndUnderPaymentReport(
  currentMonth: string,
  previousMonth: string,
  type: "overpayment" | "underpayment"
) {
  try {
    // Step 1: Fetch mismatch records for both months (only basic)
    const [previousData, currentData] = await Promise.all([
      ArpanModel.findAll({
        where: {
          month: previousMonth,
          commutationCategory: "mismatch",
        },
        attributes: ["newPPONo", "oldPPONo", "commutationMismatch"],
        raw: true,
      }),
      ArpanModel.findAll({
        where: {
          month: currentMonth,
          commutationCategory: "mismatch",
        },
        attributes: [
          "newPPONo",
          "oldPPONo",
          "currentPensionerName",
          "originalPensionerName",
          "typeOfPension",
          "railwayDept",
          "basicPensionAmount",
          "additionalPension80Plus",
          "totalPension",
          "commutationMismatch",
        ],
        raw: true,
      }),
    ]);

    // Step 2: Map previous month users by PPO
    const previousMap = new Map<string, number>();
    previousData.forEach((user) => {
      const mismatch = Number(user.commutationMismatch || 0);
      if (user.newPPONo) previousMap.set(user.newPPONo, mismatch);
      if (user.oldPPONo) previousMap.set(user.oldPPONo, mismatch);
    });

    // Step 3: Process current month data
    const filtered = currentData
      .map((user) => {
        const ppoKeys = [user.newPPONo, user.oldPPONo].filter(Boolean);
        const previousMismatch = ppoKeys
          .map((key) => previousMap.get(key))
          .find((val) => val !== undefined);

        if (previousMismatch === undefined) return null;

        const currentMismatch = Number(user.commutationMismatch || 0);

        const isOverBoth =
          currentMismatch > 0 && previousMismatch > 0 && type === "overpayment";
        const isUnderBoth =
          currentMismatch < 0 &&
          previousMismatch < 0 &&
          type === "underpayment";

        // ✅ Skip if mismatch type doesn't match or values haven't changed
        if (
          (!isOverBoth && !isUnderBoth) ||
          currentMismatch === previousMismatch
        ) {
          return null;
        }

        const diff = currentMismatch - previousMismatch;

        return {
          "S. no.": 0,
          "New PPO no.": user.newPPONo || "",
          "Old PPO no.": user.oldPPONo || "",
          "Current Pensioner Name": user.currentPensionerName || "",
          "Original Pensioner Name": user.originalPensionerName || "",
          "Type of pension (R, F)": user.typeOfPension || "",
          "Railway Dept.": user.railwayDept || "",
          "Basic Pension": user.basicPensionAmount || 0,
          "Add. Pension (80+)": user.additionalPension80Plus || 0,
          "Total Pension": user.totalPension || 0,
          [`${
            type === "overpayment" ? "Overpayment" : "Underpayment"
          } (Previous Month)`]: previousMismatch,
          [`${
            type === "overpayment" ? "Overpayment" : "Underpayment"
          } (Current Month)`]: currentMismatch,
          [`Basic ${
            type === "overpayment" ? "overpayment" : "underpayment"
          } Difference`]: diff,
        };
      })
      .filter((x): x is Exclude<typeof x, null> => !!x);
    // Step 4: Add serial numbers
    filtered.forEach((item, idx) => {
      item["S. no."] = idx + 1;
    });

    return filtered;
  } catch (err) {
    console.error("❌ Error generating basic mismatch report:", err);
    throw err;
  }
}

async function generateOverPaymentAndUnderPaymentReport(
  currentMonth: string,
  previousMonth: string,
  type: "overpayment" | "underpayment"
) {
  try {
    // Step 1: Fetch mismatch records for both months (only basic)
    const [previousData, currentData] = await Promise.all([
      ArpanModel.findAll({
        where: {
          month: previousMonth,
          basicCategory: "mismatch",
        },
        attributes: ["newPPONo", "oldPPONo", "basicMismatch"],
        raw: true,
      }),
      ArpanModel.findAll({
        where: {
          month: currentMonth,
          basicCategory: "mismatch",
        },
        attributes: [
          "newPPONo",
          "oldPPONo",
          "currentPensionerName",
          "originalPensionerName",
          "typeOfPension",
          "railwayDept",
          "basicPensionAmount",
          "additionalPension80Plus",
          "totalPension",
          "basicMismatch",
        ],
        raw: true,
      }),
    ]);

    // Step 2: Map previous month users by PPO
    const previousMap = new Map<string, number>();
    previousData.forEach((user) => {
      const mismatch = Number(user.basicMismatch || 0);
      if (user.newPPONo) previousMap.set(user.newPPONo, mismatch);
      if (user.oldPPONo) previousMap.set(user.oldPPONo, mismatch);
    });

    // Step 3: Process current month data
    const filtered = currentData
      .map((user) => {
        const ppoKeys = [user.newPPONo, user.oldPPONo].filter(Boolean);
        const previousMismatch = ppoKeys
          .map((key) => previousMap.get(key))
          .find((val) => val !== undefined);

        if (previousMismatch === undefined) return null;

        const currentMismatch = Number(user.basicMismatch || 0);

        const isOverBoth =
          currentMismatch > 0 && previousMismatch > 0 && type === "overpayment";
        const isUnderBoth =
          currentMismatch < 0 &&
          previousMismatch < 0 &&
          type === "underpayment";

        // ✅ Skip if mismatch type doesn't match or values haven't changed
        if (
          (!isOverBoth && !isUnderBoth) ||
          currentMismatch === previousMismatch
        ) {
          return null;
        }

        const diff = currentMismatch - previousMismatch;

        return {
          "S. no.": 0,
          "New PPO no.": user.newPPONo || "",
          "Old PPO no.": user.oldPPONo || "",
          "Current Pensioner Name": user.currentPensionerName || "",
          "Original Pensioner Name": user.originalPensionerName || "",
          "Type of pension (R, F)": user.typeOfPension || "",
          "Railway Dept.": user.railwayDept || "",
          "Basic Pension": user.basicPensionAmount || 0,
          "Add. Pension (80+)": user.additionalPension80Plus || 0,
          "Total Pension": user.totalPension || 0,
          [`${
            type === "overpayment" ? "Overpayment" : "Underpayment"
          } (Previous Month)`]: previousMismatch,
          [`${
            type === "overpayment" ? "Overpayment" : "Underpayment"
          } (Current Month)`]: currentMismatch,
          [`Basic ${
            type === "overpayment" ? "overpayment" : "underpayment"
          } Difference`]: diff,
        };
      })
      .filter((x): x is Exclude<typeof x, null> => !!x);
    // Step 4: Add serial numbers
    filtered.forEach((item, idx) => {
      item["S. no."] = idx + 1;
    });

    return filtered;
  } catch (err) {
    console.error("❌ Error generating basic mismatch report:", err);
    throw err;
  }
}

// async function generateRegularToFamilyConversionReport(
//   currentMonth: string,
//   previousMonth: string
// ) {
//   try {
//     const { users } = await filterRegularToFamilyPensionData(
//       previousMonth,
//       currentMonth
//     );
//     return users;
//   } catch (err) {
//     console.error("❌ Error generating conversion report:", err);
//     throw err;
//   }
// }

function generateEightyPlusTransitionReport(
  arpanData: any[],
  date: string,
  previousMonth: string,
  sbiMasterData: { ppoNumber: string; dateOfBirth: string }[]
) {
  console.log("this is arpandata");

  console.log(arpanData);

  const categorizedData: Record<
    string,
    { totalPension: number; users: any[] }
  > = {};
  const monthWisePPO: Record<string, Set<string>> = {};
  const prevAges: Record<string, number> = {};

  const sbiMap = new Map(
    sbiMasterData.map((item) => [item.ppoNumber, item.dateOfBirth])
  );

  console.log("✅ Total SBI master entries:", sbiMasterData.length);

  const enrichedArpanData = arpanData
    .map((entry) => {
      const dob =
        sbiMap.get(entry.oldPPONo) || sbiMap.get(entry.newPPONo) || null;
      if (!dob) {
        console.warn(
          "⚠️ No DOB found for entry:",
          entry.oldPPONo,
          entry.newPPONo
        );
      }
      return dob ? { ...entry, dateOfBirth: dob } : null;
    })
    .filter((entry): entry is any => entry !== null);

  console.log(
    "✅ Enriched ARPAN data entries with DOB:",
    enrichedArpanData.length
  );
  console.log(enrichedArpanData);

  const monthsWithData = new Set(enrichedArpanData.map((entry) => entry.month));
  console.log("this is monthswithdata");

  console.log(monthsWithData);

  enrichedArpanData.forEach((entry) => {
    const { month, dateOfBirth, totalPension, oldPPONo, newPPONo } = entry;

    const [entryMonth, entryYear] = month.split("/").map(Number);
    const [birthYear, birthMonth] = dateOfBirth.split("-").map(Number);

    let age = entryYear - birthYear;
    if (entryMonth < birthMonth) {
      age -= 1;
    }

    const prevMonth =
      entryMonth === 1
        ? `12/${entryYear - 1}`
        : `${String(entryMonth - 1).padStart(2, "0")}/${entryYear}`;

    if (!monthsWithData.has(prevMonth)) {
      prevAges[`${oldPPONo}_${month}`] = age;
      prevAges[`${newPPONo}_${month}`] = age;

      if (!monthWisePPO[month]) {
        monthWisePPO[month] = new Set();
      }
      monthWisePPO[month].add(oldPPONo);
      monthWisePPO[month].add(newPPONo);
      return;
    }

    if (!categorizedData[month]) {
      categorizedData[month] = {
        totalPension: 0,
        users: [],
      };
      monthWisePPO[month] = new Set();
    }
    // Retrieve the previous month's age
    const prevAgeKeyOldPpo = `${oldPPONo}_${prevMonth}`;
    const prevAgeKeyNewPpo = `${newPPONo}_${prevMonth}`;
    const prevAge =
      prevAges[prevAgeKeyOldPpo] ?? prevAges[prevAgeKeyNewPpo] ?? null;
    // Store the previous month's age
    prevAges[`${oldPPONo}_${month}`] = age; // Store current age
    prevAges[`${newPPONo}_${month}`] = age; // Store current age

    const isNewUser =
      !monthWisePPO[prevMonth]?.has(oldPPONo) &&
      !monthWisePPO[prevMonth]?.has(newPPONo);

    const hasAgedIntoNewBracket = prevAge !== null && prevAge < 80 && age >= 80;

    if (isNewUser || hasAgedIntoNewBracket) {
      if (age >= 80) {
        // console.log(
        //   `🎯 Including user turning 80+ in ${month}:`,
        //   entry.currentPensionerName,
        //   "| Age:",
        //   age,
        //   "| Old PPO:",
        //   oldPPONo,
        //   "| New PPO:",
        //   newPPONo,
        //   "| Total Pension:",
        //   totalPension
        // );

        categorizedData[month].users.push({
          ...entry,
          age,
        });
      }
    }

    monthWisePPO[month].add(oldPPONo);
    monthWisePPO[month].add(newPPONo);
  });

  const results = Object.entries(categorizedData).map(([month, data]) => {
    const formattedUsers = data.users.map((user, index) => ({
      "S. no.": index + 1,
      "New PPO no.": user.newPPONo || "",
      "Old PPO no.": user.oldPPONo || "",
      "Current Pensioner Name": user.currentPensionerName || "",
      "Original Pensioner Name": user.originalPensionerName || "",
      "Type of pension (R, F)": user.typeOfPension || "",
      "Railway Dept.": user.railwayDept || "",
      "Basic Pension Amount": user.basicPensionAmount || 0,
      "Add. Pension (80+)": user.additionalPension80Plus || 0,
      "Total Pension": user.totalPension || 0,
      [`Pension ${date}`]: user.totalPension || 0,
    }));

    console.log(`📋 Total 80+ users in ${month}:`, formattedUsers.length);

    return formattedUsers;
  });

  return results.length > 0 ? results[0] : [];
}

export async function fetchSqlData(
  date: string,
  previousMonth: string
): Promise<[any[], any[]]> {
  return Promise.all([
    ArpanModel.findAll({
      attributes: [
        "oldPPONo",
        "newPPONo",
        "totalPension",
        "month",
        "typeOfPension",
        "basicCategory",
        "basicMismatch",

        "currentPensionerName",
        "originalPensionerName",

        "railwayDept",
        "basicPensionAmount",
        "additionalPension80Plus",

        "typeOfPension",
        "railwayDept",
        "basicPensionAmount",
      ],
      where: { month: { [Op.in]: [date, previousMonth] } },
      raw: true,
    }),
    SbiMasterModel.findAll({
      attributes: ["ppoNumber", "dateOfBirth"],
      raw: true,
    }),
  ]);
}
