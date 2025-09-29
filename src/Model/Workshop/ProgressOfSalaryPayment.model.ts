import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ProgressOfSalaryPayment = sequelize.define(
  "ProgressOfSalaryPayment",
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
    item: { type: DataTypes.STRING, allowNull: true },
    totalNoOfEmployees: { type: DataTypes.STRING, allowNull: true },
    employeesThroughBank: { type: DataTypes.STRING, allowNull: true },
    percentBankCurrentMonth: { type: DataTypes.STRING, allowNull: true },
    percentBankPrevMonth: { type: DataTypes.STRING, allowNull: true },
    increaseOrDecrease: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ProgressOfSalaryPayment; 