// ========== INITIAL GOALS SETUP PAGE ==========

function renderGoals() {
    const page = document.getElementById('page-goals');
    if (!page) return;

    const today = new Date().toISOString().split('T')[0];

    page.innerHTML = `
        <div class="onboarding-wrap">
            <div class="onboarding-hero">
                <div class="onboarding-icon">🎯</div>
                <div class="onboarding-title">Welcome! Let's Set Your Goals</div>
                <div class="onboarding-subtitle">
                    Tell us where you are and where you want to be.<br>
                    You can adjust these anytime in Settings.
                </div>
            </div>

            <div class="onboarding-steps">
                <div class="onboarding-step active">1. Goals</div>
                <div class="onboarding-step-divider">›</div>
                <div class="onboarding-step">2. Dashboard</div>
            </div>

            <div class="card" style="margin-top:16px">
                <div class="form-group">
                    <label class="form-label">📅 Start Date</label>
                    <input type="date" id="goalsStartDate" class="form-input" value="${today}"
                           onchange="updateGoalsSummary()">
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
                    <div class="form-group">
                        <label class="form-label">⚖️ Current Weight</label>
                        <div style="position:relative">
                            <input type="number" id="goalsStartWeight" class="form-input"
                                   placeholder="e.g. 385" step="0.1" inputmode="decimal"
                                   oninput="updateGoalsSummary()" style="padding-right:36px">
                            <span class="form-unit">lbs</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">🏁 Goal Weight</label>
                        <div style="position:relative">
                            <input type="number" id="goalsGoalWeight" class="form-input"
                                   placeholder="e.g. 250" step="0.1" inputmode="decimal"
                                   oninput="updateGoalsSummary()" style="padding-right:36px">
                            <span class="form-unit">lbs</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">📉 Weekly Loss Target</label>
                    <select id="goalsWeeklyTarget" class="form-input" onchange="updateGoalsSummary()">
                        <option value="0.5">0.5 lbs/week — Conservative</option>
                        <option value="1.0">1.0 lbs/week — Steady</option>
                        <option value="1.5" selected>1.5 lbs/week — Moderate</option>
                        <option value="2.0">2.0 lbs/week — Aggressive</option>
                        <option value="2.5">2.5 lbs/week — Very Aggressive</option>
                    </select>
                    <div class="form-hint">Most people sustain 1–2 lbs/week long-term</div>
                </div>

                <!-- Live summary card -->
                <div id="goalsSummary" class="goals-summary hidden"></div>

                <button class="btn btn-primary" id="goalsSaveBtn" onclick="saveInitialGoals()" style="margin-top:8px">
                    🚀 Start My Transformation
                </button>
            </div>

            <div style="text-align:center; margin-top:14px; font-size:11px; color:var(--text-muted); line-height:1.6">
                🔒 Your goals are saved securely to your personal cloud account
            </div>
        </div>
    `;

    // Trigger summary update on load if defaults are filled
    updateGoalsSummary();
}

// ===== LIVE SUMMARY =====
function updateGoalsSummary() {
    const startWeight  = parseFloat(document.getElementById('goalsStartWeight')?.value);
    const goalWeight   = parseFloat(document.getElementById('goalsGoalWeight')?.value);
    const weeklyTarget = parseFloat(document.getElementById('goalsWeeklyTarget')?.value);
    const summary      = document.getElementById('goalsSummary');
    if (!summary) return;

    if (!startWeight || !goalWeight || !weeklyTarget || startWeight <= goalWeight || startWeight < 50 || goalWeight < 50) {
        summary.classList.add('hidden');
        return;
    }

    const lbsToLose = (startWeight - goalWeight).toFixed(1);
    const weeks     = Math.ceil((startWeight - goalWeight) / weeklyTarget);
    const months    = (weeks / 4.33).toFixed(1);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (weeks * 7));
    const endStr = endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const pace = weeklyTarget >= 2 ? '🔥 Aggressive' : weeklyTarget >= 1.5 ? '💪 Moderate' : weeklyTarget >= 1 ? '✅ Steady' : '🐢 Conservative';

    summary.classList.remove('hidden');
    summary.innerHTML = `
        <div class="goals-summary-title">📊 Your Transformation Plan</div>
        <div class="goals-summary-grid">
            <div class="goals-summary-item">
                <div class="goals-summary-value">${lbsToLose}</div>
                <div class="goals-summary-label">lbs to lose</div>
            </div>
            <div class="goals-summary-item">
                <div class="goals-summary-value">${weeks}</div>
                <div class="goals-summary-label">weeks</div>
            </div>
            <div class="goals-summary-item">
                <div class="goals-summary-value">${months}</div>
                <div class="goals-summary-label">months</div>
            </div>
        </div>
        <div class="goals-summary-footer">
            ${pace} pace · Target: <strong>${endStr}</strong>
        </div>
    `;
}

// ===== SAVE GOALS =====
async function saveInitialGoals() {
    const startDate    = document.getElementById('goalsStartDate')?.value;
    const startWeight  = parseFloat(document.getElementById('goalsStartWeight')?.value);
    const goalWeight   = parseFloat(document.getElementById('goalsGoalWeight')?.value);
    const weeklyTarget = parseFloat(document.getElementById('goalsWeeklyTarget')?.value);

    // Validation
    if (!startDate)                       return showToast('Please set a start date', 'error');
    if (!startWeight || startWeight < 50) return showToast('Please enter a valid current weight', 'error');
    if (!goalWeight  || goalWeight  < 50) return showToast('Please enter a valid goal weight', 'error');
    if (startWeight <= goalWeight)        return showToast('Current weight must be greater than goal weight', 'error');

    const btn = document.getElementById('goalsSaveBtn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Saving...'; }

    try {
        const settings = {
            startDate,
            startWeight,
            goalWeight,
            weeklyTarget,
            units:         'lbs',
            setupComplete: true
        };

        // 1. Save to localStorage immediately (instant UI)
        Storage.saveSettings(settings);

        // 2. Push to Supabase cloud
        await SupabaseDB.upsertSettings(settings);

        showToast('✅ Goals saved! Welcome to your journey! 🎉');

        // Short delay so user sees the toast, then go to dashboard
        setTimeout(() => navigate('dashboard'), 900);

    } catch (e) {
        console.error('Error saving goals:', e);
        showToast('❌ Failed to save. Please check your connection and try again.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = '🚀 Start My Transformation'; }
    }
}
