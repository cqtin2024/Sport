const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const dbPath = path.join(__dirname, 'data', 'db.json');

// Đọc dữ liệu
app.get('/api/data', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send({ error: 'Lỗi đọc file dữ liệu' });
    res.send(JSON.parse(data));
  });
});

// Ghi dữ liệu (cập nhật toàn bộ)
app.post('/api/data', (req, res) => {
  fs.writeFile(dbPath, JSON.stringify(req.body, null, 2), 'utf8', err => {
    if (err) return res.status(500).send({ error: 'Lỗi ghi file dữ liệu' });
    res.send({ success: true });
  });
});

app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
