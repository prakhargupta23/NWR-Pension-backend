import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const PlanHead = sequelize.define(
  "PlanHead",
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
    PlanHead: {
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
    ActualfortheMonthLastYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ActualfortheMonthCurrentYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PlanHead;