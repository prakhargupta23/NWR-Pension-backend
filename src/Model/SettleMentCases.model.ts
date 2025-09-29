// models/settlementcases.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const settlementcases = sequelize.define(
  "settlementcases",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    item: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    openingBalanceOfMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accretionDuringMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clearedDuringMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    closingOutstanding: {
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

module.exports = settlementcases;
