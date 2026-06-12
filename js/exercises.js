// ========== EXERCISE MANAGER PAGE ==========
let editingDayId = null;
let editingExerciseIdx = null;

// Exercise DB picker state
let dbPickerCategory = 'All';
let dbPickerSearch = '';

// ==================== HELPER ====================

/**
 * Escapes a string for safe use inside an HTML attribute value (double-quoted).
 * Prevents broken attributes when names/notes contain " or & or < characters.
 */
function escAttr(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function renderExercises() {
    const page = document.getElementById('page-exercises');
    const program = getTrainingProgram();
    const custom = isCustomProgram();

    page.innerHTML = `
        <div class="section-title">🛠️ Exercise Manager</div>

        ${custom ? `
            <div class="card" style="border-left: 3px solid var(--accent-orange); padding: 12px 14px;">
                <div style="font-size:12px; color:var(--accent-orange)">⚠️ You're using a custom program. Changes are saved automatically.</div>
            </div>
        ` : `
            <div class="card" style="border-left: 3px solid var(--accent-green); padding: 12px 14px;">
                <div style="font-size:12px; color:var(--accent-green)">✅ Using the default 5-day Push/Pull/Legs split. Edit any exercise to create your custom version.</div>
            </div>
        `}

        <div id="exerciseDaysList">
            ${program.days.map((day) => `
                <div class="ex-day-card" style="border-left: 3px solid ${day.color}">
                    <div class="ex-day-header">
                        <div>
                            <div class="ex-day-name" style="color:${day.color}">${escAttr(day.name)}</div>
                            <div class="ex-day-info">${escAttr(day.dayOfWeek)} · ${day.exercises.length} exercises</div>
                        </div>
                        <div class="ex-day-actions">
                            <button class="ex-action-btn" onclick="editDay('${day.id}')" title="Edit Day">✏️</button>
                            <button class="ex-action-btn" onclick="deleteDay('${day.id}')" title="Delete Day">🗑️</button>
                        </div>
                    </div>
                    <div class="ex-exercise-list">
                        ${day.exercises.map((ex, exIdx) => `
                            <div class="ex-exercise-item">
                                <div class="ex-exercise-info">
                                    <div class="ex-exercise-name">${escAttr(ex.name)}</div>
                                    <div class="ex-exercise-detail">${ex.sets} × ${escAttr(ex.repsTarget)} · Rest ${escAttr(ex.rest)}</div>
                                    ${ex.notes ? `<div class="ex-exercise-notes">💡 ${escAttr(ex.notes)}</div>` : ''}
                                </div>
                                <div class="ex-exercise-actions">
                                    ${exIdx > 0 ? `<button class="ex-move-btn" onclick="moveExercise('${day.id}', ${exIdx}, -1)" title="Move Up">⬆️</button>` : '<div style="width:32px"></div>'}
                                    ${exIdx < day.exercises.length - 1 ? `<button class="ex-move-btn" onclick="moveExercise('${day.id}', ${exIdx}, 1)" title="Move Down">⬇️</button>` : '<div style="width:32px"></div>'}
                                    <button class="ex-action-btn" onclick="editExercise('${day.id}', ${exIdx})" title="Edit">✏️</button>
                                    <button class="ex-action-btn" onclick="deleteExercise('${day.id}', ${exIdx})" title="Delete">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm" style="margin-top:8px; width:100%" onclick="addExercise('${day.id}')">
                        ➕ Add Exercise
                    </button>
                </div>
            `).join('')}
        </div>

        <button class="btn btn-success" style="margin-top:16px" onclick="addDay()">
            ➕ Add Training Day
        </button>

        ${custom ? `
            <button class="btn btn-danger" style="margin-top:10px" onclick="resetProgram()">
                🔄 Reset to Default Program
            </button>
        ` : ''}

        <!-- Exercise Form Modal -->
        <div id="exModal" class="ex-modal hidden">
            <div class="ex-modal-overlay" onclick="closeExModal()"></div>
            <div class="ex-modal-content">
                <div class="ex-modal-header">
                    <h3 id="exModalTitle">Edit</h3>
                    <button class="ex-modal-close" onclick="closeExModal()">✕</button>
                </div>
                <div id="exModalBody"></div>
            </div>
        </div>

        <!-- Exercise Database Picker Modal -->
        <div id="exDBPicker" class="ex-db-picker hidden">
            <div class="ex-db-overlay" onclick="closeExercisePicker()"></div>
            <div class="ex-db-content">
                <div class="ex-db-header">
                    <h3>📚 Exercise Database</h3>
                    <button class="ex-modal-close" onclick="closeExercisePicker()">✕</button>
                </div>
                <div class="ex-db-search-wrap">
                    <input type="text" id="dbSearchInput" class="ex-db-search"
                        placeholder="🔍  Search exercises..."
                        oninput="dbPickerSearch=this.value; renderDBList()"
                        autocomplete="off" autocorrect="off" spellcheck="false">
                </div>
                <div class="ex-db-categories" id="dbCategories"></div>
                <div class="ex-db-list" id="dbList"></div>
            </div>
        </div>
    `;
}

// ==================== EXERCISE DATABASE PICKER ====================

function openExercisePicker() {
    // Reset state
    dbPickerSearch = '';
    dbPickerCategory = 'All';

    // FIX (Bug 7): Guard against missing DOM element if picker isn't rendered yet
    const catEl = document.getElementById('dbCategories');
    if (!catEl) {
        console.warn('openExercisePicker: #dbCategories not found in DOM');
        return;
    }

    // Render category chips
    catEl.innerHTML = DB_CATEGORIES.map(cat => `
        <button class="ex-db-chip ${cat === dbPickerCategory ? 'active' : ''}"
                onclick="selectDBCategory('${escAttr(cat)}')">
            ${escAttr(cat)}
        </button>
    `).join('');

    // Clear search
    const searchEl = document.getElementById('dbSearchInput');
    if (searchEl) searchEl.value = '';

    // Render list
    renderDBList();

    // Show picker
    document.getElementById('exDBPicker').classList.remove('hidden');

    // Focus search after a tick
    setTimeout(() => {
        const s = document.getElementById('dbSearchInput');
        if (s) s.focus();
    }, 150);
}

function closeExercisePicker() {
    document.getElementById('exDBPicker').classList.add('hidden');
}

function selectDBCategory(cat) {
    dbPickerCategory = cat;
    // Update chip styles
    document.querySelectorAll('.ex-db-chip').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === cat);
    });
    renderDBList();
}

function renderDBList() {
    const search = (dbPickerSearch || '').toLowerCase().trim();
    const cat = dbPickerCategory;

    let results = EXERCISE_DATABASE;

    // Filter by category
    if (cat !== 'All') {
        results = results.filter(e => e.category === cat);
    }

    // Filter by search
    if (search) {
        results = results.filter(e =>
            e.name.toLowerCase().includes(search) ||
            e.category.toLowerCase().includes(search) ||
            e.equipment.toLowerCase().includes(search)
        );
    }

    const listEl = document.getElementById('dbList');
    if (!listEl) return;

    if (results.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state" style="padding:30px 16px">
                <div class="empty-icon">🔍</div>
                <p>No exercises found.<br>Try a different search or category.</p>
                <button class="btn btn-secondary btn-sm" style="margin-top:12px; width:auto"
                        onclick="useCustomExerciseName()">
                    ✏️ Use "${escAttr(dbPickerSearch)}" as custom name
                </button>
            </div>`;
        return;
    }

    // Group by category if showing All
    let html = '';
    if (cat === 'All') {
        const grouped = {};
        results.forEach(e => {
            if (!grouped[e.category]) grouped[e.category] = [];
            grouped[e.category].push(e);
        });
        Object.keys(grouped).forEach(group => {
            html += `<div class="ex-db-group-label">${escAttr(group)}</div>`;
            html += grouped[group].map(e => renderDBItem(e)).join('');
        });
    } else {
        html = results.map(e => renderDBItem(e)).join('');
    }

    listEl.innerHTML = html;
}

function renderDBItem(ex) {
    const color = EQUIPMENT_COLORS[ex.equipment] || '#718096';

    // FIX (Bug 5): Escape BOTH single AND double quotes so the onclick attribute
    // is never broken by exercise names/notes that contain either quote character.
    const safeName  = ex.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const safeNotes = (ex.notes || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');

    return `
        <button class="ex-db-item" onclick="selectExerciseFromDB('${safeName}', '${safeNotes}')">
            <div class="ex-db-item-name">${escAttr(ex.name)}</div>
            <div class="ex-db-item-meta">
                <span class="ex-db-badge" style="background:${color}22; color:${color}; border:1px solid ${color}44">
                    ${escAttr(ex.equipment)}
                </span>
                ${ex.notes ? `<span class="ex-db-notes">${escAttr(ex.notes)}</span>` : ''}
            </div>
        </button>`;
}

function selectExerciseFromDB(name, notes) {
    // Fill in the form fields
    const nameInput = document.getElementById('exNameInput');
    const notesInput = document.getElementById('exNotesInput');
    if (nameInput) nameInput.value = name;
    if (notesInput && notesInput.value === '') notesInput.value = notes;

    // Close picker and focus the sets field
    closeExercisePicker();
    setTimeout(() => {
        const setsInput = document.getElementById('exSetsInput');
        if (setsInput) setsInput.focus();
    }, 150);

    showToast(`✅ ${name} selected`);
}

function useCustomExerciseName() {
    // Fill name field with whatever was typed in search
    const nameInput = document.getElementById('exNameInput');
    if (nameInput && dbPickerSearch) nameInput.value = dbPickerSearch;
    closeExercisePicker();
    setTimeout(() => {
        const setsInput = document.getElementById('exSetsInput');
        if (setsInput) setsInput.focus();
    }, 150);
}

// ==================== EXERCISE FORM BODY (shared) ====================

function exerciseFormBody(ex) {
    const restOptions = ['30s','45s','60s','90s','120s','180s'];
    const restLabels  = { '120s': '2 minutes', '180s': '3 minutes' };

    // FIX (Bug 3): Use escAttr() for all values injected into HTML attributes so
    // exercise names / notes containing " characters don't corrupt the markup.
    const name  = escAttr(ex ? ex.name       : '');
    const sets  = ex ? ex.sets       : 3;
    const reps  = escAttr(ex ? ex.repsTarget : '');
    const rest  = ex ? ex.rest       : '60s';
    const notes = escAttr(ex ? (ex.notes || '') : '');

    return `
        <!-- Database Browse Button -->
        <button type="button" class="ex-browse-db-btn" onclick="openExercisePicker()">
            📚 Browse Exercise Database (${EXERCISE_DATABASE.length} exercises)
        </button>

        <div class="form-group" style="margin-top:14px">
            <label class="form-label">Exercise Name</label>
            <input type="text" id="exNameInput" class="form-input"
                   value="${name}" placeholder="Type a name or browse above...">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
            <div class="form-group">
                <label class="form-label">Sets</label>
                <input type="number" id="exSetsInput" class="form-input"
                       value="${sets}" min="1" max="10" inputmode="numeric">
            </div>
            <div class="form-group">
                <label class="form-label">Rep Target</label>
                <input type="text" id="exRepsInput" class="form-input"
                       value="${reps}" placeholder="e.g. 10-12">
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Rest Period</label>
            <select id="exRestInput" class="form-input">
                ${restOptions.map(r => `
                    <option value="${r}" ${r === rest ? 'selected' : ''}>
                        ${restLabels[r] || r.replace('s', ' seconds')}
                    </option>`).join('')}
            </select>
        </div>

        <div class="form-group">
            <label class="form-label">Coaching Notes (optional)</label>
            <input type="text" id="exNotesInput" class="form-input"
                   value="${notes}" placeholder="e.g. Squeeze at the top">
        </div>
    `;
}

// ==================== DAY MANAGEMENT ====================

function addDay() {
    const program = getTrainingProgram();
    const usedColors     = program.days.map(d => d.color);
    const availableColor = DAY_COLORS.find(c => !usedColors.includes(c)) || DAY_COLORS[program.days.length % DAY_COLORS.length];

    editingDayId = null;
    openExModal('Add Training Day', `
        <div class="form-group">
            <label class="form-label">Day Name</label>
            <input type="text" id="dayNameInput" class="form-input" placeholder="e.g. Push Day, Arms, etc.">
        </div>
        <div class="form-group">
            <label class="form-label">Day of Week</label>
            <select id="dayOfWeekInput" class="form-input">
                ${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
                    .map(d => `<option value="${d}">${d}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Color</label>
            <div class="ex-color-grid">
                ${DAY_COLORS.map(c => `
                    <button class="ex-color-btn ${c === availableColor ? 'selected' : ''}"
                            style="background:${c}"
                            onclick="selectColor(this,'${c}')"
                            data-color="${c}"></button>
                `).join('')}
            </div>
            <input type="hidden" id="dayColorInput" value="${availableColor}">
        </div>
        <button class="btn btn-primary" onclick="saveDayForm()">💾 Save Day</button>
    `);
}

function editDay(dayId) {
    const program = getTrainingProgram();
    const day = program.days.find(d => d.id === dayId);
    if (!day) return;

    editingDayId = dayId;

    // FIX (Bug 4): Use escAttr() so day names with " won't break the value attribute
    openExModal('Edit Training Day', `
        <div class="form-group">
            <label class="form-label">Day Name</label>
            <input type="text" id="dayNameInput" class="form-input" value="${escAttr(day.name)}">
        </div>
        <div class="form-group">
            <label class="form-label">Day of Week</label>
            <select id="dayOfWeekInput" class="form-input">
                ${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
                    .map(d => `<option value="${d}" ${d === day.dayOfWeek ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Color</label>
            <div class="ex-color-grid">
                ${DAY_COLORS.map(c => `
                    <button class="ex-color-btn ${c === day.color ? 'selected' : ''}"
                            style="background:${c}"
                            onclick="selectColor(this,'${c}')"
                            data-color="${c}"></button>
                `).join('')}
            </div>
            <input type="hidden" id="dayColorInput" value="${day.color}">
        </div>
        <button class="btn btn-primary" onclick="saveDayForm()">💾 Save Changes</button>
    `);
}

function saveDayForm() {
    const name      = document.getElementById('dayNameInput').value.trim();
    const dayOfWeek = document.getElementById('dayOfWeekInput').value;
    const color     = document.getElementById('dayColorInput').value;

    if (!name) { showToast('Please enter a day name', 'error'); return; }

    const program    = getTrainingProgram();
    const newProgram = JSON.parse(JSON.stringify(program));

    // FIX (Bug 1): Capture whether we were editing BEFORE closeExModal() clears editingDayId.
    const wasEditing = !!editingDayId;

    if (editingDayId) {
        const day = newProgram.days.find(d => d.id === editingDayId);
        if (day) { day.name = name; day.dayOfWeek = dayOfWeek; day.color = color; }
    } else {
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '') + '_' + Date.now();
        newProgram.days.push({ id, name, dayOfWeek, color, exercises: [] });
    }

    saveTrainingProgram(newProgram);
    closeExModal();          // ← sets editingDayId = null
    renderExercises();
    showToast(wasEditing ? '✅ Day updated!' : '✅ Day added!');   // use captured value
}

function deleteDay(dayId) {
    const program = getTrainingProgram();
    const day = program.days.find(d => d.id === dayId);
    if (!day) return;
    if (!confirm(`Delete "${day.name}" and all its exercises?\n\nThis cannot be undone.`)) return;

    const newProgram = JSON.parse(JSON.stringify(program));
    newProgram.days = newProgram.days.filter(d => d.id !== dayId);
    saveTrainingProgram(newProgram);
    renderExercises();
    showToast('🗑️ Day deleted');
}

// ==================== EXERCISE MANAGEMENT ====================

function addExercise(dayId) {
    editingDayId = dayId;
    editingExerciseIdx = null;

    const program = getTrainingProgram();
    const day = program.days.find(d => d.id === dayId);
    if (!day) return;

    openExModal(`Add Exercise — ${escAttr(day.name)}`,
        exerciseFormBody(null) +
        `<button class="btn btn-primary" onclick="saveExerciseForm()">💾 Add Exercise</button>`
    );
}

function editExercise(dayId, exIdx) {
    editingDayId = dayId;
    editingExerciseIdx = exIdx;

    const program = getTrainingProgram();
    const day = program.days.find(d => d.id === dayId);
    if (!day) return;
    const ex = day.exercises[exIdx];
    if (!ex) return;

    openExModal('Edit Exercise',
        exerciseFormBody(ex) +
        `<button class="btn btn-primary" onclick="saveExerciseForm()">💾 Save Changes</button>`
    );
}

function saveExerciseForm() {
    const name       = document.getElementById('exNameInput').value.trim();
    const sets       = parseInt(document.getElementById('exSetsInput').value) || 3;
    const repsTarget = document.getElementById('exRepsInput').value.trim() || '10-12';
    const rest       = document.getElementById('exRestInput').value;
    const notes      = document.getElementById('exNotesInput').value.trim();

    if (!name) { showToast('Please enter an exercise name', 'error'); return; }

    const program    = getTrainingProgram();
    const newProgram = JSON.parse(JSON.stringify(program));
    const day        = newProgram.days.find(d => d.id === editingDayId);
    if (!day) return;

    // FIX (Bug 2): Capture editing state BEFORE closeExModal() clears editingExerciseIdx.
    const wasEditing = editingExerciseIdx !== null;
    const editIdx    = editingExerciseIdx;

    const exercise = { name, sets, repsTarget, rest, notes };

    if (wasEditing) {
        day.exercises[editIdx] = exercise;
    } else {
        day.exercises.push(exercise);
    }

    saveTrainingProgram(newProgram);
    closeExModal();          // ← sets editingExerciseIdx = null
    renderExercises();
    showToast(wasEditing ? '✅ Exercise updated!' : '✅ Exercise added!');  // use captured value
}

function deleteExercise(dayId, exIdx) {
    const program = getTrainingProgram();

    // FIX (Bug 6): Guard against day or exercise not found before accessing properties
    const day = program.days.find(d => d.id === dayId);
    if (!day) return;
    const ex = day.exercises[exIdx];
    if (!ex) return;

    if (!confirm(`Delete "${ex.name}"?`)) return;

    const newProgram = JSON.parse(JSON.stringify(program));
    const newDay = newProgram.days.find(d => d.id === dayId);
    newDay.exercises.splice(exIdx, 1);
    saveTrainingProgram(newProgram);
    renderExercises();
    showToast('🗑️ Exercise deleted');
}

function moveExercise(dayId, exIdx, direction) {
    const program    = getTrainingProgram();
    const newProgram = JSON.parse(JSON.stringify(program));
    const day        = newProgram.days.find(d => d.id === dayId);
    if (!day) return;

    const newIdx = exIdx + direction;
    if (newIdx < 0 || newIdx >= day.exercises.length) return;

    const temp = day.exercises[exIdx];
    day.exercises[exIdx] = day.exercises[newIdx];
    day.exercises[newIdx] = temp;

    saveTrainingProgram(newProgram);
    renderExercises();
}

// ==================== RESET ====================

function resetProgram() {
    if (!confirm('Reset to the default 5-day Push/Pull/Legs split?\n\nYour custom exercises will be lost.')) return;
    if (!confirm('Are you sure? This cannot be undone.')) return;
    resetTrainingProgram();
    renderExercises();
    showToast('🔄 Program reset to defaults');
}

// ==================== MODAL HELPERS ====================

function openExModal(title, bodyHtml) {
    document.getElementById('exModalTitle').textContent = title;
    document.getElementById('exModalBody').innerHTML = bodyHtml;
    document.getElementById('exModal').classList.remove('hidden');
    setTimeout(() => {
        const first = document.querySelector('#exModalBody input[type="text"]');
        if (first) first.focus();
    }, 100);
}

function closeExModal() {
    document.getElementById('exModal').classList.add('hidden');
    editingDayId = null;
    editingExerciseIdx = null;
}

function selectColor(btn, color) {
    document.querySelectorAll('.ex-color-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('dayColorInput').value = color;
}
