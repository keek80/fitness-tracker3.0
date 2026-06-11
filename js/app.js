// ========== GLOBAL CHART MANAGER (Prevents Memory Leaks) ==========
window.currentCharts = [];

// Destroy all existing charts
function destroyAllCharts() {
    if (window.currentCharts && window.currentCharts.length > 0) {
        window.currentCharts.forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        window.currentCharts = [];
    }
}
// ========== MAIN APP CONTROLLER ==========

// Called after successful sign-in — pulls cloud data then shows app
async function onSignedIn() {
    const authPage = document.getElementById('auth-page');
    if (authPage) {
        authPage.innerHTML = `
            <div class="auth-container" style="text-align:center; padding-top:80px">
                <div class="auth-logo">🏋️</div>
                <div class="auth-title">Loading your data...</div>
                <div class="auth-subtitle">Syncing from cloud ☁️</div>
                <div class="loader" style="margin:24px auto"></div>
            </div>`;
    }

    await SupabaseSync.pullAll();
    showMainAppView();
    initApp();

    const settings = Storage.getSettings();
    if (!settings.setupComplete) {
        navigate('goals');
    }
}

// Navigation
function navigate(page) {
    destroyAllCharts();
    
   if (page !== 'gym') {
    if (typeof cleanupWorkoutTimer === 'function') {
        cleanupWorkoutTimer();
    }
}

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-page') === page);
    });

    document.querySelectorAll('.drawer-content a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('data-page') === page);
    });

    const titles = {
        dashboard: '📊 Dashboard',
        weighin:   '⚖️ Weigh-In',
        gym:       '💪 Gym Log',
        analytics: '📈 Analytics',
        meals:     '🍽️ Meal Plan',
        program:   '🏋️ Training Program',
        exercises: '🛠️ Exercise Manager',
        settings:  '⚙️ Settings',
        goals:     '🎯 Set Your Goals'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

    switch (page) {
        case 'dashboard': renderDashboard();  break;
        case 'weighin':   renderWeighIn();    break;
        case 'gym':       renderGym();        break;
        case 'analytics': renderAnalytics();  break;
        case 'meals':     renderMeals();      break;
        case 'program':   renderProgram();    break;
        case 'exercises': renderExercises();  break;
        case 'settings':  renderSettings();   break;
        case 'goals':     renderGoals();      break;
    }

    closeDrawer();
    document.querySelector('.pages').scrollTop = 0;
}

// Drawer
function openDrawer()  { document.getElementById('drawer').classList.remove('hidden'); }
function closeDrawer() { document.getElementById('drawer').classList.add('hidden');    }

// Toast notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    toast.style.background = type === 'error' ? '#e94560' : '#00d68f';
    toast.style.color = type === 'error' ? '#fff' : '#000';
    setTimeout(() => { toast.classList.add('hidden'); }, 2500);
}

// Menu button
document.getElementById('menuBtn').addEventListener('click', openDrawer);

// ========== INITIALIZATION ==========
function initApp() {
    renderDashboard();

    const email = SupabaseAuth.getUserEmail();
    const drawerSubtitle = document.querySelector('.drawer-subtitle');
    if (drawerSubtitle && email) {
        drawerSubtitle.textContent = email;
    }

    const splash = document.getElementById('splash');
    if (splash && !splash.classList.contains('done')) {
        splash.classList.add('done');
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => { splash.style.display = 'none'; }, 400);
        }, 800);
    }
}

// ========== SERVICE WORKER — Auto-update on every launch ==========
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('./sw.js')
        .then(registration => {
            console.log('SW registered');

            // Check for a new SW version immediately on every app open
            registration.update();

            // When a new SW is waiting, activate it immediately
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New SW is ready — tell it to skip waiting and take over
                        newWorker.postMessage('SKIP_WAITING');
                    }
                });
            });
        })
        .catch(err => console.log('SW failed:', err));

    // When the SW takes control, reload the page to use fresh cached files
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

// ========== STARTUP — Check Auth ==========
async function startup() {
    const splashTimeout = setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) splash.style.display = 'none';
    }, 5000);

    try {
        const session = await SupabaseAuth.getSession();

        if (session) {
            clearTimeout(splashTimeout);
            await onSignedIn();
        } else {
            clearTimeout(splashTimeout);
            const splash = document.getElementById('splash');
            if (splash) splash.style.display = 'none';
            showAuthPageView();
        }
    } catch (e) {
        console.warn('Startup error:', e);
        clearTimeout(splashTimeout);
        const splash = document.getElementById('splash');
        if (splash) splash.style.display = 'none';
        showAuthPageView();
    }
}

// Listen for auth state changes
_supabase?.auth?.onAuthStateChange?.((event, session) => {
    if (event === 'SIGNED_OUT') {
        Storage.clearAll();
        showAuthPageView();
    }
});

// Register SW with auto-update logic
registerServiceWorker();

// Start
document.addEventListener('DOMContentLoaded', startup);

window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) navigate(e.state.page);
});
// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
