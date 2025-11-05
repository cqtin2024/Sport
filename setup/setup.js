document.getElementById('setupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const log = document.getElementById('log');
  const appendLog = (text) => {
    log.style.display = 'block';
    log.textContent += text + '\n';
  };

  const ghToken = document.getElementById('ghToken').value.trim();
  const ghRepo = document.getElementById('ghRepo').value.trim();
  const fbUrl = document.getElementById('fbUrl').value.trim();
  const fbSecret = document.getElementById('fbSecret').value.trim();
  const vercelProject = document.getElementById('vercelProject').value.trim();

  appendLog('🚀 Bắt đầu thiết lập...');

  // 1️⃣ Khởi tạo db.json mẫu
  const initData = {
    members: [],
    schedule: [],
    tournaments: [],
    finance: { records: [], balance: 0 }
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(initData, null, 2))));

  try {
    appendLog('📤 Tạo file data/db.json trong GitHub repo...');
    const res = await fetch(`https://api.github.com/repos/${ghRepo}/contents/data/db.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ghToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Initialize club data',
        content: encoded
      })
    });
    if (!res.ok) throw new Error('GitHub API lỗi: ' + res.statusText);
    appendLog('✅ Đã tạo db.json thành công.');

    // 2️⃣ Lưu cấu hình local
    localStorage.setItem('sportclub_config', JSON.stringify({
      ghRepo, fbUrl, fbSecret, vercelProject
    }));
    appendLog('💾 Đã lưu cấu hình tạm thời.');

    // 3️⃣ Hướng dẫn bước thêm ENV vào Vercel
    appendLog('\n👉 Tiếp theo: Vào Vercel → Project Settings → Environment Variables');
    appendLog('Thêm các biến sau:');
    appendLog(`FIREBASE_URL = ${fbUrl}`);
    appendLog(`FIREBASE_SECRET = ${fbSecret}`);
    appendLog(`GITHUB_TOKEN = [token bạn nhập]`);
    appendLog(`GITHUB_REPO = ${ghRepo}`);
    appendLog('\nHoàn tất rồi bấm "Redeploy" project.');

    appendLog('\n🎉 Thiết lập cơ bản hoàn tất!');
  } catch (err) {
    appendLog('❌ Lỗi: ' + err.message);
  }
});
