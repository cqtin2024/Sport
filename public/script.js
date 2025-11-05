let clubData = {};
let editingId = null;

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

async function loadData() {
  const res = await fetch('/api/data');
  clubData = await res.json();
  renderMembers();
}

function renderMembers() {
  const table = document.getElementById('membersTable');
  table.innerHTML = "<tr><th>Tên</th><th>Vai trò</th><th>Tham gia</th></tr>" +
    clubData.members.map(m => 
      `<tr onclick="openMemberModal(${m.id})"><td>${m.name}</td><td>${m.role}</td><td>${m.joined}</td></tr>`
    ).join('');
}

function openMemberModal(id = null) {
  const modal = document.getElementById('memberModal');
  modal.style.display = 'flex';
  const m = id ? clubData.members.find(x => x.id === id) : {};
  editingId = id;
  document.getElementById('modalTitle').innerText = id ? "Chỉnh sửa thành viên" : "Thêm thành viên mới";
  document.getElementById('m_name').value = m?.name || "";
  document.getElementById('m_role').value = m?.role || "";
  document.getElementById('m_joined').value = m?.joined || "";
  document.getElementById('m_email').value = m?.email || "";
  document.getElementById('m_phone').value = m?.phone || "";
  document.getElementById('m_level').value = m?.level || "";
  document.getElementById('m_sessions').value = m?.sessions || "";
  document.getElementById('m_note').value = m?.note || "";
}

function closeModal() {
  document.getElementById('memberModal').style.display = 'none';
}

async function saveMember() {
  const newM = {
    id: editingId || Date.now(),
    name: document.getElementById('m_name').value,
    role: document.getElementById('m_role').value,
    joined: document.getElementById('m_joined').value,
    email: document.getElementById('m_email').value,
    phone: document.getElementById('m_phone').value,
    level: document.getElementById('m_level').value,
    sessions: parseInt(document.getElementById('m_sessions').value || 0),
    note: document.getElementById('m_note').value
  };
  if (editingId) {
    const i = clubData.members.findIndex(x => x.id === editingId);
    clubData.members[i] = newM;
  } else {
    clubData.members.push(newM);
  }
  await saveData();
  renderMembers();
  closeModal();
}

async function deleteMember() {
  if (!editingId) return closeModal();
  if (!confirm("Xác nhận xóa thành viên này?")) return;
  clubData.members = clubData.members.filter(m => m.id !== editingId);
  await saveData();
  renderMembers();
  closeModal();
}

async function saveData() {
  await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clubData)
  });
}

loadData();
