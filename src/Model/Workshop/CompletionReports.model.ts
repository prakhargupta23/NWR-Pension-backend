import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const CompletionReportsexpenditure = sequelize.define(
  "CompletionReportsexpenditure",
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
    positionAsPerLHR: { type: DataTypes.STRING, allowNull: true },
    openingBalanceOn1stApril: { type: DataTypes.STRING, allowNull: true },
    accretionUpToMonth: { type: DataTypes.STRING, allowNull: true },
    clearanceUpToMonthDuringYear: { type: DataTypes.STRING, allowNull: true },
    closingBalanceAsOn: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = CompletionReportsexpenditure;
