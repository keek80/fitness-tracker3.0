let currentStep = 1;
let builderData = {};

function navigateToBuilder() {
    currentStep = 1;
    builderData = { goals: {}, split: '', days: 5, focus: [] };
    renderWizard();
}

function renderWizard() {
    const page = document.getElementById('page-exercises');
    page.innerHTML = `
        <div style="background:#1a1a2e; padding:20px; border-radius:12px; margin:16px;">
            <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:2.5em;">Step \${currentStep}/5</div>
            </div>
            <div id="wizard-content"></div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                \${currentStep > 1 ? `<button class="btn" onclick="prevStep()">← Back</button>` : ''}
                <button class="btn btn-success" onclick="nextStep()" style="flex:1;">\${currentStep === 5 ? '✅ Build Routine' : 'Next →'}</button>
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
            <div onclick="selectGoal('Fat Loss')" class="chip">Fat Loss</div>
            <div onclick="selectGoal('Muscle Gain')" class="chip">Muscle Gain</div>
            <div onclick="selectGoal('Strength')" class="chip">Strength</div>
            <h3>Experience</h3>
            <select class="form-input" onchange="builderData.experience=this.value">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
            </select>
        `;
    } else if (currentStep === 2) {
        content.innerHTML = `
            <h3>Choose Split</h3>
            <div onclick="selectSplit('PPL')" class="chip" style="display:block;margin:8px 0;padding:16px;">Push/Pull/Legs</div>
            <div onclick="selectSplit('FullBody')" class="chip" style="display:block;margin:8px 0;padding:16px;">Full Body</div>
        `;
    } else if (currentStep === 5) {
        content.innerHTML = `<p>Building routine based on your inputs...</p>`;
    } else {
        content.innerHTML = `<p>Step \${currentStep} content coming soon...</p>`;
    }
}

function selectGoal(g) { builderData.goals.primary = g; renderWizard(); }
function selectSplit(s) { builderData.split = s; nextStep(); }

function nextStep() {
    if (currentStep === 5) {
        buildAndSaveRoutine();
    } else {
        currentStep++;
        renderWizard();
    }
}

function prevStep() { currentStep--; renderWizard(); }

function buildAndSaveRoutine() {
    console.log("Building routine from:", builderData);
    const program = { ...DEFAULT_TRAINING_PROGRAM };
    saveTrainingProgram(program);
    showToast("✅ Routine Built!");
    setTimeout(() => location.reload(), 1500);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2500);
}
