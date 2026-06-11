// ========== SETTINGS PAGE ==========
function renderSettings() {
    const page    = document.getElementById('page-settings');
    const settings = Storage.getSettings();
    const weighIns = Storage.getWeighIns();
    const gymLogs  = Storage.getGymLogs();
    const user     = SupabaseAuth.getCurrentUser();
    const isDark   = document.body.classList.contains('dark-mode');

    page.innerHTML = `
        <div class="section-title">⚙️ Settings</div>

        <!-- ACCOUNT -->
        <div class="card" style="border-left:3px solid var(--accent-blue)">
            <div class="card-title mb-12">👤 Account</div>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px">
                <div style="width:44px; height:44px; border-radius:50%; background:var(--accent-blue);
                            display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0">
                    👤
                </div>
                <div>
                    <div style="font-size:14px; font-weight:600">${user?.email || 'Unknown'}</div>
                    <div style="font-size:11px; color:var(--text-muted)">
                        ${weighIns.length} weigh-ins · ${gymLogs.length} workouts · ${Object.keys(Storage.getPRs()).length} PRs
                    </div>
                </div>
            </div>
            <div style="display:grid; gap:8px">
                <button class="btn btn-secondary" onclick="handleSignOut()" style="border-color:var(--accent); color:var(--accent)">
                    🚪 Sign Out
                </button>
            </div>
        </div>

        <!-- APPEARANCE -->
        <div class="section-title">🎨 Appearance</div>
        <div class="card">
            <div class="list-item">
                <div>🌙 Dark Mode</div>
                <label class="switch">
                    <input type="checkbox" id="darkModeToggle" ${isDark ? 'checked' : ''} onchange="toggleDarkMode()">
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <!-- PROFILE / GOALS -->
        <div class="section-title">🎯 Goals</div>
        <div class="card">
            <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="date" id="settStartDate" class="form-input" value="${settings.startDate || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Start Weight (lbs)</label>
                <input type="number" id="settStartWeight" class="form-input" value="${settings.startWeight || ''}" step="0.1">
            </div>
            <div class="form-group">
                <label class="form-label">Goal Weight (lbs)</label>
                <input type="number" id="settGoalWeight" class="form-input" value="${settings.goalWeight || ''}" step="0.1">
            </div>
            <div class="form-group">
                <label class="form-label">Weekly Loss Target (lbs/week)</label>
                <input type="number" id="settWeeklyTarget" class="form-input" value="${settings.weeklyTarget || ''}" step="0.1">
            </div>
            <button class="btn btn-primary" onclick="saveSettingsForm()">💾 Save Settings</button>
        </div>

        <!-- DATA MANAGEMENT -->
        <div class="section-title">💾 Data Management</div>
        <div class="card">
            <div style="display:grid; gap:10px">
                <button class="btn btn-secondary" onclick="exportData()">📤 Export All Data (JSON)</button>
                <button class="btn btn-secondary" onclick="document.getElementById('importFile').click()">📥 Import Data</button>
                <input type="file" id="importFile" accept=".json" style="display:none" onchange="importData(event)">
                <button class="btn btn-danger" onclick="clearAllData()">🗑️ Clear All Local Data</button>
            </div>
        </div>

        <!-- INSTALL + ABOUT -->
        <div class="section-title">📱 Install App</div>
        <div class="card">
            <p style="font-size:13px; color:var(--text-secondary); line-height:1.5">
                Open this app in Chrome/Safari → tap menu → "Add to Home Screen"
            </p>
        </div>
    `;
}

function saveSettingsForm() {
    const settings = {
        startDate:     document.getElementById('settStartDate').value,
        startWeight:   parseFloat(document.getElementById('settStartWeight').value),
        goalWeight:    parseFloat(document.getElementById('settGoalWeight').value),
        weeklyTarget:  parseFloat(document.getElementById('settWeeklyTarget').value),
        units:         'lbs',
        setupComplete: true
    };
    Storage.saveSettings(settings);
    showToast('✅ Settings saved!');
    renderDashboard();
}

function exportData() {
    const json = Storage.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `fat-loss-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📤 Data exported!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const success = Storage.importAll(e.target.result);
        if (success) {
            showToast('📥 Data imported successfully!');
            renderSettings();
            renderDashboard();
        } else {
            showToast('❌ Invalid backup file', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function clearAllData() {
    if (confirm('⚠️ This will delete ALL local data (weigh-ins, workouts, PRs).\n\nNote: This only clears your local cache. Your cloud data in Supabase is NOT deleted.\n\nAre you sure?')) {
        if (confirm('Really clear local cache? The app will re-sync from the cloud on next load.')) {
            Storage.clearAll();
            showToast('Local cache cleared');
            renderSettings();
            renderDashboard();
        }
    }
}

// ========== DARK MODE TOGGLE ==========
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}
