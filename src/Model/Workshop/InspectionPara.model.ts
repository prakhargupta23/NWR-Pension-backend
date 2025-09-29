import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const InspectionPara = sequelize.define(
  "InspectionPara",
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
    typeOfPara: { type: DataTypes.STRING, allowNull: true },
    totalNoOfParas: { type: DataTypes.STRING, allowNull: true },
    noOfParasOutstandingatStart: { type: DataTypes.STRING, allowNull: true },
    noOfParasClosed: { type: DataTypes.STRING, allowNull: true },
    noOfParasOutstandingatEnd: { type: DataTypes.STRING, allowNull: true },
    accretionitem: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = InspectionPara;
