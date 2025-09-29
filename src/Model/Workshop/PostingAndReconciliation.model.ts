import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const PostingAndReconciliation = sequelize.define(
  "PostingAndReconciliation",
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
    suspenseHeads: { type: DataTypes.STRING, allowNull: true },
    positionasperLHAR: { type: DataTypes.STRING, allowNull: true },
    openingBalance: { type: DataTypes.STRING, allowNull: true },  // changed
    accretion: { type: DataTypes.STRING, allowNull: true },       // changed
    clearance: { type: DataTypes.STRING, allowNull: true },       // changed
    closingBalance: { type: DataTypes.STRING, allowNull: true },  // changed
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PostingAndReconciliation;
