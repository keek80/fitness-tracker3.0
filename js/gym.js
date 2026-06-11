// ========== GYM LOG PAGE ==========
let currentGymDay = null;
let currentGymDate = new Date().toISOString().split('T')[0];
let autoSelectedDay = false;

const DAY_NAME_MAP = {
    0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
    4: 'Thursday', 5: 'Friday', 6: 'Saturday'
};

function getTodaysWorkout(dateStr) {
    const program = getTrainingProgram();
    if (!program.days || program.days.length === 0) return null;
    const date = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = DAY_NAME_MAP[date.getDay()];
    const match = program.days.find(d => d.dayOfWeek === dayOfWeek);
    return match ? match.id : null;
}

function isToday(dateStr) {
    return dateStr === new Date().toISOString().split('T')[0];
}

function renderGym() {
    const page = document.getElementById('page-gym');
    const program = getTrainingProgram();

    const todaysWorkout = getTodaysWorkout(currentGymDate);

    if (!currentGymDay || !program.days.find(d => d.id === currentGymDay)) {
        if (todaysWorkout) {
            currentGymDay = todaysWorkout;
            autoSelectedDay = true;
        } else {
            currentGymDay = program.days.length > 0 ? program.days[0].id : null;
            autoSelectedDay = false;
        }
    }

    if (!currentGymDay || program.days.length === 0) {
        page.innerHTML = `
            <div class="section-title">💪 Gym Log</div>
            <div class="empty-state">
                <div class="empty-icon">🏋️</div>
                <p>No training days set up yet.</p>
                <button class="btn btn-primary btn-sm" style="margin-top:12px; width:auto" onclick="navigate('exercises')">🛠️ Set Up Exercises</button>
            </div>
        `;
        return;
    }

    const day = program.days.find(d => d.id === currentGymDay);
    const existingLog = Storage.getGymLogs().find(l => l.date === currentGymDate && l.dayId === currentGymDay);
    const previousLog = Storage.getPreviousGymLog(currentGymDay, currentGymDate);
    const prs = Storage.getPRs();

    const selectedDate = new Date(currentGymDate + 'T12:00:00');
    const selectedDayName = DAY_NAME_MAP[selectedDate.getDay()];
    const isTodayDate = isToday(currentGymDate);
    const isScheduledDay = todaysWorkout === currentGymDay;
    let scheduleIndicator = '';

    if (isTodayDate && isScheduledDay && todaysWorkout) {
        scheduleIndicator = `
            <div class="today-workout-banner">
                <span class="today-badge">📅 TODAY</span>
                <span>It's ${selectedDayName} — <strong>${day.name}</strong> is scheduled!</span>
            </div>`;
    } else if (isTodayDate && !todaysWorkout) {
        scheduleIndicator = `
            <div class="rest-day-banner">
                <span class="rest-badge">😴 REST DAY</span>
                <span>It's ${selectedDayName} — no workout scheduled. But you can still log one!</span>
            </div>`;
    } else if (!isTodayDate) {
        scheduleIndicator = `
            <div class="past-date-banner">
                <span>📆 Logging for <strong>${formatDate(currentGymDate)}</strong> (${selectedDayName})</span>
            </div>`;
    }

    page.innerHTML = `
        <div class="section-title">💪 Log Workout</div>
        
        <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" id="gymDate" class="form-input" value="${currentGymDate}" onchange="onGymDateChange(this.value)">
        </div>

        ${scheduleIndicator}

        <div class="day-selector">
            ${program.days.map(d => {
                const isActive = d.id === currentGymDay;
                const isScheduled = d.id === todaysWorkout && isTodayDate;
                return `
                <button class="day-btn ${isActive ? 'active' : ''} ${isScheduled && !isActive ? 'scheduled' : ''}" 
                        style="${isActive ? 'background:' + d.color + '; border-color:' + d.color + '; color:' + (isLightColor(d.color) ? '#000' : '#fff') : ''}"
                        onclick="selectGymDay('${d.id}')">
                    ${d.dayOfWeek.slice(0,3)}<br><span style="font-size:10px">${d.name}</span>
                    ${isScheduled ? '<span class="day-today-dot"></span>' : ''}
                </button>`;
            }).join('')}
        </div>

        <div class="card" style="border-left: 3px solid ${day.color}; padding: 12px 14px;">
            <div style="font-size:14px; font-weight:600; color:${day.color}">${day.name}</div>
            <div style="font-size:12px; color:var(--text-muted)">${day.dayOfWeek} — ${day.exercises.length} exercises</div>
        </div>

        <div id="exerciseList">
            ${day.exercises.map((ex, i) => {
                const saved = existingLog?.exercises?.[i];
                const prev = previousLog?.exercises?.find(e => e.name === ex.name);
                const pr = prs[ex.name];

                const prBadge = pr ? `<span class="pr-badge">🏆 PR: ${pr.bestWeight} lbs</span>` : '';

                const prevWeights = prev
                    ? (prev.weights || (prev.weight ? Array((prev.sets || []).length || ex.sets).fill(prev.weight) : []))
                    : [];
                const prevSets = prev ? (prev.sets || []) : [];

                const isAutoLoaded = !saved && prevWeights.some(w => w > 0);

                const savedWeights = saved?.weights
                    ? saved.weights
                    : saved?.weight
                        ? Array(ex.sets).fill(saved.weight)
                        : Array.from({length: ex.sets}, (_, si) =>
                            prevWeights[si] !== undefined && prevWeights[si] > 0 ? prevWeights[si] : '');

                const savedReps = saved?.sets || Array(ex.sets).fill('');

                let prevDisplay = '';
                if (prev) {
                    const prevParts = prevSets.map((r, si) => {
                        const w = prevWeights[si] || 0;
                        return r > 0 ? `${w > 0 ? w + 'lb×' : ''}${r}` : null;
                    }).filter(Boolean);
                    if (prevParts.length > 0) {
                        const prevMaxW = prevWeights.length > 0 ? Math.max(...prevWeights.filter(w => w > 0)) : 0;
                        prevDisplay = `
                            <div class="prev-session-info">
                                <span class="prev-label">Last session:</span>
                                <span class="prev-sets">${prevParts.join(' · ')}</span>
                                ${prevMaxW > 0 && saved ? `<button class="fill-btn" onclick="fillFromPrevious(${i}, [${prevWeights.join(',')}], [${prevSets.join(',')}])" title="Load previous session">⬆️ Load</button>` : ''}
                            </div>`;
                    }
                }

                return `
                <div class="exercise-card">
                    <div class="exercise-name">${ex.name} ${prBadge}</div>
                    <div class="exercise-target">${ex.sets} × ${ex.repsTarget} · Rest ${ex.rest}${ex.notes ? ' · ' + ex.notes : ''}</div>
                    ${prevDisplay}

                    ${isAutoLoaded ? `
                    <div style="font-size:11px; color:var(--accent-orange); margin-bottom:8px; padding:5px 10px;
                                background:rgba(255,170,0,0.08); border-radius:6px;
                                border:1px solid rgba(255,170,0,0.25);">
                        ⬆️ Weights pre-loaded from last session — enter your reps below
                    </div>` : ''}

                    <div class="per-set-grid">
                        <div class="per-set-header">
                            <span>SET</span>
                            <span>WEIGHT (lbs)</span>
                            <span>REPS</span>
                        </div>
                        ${Array.from({length: ex.sets}, (_, s) => `
                            <div class="per-set-row">
                                <div class="set-num-badge">${s + 1}</div>
                                <input type="number"
                                       class="set-input gym-weight"
                                       data-idx="${i}" data-set="${s}"
                                       value="${savedWeights[s] || ''}"
                                       placeholder="lbs"
                                       inputmode="decimal"
                                       onchange="onWeightChange(${i}, ${s})">
                                <input type="number"
                                       class="set-input gym-reps"
                                       data-idx="${i}" data-set="${s}"
                                       value="${savedReps[s] || ''}"
                                       placeholder="${ex.repsTarget.split('-')[0] || '—'}"
                                       inputmode="numeric">
                            </div>
                        `).join('')}
                    </div>

                    <button class="fill-down-btn" onclick="fillWeightsDown(${i}, ${ex.sets})" title="Copy Set 1 weight to all sets">
                        ↓ Apply Set 1 weight to all sets
                    </button>

                    <div class="notes-row">
                        <input type="text" class="notes-input gym-notes" data-idx="${i}"
                               value="${saved?.notes || ''}" placeholder="Notes for this exercise...">
                    </div>
                </div>`;
            }).join('')}
        </div>

        <div style="margin-top:12px">
            <button class="btn btn-secondary" onclick="viewGymHistory()">📋 History</button>
        </div>

        <!-- Floating Save Workout Button (bottom-left) -->
        <div style="position:fixed; bottom:85px; left:16px; z-index:99999; display:flex; flex-direction:column; align-items:center; gap:8px;">
            <div id="save-workout-btn" onclick="saveGymLog()"
                 style="background:#00d68f; color:#000; width:82px; height:82px; border-radius:50%;
                        display:flex; align-items:center; justify-content:center; flex-direction:column;
                        box-shadow:0 10px 35px rgba(0,214,143,0.85);
                        cursor:pointer; border:6px solid white; user-select:none;
                        transition: transform 0.2s;">
                <span style="font-size:28px; line-height:1;">💾</span>
                <span style="font-size:11px; font-weight:900; line-height:1.5;">Save</span>
            </div>
        </div>

        <!-- Simple Rest Timer - Side-by-Side Layout (No Overlap) -->
        <div style="position:fixed; bottom:85px; right:16px; z-index:99999; display:flex; flex-direction:column; align-items:center; gap:8px;">
            <select id="timer-preset" onchange="changeTimerDuration(parseInt(this.value))" 
                    style="background:#1e2937; color:white; border:2px solid #475569; border-radius:9999px; 
                           padding:8px 16px; font-size:14px; min-width:130px; z-index:100001;">
                <option value="30">30s</option>
                <option value="60" selected>60s</option>
                <option value="90">90s</option>
                <option value="120">2min</option>
                <option value="180">3min</option>
            </select>
            
            <div id="rest-timer" onclick="toggleRestTimer()" 
                 style="background:#00d4ff; color:#000; width:82px; height:82px; border-radius:50%; 
                        display:flex; align-items:center; justify-content:center; font-size:32px; 
                        font-weight:900; box-shadow:0 10px 35px rgba(0,212,255,0.85); 
                        cursor:pointer; border:6px solid white; user-select:none;">
                60
            </div>
        </div>
    `;
}

// ========== WEIGHT HELPERS ==========

function onWeightChange(exIdx, setIdx) {
    if (setIdx !== 0) return;
    const set1Input = document.querySelector(`.gym-weight[data-idx="${exIdx}"][data-set="0"]`);
    if (!set1Input || !set1Input.value) return;

    let s = 1;
    while (true) {
        const el = document.querySelector(`.gym-weight[data-idx="${exIdx}"][data-set="${s}"]`);
        if (!el) break;
        if (!el.value) el.value = set1Input.value;
        s++;
    }
}

function fillWeightsDown(exIdx, numSets) {
    const set1 = document.querySelector(`.gym-weight[data-idx="${exIdx}"][data-set="0"]`);
    if (!set1 || !set1.value) {
        showToast('Enter Set 1 weight first', 'error');
        return;
    }
    for (let s = 1; s < numSets; s++) {
        const el = document.querySelector(`.gym-weight[data-idx="${exIdx}"][data-set="${s}"]`);
        if (el) el.value = set1.value;
    }
}

function fillFromPrevious(exIdx, prevWeights, prevReps) {
    prevWeights.forEach((w, s) => {
        const wEl = document.querySelector(`.gym-weight[data-idx="${exIdx}"][data-set="${s}"]`);
        if (wEl && w > 0) wEl.value = w;
    });
    prevReps.forEach((r, s) => {
        const rEl = document.querySelector(`.gym-reps[data-idx="${exIdx}"][data-set="${s}"]`);
        if (rEl && r > 0) rEl.value = r;
    });
    showToast('⬆️ Previous session loaded');
}

// ========== DATE / DAY CHANGE ==========

function onGymDateChange(newDate) {
    currentGymDate = newDate;
    const todaysWorkout = getTodaysWorkout(newDate);
    if (todaysWorkout) {
        currentGymDay = todaysWorkout;
        autoSelectedDay = true;
    } else {
        autoSelectedDay = false;
    }
    renderGym();
}

function selectGymDay(dayId) {
    currentGymDay = dayId;
    autoSelectedDay = false;
    renderGym();
}

// ========== SAVE ==========

function saveGymLog() {
    const program = getTrainingProgram();
    const day = program.days.find(d => d.id === currentGymDay);
    if (!day) return;

    const allPRsBefore = Storage.getPRs();
    const prevBestWeights = {};
    day.exercises.forEach(ex => {
        prevBestWeights[ex.name] = allPRsBefore[ex.name]?.bestWeight || 0;
    });

    const exercises = day.exercises.map((ex, i) => {
        const notesEl = document.querySelector(`.gym-notes[data-idx="${i}"]`);
        const notes = notesEl?.value || '';

        const weights = [];
        const sets = [];
        for (let s = 0; s < ex.sets; s++) {
            const wEl = document.querySelector(`.gym-weight[data-idx="${i}"][data-set="${s}"]`);
            const rEl = document.querySelector(`.gym-reps[data-idx="${i}"][data-set="${s}"]`);
            weights.push(parseFloat(wEl?.value) || 0);
            sets.push(parseInt(rEl?.value) || 0);
        }

        return { name: ex.name, weights, sets, notes };
    });

    const log = {
        date: currentGymDate,
        dayId: currentGymDay,
        dayName: day.name,
        exercises,
        bodyWeight: Storage.getWeighIns().slice(-1)[0]?.weight || null
    };

    Storage.saveGymLog(log);

    const allPRsAfter = Storage.getPRs();
    const newPRExercises = day.exercises.filter(ex => {
        const newBest = allPRsAfter[ex.name]?.bestWeight || 0;
        return newBest > prevBestWeights[ex.name];
    });

    if (newPRExercises.length === 1) {
        const ex = newPRExercises[0];
        showToast(`🏆 New PR! ${ex.name}: ${allPRsAfter[ex.name].bestWeight} lbs`);
    } else if (newPRExercises.length > 1) {
        showToast(`🏆 ${newPRExercises.length} New PRs this session! 💪`);
    } else {
        showToast('✅ Workout saved!');
    }

    renderGym();
    if (document.getElementById('page-dashboard')) {
        try { renderDashboard(); } catch(e) {}
    }
}

// ========== HISTORY ==========

function viewGymHistory() {
    const section = document.getElementById('gymHistorySection');
    const list = document.getElementById('gymHistoryList');
    section.classList.toggle('hidden');

    const logs = Storage.getGymLogsForDay(currentGymDay);
    if (logs.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>No sessions logged yet for this day.</p></div>';
        return;
    }

    list.innerHTML = logs.slice(0, 8).map(log => `
        <div class="card" style="padding:12px">
            <div class="flex-between mb-8">
                <span style="font-size:13px; font-weight:600">${formatDate(log.date)}</span>
                <button class="delete-btn" onclick="deleteGymLog('${log.date}','${log.dayId}')" title="Delete">🗑️</button>
            </div>
            ${log.exercises.map(ex => {
                const weightsArr = ex.weights || (ex.weight ? Array((ex.sets||[]).length).fill(ex.weight) : []);
                const hasData = weightsArr.some(w => w > 0) || (ex.sets||[]).some(s => s > 0);
                if (!hasData) return '';

                const setParts = (ex.sets || []).map((r, s) => {
                    const w = weightsArr[s] || 0;
                    return r > 0 ? `${w > 0 ? w + '×' : ''}${r}` : null;
                }).filter(Boolean);

                return `<div style="font-size:12px; color:var(--text-secondary); padding:3px 0">
                    <strong>${ex.name}</strong>:
                    <span style="color:var(--text-primary)">${setParts.join(' · ')}</span>
                    ${ex.notes ? `<span style="color:var(--text-muted)"> — ${ex.notes}</span>` : ''}
                </div>`;
            }).join('')}
        </div>
    `).join('');
}

function deleteGymLog(date, dayId) {
    if (confirm('Delete this workout log?')) {
        Storage.deleteGymLog(date, dayId);
        showToast('Workout deleted');
        renderGym();
    }
}

// ========== HELPERS ==========

function isLightColor(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// ========== SIMPLE REST TIMER ==========
let restTimerInterval = null;
let restTimeLeft = 60;
let currentTimerPreset = 60;

function playRingingSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const startTime = audioContext.currentTime;
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(620, startTime);
        gain.gain.setValueAtTime(0.7, startTime);
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        
        oscillator.frequency.setValueAtTime(880, startTime + 0.1);
        oscillator.frequency.setValueAtTime(620, startTime + 0.4);
        
        setTimeout(() => {
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.9);
            oscillator.stop(audioContext.currentTime + 1.3);
        }, 900);
    } catch (e) {
        if (navigator.vibrate) navigator.vibrate([120, 80, 180, 80, 120]);
    }
}

function startRestTimer() {
    if (restTimerInterval) clearInterval(restTimerInterval);
    
    const timerEl = document.getElementById('rest-timer');
    if (!timerEl) return;

    timerEl.classList.remove('paused');
    timerEl.textContent = restTimeLeft;

    restTimerInterval = setInterval(() => {
        restTimeLeft--;
        if (timerEl) timerEl.textContent = restTimeLeft;

        if (restTimeLeft <= 0) {
            clearInterval(restTimerInterval);
            restTimerInterval = null;
            
            if (timerEl) {
                timerEl.textContent = '✓';
                timerEl.classList.add('paused');
            }
            
            playRingingSound();
            
            setTimeout(() => {
                if (timerEl) {
                    restTimeLeft = currentTimerPreset;
                    timerEl.textContent = restTimeLeft;
                    timerEl.classList.remove('paused');
                }
            }, 2200);
        }
    }, 1000);
}

function toggleRestTimer() {
    const timerEl = document.getElementById('rest-timer');
    if (!timerEl) return;

    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
        timerEl.classList.add('paused');
        timerEl.textContent = '⏸';
    } else {
        if (restTimeLeft <= 0) restTimeLeft = currentTimerPreset;
        startRestTimer();
    }
}

function changeTimerDuration(seconds) {
    currentTimerPreset = seconds;
    restTimeLeft = seconds;
    
    const timerEl = document.getElementById('rest-timer');
    if (timerEl) timerEl.textContent = seconds;

    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
        startRestTimer();
    }
}

function cleanupWorkoutTimer() {
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
    }
}
