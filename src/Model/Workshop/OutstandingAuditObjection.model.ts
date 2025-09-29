import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const OutstandingAuditObjection = sequelize.define(
  "OutstandingAuditObjection",
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
    typeOfAuditObjection: { type: DataTypes.STRING, allowNull: true },
    positionasperLHY: { type: DataTypes.STRING, allowNull: true },
    openingBalance: { type: DataTypes.STRING, allowNull: true },
    accretion: { type: DataTypes.STRING, allowNull: true },
    clearenceOverOneYearOld: { type: DataTypes.STRING, allowNull: true },
    clearenceLessthanOneYearOld: { type: DataTypes.STRING, allowNull: true },
    totalClearence: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = OutstandingAuditObjection;
