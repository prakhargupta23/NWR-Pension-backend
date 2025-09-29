// models/recoverable.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const recoverable = sequelize.define(
  "recoverable",
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
    figure: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    openingBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    accretionUptoTheMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    clearanceUptoMonth: {
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
      {
        fields: ["category"],
      },
      {
        fields: ["type"],
      },
    ],
  }
);

module.exports = recoverable;
