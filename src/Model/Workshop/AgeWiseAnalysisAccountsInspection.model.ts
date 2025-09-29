import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const AgeWiseAnalysisAccountsInspection = sequelize.define(
  "AgeWiseAnalysisAccountsInspection",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    division: { type: DataTypes.STRING, allowNull: false },  // NOT NULL
    date: { type: DataTypes.STRING, allowNull: false },      // NOT NULL
    SNo: { type: DataTypes.STRING, allowNull: true },
    typeOfReport: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
    over6MonthOld: { type: DataTypes.STRING, allowNull: true },
    overOneYearOld: { type: DataTypes.STRING, allowNull: true },
    overThreeYearsOld: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AgeWiseAnalysisAccountsInspection;
