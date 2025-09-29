import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const UnsanctionedExpenditure = sequelize.define(
  "UnsanctionedExpenditure",
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
    SNo: { type: DataTypes.STRING, allowNull: true },
    suspenseHeads: { type: DataTypes.STRING, allowNull: true },
    positionasperLHARitem: { type: DataTypes.STRING, allowNull: true },
    positionasperLHARamount: { type: DataTypes.STRING, allowNull: true },
    openingBalanceitem: { type: DataTypes.STRING, allowNull: true },
    openingBalanceamount: { type: DataTypes.STRING, allowNull: true },
    accretionitem: { type: DataTypes.STRING, allowNull: true },
    accretionamount: { type: DataTypes.STRING, allowNull: true },
    clearanceitem: { type: DataTypes.STRING, allowNull: true },
    clearanceamount: { type: DataTypes.STRING, allowNull: true },
    closingBalanceitem: { type: DataTypes.STRING, allowNull: true },
    closingBalanceamount: { type: DataTypes.STRING, allowNull: true },
    oldestBalance: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = UnsanctionedExpenditure;
