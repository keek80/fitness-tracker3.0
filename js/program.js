// ========== TRAINING PROGRAM PAGE ==========
let programDayView = null;

function renderProgram() {
    const page = document.getElementById('page-program');
    const program = getTrainingProgram();
    
    // Default to first day if current doesn't exist
    if (!programDayView || !program.days.find(d => d.id === programDayView)) {
        programDayView = program.days.length > 0 ? program.days[0].id : null;
    }

    if (!programDayView || program.days.length === 0) {
        page.innerHTML = `
            <div class="section-title">🏋️ Training Program</div>
            <div class="empty-state">
                <div class="empty-icon">🏋️</div>
                <p>No training days set up yet.</p>
                <button class="btn btn-primary btn-sm" style="margin-top:12px; width:auto" onclick="navigate('exercises')">🛠️ Set Up Exercises</button>
            </div>
        `;
        return;
    }

    page.innerHTML = `
        <div class="section-title flex-between">
            <span>🏋️ Training Program</span>
            <button class="btn btn-secondary btn-sm" style="width:auto; padding:6px 12px; font-size:12px" onclick="navigate('exercises')">🛠️ Edit</button>
        </div>
        
        <div class="card">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px">
                <div><strong>Split:</strong> Push / Pull / Legs</div>
                <div><strong>Days/Week:</strong> ${program.days.length}</div>
                <div><strong>Session:</strong> 45-60 min</div>
                <div><strong>Focus:</strong> Strength & Fat Loss</div>
                <div><strong>Rest Days:</strong> Sat & Sun</div>
                <div><strong>Core:</strong> Machine finisher each day</div>
            </div>
        </div>

        <div class="day-selector">
            ${program.days.map(d => `
                <button class="day-btn ${d.id === programDayView ? 'active' : ''}" 
                        style="${d.id === programDayView ? 'background:' + d.color + '; border-color:' + d.color + '; color:' + (isLightColor(d.color) ? '#000' : '#fff') : ''}"
                        onclick="programDayView='${d.id}'; renderProgram()">
                    ${d.dayOfWeek}<br><span style="font-size:10px">${d.name}</span>
                </button>
            `).join('')}
        </div>

        ${renderProgramDay(program.days.find(d => d.id === programDayView))}

        <div class="section-title">🔥 Warm-Up Protocol (Every Session)</div>
        <div class="card" style="font-size:13px; color:var(--text-secondary); line-height:1.8">
            <div>1️⃣ 5 min walk on treadmill or bike (low intensity)</div>
            <div>2️⃣ Arm circles (10 forward, 10 backward)</div>
            <div>3️⃣ Bodyweight squats to box/chair × 10</div>
            <div>4️⃣ Band pull-aparts × 15</div>
            <div>5️⃣ Cat-cow stretches × 10</div>
            <div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--border); color:var(--accent-blue)">🦵 <strong>Leg Day extra:</strong> Add leg swings (10/side) and hip circles (10/side) before starting</div>
        </div>

        <div class="section-title">📈 Progressive Overload Rules</div>
        <div class="card" style="font-size:13px; color:var(--text-secondary); line-height:1.6">
            <div style="padding:4px 0">1️⃣ Hit all sets at <strong>TOP of rep range</strong> with good form → <strong>increase weight by 5 lbs</strong></div>
            <div style="padding:4px 0">2️⃣ Log weights and reps every session</div>
            <div style="padding:4px 0">3️⃣ Miss reps? Stay at same weight until you hit all sets/reps</div>
            <div style="padding:4px 0">4️⃣ <strong>Deload every 6-8 weeks</strong> (reduce weight by 40%, same reps)</div>
        </div>

        <div class="section-title">🔄 Phase Progression</div>
        ${PHASES.map(p => `
            <div class="card" style="padding:12px">
                <div class="flex-between">
                    <div>
                        <div style="font-size:14px; font-weight:600">Phase ${p.phase}</div>
                        <div style="font-size:12px; color:var(--text-muted)">${p.range}</div>
                    </div>
                    <div style="font-size:12px; color:var(--text-secondary); text-align:right; max-width:55%">${p.focus}</div>
                </div>
            </div>
        `).join('')}

        <div class="section-title">🧘 Rest Days (Saturday & Sunday)</div>
        <div class="card" style="font-size:13px; color:var(--text-secondary); line-height:1.8">
            <div>🚶 Walking: 20-30 min (low intensity)</div>
            <div>🧘 Stretching or yoga: 10-15 min</div>
            <div>🧽 Foam rolling: 5-10 min (quads, IT band, upper back)</div>
            <div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--border); color:var(--accent-orange)">💡 Wednesday is a heavy leg day — prioritize sleep and nutrition that night for recovery</div>
        </div>

        <div class="section-title">🎯 Core Finisher Rules</div>
        <div class="card" style="font-size:13px; color:var(--text-secondary); line-height:1.8">
            <div>1️⃣ Core finishers are the <strong>last exercise</strong> every session</div>
            <div>2️⃣ For <strong>unilateral exercises</strong> (Wood Chop, Oblique Crunch): always work <strong>both sides</strong> each session</div>
            <div>3️⃣ Always start with your <strong>weaker side first</strong> — that side sets the rep limit</div>
            <div>4️⃣ Complete all reps on one side, switch, then rest — <strong>do not rest between sides</strong></div>
            <div>5️⃣ <strong>Never skip</strong> the core finisher — it's 3 sets and under 5 minutes</div>
        </div>
    `;
}

function renderProgramDay(day) {
    if (!day) return '<div class="card"><p class="text-muted">No day selected.</p></div>';
    
    return `
        <div class="card" style="border-left:3px solid ${day.color}">
            <div style="font-size:15px; font-weight:600; color:${day.color}; margin-bottom:12px">
                ${day.name} — ${day.dayOfWeek}
            </div>
            ${day.exercises.length === 0 ? 
                '<div style="font-size:13px; color:var(--text-muted); padding:8px 0">No exercises yet. <a href="#" onclick="navigate(\'exercises\')" style="color:var(--accent-blue)">Add some →</a></div>' :
                day.exercises.map(ex => `
                    <div style="padding:8px 0; border-bottom:1px solid var(--border)">
                        <div style="font-size:14px; font-weight:500">${ex.name}</div>
                        <div style="display:flex; gap:12px; font-size:12px; color:var(--text-secondary); margin-top:3px">
                            <span>📊 ${ex.sets} × ${ex.repsTarget}</span>
                            <span>⏱ ${ex.rest}</span>
                        </div>
                        ${ex.notes ? `<div style="font-size:12px; color:var(--accent-orange); margin-top:2px">💡 ${ex.notes}</div>` : ''}
                    </div>
                `).join('')
            }
        </div>
    `;
}
