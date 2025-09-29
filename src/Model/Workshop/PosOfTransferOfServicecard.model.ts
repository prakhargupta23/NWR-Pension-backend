import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const PosOfTransferOfServicecard = sequelize.define(
  "PosOfTransferOfServicecard",
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
    Sno: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
    openingBalance: { type: DataTypes.STRING, allowNull: true },  // changed from FLOAT
    accretion: { type: DataTypes.STRING, allowNull: true },       // changed from FLOAT
    clearance: { type: DataTypes.STRING, allowNull: true },       // changed from FLOAT
    closingBalance: { type: DataTypes.STRING, allowNull: true },  // changed from FLOAT
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PosOfTransferOfServicecard;
