let currentStep = 1;
let builderData = {};

function navigateToBuilder() {
    currentStep = 1;
    builderData = { 
        goals: { primary: 'Fat Loss' }, 
        split: 'PPL', 
        days: 5, 
        focus: [], 
        experience: 'Beginner' 
    };
    renderWizard();
}

function renderWizard() {
    const page = document.getElementById('page-exercises');
    if (!page) return;

    let backButton = currentStep > 1 
        ? `<button class="btn" onclick="prevStep()" style="flex:1;">← Back</button>` 
        : '';

    page.innerHTML = `
        <div style="background:#1a1a2e; padding:20px; border-radius:12px; margin:16px;">
            <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:2.5em;">Step ${currentStep}/5</div>
                <div style="color:#888;">Workout Routine Builder</div>
            </div>
            <div id="wizard-content"></div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                ${backButton}
                <button class="btn btn-success" onclick="nextStep()" style="flex:1;">
                    ${currentStep === 5 ? '✅ Build Routine' : 'Next →'}
                </button>
            </div>
        </div>
    `;
    renderCurrentStep();
}

function renderCurrentStep() {
    const content = document.getElementById('wizard-content');
    if (!content) return;

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
            <div onclick="selectSplit('PPL')" class="chip" style="display:block;padding:16px;margin:8px 0;">Push / Pull / Legs</div>
            <div onclick="selectSplit('FullBody')" class="chip" style="display:block;padding:16px;margin:8px 0;">Full Body</div>
        `;
    } else if (currentStep === 3) {
        content.innerHTML = `
            <h3>Days per Week</h3>
            <input type="range" min="3" max="6" value="${builderData.days}" 
                   oninput="builderData.days=parseInt(this.value); renderWizard()" style="width:100%">
            <div style="text-align:center;font-size:1.8em;margin:12px 0;">${builderData.days} days</div>
        `;
    } else if (currentStep === 4) {
        content.innerHTML = `
            <h3>Focus Areas (tap to toggle)</h3>
            ${['Chest','Back','Shoulders','Arms','Legs','Core'].map(area => `
                <div class="chip ${builderData.focus.includes(area) ? 'active' : ''}" 
                     onclick="toggleFocus('${area}')">${area}</div>
            `).join('')}
        `;
    } else if (currentStep === 5) {
        content.innerHTML = `
            <h3>Ready to Build Your Routine!</h3>
            <p><strong>Goal:</strong> ${builderData.goals.primary}</p>
            <p><strong>Split:</strong> ${builderData.split}</p>
            <p><strong>Days:</strong> ${builderData.days}</p>
            <p><strong>Focus:</strong> ${builderData.focus.length ? builderData.focus.join(', ') : 'Balanced'}</p>
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
    
    // Display the generated routine
    const page = document.getElementById('page-exercises');
    page.innerHTML = `
        <div style="padding:20px;">
            <h2>✅ Your Custom Routine</h2>
            <pre style="background:#25253a; padding:16px; border-radius:8px; white-space:pre-wrap; font-size:0.9em;">${JSON.stringify(newProgram, null, 2)}</pre>
            <button class="btn btn-success" onclick="saveTrainingProgram(${JSON.stringify(newProgram).replace(/"/g, '&quot;')}); showToast('Routine Saved!'); location.reload();">Save This Routine</button>
            <button class="btn" onclick="navigateToBuilder()">Build Another</button>
        </div>
    `;

    console.log("Generated Routine:", newProgram);
}

function generateSmartRoutine(answers) {
    let program = JSON.parse(JSON.stringify(DEFAULT_TRAINING_PROGRAM || {}));
    
    // Basic customization based on answers
    if (answers.focus.includes('Shoulders')) {
        console.log("Emphasizing shoulders...");
        // TODO: Add more shoulder work in future iterations
    }
    
    return program;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (t) {
        t.textContent = msg;
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 3000);
    }
}

// Make functions global
window.navigateToBuilder = navigateToBuilder;
window.selectGoal = selectGoal;
window.selectSplit = selectSplit;
window.toggleFocus = toggleFocus;
window.prevStep = prevStep;
window.nextStep = nextStep;
window.buildAndSaveRoutine = buildAndSaveRoutine;
