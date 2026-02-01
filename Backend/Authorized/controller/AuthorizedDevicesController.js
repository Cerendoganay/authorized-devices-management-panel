import AuthorizedDevicesModel from "../model/AuthorizedDevicesModel.js";

// --- Tüm cihazları listele (GET) ---

export const getAllAuthorizedDevices = async (req, res) => {
    try {
        const devices = await AuthorizedDevicesModel.findAll();
        res.status(200).json(devices); // Başarılıysa 200 OK durum kodu ve cihaz listesini JSON formatında gönder.
    } catch (error) {
        console.error('Error listing devices: ', error.message); 
        res.status(500).json({ message: 'Server error: Failed to list devices.' }); // İstemciye 500 Internal Server Error (Sunucu Hatası) dön.
    }
};

// --- ID'ye göre istenilen cihazı getir (GET) ---

export const getAuthorizedDeviceById = async (req, res) => {
  const { id } = req.params;

  try {
    const device = await AuthorizedDevicesModel.findOne({
      where: { id }
    });

    if (!device) {
      return res.status(404).json({
        message: 'The device with the specified ID was not found.'
      });
    }

    return res.status(200).json(device);
  } catch (error) {
    console.error(`Error while fetching device (ID: ${id}):`, error.message);
    return res.status(500).json({
      message: 'Server error: Failed to fetch device information.'
    });
  }
};


// --- Yeni cihaz ekle (POST) ---

export const createAuthorizedDevice = async (req, res) => {
    // İstek gövdesinden (body) cihaz bilgilerini alırız.
    const { device_name, mac_address, ip_address, username, device_type, status } = req.body;

    // MAC adresi ve kullanıcı adı zorunlu alanlardır.
    if (!mac_address || !username) {
        return res.status(400).json({ message: 'MAC address and username are required.' });
    }

    try {
        const newDevice = await AuthorizedDevicesModel.create({
            device_name,
            mac_address,
            ip_address,
            username,
            device_type,
            status // Eğer frontend'den gelmezse modeldeki defaultValue kullanılır.
        });
        res.status(201).json(newDevice); // Başarılıysa 201 Created durum kodu ve yeni oluşturulan cihazı JSON olarak gönder.
    } catch (error) {
        console.error('Error while adding new device:', error.message);
        // Eğer girilen MAC adresinden zaten varsa:
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'This MAC address is already registered.' }); // 409 Conflict döner.
        }
        // Diğer hatalar için genel 500 Sunucu Hatası döneriz.
        res.status(500).json({ message: 'Server error: Failed to add device.' });
    }
};

// --- Cihaz bilgilerini güncelle (PUT) ---

export const updateAuthorizedDevice = async (req, res) => {
    const { device_name, mac_address, ip_address, username, device_type, status } = req.body;
    const { id } = req.params;

    try {
        const [updatedRowsCount, updatedDevices] = await AuthorizedDevicesModel.update(
            {
                device_name,
                mac_address,
                ip_address,
                username,
                device_type,
                status,
            },
            {
                where: { id },
                // returning: true, // Güncellenen kaydı dizi olarak döndür
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: "The device with the specified ID was not found." });
        }

        // Başarılı güncelleme durumunda, güncellenen cihaz objesini geri döndürüyoruz.
        res.status(200).json(updatedDevices[0]);
    } catch (error) {
        console.error('Error while updating device:', error.message);
        // MAC Adresi unique olduğu için var olan bir MAC adresi ile aynı adres verilirse hata döndürür.
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'This MAC address is already registered or used on another device.' });
        }
        res.status(500).json({ message: 'Server error: Failed to update device.' });
    }
};

// --- Cihaz silme (DELETE) - Sadece ID ile silme ---
export const deleteAuthorizedDevice = async (req, res) => {
    const { id } = req.params; // URL'den ID parametresini alıyoruz

    try {
        if (!id) {
            // Aslında router'da '/:id' olduğu için bu duruma düşmeyiz ama savunma amaçlı bırakılabilir.
            return res.status(400).json({ message: 'Device ID is required for deletion' });
        }

        const deletedRowCount = await AuthorizedDevicesModel.destroy({
            where: { id: id } // Sadece belirli bir ID'ye sahip kaydı sil
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'No device found to delete.' });
        }

        res.status(200).json({ message: 'The device was erased successfully.' });
    } catch (error) {
        console.error('Error while deleting the device: ', error.message);
        res.status(500).json({ message: 'Server error: Failed to delete device.' });
    }
};

// --- IP'ye göre cihaz arama (istenilen bilgiye göre GET komutu) ---

export const searchAuthorizedDevices = async (req, res) => {
    const { device_name, mac_address, ip_address, username, device_type, status } = req.query;

    const whereClause = {};
    if (device_name) whereClause.device_name = device_name;
    if (mac_address) whereClause.mac_address = mac_address;
    if (ip_address) whereClause.ip_address = ip_address; 
    if (username) whereClause.username = username;
    if (device_type) whereClause.device_type = device_type;
    if (status) whereClause.status = status;

    try {
        const devices = await AuthorizedDevicesModel.findAll({
            where: whereClause,
        });

        res.status(200).json(devices);
    } catch (error) {
        console.error('Error while searching devices:', error.message);
        res.status(500).json({ message: 'Server error: Failed to search devices.' });
    }
};