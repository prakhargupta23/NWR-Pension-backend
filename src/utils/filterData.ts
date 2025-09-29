const ArpanModel = require("../Model//Arpan.model");
import { Op } from "sequelize";

///// Funciton for filtering the newPensionerData --------------------------/
export function filterNewPensionerData(
  arpanData: any[],
  previousMonth: any,
  date: any,
  difference: any
) {
  try {
    const previousMonthData = arpanData.filter(
      (entry) => entry.month === previousMonth
    );
    const currentMonthData = arpanData.filter((entry) => entry.month === date);

    // Create a Set of all PPO numbers from the previous month
    const previousPpoSet = new Set(
      previousMonthData.flatMap(({ oldPPONo, newPPONo }) => [
        oldPPONo,
        newPPONo,
      ])
    );

    let totalPension = 0;
    let newPensioners = [];
    currentMonthData.forEach((user) => {
      const isNew =
        !previousPpoSet.has(user.oldPPONo) &&
        !previousPpoSet.has(user.newPPONo);

      if (isNew) {
        totalPension += user.totalPension;
        newPensioners.push(user);
      }
    });
    // Format the result with required column names
    const users = newPensioners.map((user, index) => ({
      "S. No.": index + 1,
      "New PPO No.": user.newPPONo || "",
      "Old PPO No.": user.oldPPONo || "",
      "Current Pensioner Name": user.currentPensionerName || "",
      "Original Pensioner Name": user.originalPensionerName || "",
      "Type of Pension (R, F)": user.typeOfPension || "",
      "Railway Dept.": user.railwayDept || "",
      "Basic Pension Amount": user.basicPensionAmount || 0,
      "Add. Pension (80+)": user.additionalPension80Plus || 0,
      "Total Pension": user.totalPension || 0,
    }));
    // Calculate contribution using provided difference
    const contributed =
      difference !== 0
        ? parseFloat((totalPension / (difference / 100)).toFixed(2))
        : 0;

    return { totalPension, newPensioners, users, contributed };
  } catch (error) {
    console.log(error.message);
  }
}

//// Function for filterting the regular to family pension data --------------/
export async function filterRegularToFamilyPensionData(
  previousMonth: any,
  currentMonth: any,
  difference
) {
  // Step 1: Fetch all previous month users (no pension type filter at DB level)
  const previousData = await ArpanModel.findAll({
    where: { month: previousMonth },
    attributes: ["newPPONo", "oldPPONo", "typeOfPension", "totalPension"],
    raw: true,
  });
  // Step 2: Fetch all current month users
  const currentData = await ArpanModel.findAll({
    where: { month: currentMonth },
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
    ],
    raw: true,
  });
  const previousPensioners = new Map<
    string,
    { typeOfPension: string; totalPension: number }
  >();

  previousData.forEach((entry) => {
    previousPensioners.set(entry.oldPPONo, {
      typeOfPension: entry.typeOfPension,
      totalPension: entry.totalPension,
    });
    previousPensioners.set(entry.newPPONo, {
      typeOfPension: entry.typeOfPension,
      totalPension: entry.totalPension,
    });
  });

  let totalDifference = 0;
  let transitionPensioners = [];

  currentData.forEach((entry) => {
    const previousData =
      previousPensioners.get(entry.oldPPONo) ||
      previousPensioners.get(entry.newPPONo);

    if (
      previousData &&
      (previousData.typeOfPension === "R" ||
        previousData.typeOfPension === "r") &&
      (entry.typeOfPension === "F" || entry.typeOfPension === "f")
    ) {
      const currentPension = Number(entry.totalPension || 0);
      const previousPension = Number(previousData.totalPension || 0);
      const difference = currentPension - previousPension;

      totalDifference += difference;

      transitionPensioners.push({
        "New PPO no.": entry.newPPONo || "",
        "Old PPO no.": entry.oldPPONo || "",
        "Current Pensioner Name": entry.currentPensionerName || "",
        "Original Pensioner Name": entry.originalPensionerName || "",
        "Type of pension (R, F)": entry.typeOfPension || "",
        "Railway Dept.": entry.railwayDept || "",
        "Basic Pension Amount": entry.basicPensionAmount || 0,
        "Add. Pension (80+)": entry.additionalPension80Plus || 0,
        "Total Pension": currentPension,
        [`Pension ${previousMonth}`]: previousPension,
        [`Pension ${currentMonth}`]: currentPension,
        Difference: difference,
      });
    }
  });
  let amount = parseFloat(totalDifference.toFixed(2));
  const contributed =
    difference !== 0 ? parseFloat((amount / (difference / 100)).toFixed(2)) : 0;

  return {
    amount: amount,
    users: transitionPensioners,
    contributed,
  };
}
///// Function for the getting the stopped pensioner data -----------------------/
export function filteredStoppedPensioner(
  arpanData: any[],
  previousMonth: any,
  date,
  difference: any
) {
  // Extract PPO numbers for current and previous month
  const previousMonthData = arpanData.filter(
    (data) => data.month === previousMonth
  );
  const currentMonthData = arpanData.filter((data) => data.month === date);

  const currentPpoSet = new Set([
    ...currentMonthData.map((data) => data.oldPPONo),
    ...currentMonthData.map((data) => data.newPPONo),
  ]);

  // Filter out old pensioners (present in previous month but not in current)
  const oldPensioners = previousMonthData.filter(
    (data) =>
      !currentPpoSet.has(data.oldPPONo) && !currentPpoSet.has(data.newPPONo)
  );

  // Calculate total pension for old pensioners
  const totalPension = -Math.abs(
    oldPensioners.reduce((sum, data) => sum + data.totalPension, 0)
  );

  // Format the result with required column names
  const stoppedPensioners = oldPensioners.map((user, index) => ({
    "S. No.": index + 1,
    "New PPO No.": user.newPPONo || "",
    "Old PPO No.": user.oldPPONo || "",
    "Current Pensioner Name": user.currentPensionerName || "",
    "Original Pensioner Name": user.originalPensionerName || "",
    "Type of Pension (R, F)": user.typeOfPension || "",
    "Railway Dept.": user.railwayDept || "",
    "Basic Pension Amount": user.basicPensionAmount || 0,
    "Add. Pension (80+)": user.additionalPension80Plus || 0,
    "Total Pension": user.totalPension || 0,
  }));
  // Calculate contribution using provided difference
  const contributed =
    difference !== 0
      ? parseFloat((totalPension / (difference / 100)).toFixed(2))
      : 0;
  return { totalPension, stoppedPensioners, contributed };
}

///// Function for fetching the overpaymaynet and underpayment data based-------------/
export async function filteredOverPaymentUnderPaymentData(
  currentMonth: string,
  previousMonth: string,
  type: "overpayment" | "underpayment",
  difference: any
) {
  const mismatchCondition =
    type === "overpayment" ? { [Op.gt]: 0 } : { [Op.lt]: 0 };

  // Step 1: Fetch mismatch records for both months (only basic)
  const [previousData, currentData] = await Promise.all([
    ArpanModel.findAll({
      where: {
        month: previousMonth,
        basicCategory: "mismatch",
        basicMismatch: mismatchCondition,
      },
      attributes: ["newPPONo", "oldPPONo", "basicMismatch"],
      raw: true,
    }),
    ArpanModel.findAll({
      where: {
        month: currentMonth,
        basicCategory: "mismatch",
        basicMismatch: mismatchCondition,
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

  let totalDifference = 0;

  // Step 3: Process current month data
  const filtered = currentData
    .map((user) => {
      const ppoKeys = [user.newPPONo, user.oldPPONo].filter(Boolean);
      const previousMismatch = ppoKeys
        .map((key) => previousMap.get(key))
        .find((val) => val !== undefined);

      if (previousMismatch === undefined) return null;

      const currentMismatch = Number(user.basicMismatch || 0);

      // Since both current and previous already filtered by over/under payment,
      // we only check if values are different
      if (currentMismatch === previousMismatch) return null;

      if (type === "overpayment") {
        console.log(
          "this is current mismatch",
          currentMismatch,
          "this is previous mismatch",
          previousMismatch
        );
      }

      const diff = currentMismatch - previousMismatch;

      totalDifference += diff;

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

  const contributed =
    difference !== 0
      ? parseFloat((totalDifference / (difference / 100)).toFixed(2))
      : 0;

  return {
    filtered,
    amount: parseFloat(totalDifference.toFixed(2)),
    contributed: parseFloat(contributed.toFixed(2)),
  };
}

export async function filteredOverPaymentUnderPaymentDataForCommutation(
  currentMonth: string,
  previousMonth: string,
  type: "overpayment" | "underpayment",
  difference: any
) {
  // Step 1: Fetch mismatch records for both months (only basic)
  const [previousData, currentData] = await Promise.all([
    ArpanModel.findAll({
      where: {
        month: previousMonth,
        commutationCategory: "mismatch",
      },
      attributes: ["newPPONo", "oldPPONo", "basicMismatch"],
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

  let totalDifference = 0;
  let count = 0;

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
        currentMismatch < 0 && previousMismatch < 0 && type === "underpayment";

      if (
        (!isOverBoth && !isUnderBoth) ||
        currentMismatch === previousMismatch
      ) {
        return null;
      }

      const diff = currentMismatch - previousMismatch;

      // Update totalDifference and count
      totalDifference += diff;
      count++;

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

  const contributed =
    difference !== 0
      ? parseFloat((totalDifference / (difference / 100)).toFixed(2))
      : 0;

  return {
    filtered,
    amount: parseFloat(totalDifference.toFixed(2)),
    contributed: parseFloat(contributed.toFixed(2)),
  };
}

export function filteredAgeSqlData(
  arpanData: any[],
  sbiMasterData: any[],
  difference: number
) {
  const categorizedData: Record<
    string,
    { totalPension: number; users: any[] }
  > = {};
  const monthWisePPO: Record<string, Set<string>> = {};
  const prevAges: Record<string, number> = {};

  const sbiMap = new Map(
    sbiMasterData
      .filter((item) => item.ppoNumber) // filters out null, undefined, and empty string
      .map((item) => [item.ppoNumber, item.dateOfBirth])
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

    // If no data in previous month, mark as new entry
    if (!monthsWithData.has(prevMonth)) {
      // Store the previous month's age
      prevAges[`${oldPPONo}_${month}`] = age; // Store current age
      prevAges[`${newPPONo}_${month}`] = age; // Store current age
      if (!monthWisePPO[month]) {
        monthWisePPO[month] = new Set();
      }
      monthWisePPO[month].add(oldPPONo);
      monthWisePPO[month].add(newPPONo);
      return;
    }

    // Initialize month entry
    if (!categorizedData[month]) {
      categorizedData[month] = { totalPension: 0, users: [] };
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
      categorizedData[month].totalPension += totalPension;
      categorizedData[month].users.push({ ...entry, age });
    }

    // Track processed PPOs
    monthWisePPO[month].add(oldPPONo);
    monthWisePPO[month].add(newPPONo);
  });

  const results = Object.entries(categorizedData).map(([month, data]) => {
    const users = data.users.map((user, index) => ({
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
      Age: user.age,
    }));

    const contributed =
      difference !== 0
        ? parseFloat((data.totalPension / (difference / 100)).toFixed(2))
        : 0;

    console.log(`📋 Total 80+ users in ${month}:`, users.length);

    return {
      month,
      amount: data.totalPension.toFixed(2),
      contributed,
      users,
    };
  });

  return results.length > 0
    ? results[0]
    : { amount: "", contributed: "", users: [] };
}
