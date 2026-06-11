// ========== ANALYTICS PAGE ==========
let analyticsTab = 'weight';

function renderAnalytics() {
    destroyAllCharts();   // ← Important: prevents memory leaks

    const page = document.getElementById('page-analytics');
    const weighIns = Storage.getWeighIns();
    const gymLogs = Storage.getGymLogs();
    const settings = Storage.getSettings();
    const prs = Storage.getPRs();

    page.innerHTML = `
        <div class="section-title">📈 Analytics</div>
        
        <div class="tab-bar">
            <button class="tab-btn ${analyticsTab === 'weight' ? 'active' : ''}" onclick="analyticsTab='weight'; renderAnalytics()">Weight</button>
            <button class="tab-btn ${analyticsTab === 'weekly' ? 'active' : ''}" onclick="analyticsTab='weekly'; renderAnalytics()">Weekly</button>
            <button class="tab-btn ${analyticsTab === 'gym' ? 'active' : ''}" onclick="analyticsTab='gym'; renderAnalytics()">Exercises</button>
            <button class="tab-btn ${analyticsTab === 'prs' ? 'active' : ''}" onclick="analyticsTab='prs'; renderAnalytics()">PRs</button>
            <button class="tab-btn ${analyticsTab === 'stats' ? 'active' : ''}" onclick="analyticsTab='stats'; renderAnalytics()">Stats</button>
        </div>

        <div id="analyticsContent"></div>
    `;

    const content = document.getElementById('analyticsContent');
    
    switch (analyticsTab) {
        case 'weight': renderWeightAnalytics(content, weighIns, settings); break;
        case 'weekly': renderWeeklyProgress(content, weighIns, gymLogs); break;
        case 'gym': renderExerciseProgressAnalytics(content, gymLogs); break;
        case 'prs': renderPRAnalytics(content, prs); break;
        case 'stats': renderStatsAnalytics(content, weighIns, gymLogs, settings); break;
    }
}

// ========== WEIGHT ==========
function renderWeightAnalytics(container, weighIns, settings) {
    if (weighIns.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No weigh-ins logged yet.</p></div>`;
        return;
    }

    const labels = weighIns.map(w => formatDateShort(w.date));
    const weights = weighIns.map(w => w.weight);

    container.innerHTML = `
        <div class="section-title">📉 Weight Trend</div>
        <canvas id="weightChart" style="max-height:340px;"></canvas>
        <div class="card" style="margin-top:16px">
            <div class="list-item"><div>Current Weight</div><div><strong>${weights[weights.length-1]} lbs</strong></div></div>
            <div class="list-item"><div>Total Loss</div><div class="text-green"><strong>${(settings.startWeight - weights[weights.length-1]).toFixed(1)} lbs</strong></div></div>
        </div>
    `;

    setTimeout(() => {
        const chart = new Chart(document.getElementById('weightChart'), {
            type: 'line',
            data: { 
                labels, 
                datasets: [{ 
                    label: 'Body Weight (lbs)', 
                    data: weights, 
                    borderColor: '#00d4ff', 
                    tension: 0.3, 
                    borderWidth: 3 
                }] 
            },
            options: chartOptions(Math.min(...weights)-10, Math.max(...weights)+5)
        });
        window.currentCharts.push(chart);
    }, 100);
}

// ========== WEEKLY ==========
function renderWeeklyProgress(container, weighIns, gymLogs) {
    container.innerHTML = `
        <div class="section-title">📅 Weekly Progress</div>
        <canvas id="weeklyWorkoutChart" style="max-height:260px; margin-bottom:20px;"></canvas>
        <canvas id="weeklyWeightChart" style="max-height:260px;"></canvas>
    `;

    setTimeout(() => {
        renderWeeklyWorkoutChart(gymLogs);
        renderWeeklyWeightChart(weighIns);
    }, 100);
}

function renderWeeklyWorkoutChart(gymLogs) {
    if (gymLogs.length === 0) return;
    const data = getWeeklyWorkoutData(gymLogs);
    const workoutChart = new Chart(document.getElementById('weeklyWorkoutChart'), {
        type: 'bar',
        data: { 
            labels: data.labels, 
            datasets: [{ 
                label: 'Workouts', 
                data: data.counts, 
                backgroundColor: '#00d4ff', 
                borderRadius: 6 
            }] 
        },
        options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }}
    });
    window.currentCharts.push(workoutChart);
}

function renderWeeklyWeightChart(weighIns) {
    if (weighIns.length < 2) return;
    const data = getWeeklyWeightChange(weighIns);
    const weightChart = new Chart(document.getElementById('weeklyWeightChart'), {
        type: 'line',
        data: { 
            labels: data.labels, 
            datasets: [{ 
                label: 'Weekly Change (lbs)', 
                data: data.changes, 
                borderColor: '#22c55e', 
                tension: 0.3 
            }] 
        },
        options: chartOptions(-6, 6)
    });
    window.currentCharts.push(weightChart);
}

// ========== EXERCISES ==========
function renderExerciseProgressAnalytics(container, gymLogs) {
    if (gymLogs.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No workouts logged yet.</p></div>`;
        return;
    }

    container.innerHTML = `<div class="section-title">💪 Exercise Progress</div><div id="exProgress"></div>`;

    const program = getTrainingProgram();
    let html = '';

    program.days.forEach(day => {
        const dayLogs = gymLogs.filter(l => l.dayId === day.id);
        if (dayLogs.length < 2) return;

        const hist = typeof buildExerciseHistory === 'function' ? buildExerciseHistory(dayLogs, day) : {};
        Object.keys(hist).forEach(name => {
            const entries = hist[name];
            if (entries.length < 2) return;
            const trend = typeof getExerciseTrend === 'function' ? getExerciseTrend(entries) : { direction: 'neutral', change: 0, bestWeight: 0 };
            html += `
                <div class="card" style="margin-bottom:12px">
                    <div style="display:flex;justify-content:space-between;">
                        <strong>${name}</strong>
                        <span class="${trend.direction === 'up' ? 'text-green' : 'text-red'}">${trend.direction === 'up' ? '↑' : '↓'} ${trend.change}%</span>
                    </div>
                    <small style="color:var(--text-muted)">${entries.length} sessions • Best: ${trend.bestWeight} lbs</small>
                </div>`;
        });
    });

    document.getElementById('exProgress').innerHTML = html || '<p style="text-align:center;padding:40px;color:var(--text-muted);">Not enough data yet.</p>';
}

// ========== PRS ==========
function renderPRAnalytics(container, prs) {
    const entries = Object.entries(prs);
    if (entries.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No PRs recorded yet.</p></div>`;
        return;
    }

    let html = `<div class="section-title">🏆 Personal Records</div><div class="card">`;
    entries.sort((a,b) => b[1].bestWeight - a[1].bestWeight).forEach(([name, data]) => {
        html += `<div class="list-item"><div>${name}</div><div class="text-green">${data.bestWeight} lbs</div></div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
}

// ========== STATS ==========
function renderStatsAnalytics(container, weighIns, gymLogs, settings) {
    const totalWeighIns = weighIns.length;
    const totalWorkouts = gymLogs.length;
    const prs = Storage.getPRs();

    let bestWeek = '—', worstWeek = '—', maxStreak = 0, lossWeeks = 0;

    if (weighIns.length >= 2) {
        let best = 0, worst = 0, streak = 0;
        for (let i = 1; i < weighIns.length; i++) {
            const diff = weighIns[i].weight - weighIns[i-1].weight;
            if (diff < best) { 
                best = diff; 
                bestWeek = `${best.toFixed(1)} lbs (${formatDateShort(weighIns[i].date)})`; 
            }
            if (diff > worst) { 
                worst = diff; 
                worstWeek = `+${worst.toFixed(1)} lbs (${formatDateShort(weighIns[i].date)})`; 
            }
            if (diff <= 0) { 
                streak++; 
                lossWeeks++; 
                maxStreak = Math.max(maxStreak, streak); 
            } else streak = 0;
        }
    }

    const consistency = totalWeighIns > 0 ? 
        Math.round((lossWeeks / Math.max(1, totalWeighIns - 1)) * 100) : 0;

    let workoutsPerWeek = '—';
    if (gymLogs.length > 0) {
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const recentLogs = gymLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= thirtyDaysAgo && logDate <= now;
        });

        const recentCount = recentLogs.length;
        if (recentCount > 0) {
            const dates = recentLogs.map(l => new Date(l.date));
            const firstDate = new Date(Math.min(...dates));
            const spanDays = (now - firstDate) / (24 * 60 * 60 * 1000) + 1;
            const spanWeeks = Math.max(spanDays / 7, 0.5);
            workoutsPerWeek = (recentCount / spanWeeks).toFixed(1);
        }
    }

    container.innerHTML = `
        <div class="section-title">📊 Summary Statistics</div>
        <div class="stat-grid">
            <div class="stat-box accent"><div class="stat-value">${totalWeighIns}</div><div class="stat-label">Weigh-Ins</div></div>
            <div class="stat-box green"><div class="stat-value">${totalWorkouts}</div><div class="stat-label">Workouts</div></div>
            <div class="stat-box orange"><div class="stat-value">${consistency}%</div><div class="stat-label">Consistency Rate</div></div>
            <div class="stat-box blue"><div class="stat-value">${maxStreak}</div><div class="stat-label">Best Streak</div></div>
        </div>
        <div class="card">
            <div class="list-item"><div>Best Week</div><div class="text-green">${bestWeek}</div></div>
            <div class="list-item"><div>Worst Week</div><div class="text-red">${worstWeek}</div></div>
            <div class="list-item"><div>Avg Workouts/Week (30d)</div><div>${workoutsPerWeek}</div></div>
            <div class="list-item"><div>PRs Set</div><div>${Object.keys(prs).length}</div></div>
        </div>
    `;
}

function chartOptions(sugMin, sugMax) {
    return {
        responsive: true, maintainAspectRatio: true, aspectRatio: 1.8,
        plugins: { legend: { position: 'top', labels: { color: '#a0aec0', font: { size: 11 } } } },
        scales: {
            x: { ticks: { color: '#718096' }, grid: { color: 'rgba(45,55,72,0.5)' } },
            y: { ticks: { color: '#718096' }, grid: { color: 'rgba(45,55,72,0.5)' }, suggestedMin: sugMin, suggestedMax: sugMax }
        }
    };
}

// Weekly Helpers
function getWeeklyWorkoutData(gymLogs) {
    const weeks = {};
    gymLogs.forEach(log => {
        const date = new Date(log.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const key = weekStart.toISOString().split('T')[0];
        weeks[key] = (weeks[key] || 0) + 1;
    });
    const sorted = Object.keys(weeks).sort();
    return { 
        labels: sorted.map(k => formatDateShort(k)), 
        counts: sorted.map(k => weeks[k]) 
    };
}

function getWeeklyWeightChange(weighIns) {
    const weekly = {};
    weighIns.forEach(w => {
        const date = new Date(w.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const key = weekStart.toISOString().split('T')[0];
        if (!weekly[key]) weekly[key] = [];
        weekly[key].push(w.weight);
    });
    const sortedKeys = Object.keys(weekly).sort();
    const changes = [];
    for (let i = 1; i < sortedKeys.length; i++) {
        const prevAvg = weekly[sortedKeys[i-1]].reduce((a,b)=>a+b,0) / weekly[sortedKeys[i-1]].length;
        const currAvg = weekly[sortedKeys[i]].reduce((a,b)=>a+b,0) / weekly[sortedKeys[i]].length;
        changes.push(currAvg - prevAvg);
    }
    return { 
        labels: sortedKeys.slice(1).map(k => formatDateShort(k)), 
        changes 
    };
}

function buildExerciseHistory(dayLogs, day) {
    const history = {};
    dayLogs.forEach(log => {
        (log.exercises || []).forEach(ex => {
            if (!history[ex.name]) history[ex.name] = [];
            const weights = ex.weights || (ex.weight ? Array((ex.sets || []).length || 1).fill(ex.weight) : []);
            const bestWeight = Math.max(0, ...weights.map(w => parseFloat(w) || 0));
            const sets = ex.sets || [];
            if (bestWeight > 0 || sets.some(s => s > 0)) history[ex.name].push({ date: log.date, bestWeight, sets, weights });
        });
    });
    return history;
}

function getExerciseTrend(entries) {
    if (!entries || entries.length < 2) return { direction: 'neutral', change: 0, bestWeight: 0 };
    const sorted = [...entries].sort((a,b) => new Date(a.date) - new Date(b.date));
    const latest = sorted[sorted.length - 1].bestWeight || 0;
    const prev = sorted[sorted.length - 2].bestWeight || 0;
    const bestWeight = Math.max(...sorted.map(e => e.bestWeight || 0));
    if (latest > prev) return { direction: 'up', change: (((latest - prev) / Math.max(prev,1)) * 100).toFixed(1), bestWeight };
    if (latest < prev) return { direction: 'down', change: (((prev - latest) / Math.max(prev,1)) * 100).toFixed(1), bestWeight };
    return { direction: 'neutral', change: 0, bestWeight };
}
