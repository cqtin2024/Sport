const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const dbPath = path.join(__dirname, 'data', 'db.json');

app.get('/api/data', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Lỗi đọc dữ liệu' });
    res.json(JSON.parse(data));
  });
});

app.post('/api/data', (req, res) => {
  fs.writeFile(dbPath, JSON.stringify(req.body, null, 2), 'utf8', err => {
    if (err) return res.status(500).json({ error: 'Lỗi ghi dữ liệu' });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy tại cổng ${PORT}`));
