// models/phexpenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const phexpenditure = sequelize.define(
  "phexpenditure",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    planHead: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    actualLastYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    figure: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    targetLastYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actualForTheMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actualUpToTheMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actualUpToTheMonthLastYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["planHead"],
      },
    ],
  }
);

module.exports = phexpenditure;
