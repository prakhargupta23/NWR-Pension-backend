import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const PositionOfStockSheet = sequelize.define(
  "PositionOfStockSheet",
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
    item: { type: DataTypes.STRING, allowNull: true },
    openingBalance: { type: DataTypes.STRING, allowNull: true },       // changed from FLOAT
    accretionUpToMonth: { type: DataTypes.STRING, allowNull: true },   // changed from FLOAT
    clearanceUpToMonth: { type: DataTypes.STRING, allowNull: true },   // changed from FLOAT
    closingBalance: { type: DataTypes.STRING, allowNull: true },       // changed from FLOAT
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PositionOfStockSheet;
