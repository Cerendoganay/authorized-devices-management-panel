import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js"; 

const AuthorizedDevices = sequelize.define( // 'sequelize.define' kullanarak modeli tanımla
    "authorized_devices", 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        device_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        mac_address: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, 
        },
        ip_address: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        device_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'active',
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            // oluşturulma zamanını ekle : now olarak ayarla
        },
    },
    {
        timestamps: false, // 'createdAt' ve 'updatedAt' alanları manuel yönetildiği için 'false' 
        tableName: "authorized_devices", 
    }
);

export default AuthorizedDevices; // Modeli diğer dosyalarda kullanmak için dışarı aktrarır