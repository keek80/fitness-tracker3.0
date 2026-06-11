// Main App Initialization
console.log("Fitness Tracker App Initialized");

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// Global functions for buttons
window.navigateToBuilder = navigateToBuilder;
window.showToast = showToast;

// Make sure everything is loaded
console.log("✅ All scripts loaded. Click the ✨ button to start the Routine Builder.");
