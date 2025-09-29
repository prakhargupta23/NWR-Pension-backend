import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const StaffReferencesOrCases = sequelize.define(
  "StaffReferencesOrCases",
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
    SNo: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
    openingBalance: { type: DataTypes.STRING, allowNull: true },
    accretion: { type: DataTypes.STRING, allowNull: true },
    clearance: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = StaffReferencesOrCases;
