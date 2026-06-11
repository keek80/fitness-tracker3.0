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
        
        <!-- Routine Builder Button -->
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

// ==================== Keep the rest of your original functions unchanged ====================

// (Paste all the rest of your original code here - from openExercisePicker() down to the end)

function openExercisePicker() { /* your original code */ }
function closeExercisePicker() { /* your original code */ }
function selectDBCategory(cat) { /* your original code */ }
function renderDBList() { /* your original code */ }
function renderDBItem(ex) { /* your original code */ }
function selectExerciseFromDB(name, notes) { /* your original code */ }
function useCustomExerciseName() { /* your original code */ }
function exerciseFormBody(ex) { /* your original code */ }
function addDay() { /* your original code */ }
function editDay(dayId) { /* your original code */ }
function saveDayForm() { /* your original code */ }
function deleteDay(dayId) { /* your original code */ }
function addExercise(dayId) { /* your original code */ }
function editExercise(dayId, exIdx) { /* your original code */ }
function saveExerciseForm() { /* your original code */ }
function deleteExercise(dayId, exIdx) { /* your original code */ }
function moveExercise(dayId, exIdx, direction) { /* your original code */ }
function resetProgram() { /* your original code */ }
function openExModal(title, bodyHtml) { /* your original code */ }
function closeExModal() { /* your original code */ }
function selectColor(btn, color) { /* your original code */ }
