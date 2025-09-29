/**
 * Update suspense register entries in the database
 * @param {Array<Object>} updatedData - Array of updated suspense register records
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const SuspenseRegister = require("../Model/SuspenseRegister.model");

export const updateSuspenseRegisterData = async (updatedData) => {
  try {
    if (!Array.isArray(updatedData) || updatedData.length === 0) {
      return {
        success: false,
        message: "No data provided for update.",
      };
    }

    // Loop through each entry and update individually
    for (const item of updatedData) {
      if (!item.uuid) {
        throw new Error("Missing uuid in one of the records.");
      }

      await SuspenseRegister.update(
        {
          date: item.date,
          division: item.division,
          suspenseHeads: item.suspenseHeads,
          position: item.position,
          positionLhr: item.positionLhr,
          closingBalance: item.closingBalance,
          reconciliationMonth: item.reconciliationMonth,
        },
        {
          where: { uuid: item.uuid },
        }
      );
    }

    return {
      success: true,
      message: "Suspense register entries updated successfully.",
    };
  } catch (error) {
    console.error("Error updating suspense register entries:", error);
    return {
      success: false,
      message: "Failed to update suspense register entries. " + error.message,
    };
  }
};
