import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ProgressOfSalaryThroughBank = sequelize.define(
  "ProgressOfSalaryThroughBank",
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
    type: { type: DataTypes.STRING, allowNull: true },
    noOfStaffAB: { type: DataTypes.STRING, allowNull: true },
    noOfStaffCD: { type: DataTypes.STRING, allowNull: true },
    coverageAB: { type: DataTypes.STRING, allowNull: true },
    coverageCD: { type: DataTypes.STRING, allowNull: true },
    percentAB: { type: DataTypes.STRING, allowNull: true },
    percentCD: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ProgressOfSalaryThroughBank;
