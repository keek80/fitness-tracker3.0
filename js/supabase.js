// ========== SUPABASE CONFIGURATION ==========
const SUPABASE_URL = 'https://ihyekncythrcmuhiahzr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wiw7KN-039CekJ7q3MpH1g_R0WdoCpn';

// Initialize client using the CDN global
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ========== AUTH LAYER ==========
let _currentUser = null;

const SupabaseAuth = {
    async signIn(email, password) {
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        _currentUser = data.user;
        return data;
    },

    async signUp(email, password) {
        const { data, error } = await _supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await _supabase.auth.signOut();
        if (error) throw error;
        _currentUser = null;
    },

    async resetPassword(email) {
        const redirectTo = window.location.origin + window.location.pathname;
        const { error } = await _supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw error;
    },

    async getSession() {
        const { data: { session } } = await _supabase.auth.getSession();
        if (session) _currentUser = session.user;
        return session;
    },

    getCurrentUser()  { return _currentUser; },
    getUserId()       { return _currentUser?.id || null; },
    getUserEmail()    { return _currentUser?.email || null; }
};

// ========== DATABASE LAYER ==========
const SupabaseDB = {
    uid() { return SupabaseAuth.getUserId(); },

    // ===== WEIGH-INS =====
    async getWeighIns() {
        const { data, error } = await _supabase
            .from('weigh_ins')
            .select('date, weight, notes')
            .order('date', { ascending: true });
        if (error) throw error;
        return (data || []).map(r => ({
            date: r.date,
            weight: parseFloat(r.weight),
            notes: r.notes || ''
        }));
    },

    async upsertWeighIn(entry) {
        const { error } = await _supabase
            .from('weigh_ins')
            .upsert({
                user_id: this.uid(),
                date: entry.date,
                weight: entry.weight,
                notes: entry.notes || null
            }, { onConflict: 'user_id,date' });
        if (error) throw error;
    },

    async deleteWeighIn(date) {
        const { error } = await _supabase
            .from('weigh_ins')
            .delete()
            .eq('user_id', this.uid())
            .eq('date', date);
        if (error) throw error;
    },

    // ===== GYM LOGS =====
    async getGymLogs() {
        const { data, error } = await _supabase
            .from('gym_logs')
            .select('date, day_id, day_name, exercises, body_weight')
            .order('date', { ascending: false });
        if (error) throw error;
        return (data || []).map(r => ({
            date: r.date,
            dayId: r.day_id,
            dayName: r.day_name,
            exercises: r.exercises,
            bodyWeight: r.body_weight
        }));
    },

    async upsertGymLog(log) {
        const { error } = await _supabase
            .from('gym_logs')
            .upsert({
                user_id: this.uid(),
                date: log.date,
                day_id: log.dayId,
                day_name: log.dayName,
                exercises: log.exercises,
                body_weight: log.bodyWeight || null
            }, { onConflict: 'user_id,date,day_id' });
        if (error) throw error;
    },

    async deleteGymLog(date, dayId) {
        const { error } = await _supabase
            .from('gym_logs')
            .delete()
            .eq('user_id', this.uid())
            .eq('date', date)
            .eq('day_id', dayId);
        if (error) throw error;
    },

    // ===== PERSONAL RECORDS =====
    async getPRs() {
        const { data, error } = await _supabase
            .from('personal_records')
            .select('exercise, best_weight, best_reps, best_volume, date');
        if (error) throw error;
        const prs = {};
        (data || []).forEach(r => {
            prs[r.exercise] = {
                bestWeight: r.best_weight,
                bestReps: r.best_reps,
                bestVolume: r.best_volume,
                date: r.date
            };
        });
        return prs;
    },

    async upsertPR(exerciseName, pr) {
        const { error } = await _supabase
            .from('personal_records')
            .upsert({
                user_id: this.uid(),
                exercise: exerciseName,
                best_weight: pr.bestWeight,
                best_reps: pr.bestReps,
                best_volume: pr.bestVolume,
                date: pr.date
            }, { onConflict: 'user_id,exercise' });
        if (error) throw error;
    },

    // ===== SETTINGS =====
    async getSettings() {
        const { data, error } = await _supabase
            .from('user_settings')
            .select('*')
            .single();
        if (error || !data) return null;
        return {
            startDate:     data.start_date,
            startWeight:   parseFloat(data.start_weight),
            goalWeight:    parseFloat(data.goal_weight),
            weeklyTarget:  parseFloat(data.weekly_target),
            units:         data.units || 'lbs',
            setupComplete: data.setup_complete || false
        };
    },

    async upsertSettings(settings) {
        const { error } = await _supabase
            .from('user_settings')
            .upsert({
                user_id:        this.uid(),
                start_date:     settings.startDate,
                start_weight:   settings.startWeight,
                goal_weight:    settings.goalWeight,
                weekly_target:  settings.weeklyTarget,
                units:          settings.units || 'lbs',
                setup_complete: settings.setupComplete || false,
                updated_at:     new Date().toISOString()
            }, { onConflict: 'user_id' });
        if (error) throw error;
    },

    // ===== CUSTOM PROGRAM =====
    async getCustomProgram() {
        const { data, error } = await _supabase
            .from('custom_programs')
            .select('program')
            .single();
        if (error || !data) return null;
        return data.program;
    },

    async upsertCustomProgram(program) {
        const { error } = await _supabase
            .from('custom_programs')
            .upsert({
                user_id:    this.uid(),
                program:    program,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        if (error) throw error;
    },

    async deleteCustomProgram() {
        const { error } = await _supabase
            .from('custom_programs')
            .delete()
            .eq('user_id', this.uid());
        if (error) throw error;
    }
};

// ========== SYNC LAYER ==========
// localStorage = fast cache (always works offline)
// Supabase     = cloud store (synced when online + authenticated)
const SupabaseSync = {
    _canSync() {
        return navigator.onLine && !!SupabaseAuth.getUserId();
    },

    // Pull all cloud data into localStorage on sign-in / app start
    async pullAll() {
        if (!this._canSync()) return false;
        try {
            const [weighIns, gymLogs, prs, settings, customProgram] = await Promise.all([
                SupabaseDB.getWeighIns().catch(() => null),
                SupabaseDB.getGymLogs().catch(() => null),
                SupabaseDB.getPRs().catch(() => null),
                SupabaseDB.getSettings().catch(() => null),
                SupabaseDB.getCustomProgram().catch(() => null)
            ]);

            if (weighIns !== null)     localStorage.setItem('flt_weighins',  JSON.stringify(weighIns));
            if (gymLogs !== null)      localStorage.setItem('flt_gymlogs',   JSON.stringify(gymLogs));
            if (prs !== null)          localStorage.setItem('flt_prs',       JSON.stringify(prs));
            if (settings !== null)     localStorage.setItem('flt_settings',  JSON.stringify(settings));
            if (customProgram !== null) {
                localStorage.setItem('flt_custom_program', JSON.stringify(customProgram));
            } else {
                localStorage.removeItem('flt_custom_program');
            }

            console.log('✅ Supabase sync complete');
            return true;
        } catch (e) {
            console.warn('⚠️ Supabase pull failed — using local cache:', e.message);
            return false;
        }
    },

    // Fire-and-forget push: write to localStorage first, then push to cloud
    _push(fn) {
        if (!this._canSync()) return;
        fn().catch(e => console.warn('⚠️ Supabase push failed:', e.message));
    },

    weighIn(entry)            { this._push(() => SupabaseDB.upsertWeighIn(entry)); },
    deleteWeighIn(date)       { this._push(() => SupabaseDB.deleteWeighIn(date)); },
    gymLog(log)               { this._push(() => SupabaseDB.upsertGymLog(log)); },
    deleteGymLog(date, dayId) { this._push(() => SupabaseDB.deleteGymLog(date, dayId)); },
    pr(name, pr)              { this._push(() => SupabaseDB.upsertPR(name, pr)); },
    settings(s)               { this._push(() => SupabaseDB.upsertSettings(s)); },
    customProgram(p)          { this._push(() => SupabaseDB.upsertCustomProgram(p)); },
    deleteCustomProgram()     { this._push(() => SupabaseDB.deleteCustomProgram()); }
};
