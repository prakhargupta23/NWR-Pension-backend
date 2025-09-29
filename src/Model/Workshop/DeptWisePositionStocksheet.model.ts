import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const DeptWisePositionStocksheet = sequelize.define(
  "DeptWisePositionStocksheet",
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
    SNo: { type: DataTypes.STRING, allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    openingBalance: { type: DataTypes.STRING, allowNull: true },
    accretionUpToMonth: { type: DataTypes.STRING, allowNull: true },
    clearanceUpToMonth: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DeptWisePositionStocksheet;
