// models/WorkingExpenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const WorkingExpenditure = sequelize.define(
  "WorkingExpenditure",
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
    division: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    figure: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    DemandNo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Actual: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    RBG: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    BPfortheMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ActualfortheMonthLastYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ActualfortheMonthCurrentYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    BPtoendofMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ActualtoendofMonthLastYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ActualtotheEndofMonthCurrentYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = WorkingExpenditure;