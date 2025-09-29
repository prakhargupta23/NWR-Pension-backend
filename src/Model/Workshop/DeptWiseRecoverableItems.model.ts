import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const DeptWiseRecoverableItems = sequelize.define(
  "DeptWiseRecoverableItems",
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
    figure: { type: DataTypes.STRING, allowNull: true },
    srNo: { type: DataTypes.STRING, allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    openingBalanceItem: { type: DataTypes.STRING, allowNull: true },
    openingBalanceAmount: { type: DataTypes.STRING, allowNull: true },
    accretionItem: { type: DataTypes.STRING, allowNull: true },
    accretionAmount: { type: DataTypes.STRING, allowNull: true },
    clearanceItem: { type: DataTypes.STRING, allowNull: true },
    clearanceAmount: { type: DataTypes.STRING, allowNull: true },
    closingBalanceItem: { type: DataTypes.STRING, allowNull: true },
    closingBalanceAmount: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DeptWiseRecoverableItems;
