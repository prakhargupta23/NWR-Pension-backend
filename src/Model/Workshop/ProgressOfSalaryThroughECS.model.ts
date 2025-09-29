import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ProgressOfSalaryThroughECS = sequelize.define(
  "ProgressOfSalaryThroughECS",
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
    numberOfCities: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ProgressOfSalaryThroughECS;
