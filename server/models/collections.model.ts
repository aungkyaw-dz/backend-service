import { DataTypes } from 'sequelize';
import sequelize from '../config/db_connection';
import UsersModel from './users.model';

const CollectionsModel = sequelize.define(
  'collections',
  {
    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creator: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    logo: { type: DataTypes.STRING(), allowNull: true },
    banner: { type: DataTypes.STRING(), allowNull: true },
    featured: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    favourite: { type: DataTypes.BOOLEAN, defaultValue: 0 },
  },
  {
    tableName: 'collections',
  }
);
CollectionsModel.belongsTo(UsersModel, {
  as: 'Creator',
  foreignKey: 'creator'
})
UsersModel.hasMany(CollectionsModel, {
  as: 'collections',
  foreignKey: 'creator'
});
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
// CollectionsModel.sync({ alter: true });

export default CollectionsModel;
