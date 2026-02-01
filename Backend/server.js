import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/sequelize.js' ;
import AuthorizedDevicesRouter from './Authorized/router/AuthorizedDevicesRouter.js'; 

dotenv.config();  // Ortam değişkenlerini .env dosyasından yükle
 

const app = express();
const PORT = process.env.PORT || 5000; // Portu .env'den al, yoksa 5000 kullan

//    Middleware'ler 
app.use(cors()); // Frontend bağlantısı için CORS middleware'ini ekle
app.use(express.json()); // Gelen JSON isteklerini parse etmek için

// --- Veritabanı Bağlantısı ve Sunucuyu Başlatma ---
async function startServer() {
    try {
        // Sequelize ile veritabanı bağlantısını test et
        await sequelize.authenticate();
        console.log('Database connection established successfully (Sequelize)');
        // '/api/devices' ile başlayan tüm istekleri AuthorizedDevicesRouter'a yönlendir
        app.use('/api/devices', AuthorizedDevicesRouter);
        // Sunucuyu başlat
        app.listen(PORT, () => { 
            console.log(`Backend server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Database connection error while starting the application:', error);
        process.exit(1); // Bağlantı hatasında uygulamayı sonlandır
    }
}

startServer(); // Sunucuyu başlatma fonksiyonunu çağır