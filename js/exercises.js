// Exercise Manager + Routine Builder Integration
console.log("Exercise Manager loaded - Routine Builder ready");

function showExerciseManager() {
    const page = document.getElementById('page-exercises');
    page.innerHTML = `
        <div style="padding:20px;">
            <h2>Exercise Manager</h2>
            <p>Full Exercise Manager coming soon...</p>
            <button class="btn btn-primary" onclick="navigateToBuilder()">✨ Launch Routine Builder</button>
        </div>
    `;
}

// Auto-load Exercise Manager on start
document.addEventListener('DOMContentLoaded', () => {
    showExerciseManager();
});
