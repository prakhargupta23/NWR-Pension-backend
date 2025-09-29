import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const AccountInspectionReport = sequelize.define(
  "AccountInspectionReport",
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
    positionLhr: { type: DataTypes.STRING, allowNull: true },
    openingBalance: { type: DataTypes.STRING, allowNull: true },
    accretion: { type: DataTypes.STRING, allowNull: true },
    clearanceOverOneYear: { type: DataTypes.STRING, allowNull: true },
    clearanceLessThanOneYear: { type: DataTypes.STRING, allowNull: true },
    totalClearance: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AccountInspectionReport;
