// System Clock
setInterval(() => {
    const d = new Date();
    document.getElementById('clock').innerText = d.toLocaleTimeString();
}, 1000);

// Splash Exit
window.onload = () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.transform = "translateY(-100%)";
        initSystem();
    }, 4000);
};

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('page-title').innerText = "SYSTEM_" + id.toUpperCase();
    toggleSidebar();
}

function initSystem() {
    updateStats();
    renderLogs();
    const goal = localStorage.getItem('dailyGoal');
    if(goal) document.getElementById('goal-display').innerText = "CURRENT OBJECTIVE: " + goal;
}

function saveLog() {
    const sub = document.getElementById('sub').value;
    const dur = document.getElementById('duration').value;
    const type = document.getElementById('task-type').value;

    if(sub && dur) {
        let logs = JSON.parse(localStorage.getItem('neuralLogs')) || [];
        logs.push({ sub, dur: parseFloat(dur), type, time: new Date().toLocaleString() });
        localStorage.setItem('neuralLogs', JSON.stringify(logs));
        updateStats();
        renderLogs();
        alert("DATA COMMITTED TO NVRAM");
    }
}

function updateStats() {
    const logs = JSON.parse(localStorage.getItem('neuralLogs')) || [];
    const total = logs.reduce((s, l) => s + l.dur, 0);
    document.getElementById('total-hrs').innerText = total.toFixed(1);
    
    // Simple Rank Logic
    let rank = "RECRUIT";
    if(total > 50) rank = "SOLDIER";
    if(total > 150) rank = "COMMANDER";
    document.getElementById('rank').innerText = rank;
}

function renderLogs() {
    const logs = JSON.parse(localStorage.getItem('neuralLogs')) || [];
    document.getElementById('history-list').innerHTML = logs.map(l => `
        <div class="neon-card" style="margin-bottom:10px; text-align:left;">
            <h4>${l.sub} <small>(${l.type})</small></h4>
            <p style="color:#ff0000">${l.dur} HRS - ${l.time}</p>
        </div>
    `).reverse().join('');
}

// Timer Logic
let timer;
function startTimer() {
    let sec = 25 * 60;
    clearInterval(timer);
    timer = setInterval(() => {
        sec--;
        let m = Math.floor(sec/60);
        let s = sec%60;
        document.getElementById('timer-val').innerText = `${m}:${s<10?'0':''}${s}`;
        if(sec <= 0) clearInterval(timer);
    }, 1000);
}

function resetSystem() {
    if(confirm("AUTHORIZE DATA WIPE?")) {
        localStorage.clear();
        location.reload();
    }
}
