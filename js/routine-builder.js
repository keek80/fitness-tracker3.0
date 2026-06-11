let currentStep = 1;
let builderData = {};

function navigateToBuilder() {
    currentStep = 1;
    builderData = { goals: {}, split: 'PPL', days: 5, focus: [], experience: 'Beginner' };
    renderWizard();
}

function renderWizard() {
    const page = document.getElementById('page-exercises');
    page.innerHTML = `
        <div style="background:#1a1a2e; padding:20px; border-radius:12px; margin:16px;">
            <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:2.5em; margin-bottom:8px;">Step ${currentStep}/5</div>
                <div style="color:#888;">Workout Routine Builder</div>
            </div>
            <div id="wizard-content"></div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                ${currentStep > 1 ? `<button class="btn" onclick="prevStep()" style="flex:1;">← Back</button>` : ''}
                <button class="btn btn-success" onclick="nextStep()" style="flex:1;">${currentStep === 5 ? '✅ Build & Save Routine' : 'Next →'}</button>
            </div>
        </div>
    `;
    renderCurrentStep();
}

function renderCurrentStep() {
    const content = document.getElementById('wizard-content');
    if (currentStep === 1) {
        content.innerHTML = `
            <h3>Primary Goal</h3>
            <div class="chip ${builderData.goals.primary === 'Fat Loss' ? 'active' : ''}" onclick="selectGoal('Fat Loss')">Fat Loss</div>
            <div class="chip ${builderData.goals.primary === 'Muscle Gain' ? 'active' : ''}" onclick="selectGoal('Muscle Gain')">Muscle Gain</div>
            <div class="chip ${builderData.goals.primary === 'Strength' ? 'active' : ''}" onclick="selectGoal('Strength')">Strength</div>
            <h3 style="margin-top:20px">Experience Level</h3>
            <select class="form-input" onchange="builderData.experience=this.value">
                <option value="Beginner" ${builderData.experience==='Beginner'?'selected':''}>Beginner</option>
                <option value="Intermediate" ${builderData.experience==='Intermediate'?'selected':''}>Intermediate</option>
            </select>
        `;
    } else if (currentStep === 2) {
        content.innerHTML = `
            <h3>Training Split</h3>
            <div onclick="selectSplit('PPL')" class="chip" style="display:block;padding:16px;margin:8px 0;">Push / Pull / Legs (5 days)</div>
            <div onclick="selectSplit('FullBody')" class="chip" style="display:block;padding:16px;margin:8px 0;">Full Body (3 days)</div>
        `;
    } else if (currentStep === 3) {
        content.innerHTML = `
            <h3>Days per Week</h3>
            <input type="range" min="3" max="6" value="${builderData.days}" 
                   oninput="builderData.days=parseInt(this.value);renderWizard()" style="width:100%">
            <div style="text-align:center; font-size:1.8em; margin:10px 0;">${builderData.days} days</div>
        `;
    } else if (currentStep === 4) {
        content.innerHTML = `
            <h3>Focus Areas (tap to select)</h3>
            ${['Chest','Back','Shoulders','Arms','Legs','Core'].map(a => `
                <div class="chip ${builderData.focus.includes(a)?'active':''}" onclick="toggleFocus('${a}')">${a}</div>
            `).join('')}
        `;
    } else if (currentStep === 5) {
        content.innerHTML = `
            <h3>Ready to Build!</h3>
            <p><strong>Goal:</strong> ${builderData.goals.primary || 'Fat Loss'}</p>
            <p><strong>Split:</strong> ${builderData.split}</p>
            <p><strong>Days:</strong> ${builderData.days}</p>
            <p>We'll use your full exercise database to create a balanced routine.</p>
        `;
    }
}

function selectGoal(g) { builderData.goals.primary = g; renderWizard(); }
function selectSplit(s) { builderData.split = s; nextStep(); }
function toggleFocus(area) {
    if (builderData.focus.includes(area)) {
        builderData.focus = builderData.focus.filter(a => a !== area);
    } else {
        builderData.focus.push(area);
    }
    renderWizard();
}

function nextStep() {
    if (currentStep === 5) {
        buildAndSaveRoutine();
    } else {
        currentStep++;
        renderWizard();
    }
}

function prevStep() {
    currentStep--;
    renderWizard();
}

function buildAndSaveRoutine() {
    const newProgram = generateSmartRoutine(builderData);
    saveTrainingProgram(newProgram);
    showToast("✅ Custom Routine Built and Saved!");
    setTimeout(() => location.reload(), 1500);
}

function generateSmartRoutine(answers) {
    // Start with default and enhance
    let program = JSON.parse(JSON.stringify(DEFAULT_TRAINING_PROGRAM));
    console.log("Generated routine based on:", answers);
    // Future: Add logic to swap/add exercises from EXERCISE_DATABASE based on focus
    return program;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
}
