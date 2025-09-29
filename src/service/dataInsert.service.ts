import { QueryTypes } from "sequelize";

const ArpanModel = require("../Model/Arpan.model"); // Import models
const DebitModel = require("../Model/Debit.model");
import sequelize from "../config/sequelize";
const SbiMaster = require("../Model/SbiMaster.model");
const { DataTypes } = require("sequelize");
// Map table names to models
const models = {
  arpan: ArpanModel,
  debit: DebitModel,
};

/**
 * Function to insert multiple records dynamically based on tableName.
 * @param {string} tableName - The name of the table.
 * @param {Array<Object>} dataArray - The array of data objects to insert.
 * @returns {Promise<Array<Object>>} - Returns the inserted records.
 */
export async function ensureTableExists(model: any, modelName: string) {
  const queryInterface = sequelize.getQueryInterface();

  // Check if the table exists
  const tableExists = await queryInterface.tableExists(model.getTableName());

  // Sync if the table doesn't exist
  if (!tableExists) {
    await model.sync();
  } else {
  }
}

export async function getTableDetails(query: any) {
  if (query === "stopped pensioner trend") {
    try {
      // First, get the list of valid current months
      const validMonths = await sequelize.query(
        `WITH UniqueMonths AS (
        SELECT DISTINCT month FROM arpan
      ),
      ValidMonths AS (
        -- Only include months where the previous month exists
        SELECT DISTINCT um.month AS currentMonth
        FROM UniqueMonths um
        JOIN UniqueMonths prevMonth 
          ON prevMonth.month = FORMAT(DATEADD(MONTH, -1, CONVERT(DATE, '01/' + um.month, 103)), 'MM/yyyy')
      )
      SELECT currentMonth AS month
      FROM ValidMonths
      ORDER BY CONVERT(DATE, '01/' + currentMonth, 103);`,
        { type: QueryTypes.SELECT }
      );

      // Prepare an array of query promises (one for each valid month)
      const queries = validMonths.map(({ month: currentMonth }: { month: string }) => {
        // Parse month and year as numbers
        const [monthStr, yearStr] = currentMonth.split("/");
        const mm = parseInt(monthStr, 10);
        const yyyy = parseInt(yearStr, 10);
        
        let prevMonth: number;
        let prevYear: number;
        
        if (mm === 1) {
          prevMonth = 12;
          prevYear = yyyy - 1;
        } else {
          prevMonth = mm - 1;
          prevYear = yyyy;
        }
        
        // Format previous month to MM/yyyy
        const previousMonth = `${prevMonth.toString().padStart(2, "0")}/${prevYear}`;
        
        // Return the promise from executing the query with the current and previous month
        return sequelize.query(
          `SELECT 
            :currentMonth AS month,
            COUNT(DISTINCT COALESCE(prev.newPPONo, prev.oldPPONo)) AS StoppedPensioners,
            SUM(prev.totalPension) AS StoppedPensionerAmount
         FROM arpan prev
         WHERE 
            prev.month = :previousMonth
            AND NOT EXISTS (
              SELECT 1
              FROM arpan a
              WHERE 
                a.month = :currentMonth
                AND (
                  COALESCE(prev.newPPONo, prev.oldPPONo) = a.newPPONo 
                  OR COALESCE(prev.newPPONo, prev.oldPPONo) = a.oldPPONo
                )
            );`,
          {
            replacements: { currentMonth, previousMonth },
            type: QueryTypes.SELECT,
          }
        );
      });

      // Execute all queries in parallel
      const resultsList = await Promise.all(queries);
      // Flatten the list if needed (each query returns an array)
      const finalResults = resultsList.flat();

      return {
        arpan: finalResults,
        debit: [],
        success: true,
        message: "Fetching successfull",
      };
    } catch (error) {
      console.log(error.message);

      return {
        success: false,
        message: "Unable to fetch the data",

        arpan: [],
        debit: [],
      };
    }
  } else if (query === "active pensioner trend") {
    try {
      // First, get the list of valid current months
      const validMonths = await sequelize.query(
        `WITH UniqueMonths AS (
            SELECT DISTINCT month FROM arpan
         ),
         ValidMonths AS (
            -- Only include months where the previous month exists
            SELECT DISTINCT um.month AS currentMonth
            FROM UniqueMonths um
            JOIN UniqueMonths prevMonth 
              ON prevMonth.month = FORMAT(DATEADD(MONTH, -1, CONVERT(DATE, '01/' + um.month, 103)), 'MM/yyyy')
         )
         SELECT currentMonth AS month
         FROM ValidMonths
         ORDER BY CONVERT(DATE, '01/' + currentMonth, 103);`,
        { type: QueryTypes.SELECT }
      );

      // Prepare an array of query promises (one for each valid month)
      const queries = validMonths.map(({ month: currentMonth }: { month: string }) => {
        // Parse month and year as numbers
        const [monthStr, yearStr] = currentMonth.split("/");
        const mm = parseInt(monthStr, 10);
        const yyyy = parseInt(yearStr, 10);
        
        let prevMonth: number;
        let prevYear: number;
        
        if (mm === 1) {
          prevMonth = 12;
          prevYear = yyyy - 1;
        } else {
          prevMonth = mm - 1;
          prevYear = yyyy;
        }
        
        // Format previous month to MM/yyyy
        const previousMonth = `${prevMonth.toString().padStart(2, "0")}/${prevYear}`;
        
        // Return the promise from executing the query with the current and previous month
        return sequelize.query(
          `SELECT 
              :currentMonth AS month,
              COUNT(DISTINCT COALESCE(a.newPPONo, a.oldPPONo)) AS ActivePensioners,
              SUM(a.totalPension) AS ActivePensionAmount
           FROM arpan a
           WHERE 
              a.month = :currentMonth
              AND EXISTS (
                SELECT 1
                FROM arpan prev
                WHERE 
                  prev.month = :previousMonth
                  AND (
                    COALESCE(prev.newPPONo, prev.oldPPONo) = a.newPPONo 
                    OR COALESCE(prev.newPPONo, prev.oldPPONo) = a.oldPPONo
                  )
              );`,
          {
            replacements: { currentMonth, previousMonth },
            type: QueryTypes.SELECT,
          }
        );
      });

      // Execute all queries in parallel
      const resultsList = await Promise.all(queries);
      // Flatten the list if needed (each query returns an array)
      const finalResults = resultsList.flat();

      return {
        arpan: finalResults,
        debit: [],
        success: true,
        message: "Fetching successful",
      };
    } catch (error) {
      console.log(error.message);

      return {
        success: false,
        message: "Unable to fetch the data",
        arpan: [],
        debit: [],
      };
    }
  } else if (query === "family pensioner transition trend") {
    try {
      // First, get the list of valid current months
      const validMonths = await sequelize.query(
        `WITH UniqueMonths AS (
            SELECT DISTINCT month FROM arpan
         ),
         ValidMonths AS (
            -- Only include months where the previous month exists
            SELECT DISTINCT um.month AS currentMonth
            FROM UniqueMonths um
            JOIN UniqueMonths prevMonth 
              ON prevMonth.month = FORMAT(DATEADD(MONTH, -1, CONVERT(DATE, '01/' + um.month, 103)), 'MM/yyyy')
         )
         SELECT currentMonth AS month
         FROM ValidMonths
         ORDER BY CONVERT(DATE, '01/' + currentMonth, 103);`,
        { type: QueryTypes.SELECT }
      );

      // Prepare an array of query promises (one for each valid month)
      const queries = validMonths.map(({ month: currentMonth }: { month: string }) => {
        // Parse month and year as numbers
        const [monthStr, yearStr] = currentMonth.split("/");
        const mm = parseInt(monthStr, 10);
        const yyyy = parseInt(yearStr, 10);
        
        let prevMonth: number;
        let prevYear: number;
        
        if (mm === 1) {
          prevMonth = 12;
          prevYear = yyyy - 1;
        } else {
          prevMonth = mm - 1;
          prevYear = yyyy;
        }
        
        // Format previous month to MM/yyyy
        const previousMonth = `${prevMonth.toString().padStart(2, "0")}/${prevYear}`;
        
        // Return the promise from executing the query with the current and previous month
        return sequelize.query(
          `SELECT 
              :currentMonth AS month,
              COUNT(*) AS TransitionCount,
              SUM(a.totalPension) AS TransitionAmount
           FROM arpan a
           WHERE LOWER(a.typeOfPension) = 'f'
             AND a.month = :currentMonth
             AND EXISTS (
               SELECT 1
               FROM (
                   SELECT oldPPONo AS PPONo FROM arpan 
                   WHERE LOWER(typeOfPension) = 'r' 
                     AND month = :previousMonth
                   UNION
                   SELECT newPPONo AS PPONo FROM arpan 
                   WHERE LOWER(typeOfPension) = 'r' 
                     AND month = :previousMonth
               ) t
               WHERE t.PPONo = a.oldPPONo OR t.PPONo = a.newPPONo
             )
           GROUP BY a.month;`,
          {
            replacements: { currentMonth, previousMonth },
            type: QueryTypes.SELECT,
          }
        );
      });

      // Execute all queries in parallel
      const resultsList = await Promise.all(queries);
      // Flatten the list if needed (each query returns an array)
      const finalResults = resultsList.flat();

      return {
        arpan: finalResults,
        debit: [],
        success: true,
        message: "Fetching successful",
      };
    } catch (error) {
      console.log(error.message);

      return {
        success: false,
        message: "Unable to fetch the data",
        arpan: [],
        debit: [],
      };
    }
  }

  try {
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    

    // Ensure results is always an array
    const formattedResults = Array.isArray(results) ? results : [results];

    return {
      arpan: formattedResults,
      debit: [],
      success: true,
      message: "Fetching successfull",
    };
  } catch (error) {
    console.log(error.message);

    return {
      success: false,
      message: "Unable to fetch the data",

      arpan: [],
      debit: [],
    };
  }
}




const convertBatchDataTypes = (batch, model, month) => {
  return batch.map((entry, index) => {
    const newEntry = { ...entry, month }; // Add month to each entry

    for (const key in entry) {
      if (Object.hasOwnProperty.call(entry, key)) {
        const value = entry[key];

        // Check if the key exists in the model and has FLOAT type
        if (model.rawAttributes[key]?.type instanceof DataTypes.FLOAT) {
          if (value == "" || value == null) {
            newEntry[key] = null;
          } else {
            // Try converting to float, throw an error if it fails
            const floatValue = parseFloat(value);
            if (isNaN(floatValue)) {
              throw new Error(
                `❌ Invalid float conversion for key "${key}" in batch at index ${index}: "${value}"`
              );
            }
            newEntry[key] = floatValue;
          }
        } else {
          // Convert everything else to string
          newEntry[key] = value !== null ? String(value) : null;
        }
      }
    }
    return newEntry;
  });
};

export default async function insertData(tableName, dataArray, month) {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error("❌ Data should be a non-empty array.");
    }

    if (!month) {
      throw new Error("❌ Month is required to insert data.");
    }

    // Find the correct model based on tableName
    const Model = models[tableName];

    if (!Model) {
      throw new Error(`❌ No model found for table: ${tableName}`);
    }

    // Ensure table exists before inserting
    await ensureTableExists(Model, tableName);

    try {
      // **Delete only entries that match the given month**
      await Model.destroy({
        where: { month }, // Assuming the table has a "month" column
      });
    } catch (e) {
      console.log("❌ Error while deleting existing data for month:", month);
      console.error(e);
    }

    // Batch insert mechanism (400 entries at a time)
    const batchSize = 400;
    let batchStart = 0;
    let batchEnd = batchSize;

    while (batchStart < dataArray.length) {
      const batch = dataArray.slice(batchStart, batchEnd);

      // Convert data types for the batch and add month
      const convertedBatch = convertBatchDataTypes(batch, Model, month);

      // Insert the current batch (if an error occurs, it stops here)
      await Model.bulkCreate(convertedBatch);

      // Update the start and end for the next batch
      batchStart = batchEnd;
      batchEnd = batchStart + batchSize;
    }

    return {
      message: `✅ All data inserted into ${tableName} for month: ${month}.`,
      success: true,
    };
  } catch (error) {
    console.log("went for this error");
    console.log(error.message);

    throw new Error(error.message);
  }
}

//// Funciton for adding trend data -------------------------------------------/
export async function insertTrendData(tableName, dataArray, month) {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error("Data should be a non-empty array.");
    }

    // Find the correct model based on tableName
    const Model = models[tableName];

    if (!Model) {
      throw new Error(`No model found for table: ${tableName}`);
    }

    // Ensure table exists before inserting
    await ensureTableExists(Model, tableName);

    // **Truncate the table before inserting new data**

    // Attach the month to each row
    const modifiedDataArray = dataArray.map((row) => ({
      ...row,
      month: month, // Ensure the month is added to each row
    }));

    // Batch insert mechanism (400 entries at a time)
    const batchSize = 400;
    let batchStart = 0;
    let batchEnd = batchSize;

    while (batchStart < modifiedDataArray.length) {
      const batch = modifiedDataArray.slice(batchStart, batchEnd);
      // Insert the current batch
      const newRecords = await Model.bulkCreate(batch);
      console.log(
        `✅ Batch of ${batch.length} records inserted into ${tableName}:`,
        newRecords.map((r) => r.toJSON())
      );

      // Update the start and end for the next batch
      batchStart = batchEnd;
      batchEnd = batchStart + batchSize;

      // Optional: Add a small delay to avoid hitting rate limits or overwhelming the DB
      // await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return `✅ All data inserted into ${tableName}.`;
  } catch (error) {
    console.error("❌ Error inserting data:");
    console.error("➡ Message:", error.message);
    console.error("➡ Stack Trace:", error.stack);
    console.error("➡ Full Error Object:", error);

    throw error; // Re-throw the error so it can be handled by the caller
  }
}

///// Function for generating the data from the table based on query----/
export async function getQueryData(query: any) {
  try {
    console.log("Executing query:", query);

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    

    // Ensure results is always an array
    const formattedResults = Array.isArray(results) ? results : [results];

    return formattedResults;
  } catch (error) {
    console.error("Sequelize Query Error:", error);
    throw new Error(`Query execution failed: ${error.message}`);
  }
}

export async function getMergedTableQueryData(queryCondition: string | null) {
  try {
    // Ensure queryCondition is valid
    const finalQueryCondition =
      queryCondition && queryCondition.trim() ? queryCondition : "1=1";

    console.log(
      "Executing query with join and condition:",
      finalQueryCondition
    );

    // Query with JOIN between SbiMaster and arpan, applying filters dynamically
    const query = `
      SELECT s.*, a.*
      FROM SbiMaster s
      LEFT JOIN arpan a
        ON s.ppoNumber = a.newPPONo
        OR s.ppoNumber = a.oldPPONo
      WHERE ${finalQueryCondition} 
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    console.log("Final Results:", results);
    return results;
  } catch (error) {
    console.error("Sequelize Query Error:", error);
    throw new Error(`Query execution failed: ${error.message}`);
  }
}

//// Function for the deleting the sql data --------------------------------------/
export async function deleteSqlData(tableName = "arpan") {
  try {
    // Find the correct model based on tableName
    const Model = models[tableName];
    console.log("this is model");
    console.log("Model:", Model);

    if (!Model) {
      throw new Error(`No model found for table: ${tableName}`);
    }

    // Ensure table exists before inserting
    await ensureTableExists(Model, tableName);

    // **Truncate the table before inserting new data**
    await Model.destroy({ truncate: true });
    return {
      message: "All data has been deleted",
      success: true,
    };
  } catch (error) {
    console.error("Sequelize Query Error:", error);
    throw new Error(`Query execution failed: ${error.message}`);
  }
}

//// Function for inserting the sbi csv data ---------------------------------------/
export async function insertSbiCsvData(dataArray) {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error("❌ Data should be a non-empty array.");
    }

    console.log("✔ Model found: SbiMaster");

    // Ensure table exists before inserting
    await ensureTableExists(SbiMaster, "sbi_master");

    console.log("this is dataarray length");
    console.log(dataArray.length);

    // Batch insert mechanism (400 entries at a time)
    const batchSize = 400;
    let batchStart = 0;
    let batchEnd = batchSize;

    while (batchStart < dataArray.length) {
      const batch = dataArray
        .slice(batchStart, batchEnd)
        .map((entry, index) => {
          try {
            return Object.fromEntries(
              Object.entries(entry).map(([key, value]) => [
                key,
                value != null ? String(value) : null,
              ])
            );
          } catch (error) {
            throw new Error(
              `❌ Error converting entry at batch index ${
                batchStart + index
              }: ${JSON.stringify(entry)}`
            );
          }
        });

      // Insert the current batch (if an error occurs, it stops here)
      await SbiMaster.bulkCreate(batch);

      // Update the start and end for the next batch
      batchStart = batchEnd;
      batchEnd = batchStart + batchSize;
    }

    return {
      message: `✅ All data inserted into sbi_master .`,
      success: true,
    };
  } catch (error) {
    console.log("went for this error");
    console.log(error.message);

    throw new Error(error.message);
  }
}
