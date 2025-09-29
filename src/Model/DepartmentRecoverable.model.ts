// models/recoverable.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const departmentRecoverable = sequelize.define(
  "departmentwiserecoverable",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    openingBalanceItem: {
      // <-- Updated to FLOAT
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    openingBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    accretionUptoTheMonthItem: {
      // <-- Updated to FLOAT
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    accretionUptoTheMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    clearanceUptoMonthItem: {
      // <-- Updated to FLOAT
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    clearanceUptoMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    closingBalanceItem: {
      // <-- Updated to FLOAT
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    closingBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["date"],
      },
    ],
  }
);

module.exports = departmentRecoverable;
