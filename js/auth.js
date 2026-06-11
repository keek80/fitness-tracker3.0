// ========== AUTH PAGE ==========
let authMode = 'signin'; // 'signin' | 'signup' | 'reset'

function renderAuthPage() {
    const page = document.getElementById('auth-page');
    if (!page) return;

    if (authMode === 'reset') {
        page.innerHTML = `
            <div class="auth-container">
                <div class="auth-logo">🔑</div>
                <div class="auth-title">Reset Password</div>
                <div class="auth-subtitle">Enter your email and we'll send a reset link</div>
                <div class="auth-card">
                    <div id="authMsg" class="auth-msg hidden"></div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="authEmail" class="form-input" placeholder="you@email.com"
                               autocomplete="email" onkeydown="if(event.key==='Enter') handlePasswordReset()">
                    </div>
                    <button class="btn btn-primary" id="authBtn" onclick="handlePasswordReset()">
                        📧 Send Reset Link
                    </button>
                    <button class="auth-link-btn" onclick="setAuthMode('signin')">← Back to Sign In</button>
                </div>
            </div>`;
        return;
    }

    const signinActive = authMode === 'signin' ? 'active' : '';
    const signupActive = authMode === 'signup' ? 'active' : '';

    page.innerHTML = `
        <div class="auth-container">
            <div class="auth-logo">🏋️</div>
            <div class="auth-title">Fat Loss Tracker</div>
            <div class="auth-subtitle">385 → 250 lbs · Transformation Journey</div>

            <div class="auth-card">
                <div class="auth-tabs">
                    <button class="auth-tab ${signinActive}" onclick="setAuthMode('signin')">Sign In</button>
                    <button class="auth-tab ${signupActive}" onclick="setAuthMode('signup')">Sign Up</button>
                </div>

                <div id="authMsg" class="auth-msg hidden"></div>

                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="authEmail" class="form-input" placeholder="you@email.com"
                           autocomplete="email">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" id="authPassword" class="form-input"
                           placeholder="${authMode === 'signup' ? 'Min. 6 characters' : '••••••••'}"
                           autocomplete="${authMode === 'signup' ? 'new-password' : 'current-password'}"
                           onkeydown="if(event.key==='Enter') { authMode==='signin' ? handleSignIn() : handleSignUp(); }">
                </div>

                ${authMode === 'signup' ? `
                <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" id="authPasswordConfirm" class="form-input"
                           placeholder="Repeat password" autocomplete="new-password"
                           onkeydown="if(event.key==='Enter') handleSignUp()">
                </div>` : ''}

                ${authMode === 'signin' ? `
                    <button class="btn btn-primary" id="authBtn" onclick="handleSignIn()">🔑 Sign In</button>
                    <button class="auth-link-btn" onclick="setAuthMode('reset')">Forgot password?</button>
                ` : `
                    <button class="btn btn-success" id="authBtn" onclick="handleSignUp()">🚀 Create Account</button>
                `}
            </div>

            <div style="text-align:center; margin-top:16px; font-size:11px; color:var(--text-muted)">
                🔒 Your data is encrypted and private
            </div>
        </div>`;
}

function setAuthMode(mode) {
    authMode = mode;
    renderAuthPage();
}

function showAuthMsg(msg, isError = true) {
    const el = document.getElementById('authMsg');
    if (!el) return;
    el.textContent = msg;
    el.className = `auth-msg ${isError ? 'auth-msg-error' : 'auth-msg-success'}`;
}

function setAuthBtnLoading(loading, label) {
    const btn = document.getElementById('authBtn');
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? '⏳ Please wait...' : label;
}

async function handleSignIn() {
    const email    = document.getElementById('authEmail')?.value?.trim();
    const password = document.getElementById('authPassword')?.value;
    if (!email || !password) return showAuthMsg('Please enter your email and password.');
    setAuthBtnLoading(true, '🔑 Sign In');
    try {
        await SupabaseAuth.signIn(email, password);
        await onSignedIn();
    } catch (e) {
        setAuthBtnLoading(false, '🔑 Sign In');
        const msg = e.message?.toLowerCase().includes('invalid')
            ? 'Invalid email or password. Please try again.'
            : (e.message || 'Sign in failed.');
        showAuthMsg(msg);
    }
}

async function handleSignUp() {
    const email    = document.getElementById('authEmail')?.value?.trim();
    const password = document.getElementById('authPassword')?.value;
    const confirm  = document.getElementById('authPasswordConfirm')?.value;
    if (!email || !password || !confirm) return showAuthMsg('Please fill in all fields.');
    if (password !== confirm)            return showAuthMsg('Passwords do not match.');
    if (password.length < 6)             return showAuthMsg('Password must be at least 6 characters.');
    setAuthBtnLoading(true, '🚀 Create Account');
    try {
        await SupabaseAuth.signUp(email, password);
        document.getElementById('auth-page').innerHTML = `
            <div class="auth-container" style="text-align:center">
                <div class="auth-logo">📧</div>
                <div class="auth-title">Check your email!</div>
                <div class="auth-subtitle" style="margin-bottom:20px">
                    We sent a confirmation link to<br><strong>${email}</strong>
                </div>
                <div class="auth-card">
                    <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px; line-height:1.6">
                        Click the link in the email to activate your account, then come back and sign in.
                    </p>
                    <button class="btn btn-primary" onclick="setAuthMode('signin'); renderAuthPage()">
                        ← Back to Sign In
                    </button>
                </div>
            </div>`;
    } catch (e) {
        setAuthBtnLoading(false, '🚀 Create Account');
        showAuthMsg(e.message || 'Sign up failed. Please try again.');
    }
}

async function handlePasswordReset() {
    const email = document.getElementById('authEmail')?.value?.trim();
    if (!email) return showAuthMsg('Please enter your email address.');
    setAuthBtnLoading(true, '📧 Send Reset Link');
    try {
        await SupabaseAuth.resetPassword(email);
        document.getElementById('auth-page').innerHTML = `
            <div class="auth-container" style="text-align:center">
                <div class="auth-logo">✅</div>
                <div class="auth-title">Reset link sent!</div>
                <div class="auth-subtitle">Check your inbox at<br><strong>${email}</strong></div>
                <div class="auth-card">
                    <button class="btn btn-primary" onclick="setAuthMode('signin'); renderAuthPage()">
                        ← Back to Sign In
                    </button>
                </div>
            </div>`;
    } catch (e) {
        setAuthBtnLoading(false, '📧 Send Reset Link');
        showAuthMsg(e.message || 'Failed to send reset email.');
    }
}

async function handleSignOut() {
    if (!confirm('Sign out of your account?')) return;
    try {
        await SupabaseAuth.signOut();
        Storage.clearAll();
        showAuthPageView();
        showToast('👋 Signed out successfully');
    } catch (e) {
        showToast('Sign out failed', 'error');
    }
}

function showAuthPageView() {
    document.getElementById('app').classList.add('hidden');
    const authPage = document.getElementById('auth-page');
    authPage.classList.remove('hidden');
    authMode = 'signin';
    renderAuthPage();
}

function showMainAppView() {
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}
