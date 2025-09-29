import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const StatusOfRevisionOfPension = sequelize.define(
  "StatusOfRevisionOfPension",
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
    category: { type: DataTypes.STRING, allowNull: true },
    totalNoOfCasesRequiringRevision: { type: DataTypes.STRING, allowNull: true },
    noOfCasesReceivedInAccounts: { type: DataTypes.STRING, allowNull: true },
    noOfCasesRevisedUpToMonth: { type: DataTypes.STRING, allowNull: true },
    noOfCasesReturnedUpToMonth: { type: DataTypes.STRING, allowNull: true },
    balanceNoOfCasesUnderProcessInAccounts: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = StatusOfRevisionOfPension;
