// ========== EXERCISE MANAGER PAGE ==========
let editingDayId = null;
let editingExerciseIdx = null;
// Exercise DB picker state
let dbPickerCategory = 'All';
let dbPickerSearch = '';

function renderExercises() {
    const page = document.getElementById('page-exercises');
    const program = getTrainingProgram();
    const custom = isCustomProgram();

    page.innerHTML = `
        <div class="section-title">🛠️ Exercise Manager</div>
        
        <!-- ✨ Routine Builder Button -->
        <button onclick="navigateToBuilder()" 
                style="width:100%; padding:18px; font-size:1.15em; background:#e94560; color:white; border:none; border-radius:12px; margin:12px 0 20px 0; box-shadow:0 4px 12px rgba(233,69,96,0.3);">
            ✨ Build New Workout Routine (Wizard)
        </button>

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
                            <div class="ex-day-name" style="color:${day.color}">${day.name}</div>
                            <div class="ex-day-info">${day.dayOfWeek} · ${day.exercises.length} exercises</div>
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
                                    <div class="ex-exercise-name">${ex.name}</div>
                                    <div class="ex-exercise-detail">${ex.sets} × ${ex.repsTarget} · Rest ${ex.rest}</div>
                                    ${ex.notes ? `<div class="ex-exercise-notes">💡 ${ex.notes}</div>` : ''}
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
                        placeholder="🔍 Search exercises..."
                        oninput="dbPickerSearch=this.value; renderDBList()"
                        autocomplete="off" autocorrect="off" spellcheck="false">
                </div>
                <div class="ex-db-categories" id="dbCategories"></div>
                <div class="ex-db-list" id="dbList"></div>
            </div>
        </div>
    `;
}

// ==================== YOUR ORIGINAL FUNCTIONS (copy-paste these from your backup) ====================

function openExercisePicker() {
    // Reset state
    dbPickerSearch = '';
    dbPickerCategory = 'All';
    const catEl = document.getElementById('dbCategories');
    catEl.innerHTML = DB_CATEGORIES.map(cat => `
        <button class="ex-db-chip ${cat === dbPickerCategory ? 'active' : ''}"
                onclick="selectDBCategory('${cat}')">
            ${cat}
        </button>
    `).join('');
    const searchEl = document.getElementById('dbSearchInput');
    if (searchEl) searchEl.value = '';
    renderDBList();
    document.getElementById('exDBPicker').classList.remove('hidden');
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
    document.querySelectorAll('.ex-db-chip').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === cat);
    });
    renderDBList();
}

function renderDBList() {
    const search = (dbPickerSearch || '').toLowerCase().trim();
    const cat = dbPickerCategory;
    let results = EXERCISE_DATABASE;
    if (cat !== 'All') results = results.filter(e => e.category === cat);
    if (search) {
        results = results.filter(e =>
            e.name.toLowerCase().includes(search) ||
            e.category.toLowerCase().includes(search) ||
            e.equipment.toLowerCase().includes(search)
        );
    }
    const listEl = document.getElementById('dbList');
    if (!listEl) return;
    listEl.innerHTML = results.map(e => renderDBItem(e)).join('');
}

function renderDBItem(ex) {
    const color = EQUIPMENT_COLORS[ex.equipment] || '#718096';
    const safeName = ex.name.replace(/'/g, "\\'");
    const safeNotes = (ex.notes || '').replace(/'/g, "\\'");
    return `
        <button class="ex-db-item" onclick="selectExerciseFromDB('${safeName}', '${safeNotes}')">
            <div class="ex-db-item-name">${ex.name}</div>
            <div class="ex-db-item-meta">
                <span class="ex-db-badge" style="background:${color}22; color:${color};">${ex.equipment}</span>
            </div>
        </button>`;
}

function selectExerciseFromDB(name, notes) {
    const nameInput = document.getElementById('exNameInput');
    const notesInput = document.getElementById('exNotesInput');
    if (nameInput) nameInput.value = name;
    if (notesInput) notesInput.value = notes || '';
    closeExercisePicker();
    showToast(`✅ ${name} selected`);
}

// Add the rest of your original functions here (exerciseFormBody, addDay, editDay, etc.)
// For brevity, add them from your backup. They should be the same as before.

function exerciseFormBody(ex) { /* paste your original */ }
function addDay() { /* paste your original */ }
function editDay(dayId) { /* paste */ }
function saveDayForm() { /* paste */ }
function deleteDay(dayId) { /* paste */ }
function addExercise(dayId) { /* paste */ }
function editExercise(dayId, exIdx) { /* paste */ }
function saveExerciseForm() { /* paste */ }
function deleteExercise(dayId, exIdx) { /* paste */ }
function moveExercise(dayId, exIdx, direction) { /* paste */ }
function resetProgram() { /* paste */ }
function openExModal(title, bodyHtml) { /* paste */ }
function closeExModal() { /* paste */ }
function selectColor(btn, color) { /* paste */ }

// Global exposure
window.navigateToBuilder = navigateToBuilder;
