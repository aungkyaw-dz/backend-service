// https://sequelize.org/master/manual/model-basics.html
import { DataTypes } from 'sequelize';
import sequelize from '../config/db_connection';

const UsersModel = sequelize.define(
  'users',
  {
    userId: {
      type: DataTypes.STRING(300),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    walletAddress: {
        type: DataTypes.STRING(300),
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    email: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: Math.random().toString(36).slice(2, 7),
    },
    role_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    profileImage: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    isVerify: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    freeNFT: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: 'users',
    modelName: 'Users',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'walletAddress'],
      },
    ],
  }
);

export default UsersModel;
