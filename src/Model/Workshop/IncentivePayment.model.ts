import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const IncentivePayment = sequelize.define(
  "IncentivePayment",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    index: { type: DataTypes.INTEGER, allowNull: true },
    division: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    figure: { type: DataTypes.STRING, allowNull: true },
    duringTheMonthLastYear: { type: DataTypes.STRING, allowNull: true },
    upToTheMonthLastYear: { type: DataTypes.STRING, allowNull: true },
    duringTheMonth: { type: DataTypes.STRING, allowNull: true },
    upToTheMonth: { type: DataTypes.STRING, allowNull: true },
    year: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = IncentivePayment;


