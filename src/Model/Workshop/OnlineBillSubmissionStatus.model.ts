import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const OnlineBillSubmissionStatus = sequelize.define(
  "OnlineBillSubmissionStatus",
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
    billType: { type: DataTypes.STRING, allowNull: true },
    online: { type: DataTypes.STRING, allowNull: true },
    offline: { type: DataTypes.STRING, allowNull: true },
    total: { type: DataTypes.STRING, allowNull: true },
    percentage: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = OnlineBillSubmissionStatus;


