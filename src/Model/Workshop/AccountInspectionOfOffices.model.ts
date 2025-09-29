import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const AccountInspectionOfOffices = sequelize.define(
  "AccountInspectionOfOffices",
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
    doneBy: { type: DataTypes.STRING, allowNull: true },
    targetfortheYear: { type: DataTypes.STRING, allowNull: true },
    duefortheMonth: { type: DataTypes.STRING, allowNull: true },
    dueUptotheMonth: { type: DataTypes.STRING, allowNull: true },
    donefortheMonth: { type: DataTypes.STRING, allowNull: true },
    doneUptotheMonth: { type: DataTypes.STRING, allowNull: true },
    arrearsfortheMonth: { type: DataTypes.STRING, allowNull: true },
    arrearsUptotheMonth: { type: DataTypes.STRING, allowNull: true },
    officeInspected: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AccountInspectionOfOffices;
