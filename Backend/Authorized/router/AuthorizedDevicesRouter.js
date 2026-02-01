import express from 'express';

// Controller dosyasındaki fonksiyonları import et.

import {
    getAllAuthorizedDevices,   // GET /api/devices (Tüm cihazları listele)
    createAuthorizedDevice,    // POST (Yeni cihaz ekle)
    updateAuthorizedDevice,    // PUT (Cihaz güncelle)
    deleteAuthorizedDevice,    // 
    getAuthorizedDeviceById,   // GET /api/devices/:id (ID'ye göre tek cihaz getir)
    searchAuthorizedDevices,   // GET /api/devices/search (Kriterlere göre cihaz ara)
} from '../controller/AuthorizedDevicesController.js';



const router = express.Router();

router.get('/', getAllAuthorizedDevices);

router.get('/:id', getAuthorizedDeviceById); // İstenilen İD'ye sahip cihazı getir

router.get('/search', searchAuthorizedDevices); //İstenilen kritere uyan cihaz/ları getir

router.post('/', createAuthorizedDevice);

router.delete('/:id', deleteAuthorizedDevice); // Tek cihazı sil

router.put('/:id', updateAuthorizedDevice);


export default router; //router objesini dışa aktarmayı sağlar.
