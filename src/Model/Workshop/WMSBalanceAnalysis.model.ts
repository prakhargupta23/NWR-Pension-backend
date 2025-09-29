import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const WMSBalanceAnalysis = sequelize.define(
  "WMSBalanceAnalysis",
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
    division: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    figure: { type: DataTypes.STRING, allowNull: true },
    previousYearNonth: { type: DataTypes.STRING, allowNull: true },
    previousYearOpeningBalance: { type: DataTypes.STRING, allowNull: true },
    previousYearDebit: { type: DataTypes.STRING, allowNull: true },
    previousYearCredit: { type: DataTypes.STRING, allowNull: true },
    previousYearClosingBalance: { type: DataTypes.STRING, allowNull: true },
    currentYearNonth: { type: DataTypes.STRING, allowNull: true },
    currentYearOpeningBalance: { type: DataTypes.STRING, allowNull: true },
    currentYearDebit: { type: DataTypes.STRING, allowNull: true },
    currentYearCredit: { type: DataTypes.STRING, allowNull: true },
    currentYearClosingBalance: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = WMSBalanceAnalysis;
