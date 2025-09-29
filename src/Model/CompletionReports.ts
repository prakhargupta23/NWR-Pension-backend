// models/completionreports.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const completionreports = sequelize.define(
  "completionreports",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    positionAsLastYearMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accretionUpToMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clearanceUpToMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    closingBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oldestCRPending: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["division"],
      },
    ],
  }
);

module.exports = completionreports;