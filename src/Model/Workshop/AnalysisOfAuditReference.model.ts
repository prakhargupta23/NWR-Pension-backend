import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const AnalysisOfAuditReference = sequelize.define(
  "AnalysisOfAuditReference",
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
    figure: { type: DataTypes.STRING, allowNull: true },
    SNo: { type: DataTypes.STRING, allowNull: true },
    typeOfAuditObjection: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
    overSixMonthOld: { type: DataTypes.STRING, allowNull: true },
    overOneYearOld: { type: DataTypes.STRING, allowNull: true },
    overThreeYearOld: { type: DataTypes.STRING, allowNull: true },
    lessThanSixMonthOld: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AnalysisOfAuditReference;
