/**
 * Create a new recoverable transaction entry in the database
 * @param {Object} data - The transaction data object
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const Recoverable = require("../Model/Recoverable.model");

export const createRecoverableData = async (data) => {
  try {
    // Ensure the table exists
    await Recoverable.sync({ alter: true });

    // Step 1: Delete existing records for the selected month/year and division
    if (data.selectedMonthYear && data.division) {
      await Recoverable.destroy({
        where: {
          date: data.selectedMonthYear,
          division: data.division,
        },
      });
    }

    // Step 2: Insert new recoverable records
    if (Array.isArray(data.recoverable) && data.recoverable.length > 0) {
      const recoverablesToInsert = data.recoverable.map((item) => ({
        division: item.division,
        date: item.date,
        category: item.category,
        type: item.type,
        openingBalance: item.openingBalance,
        accretionUptoTheMonth: item.accretionUptoTheMonth,
        clearanceUptoMonth: item.clearanceUptoMonth,
        closingBalance: item.closingBalance,
      }));

      await Recoverable.bulkCreate(recoverablesToInsert);
    }

    return {
      success: true,
      message: "Recoverable entries created successfully.",
    };
  } catch (error) {
    console.error("Error creating recoverable entries:", error);
    return {
      success: false,
      message: "Failed to create recoverable entries. " + error.message,
    };
  }
};

export async function getRecoverableData(type: string, date: string) {
  try {
    let response;
    try {
      const results = await Recoverable.findAll({
        where: {
          date: date, // or `date: { [Op.eq]: date }` for clarity
        },
      });

      if (results) {
        return {
          message: "Data has been fetched",
          success: true,
          data: results,
        };
      } else {
        return {
          message: "Unable to fetch the data",
          success: false,
          data: null,
        };
      }
    } catch (error) {
      console.error("Error fetching expenditure by month:", error);
      throw new Error(error);
    }
  } catch (error) {
    throw new Error(error);
  }
}
