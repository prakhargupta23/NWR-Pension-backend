export function transformBasicAndCommutationData(
  data: any[],
  categoryType: string
) {
  // console.log("dat1",data);
  console.log("categoryTypesdkfj");
  const categoryKey =
    categoryType === "basic" ? "basicCategory" : "commutationCategory";
  const mismatchKey =
    categoryType === "basic" ? "basicMismatch" : "commutationMismatch";

  const resultMap: { [month: string]: any } = {};
  // console.log("categorykey",categoryKey)
  // console.log("mismatchkey",mismatchKey)
  for (const entry of data) {
    const { month } = entry;
    const category = entry[categoryKey];

    // If mismatch is null or undefined, treat it as 0
    let mismatchValue = entry[mismatchKey];

    const isNullMismatch =
      mismatchValue === null || mismatchValue === undefined;
    if (isNullMismatch) {
      mismatchValue = 0;
    }
    // console.log("mismatchvalue", mismatchValue)

    if (!resultMap[month]) {
      resultMap[month] = {
        month,
        match: { count: 0, sum: 0 },
        unlinked: { count: 0, sum: 0 },
        overpaid: { count: 0, sum: 0 },
        underpaid: { count: 0, sum: 0 },
      };
    }

    // Handle "match"
    if (category === "match") {
      resultMap[month].match.count += 1;
      resultMap[month].match.sum += mismatchValue;
    }

    // Handle "unlinked"
    else if (category === "unlinked") {
      resultMap[month].unlinked.count += 1;
      resultMap[month].unlinked.sum += mismatchValue;
    }

    // Handle "mismatch" -> decide overpaid or underpaid
    else if (category === "mismatch") {
      if (mismatchValue > 0 || (isNullMismatch && category === "mismatch")) {
        resultMap[month].overpaid.count += 1;
        resultMap[month].overpaid.sum += mismatchValue;
      } else if (mismatchValue < 0) {
        resultMap[month].underpaid.count += 1;
        resultMap[month].underpaid.sum += Math.abs(mismatchValue);
      }
    }
    // console.log("resultmap", resultMap)
  }

  return Object.values(resultMap)
    .map((monthData) => {
      const formattedMonth = {
        ...monthData,
        match: { ...monthData.match, sum: Math.abs(monthData.match.sum) },
        unlinked: {
          ...monthData.unlinked,
          sum: Math.abs(monthData.unlinked.sum),
        },
        overpaid: {
          ...monthData.overpaid,
          sum: Math.abs(monthData.overpaid.sum),
        },
        underpaid: {
          ...monthData.underpaid,
          sum: Math.abs(monthData.underpaid.sum),
        },
      };

      // Optional: Remove categories where both count and sum are zero
      Object.keys(formattedMonth).forEach((key) => {
        if (
          formattedMonth[key]?.count === 0 &&
          formattedMonth[key]?.sum === 0
        ) {
          delete formattedMonth[key];
        }
      });

      return formattedMonth;
    })
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split("/").map(Number);
      const [monthB, yearB] = b.month.split("/").map(Number);
      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });
}

export function transformCommutationData(data: any[], categoryType: string) {
  try {
    const categoryKey =
      categoryType === "basic" ? "basicCategory" : "commutationCategory";
    const mismatchKey =
      categoryType === "basic" ? "basicMismatch" : "commutationMismatch";

    const resultMap: { [month: string]: any } = {};

    for (const entry of data) {
      const { month } = entry;
      const category = entry[categoryKey];

      // If mismatch is null or undefined, treat it as 0
      let mismatchValue = entry[mismatchKey];
      const isNullMismatch =
        mismatchValue === null || mismatchValue === undefined;
      if (isNullMismatch) {
        mismatchValue = 0;
      }

      if (!resultMap[month]) {
        resultMap[month] = {
          month,
          match: { count: 0, sum: 0 },
          unlinked: { count: 0, sum: 0 },
          overpaid: { count: 0, sum: 0 },
          underpaid: { count: 0, sum: 0 },
        };
      }

      // Handle "match"
      if (category === "match") {
        resultMap[month].match.count += 1;
        resultMap[month].match.sum += mismatchValue;
      }

      // Handle "unlinked"
      else if (category === "unlinked") {
        resultMap[month].unlinked.count += 1;
        resultMap[month].unlinked.sum += mismatchValue;
      }

      // Handle "mismatch" -> decide overpaid or underpaid
      else if (category === "mismatch") {
        if (mismatchValue > 0 || (isNullMismatch && category === "mismatch")) {
          resultMap[month].overpaid.count += 1;
          resultMap[month].overpaid.sum += mismatchValue;
        } else if (mismatchValue < 0) {
          resultMap[month].underpaid.count += 1;
          resultMap[month].underpaid.sum += Math.abs(mismatchValue);
        }
      }
    }

    // Convert resultMap to sorted array
    return Object.values(resultMap)
      .map((monthData) => {
        const formattedMonth = {
          ...monthData,
          match: { ...monthData.match, sum: Math.abs(monthData.match.sum) },
          unlinked: {
            ...monthData.unlinked,
            sum: Math.abs(monthData.unlinked.sum),
          },
          overpaid: {
            ...monthData.overpaid,
            sum: Math.abs(monthData.overpaid.sum),
          },
          underpaid: {
            ...monthData.underpaid,
            sum: Math.abs(monthData.underpaid.sum),
          },
        };

        // Optional: Remove categories where both count and sum are zero
        Object.keys(formattedMonth).forEach((key) => {
          if (
            formattedMonth[key]?.count === 0 &&
            formattedMonth[key]?.sum === 0
          ) {
            delete formattedMonth[key];
          }
        });

        return formattedMonth;
      })
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split("/").map(Number);
        const [monthB, yearB] = b.month.split("/").map(Number);
        return yearA !== yearB ? yearA - yearB : monthA - monthB;
      });
  } catch (error) {
    throw new Error(error);
  }
}

//// Function for formatting the age data -----------------------------------/
interface PensionCategory {
  count: number;
  amount: number;
}

interface CategorizedMonthData {
  "80+": PensionCategory;
  "85+": PensionCategory;
  "90+": PensionCategory;
  "95+": PensionCategory;
  "100+": PensionCategory;
}

interface EnrichedArpanData {
  oldPPONo: string;
  newPPONo: string;
  month: string;
  totalPension: number;
  dateOfBirth: string;
  typeOfPension: string;
}

export function formatAgeData(
  data: {
    ppoNumber: string;
    dateOfBirth: string; // 'YYYY-MM-DD'
    oldPPONo: string;
    newPPONo: string;
    month: string; // 'MM/YYYY'
    totalPension: number;
  }[]
): any {
  try {
    const categorizedData: Record<string, CategorizedMonthData> = {};

    data.forEach((entry) => {
      const { month, dateOfBirth, totalPension } = entry;

      // Extract month/year from pension month (MM/YYYY)
      const [entryMonth, entryYear] = month.split("/").map(Number); // e.g., '01/2025' => [1, 2025]

      // Extract year/month from dateOfBirth (YYYY-MM-DD)
      const [birthYear, birthMonth] = dateOfBirth.split("-").map(Number); // e.g., '1942-09-05' => [1942, 9]

      // Calculate age
      let age = entryYear - birthYear;

      // If pension month is before birth month, subtract a year
      if (entryMonth < birthMonth) {
        age -= 1;
      }

      // Initialize month category if it doesn't exist
      if (!categorizedData[month]) {
        categorizedData[month] = {
          "80+": { count: 0, amount: 0 },
          "85+": { count: 0, amount: 0 },
          "90+": { count: 0, amount: 0 },
          "95+": { count: 0, amount: 0 },
          "100+": { count: 0, amount: 0 },
        };
      }

      // Categorize based on age
      if (age >= 80) {
        categorizedData[month]["80+"].count += 1;
        categorizedData[month]["80+"].amount += totalPension;
      }
      if (age >= 85) {
        categorizedData[month]["85+"].count += 1;
        categorizedData[month]["85+"].amount += totalPension;
      }
      if (age >= 90) {
        categorizedData[month]["90+"].count += 1;
        categorizedData[month]["90+"].amount += totalPension;
      }
      if (age >= 95) {
        categorizedData[month]["95+"].count += 1;
        categorizedData[month]["95+"].amount += totalPension;
      }
      if (age >= 100) {
        categorizedData[month]["100+"].count += 1;
        categorizedData[month]["100+"].amount += totalPension;
      }
    });

    // Convert categorizedData into an array of results
    const results = Object.entries(categorizedData).map(([month, data]) => ({
      month,
      ...data,
    }));

    // Sort results by year and month ascending
    results.sort((a, b) => {
      const [aMonth, aYear] = a.month.split("/").map(Number);
      const [bMonth, bYear] = b.month.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    return results;
  } catch (error) {
    throw new Error(error);
  }
}

///// Function for getting the new pensioners  data ----------------------------------/
export function formatNewPensioners(
  arpanData: any[]
): { month: string; count: number; amount: number }[] {
  try {
    // Convert arpanData into a structured map by month
    const monthWiseData: Record<string, EnrichedArpanData[]> = {};

    arpanData.forEach((entry) => {
      if (!monthWiseData[entry.month]) {
        monthWiseData[entry.month] = [];
      }
      monthWiseData[entry.month].push(entry);
    });

    // Extract and sort months in chronological order (MM/YYYY format)
    const sortedMonths = Object.keys(monthWiseData).sort((a, b) => {
      const [aMonth, aYear] = a.split("/").map(Number);
      const [bMonth, bYear] = b.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    const result: { month: string; count: number; amount: number }[] = [];

    for (let i = 1; i < sortedMonths.length; i++) {
      const currentMonth = sortedMonths[i];
      const previousMonth = sortedMonths[i - 1];

      if (!monthWiseData[previousMonth]) continue; // Skip if no previous month data

      const currentEntries = monthWiseData[currentMonth];
      const previousEntries = monthWiseData[previousMonth];

      // Create a Set of PPO numbers from the previous month for quick lookup
      const previousPpoSet = new Set([
        ...previousEntries.map((entry) => entry.oldPPONo),
        ...previousEntries.map((entry) => entry.newPPONo),
      ]);

      let count = 0;
      let amount = 0;

      // Check which pensioners are new in the current month
      currentEntries.forEach((entry) => {
        if (
          !previousPpoSet.has(entry.oldPPONo) &&
          !previousPpoSet.has(entry.newPPONo)
        ) {
          count += 1;
          amount += entry.totalPension;
        }
      });

      // Only add months where there were new pensioners
      if (count > 0) {
        result.push({ month: currentMonth, count, amount });
      }
    }

    // Sort final result from old to new (MM/YYYY format)
    result.sort((a, b) => {
      const [aMonth, aYear] = a.month.split("/").map(Number);
      const [bMonth, bYear] = b.month.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

///// Function for getting the stopped pensioner data ---------------------------------------/
export function formatStoppedPensioners(
  arpanData: any[]
): { month: string; count: number; amount: number }[] {
  // Group pensioners by month
  try {
    const monthWiseData: Record<string, EnrichedArpanData[]> = {};

    arpanData.forEach((entry) => {
      if (!monthWiseData[entry.month]) {
        monthWiseData[entry.month] = [];
      }
      monthWiseData[entry.month].push(entry);
    });

    // Extract and sort months in chronological order (MM/YYYY format)
    const sortedMonths = Object.keys(monthWiseData).sort((a, b) => {
      const [aMonth, aYear] = a.split("/").map(Number);
      const [bMonth, bYear] = b.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    const result: { month: string; count: number; amount: number }[] = [];

    for (let i = 1; i < sortedMonths.length; i++) {
      const currentMonth = sortedMonths[i];
      const previousMonth = sortedMonths[i - 1];

      if (!monthWiseData[previousMonth]) continue; // Skip if no previous month data

      const currentEntries = monthWiseData[currentMonth];
      const previousEntries = monthWiseData[previousMonth];

      // Create a Set of PPO numbers from the current month for quick lookup
      const currentPpoSet = new Set([
        ...currentEntries.map((entry) => entry.oldPPONo),
        ...currentEntries.map((entry) => entry.newPPONo),
      ]);

      let count = 0;
      let amount = 0;

      // Check which pensioners have stopped in the current month
      previousEntries.forEach((entry) => {
        if (
          !currentPpoSet.has(entry.oldPPONo) &&
          !currentPpoSet.has(entry.newPPONo)
        ) {
          count += 1;
          amount += entry.totalPension;
        }
      });

      // Only add months where there were stopped pensioners
      if (count > 0) {
        result.push({ month: currentMonth, count, amount });
      }
    }

    // Sort final result from old to new (MM/YYYY format)
    result.sort((a, b) => {
      const [aMonth, aYear] = a.month.split("/").map(Number);
      const [bMonth, bYear] = b.month.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

//// Function for formatting the active pensioners -----------------------------/
export function formatActivePensioners(
  arpanData: EnrichedArpanData[]
): { month: string; count: number; amount: number }[] {
  try {
    // Group pensioners by month
    const monthWiseData: Record<string, EnrichedArpanData[]> = {};

    arpanData.forEach((entry) => {
      if (!monthWiseData[entry.month]) {
        monthWiseData[entry.month] = [];
      }
      monthWiseData[entry.month].push(entry);
    });

    // Extract and sort months in chronological order (MM/YYYY format)
    const sortedMonths = Object.keys(monthWiseData).sort((a, b) => {
      const [aMonth, aYear] = a.split("/").map(Number);
      const [bMonth, bYear] = b.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    const result: { month: string; count: number; amount: number }[] = [];

    for (let i = 1; i < sortedMonths.length; i++) {
      const currentMonth = sortedMonths[i];
      const previousMonth = sortedMonths[i - 1];

      if (!monthWiseData[previousMonth]) continue; // Skip if no previous month data

      const currentEntries = monthWiseData[currentMonth];
      // const previousEntries = monthWiseData[previousMonth];

      // Create a Set of PPO numbers from the previous month for quick lookup
      // const previousPpoSet = new Set([
      //   ...previousEntries.map((entry) => entry.oldPPONo),
      //   ...previousEntries.map((entry) => entry.newPPONo),
      // ]);

      let count = 0;
      let amount = 0;

      // Check which pensioners are active (present in both months)
      currentEntries.forEach((entry) => {
        // if (
        //   previousPpoSet.has(entry.oldPPONo) ||
        //   previousPpoSet.has(entry.newPPONo)
        // ) {
        count += 1;
        amount += entry.totalPension;
        // }
      });

      // Only add months where there were active pensioners
      if (count > 0) {
        result.push({ month: currentMonth, count, amount });
      }
    }

    // Sort final result from old to new (MM/YYYY format)
    result.sort((a, b) => {
      const [aMonth, aYear] = a.month.split("/").map(Number);
      const [bMonth, bYear] = b.month.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

//// Function for the family pension transition data ---------------------/
export function formatFamilyPensionTransitions(
  arpanData: any[]
): { month: string; count: number; amount: number }[] {
  try {
    // Group pensioners by month
    const monthWiseData: Record<string, EnrichedArpanData[]> = {};

    arpanData.forEach((entry) => {
      if (!monthWiseData[entry.month]) {
        monthWiseData[entry.month] = [];
      }
      monthWiseData[entry.month].push(entry);
    });

    // Extract and sort months in chronological order (MM/YYYY format)
    const sortedMonths = Object.keys(monthWiseData).sort((a, b) => {
      const [aMonth, aYear] = a.split("/").map(Number);
      const [bMonth, bYear] = b.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    const result: { month: string; count: number; amount: number }[] = [];

    for (let i = 1; i < sortedMonths.length; i++) {
      const currentMonth = sortedMonths[i];
      const previousMonth = sortedMonths[i - 1];

      if (!monthWiseData[previousMonth]) continue; // Skip if no previous month data

      const currentEntries = monthWiseData[currentMonth];
      const previousEntries = monthWiseData[previousMonth];

      // Create a map of previous month's PPO numbers and pension types
      const previousPensioners = new Map<
        string,
        { typeOfPension: string; totalPension: number }
      >();

      previousEntries.forEach((entry) => {
        previousPensioners.set(entry.oldPPONo, {
          typeOfPension: entry.typeOfPension,
          totalPension: entry.totalPension,
        });
        previousPensioners.set(entry.newPPONo, {
          typeOfPension: entry.typeOfPension,
          totalPension: entry.totalPension,
        });
      });
      console.log("this is previouspensioners");

      console.log(previousPensioners);

      let count = 0;
      let amount = 0;

      // Check for transitions from R/r to F/f
      currentEntries.forEach((entry) => {
        const previousData =
          previousPensioners.get(entry.oldPPONo) ||
          previousPensioners.get(entry.newPPONo);

        if (
          previousData &&
          (previousData.typeOfPension === "R" ||
            previousData.typeOfPension === "r") &&
          (entry.typeOfPension === "F" || entry.typeOfPension === "f")
        ) {
          count += 1;
          amount += entry.totalPension;
        }
      });

      // Only add months where there were family pension transitions
      if (count > 0) {
        result.push({ month: currentMonth, count, amount });
      }
    }

    // Sort final result from old to new (MM/YYYY format)
    result.sort((a, b) => {
      const [aMonth, aYear] = a.month.split("/").map(Number);
      const [bMonth, bYear] = b.month.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export function formatFamilyData(arpanData: any[]): {
  month: string;
  regular: { count: number; amount: number };
  family: { count: number; amount: number };
}[] {
  // Group pensioners by month
  const monthWiseData: Record<string, EnrichedArpanData[]> = {};

  arpanData.forEach((entry) => {
    if (!monthWiseData[entry.month]) {
      monthWiseData[entry.month] = [];
    }
    monthWiseData[entry.month].push(entry);
  });

  // Extract and sort months in chronological order (MM/YYYY format)
  const sortedMonths = Object.keys(monthWiseData).sort((a, b) => {
    const [aMonth, aYear] = a.split("/").map(Number);
    const [bMonth, bYear] = b.split("/").map(Number);
    return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
  });

  const result: {
    month: string;
    regular: { count: number; amount: number };
    family: { count: number; amount: number };
  }[] = [];

  sortedMonths.forEach((month) => {
    const entries = monthWiseData[month];

    let regularCount = 0,
      regularAmount = 0;
    let familyCount = 0,
      familyAmount = 0;

    // Count pensions in the current month only
    entries.forEach((entry) => {
      if (entry.typeOfPension === "R" || entry.typeOfPension === "r") {
        regularCount += 1;
        regularAmount += entry.totalPension;
      }

      if (entry.typeOfPension === "F" || entry.typeOfPension === "f") {
        familyCount += 1;
        familyAmount += entry.totalPension;
      }
    });

    // Add the data for the month
    result.push({
      month,
      regular: { count: regularCount, amount: regularAmount },
      family: { count: familyCount, amount: familyAmount },
    });
  });

  return result;
}

export function formatAgeBracketData(
  arpanData: EnrichedArpanData[], // Array containing pension data
  sbiData: { ppoNumber: string; dateOfBirth: string }[] // Array containing date of birth data
): any {
  try {
    const categorizedData: Record<string, CategorizedMonthData> = {}; // Stores categorized data per month
    const monthWisePPO: Record<string, Set<string>> = {}; // Stores unique PPO numbers for each month
    const prevAges: Record<string, number> = {}; // Stores previous month’s age for each user

    // Create a map of PPO numbers to dates of birth from SBI data
    const sbiMap = new Map(
      sbiData.map((item) => [item.ppoNumber, item.dateOfBirth])
    );

    // Enrich ARPAN data by adding date of birth where available
    const enrichedArpanData = arpanData
      .map((entry) => {
        const dob =
          sbiMap.get(entry.oldPPONo) || sbiMap.get(entry.newPPONo) || null; // Get DOB from SBI data
        return dob ? { ...entry, dateOfBirth: dob } : null; // Add DOB if found
      })
      .filter((entry): entry is EnrichedArpanData => entry !== null); // Remove null entries

    const monthsWithData = new Set(
      enrichedArpanData.map((entry) => entry.month)
    ); // Track months with available data

    enrichedArpanData.forEach((entry) => {
      const { month, dateOfBirth, totalPension, oldPPONo, newPPONo } = entry; // Extract required fields

      // Parse month and year from the entry's data
      const [entryMonth, entryYear] = month.split("/").map(Number);
      const [birthYear, birthMonth] = dateOfBirth.split("-").map(Number);

      let age = entryYear - birthYear; // Calculate initial age
      if (entryMonth < birthMonth) {
        age -= 1; // Adjust age if the birth month hasn’t occurred yet
      }

      // Determine the previous month in MM/YYYY format
      const prevMonth =
        entryMonth === 1
          ? `12/${entryYear - 1}` // Handle January case
          : `${String(entryMonth - 1).padStart(2, "0")}/${entryYear}`;

      // If previous month data isn't available, just store the PPO number and move on
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

      // Initialize data structure for the month if not present
      if (!categorizedData[month]) {
        categorizedData[month] = {
          "80+": { count: 0, amount: 0 },
          "85+": { count: 0, amount: 0 },
          "90+": { count: 0, amount: 0 },
          "95+": { count: 0, amount: 0 },
          "100+": { count: 0, amount: 0 },
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

      // Check if the user is new for this month
      const isNewUser =
        !monthWisePPO[prevMonth]?.has(oldPPONo) &&
        !monthWisePPO[prevMonth]?.has(newPPONo);

      // Check if the user has aged into a new bracket
      const hasAgedIntoNewBracket =
        (prevAge !== null && prevAge < 80 && age >= 80) ||
        (prevAge !== null && prevAge < 85 && age >= 85) ||
        (prevAge !== null && prevAge < 90 && age >= 90) ||
        (prevAge !== null && prevAge < 95 && age >= 95) ||
        (prevAge !== null && prevAge < 100 && age >= 100);

      // If the user is new or has aged into a new bracket, count them
      if (isNewUser || hasAgedIntoNewBracket) {
        if (age >= 100) {
          categorizedData[month]["100+"].count += 1;
          categorizedData[month]["100+"].amount += totalPension;
        } else if (age >= 95) {
          categorizedData[month]["95+"].count += 1;
          categorizedData[month]["95+"].amount += totalPension;
        } else if (age >= 90) {
          categorizedData[month]["90+"].count += 1;
          categorizedData[month]["90+"].amount += totalPension;
        } else if (age >= 85) {
          categorizedData[month]["85+"].count += 1;
          categorizedData[month]["85+"].amount += totalPension;
        } else if (age >= 80) {
          categorizedData[month]["80+"].count += 1;
          categorizedData[month]["80+"].amount += totalPension;
        }
      }

      // Store PPO numbers for this month
      monthWisePPO[month].add(oldPPONo);
      monthWisePPO[month].add(newPPONo);
    });

    // Convert categorized data into an array and sort by month
    let results = Object.entries(categorizedData).map(([month, data]) => ({
      month,
      ...data,
    }));

    results.sort((a, b) => {
      const [aMonth, aYear] = a.month.split("/").map(Number);
      const [bMonth, bYear] = b.month.split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });

    return results; // Return final sorted results
  } catch (error) {
    throw new Error(error);
  }
}
