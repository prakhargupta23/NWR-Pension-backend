import { QueryTypes, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const ArpanModel = require("../Model/Arpan.model");
const DebitModel = require("../Model/Debit.model");
const SbiMaster = require("../Model/SbiMaster.model");

// Map table names to models
const models = {
  arpan: ArpanModel,
  debit: DebitModel,
};

/**
 * Function to ensure table exists by syncing the model.
 */
export async function ensureTableExists(model: any, modelName: string) {
  const queryInterface = sequelize.getQueryInterface();
  const tableExists = await queryInterface.tableExists(model.getTableName());

  if (!tableExists) {
    await model.sync();
  }
}

/* -------------------------------------------------------------------------- */
/*                              TABLE QUERY LOGIC                             */
/* -------------------------------------------------------------------------- */

export async function getTableDetails(query: any) {
  try {
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    const formattedResults = Array.isArray(results) ? results : [results];

    return {
      arpan: formattedResults,
      debit: [],
      success: true,
      message: "Fetching successful",
    };
  } catch (error) {
    console.log(error.message);

    return {
      success: false,
      message: "Unable to fetch data",
      arpan: [],
      debit: [],
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                         DATA TYPE CONVERSION FUNCTION                      */
/* -------------------------------------------------------------------------- */

const convertBatchDataTypes = (batch, model, month) => {
  return batch.map((entry, index) => {
    const newEntry = { ...entry, month };

    for (const key in entry) {
      if (Object.hasOwnProperty.call(entry, key)) {
        const value = entry[key];

        // Handle various null/empty cases case-insensitively
        if (value === "" || value === undefined || value === null || String(value).toUpperCase() === "NULL") {
          newEntry[key] = null;
          continue;
        }

        const attribute = model.rawAttributes[key];
        if (attribute?.type instanceof DataTypes.FLOAT) {
          const floatValue = parseFloat(value);
          if (isNaN(floatValue)) {
            throw new Error(`Invalid float conversion for key "${key}" at row ${index}: "${value}"`);
          }
          newEntry[key] = floatValue;
        } else if (attribute?.type instanceof DataTypes.STRING || attribute?.type.key === 'STRING') {
          // Safety: Truncate strings to their defined length (usually 255) to prevent truncation errors
          const limit = attribute.type._length || 255;
          const strValue = String(value);
          newEntry[key] = strValue.length > limit ? strValue.substring(0, limit) : strValue;
        } else {
          newEntry[key] = value;
        }
      }
    }

    return newEntry;
  });
};

/* -------------------------------------------------------------------------- */
/*                            INSERT CSV DATA                                 */
/* -------------------------------------------------------------------------- */

export default async function insertData(tableName, dataArray, month) {
  console.log(`Data insertion function reached for table: ${tableName}`);

  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error("Data should be a non-empty array.");
    }

    if (!month) {
      throw new Error("Month is required to insert data.");
    }

    const Model = models[tableName.toLowerCase()];
    if (!Model) {
      throw new Error(`No model found for table: ${tableName}`);
    }

    await ensureTableExists(Model, tableName);

    console.log("Deleting existing data for month:", month);
    try {
      await Model.destroy({ where: { month } });
    } catch (e) {
      console.log("Error while deleting existing data:", e.message);
    }

    // Arpan has ~25 cols. MSSQL limit is 2100 params. 80 * 25 = 2000 (Safe).
    const batchSize = tableName.toLowerCase() === "arpan" ? 80 : 300;

    console.log(`Starting insertion of ${dataArray.length} records in batches of ${batchSize}...`);

    for (let i = 0; i < dataArray.length; i += batchSize) {
      const batch = dataArray.slice(i, i + batchSize);
      const convertedBatch = convertBatchDataTypes(batch, Model, month);

      try {
        await Model.bulkCreate(convertedBatch, {
          returning: false,
          validate: false,
          logging: false,
        });
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} for ${tableName} inserted (${Math.min(i + batchSize, dataArray.length)}/${dataArray.length})`);
      } catch (err) {
        console.error(`❌ Batch failed at index ${i}:`);
        // Dig into AggregateError to find the actual SQL message
        if (err.original?.errors) {
          err.original.errors.forEach((e, idx) => {
            console.error(`  Error ${idx + 1}: ${e.message}`);
          });
        } else {
          console.error(`  Message: ${err.message}`);
        }
        throw err;
      }
    }

    console.log("All batches inserted successfully");
    return {
      message: `All data inserted into ${tableName} for month: ${month}`,
      success: true,
    };
  } catch (error) {
    console.error("InsertData outer error:", error.message);
    throw new Error(error.message);
  }
}

/* -------------------------------------------------------------------------- */
/*                         INSERT TREND DATA                                  */
/* -------------------------------------------------------------------------- */

export async function insertTrendData(tableName, dataArray, month) {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error("Data should be a non-empty array.");
    }

    const Model = models[tableName.toLowerCase()];
    if (!Model) {
      throw new Error(`No model found for table: ${tableName}`);
    }

    await ensureTableExists(Model, tableName);

    const modifiedDataArray = dataArray.map((row) => ({ ...row, month }));
    const batchSize = 200;

    for (let i = 0; i < modifiedDataArray.length; i += batchSize) {
      const batch = modifiedDataArray.slice(i, i + batchSize);
      await Model.bulkCreate(batch, {
        returning: false,
        validate: false,
        logging: false,
      });
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} for trend ${tableName} inserted (${Math.min(i + batchSize, modifiedDataArray.length)}/${modifiedDataArray.length})`);
    }

    console.log("Trend data inserted successfully");
    return `All trend data inserted into ${tableName}`;
  } catch (error) {
    console.error("Error inserting trend data:", error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                         GENERIC QUERY EXECUTOR                             */
/* -------------------------------------------------------------------------- */

export async function getQueryData(query) {
  try {
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return Array.isArray(results) ? results : [results];
  } catch (error) {
    console.error("Query Error:", error);
    throw new Error(`Query execution failed: ${error.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/*                         MERGED QUERY DATA                                  */
/* -------------------------------------------------------------------------- */

export async function getMergedTableQueryData(queryCondition) {
  try {
    const finalQueryCondition = queryCondition && queryCondition.trim() ? queryCondition : "1=1";
    const query = `
      SELECT s.*, a.*
      FROM SbiMaster s
      LEFT JOIN arpan a
        ON s.ppoNumber = a.newPPONo
        OR s.ppoNumber = a.oldPPONo
      WHERE ${finalQueryCondition}
    `;
    const results = await sequelize.query(query, { type: QueryTypes.SELECT });
    return results;
  } catch (error) {
    console.error("Merged query error:", error);
    throw new Error(`Query execution failed: ${error.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/*                            DELETE SQL DATA                                 */
/* -------------------------------------------------------------------------- */

export async function deleteSqlData(tableName = "arpan") {
  try {
    const Model = models[tableName.toLowerCase()];
    if (!Model) {
      throw new Error(`No model found for table: ${tableName}`);
    }
    await ensureTableExists(Model, tableName);
    await Model.destroy({ truncate: true });
    return { message: "All data deleted", success: true };
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error(`Query execution failed: ${error.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/*                         INSERT SBI CSV DATA                                */
/* -------------------------------------------------------------------------- */

export async function insertSbiCsvData(dataArray) {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error("Data should be a non-empty array.");
    }
    await ensureTableExists(SbiMaster, "sbi_master");

    const batchSize = 100;
    for (let i = 0; i < dataArray.length; i += batchSize) {
      const batch = dataArray.slice(i, i + batchSize).map((entry) => {
        return Object.fromEntries(
          Object.entries(entry).map(([key, value]) => [
            key,
            (value === "" || value === undefined || value === null || String(value).toUpperCase() === "NULL") ? null : value,
          ])
        );
      });

      await SbiMaster.bulkCreate(batch, {
        returning: false,
        validate: false,
        logging: false,
      });
      console.log(`✅ SBI Batch ${Math.floor(i / batchSize) + 1} inserted (${Math.min(i + batchSize, dataArray.length)}/${dataArray.length})`);
    }
    return { message: "All data inserted into sbi_master", success: true };
  } catch (error) {
    console.log("Insert SBI CSV error:", error.message);
    throw new Error(error.message);
  }
}
