import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ClearanceAndAdjustmentOfMA = sequelize.define(
  "ClearanceAndAdjustmentOfMA",
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
    division: { type: DataTypes.STRING, allowNull: false },  // NOT NULL
    date: { type: DataTypes.STRING, allowNull: false },      // NOT NULL
    openingBalance: { type: DataTypes.STRING, allowNull: true },
    accretion: { type: DataTypes.STRING, allowNull: true },
    clearance: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ClearanceAndAdjustmentOfMA;
