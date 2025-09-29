import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ManufacturingSuspense = sequelize.define(
  "ManufacturingSuspense",
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
    OpeningBalance: { type: DataTypes.STRING, allowNull: true },
    RBGDebit: { type: DataTypes.STRING, allowNull: true },
    RBGCredit: { type: DataTypes.STRING, allowNull: true },
    RBGNet: { type: DataTypes.STRING, allowNull: true },
    ExpendituretotheEndofMonthDebit: { type: DataTypes.STRING, allowNull: true },
    ExpendituretotheEndofMonthCredit: { type: DataTypes.STRING, allowNull: true },
    ExpendituretotheEndofMonthNet: { type: DataTypes.STRING, allowNull: true },
    BalancetotheEndofMonthDebit: { type: DataTypes.STRING, allowNull: true },
    BalancetotheEndofMonthCredit: { type: DataTypes.STRING, allowNull: true },
    BalancetotheEndofMonthNet: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ManufacturingSuspense;
