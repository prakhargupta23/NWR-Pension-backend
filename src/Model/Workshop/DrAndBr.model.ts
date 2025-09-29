import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const DrAndBr = sequelize.define(
  "DrAndBr",
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
    category: { type: DataTypes.STRING, allowNull: true },
    openingBalanceNoOfItems: { type: DataTypes.STRING, allowNull: true },
    openingBalanceAmount: { type: DataTypes.STRING, allowNull: true },
    accretionNoOfItems: { type: DataTypes.STRING, allowNull: true },
    accretionAmount: { type: DataTypes.STRING, allowNull: true },
    clearanceNoOfItems: { type: DataTypes.STRING, allowNull: true },
    clearanceAmount: { type: DataTypes.STRING, allowNull: true },
    closingBalanceNoOfItems: { type: DataTypes.STRING, allowNull: true },
    closingBalanceAmount: { type: DataTypes.STRING, allowNull: true },
    billsOughtToHaveBeenPreferred: { type: DataTypes.STRING, allowNull: true },
    billsActuallyIssued: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DrAndBr;
