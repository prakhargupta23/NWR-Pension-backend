import { Op } from "sequelize";

const Comment = require("../Model/Comment.model");
const Workshopcomment = require("../Model/Workshop/WorkshopComment.model")

export const createComments = async (dataArray) => {
  try {
    await Comment.sync({ alter: true });

    // Extract unique combinations of division, date, and tableName
    const whereConditions = dataArray.map((item) => ({
      division: item.division,
      date: item.date,
      tableName: item.tableName,
    }));

    // Bulk delete old comments matching division, date, and tableName
    await Comment.destroy({
      where: {
        [Op.or]: whereConditions,
      },
    });

    // Bulk insert new comments
    await Comment.bulkCreate(dataArray);

    return {
      success: true,
      message: "Comments replaced successfully.",
    };
  } catch (error) {
    console.error("Error updating comments:", error);
    return {
      success: false,
      message: "Failed to update comments. " + error.message,
    };
  }
};


export const createWorkshopComments = async (dataArray) => {
  try {
    await Workshopcomment.sync({ alter: true });

    // Extract unique combinations of division, date, and tableName
    const whereConditions = dataArray.map((item) => ({
      division: item.division,
      date: item.date,
      tableName: item.tableName,
    }));

    // Bulk delete old comments matching division, date, and tableName
    await Workshopcomment.destroy({
      where: {
        [Op.or]: whereConditions,
      },
    });

    // Bulk insert new comments
    await Workshopcomment.bulkCreate(dataArray);

    return {
      success: true,
      message: "Comments replaced successfully.",
    };
  } catch (error) {
    console.error("Error updating comments:", error);
    return {
      success: false,
      message: "Failed to update comments. " + error.message,
    };
  }
};
