import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ProgressOfEPayment = sequelize.define(
  "ProgressOfEPayment",
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
    totalNoOfStaff: { type: DataTypes.STRING, allowNull: true },
    paidThroughEMode: { type: DataTypes.STRING, allowNull: true },
    percentAgeProgressStaff: { type: DataTypes.STRING, allowNull: true },
    totalBillsPaid: { type: DataTypes.STRING, allowNull: true },
    paidThroughEModeBills: { type: DataTypes.STRING, allowNull: true },
    percentAgeProgressBills: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ProgressOfEPayment;
