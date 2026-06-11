// ========== DASHBOARD PAGE ==========
function renderDashboard() {
    const page = document.getElementById('page-dashboard');
    const weighIns = Storage.getWeighIns();
    const gymLogs = Storage.getGymLogs();
    const settings = Storage.getSettings();
    const program = getTrainingProgram();
    
    const latest = weighIns.length > 0 ? weighIns[weighIns.length - 1] : null;
    const currentWeight = latest ? latest.weight : settings.startWeight;
    const totalLost = settings.startWeight - currentWeight;
    const progressPct = Math.min(100, (totalLost / (settings.startWeight - settings.goalWeight)) * 100);
    const weeksIn = latest ? Storage.getWeekNumber(latest.date) : 0;
    const projectedNow = Storage.getProjectedWeight(weeksIn);
    const vsProjNum = currentWeight - projectedNow;
    const vsProj = vsProjNum <= 0 ? `${Math.abs(vsProjNum).toFixed(1)} ahead` : `${vsProjNum.toFixed(1)} behind`;
    const vsProjClass = vsProjNum <= 0 ? 'text-green' : 'text-red';

    // Avg weekly loss
    let avgWeekly = 0;
    if (weighIns.length >= 2) {
        const first = weighIns[0];
        const last = weighIns[weighIns.length - 1];
        const weeks = Math.max(1, Storage.getWeekNumber(last.date) - Storage.getWeekNumber(first.date));
        avgWeekly = (first.weight - last.weight) / weeks;
    }

    // Weeks remaining estimate
    const remaining = avgWeekly > 0 ? Math.ceil((currentWeight - settings.goalWeight) / avgWeekly) : '—';

    // Current phase
    let currentPhase = PHASES[0];
    for (const phase of PHASES) {
        const [high] = phase.range.split('-').map(s => parseInt(s));
        if (currentWeight <= high) currentPhase = phase;
    }

    // Weekly change
    let weeklyChange = '—';
    let weeklyChangeClass = '';
    if (weighIns.length >= 2) {
        const diff = weighIns[weighIns.length - 1].weight - weighIns[weighIns.length - 2].weight;
        weeklyChange = (diff > 0 ? '+' : '') + diff.toFixed(1);
        weeklyChangeClass = diff <= 0 ? 'text-green' : 'text-red';
    }

    // Gym session count this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentSessions = gymLogs.filter(l => new Date(l.date) >= oneWeekAgo).length;
    const totalDays = program.days.length;

    // ===== TODAY'S WORKOUT DETECTION =====
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
    const todaysWorkoutDay = program.days.find(d => d.dayOfWeek === todayDayOfWeek);
    const todayAlreadyLogged = todaysWorkoutDay ? gymLogs.some(l => l.date === todayStr && l.dayId === todaysWorkoutDay.id) : false;

    // Build today's workout card
    let todayCard = '';
    if (todaysWorkoutDay) {
        if (todayAlreadyLogged) {
            todayCard = `
                <div class="card" style="border-left: 3px solid var(--accent-green); padding: 12px 14px;">
                    <div class="flex-between">
                        <div>
                            <div style="font-size:12px; color:var(--accent-green); font-weight:600">✅ TODAY'S WORKOUT COMPLETE</div>
                            <div style="font-size:15px; font-weight:700; margin-top:4px">${todaysWorkoutDay.name}</div>
                            <div style="font-size:12px; color:var(--text-muted)">${todayDayOfWeek} — ${todaysWorkoutDay.exercises.length} exercises</div>
                        </div>
                        <div style="font-size:32px">💪</div>
                    </div>
                </div>
            `;
        } else {
            todayCard = `
                <div class="card today-workout-card" style="border-left: 3px solid ${todaysWorkoutDay.color}; padding: 12px 14px; cursor:pointer" onclick="navigate('gym')">
                    <div class="flex-between">
                        <div>
                            <div style="font-size:12px; color:${todaysWorkoutDay.color}; font-weight:600">📅 TODAY'S WORKOUT</div>
                            <div style="font-size:15px; font-weight:700; margin-top:4px">${todaysWorkoutDay.name}</div>
                            <div style="font-size:12px; color:var(--text-muted)">${todayDayOfWeek} — ${todaysWorkoutDay.exercises.length} exercises</div>
                        </div>
                        <div style="font-size:32px">🏋️</div>
                    </div>
                    <div style="font-size:12px; color:var(--accent-blue); margin-top:8px; text-align:center">Tap to start logging →</div>
                </div>
            `;
        }
    } else {
        todayCard = `
            <div class="card" style="border-left: 3px solid var(--text-muted); padding: 12px 14px;">
                <div class="flex-between">
                    <div>
                        <div style="font-size:12px; color:var(--text-muted); font-weight:600">😴 REST DAY</div>
                        <div style="font-size:14px; font-weight:600; margin-top:4px">${todayDayOfWeek}</div>
                        <div style="font-size:12px; color:var(--text-muted)">Active recovery: 20-30 min walk, stretching, foam rolling</div>
                    </div>
                    <div style="font-size:32px">🧘</div>
                </div>
            </div>
        `;
    }

    // Gym button label based on today's schedule
    const gymBtnLabel = todaysWorkoutDay && !todayAlreadyLogged
        ? `💪 Start ${todaysWorkoutDay.name.split(' ')[0]} ${todaysWorkoutDay.name.split(' ')[1] || ''}`
        : '💪 Log Workout';

    page.innerHTML = `
        <div class="section-title">📊 Progress Overview</div>
        
        <div class="card">
            <div class="flex-between mb-8">
                <span class="text-muted" style="font-size:12px">Goal: ${settings.startWeight} → ${settings.goalWeight} lbs</span>
                <span style="font-size:13px; font-weight:600">${progressPct.toFixed(1)}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${progressPct}%"></div>
            </div>
            <div class="flex-between mt-16" style="font-size:12px; color:var(--text-muted)">
                <span>${totalLost.toFixed(1)} lbs lost</span>
                <span>${(settings.startWeight - settings.goalWeight - totalLost).toFixed(1)} lbs to go</span>
            </div>
        </div>

        <div class="stat-grid">
            <div class="stat-box accent">
                <div class="stat-value">${currentWeight}</div>
                <div class="stat-label">Current (lbs)</div>
            </div>
            <div class="stat-box green">
                <div class="stat-value">${totalLost.toFixed(1)}</div>
                <div class="stat-label">Total Lost</div>
            </div>
            <div class="stat-box orange">
                <div class="stat-value ${weeklyChangeClass}">${weeklyChange}</div>
                <div class="stat-label">Last Week</div>
            </div>
            <div class="stat-box blue">
                <div class="stat-value ${vsProjClass}" style="font-size:16px">${vsProj}</div>
                <div class="stat-label">vs. Projected</div>
            </div>
        </div>

        <div class="stat-grid">
            <div class="stat-box">
                <div class="stat-value" style="font-size:18px">${avgWeekly > 0 ? avgWeekly.toFixed(1) : '—'}</div>
                <div class="stat-label">Avg lbs/week</div>
            </div>
            <div class="stat-box">
                <div class="stat-value" style="font-size:18px">${remaining}</div>
                <div class="stat-label">Weeks to goal</div>
            </div>
            <div class="stat-box purple">
                <div class="stat-value">${recentSessions}/${totalDays}</div>
                <div class="stat-label">Sessions This Wk</div>
            </div>
            <div class="stat-box">
                <div class="stat-value" style="font-size:14px">Phase ${currentPhase.phase}</div>
                <div class="stat-label">Training Phase</div>
            </div>
        </div>

        <div class="section-title">🏋️ Today's Schedule</div>
        ${todayCard}

        <div class="section-title">🎯 Milestones</div>
        <div class="card">
            ${MILESTONES.map(m => {
                const reached = currentWeight <= m.weight;
                return `<div class="list-item">
                    <div class="list-item-left">
                        <div class="list-item-title">${reached ? '✅' : '⬜'} ${m.name}</div>
                        <div class="list-item-sub">Month ${m.month}</div>
                    </div>
                    <div class="list-item-right">
                        <div class="list-item-value" style="font-size:14px">${m.weight} lbs</div>
                    </div>
                </div>`;
            }).join('')}
        </div>

        <div class="section-title">📋 Quick Actions</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
            <button class="btn btn-primary" onclick="navigate('weighin')">⚖️ Log Weight</button>
            <button class="btn btn-success" onclick="navigate('gym')">${gymBtnLabel}</button>
        </div>

        <div class="section-title">💡 Today's Tip</div>
        <div class="card" style="border-left: 3px solid var(--accent-orange)">
            <p style="font-size:13px; color:var(--text-secondary); line-height:1.5" id="dailyTip"></p>
        </div>
    `;

    // Rotating tips
    const tips = [
        "Weigh yourself at the same time each week — morning, after bathroom, before eating — for consistent readings.",
        "When you hit all reps at the top of the range with good form, increase weight by 5 lbs next session.",
        "Protein at 41% of total calories is excellent for muscle preservation during fat loss.",
        "Consider adding ½ cup black beans to a burrito for +8g protein and +7g fiber.",
        "Recalculate macros every 30-40 lbs lost to keep progress moving.",
        "Drink at least 1 gallon of water per day — hydration affects scale weight and performance.",
        "Sleep 7-9 hours — poor sleep increases cortisol and water retention, stalling the scale.",
        "Deload every 6-8 weeks: reduce weight by 40%, same reps, to allow recovery.",
        "Swap ground turkey for salmon in one meal 2x/week to get Omega-3s naturally.",
        "Pre-roll burritos and freeze — microwave 2-3 min for instant meals."
    ];
    const tipEl = document.getElementById('dailyTip');
    if (tipEl) tipEl.textContent = tips[new Date().getDay() % tips.length];
}
