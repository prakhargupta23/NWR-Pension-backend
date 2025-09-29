const ArpanModel = require("../Model/Arpan.model");
const SbiMaster = require("../Model/SbiMaster.model");
const sequelize = require("../config/sequlize");
///// Function for getting all the unique months -------------------------------------------/
export async function getUniqueMonths() {
  console.log("this function is called");

  try {
    const [results] = await sequelize.query(
      `SELECT DISTINCT month FROM arpan WHERE month IS NOT NULL`
    );

    return results.map((item) => item.month); // Ensure no null values
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSqlDataBasedOnMonths(months: any, category: string) {
  try {
    if (!months || months.length === 0) {
      throw new Error("Months array is empty or undefined");
    }

    console.log("Fetching data for months:", months, "and category:", category);

    // Define the attributes based on category
    let attributes: string[] = ["month"];

    if (category === "basic") {
      attributes.push("basicCategory", "basicMismatch");
    } else if (category === "commutation") {
      attributes.push("commutationCategory", "commutationMismatch");
    } else {
      throw new Error("Invalid category provided");
    }
    console.log("Selected reacges");
    const results = await ArpanModel.findAll({
      where: {
        month: months, // Sequelize automatically handles IN condition
      },
      attributes, // Fetch only selected attributes
      raw: true, // Returns plain JSON objects instead of Sequelize instances
    });
    // console.log("Results fetched:",results);
    return results;
  } catch (error) {
    console.error("Error fetching data based on months:", error);
    throw new Error("Error fetching data from the database");
  }
}

export async function getAgeSqlData(months: any) {
  try {
    console.log("this is the get agesqldata called");

    // Fetch Arpan data (oldPPONo, newPPONo, month, totalPension)
    const arpanPromise = ArpanModel.findAll({
      where: {
        month: months, // Sequelize automatically handles IN condition
      },
      attributes: ["oldPPONo", "newPPONo", "month", "totalPension"],
      raw: true,
    });

    // Fetch SBI Master data (ppoNumber, dateOfBirth)
    const sbiPromise = SbiMaster.findAll({
      attributes: ["ppoNumber", "dateOfBirth"],
      raw: true,
    });

    // Run both queries in parallel
    const [arpanData, sbiData] = await Promise.all([arpanPromise, sbiPromise]);

    // Sort arpanData by month (ascending)
    // The month format is "MM/YYYY", so we split and create a Date for proper sorting.
    arpanData.sort((a, b) => {
      const [monthA, yearA] = a.month.split("/");
      const [monthB, yearB] = b.month.split("/");
      const dateA = new Date(Number(yearA), Number(monthA) - 1);
      const dateB = new Date(Number(yearB), Number(monthB) - 1);
      return dateA.getTime() - dateB.getTime();
    });

    return { arpanData, sbiData };
  } catch (error) {
    console.error("Error fetching age-related SQL data:", error);
    throw new Error("Error fetching data from the database");
  }
}

//// Function for getting sql data for the new pensioner graph ------------------------------------/
export async function getNewPensionerData(months: any) {
  try {
    // Fetch Arpan data (olPPONo, newPPONo, month)
    const arpanPromise = ArpanModel.findAll({
      where: {
        month: months, // Sequelize automatically handles IN condition
      },
      attributes: [
        "oldPPONo",
        "newPPONo",
        "month",
        "totalPension",
        "typeOfPension",
      ],
      raw: true,
    });

    // Run both queries in parallel
    const [arpanData] = await Promise.all([arpanPromise]);

    return arpanData;
  } catch (error) {
    console.error("Error fetching age-related SQL data:", error);
    throw new Error("Error fetching data from the database");
  }
}
