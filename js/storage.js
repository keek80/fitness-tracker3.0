// ========== LOCAL STORAGE MANAGER (+ Supabase Sync) ==========
// localStorage = instant reads, works offline
// SupabaseSync = cloud backup, fires async after every write
const Storage = {
    PREFIX: 'flt_',

    get(key, defaultValue = null) {
        try {
            const val = localStorage.getItem(this.PREFIX + key);
            return val ? JSON.parse(val) : defaultValue;
        } catch { return defaultValue; }
    },

    set(key, value) {
        try { localStorage.setItem(this.PREFIX + key, JSON.stringify(value)); }
        catch (e) { console.error('Storage error:', e); }
    },

    remove(key) { localStorage.removeItem(this.PREFIX + key); },

    // ===== WEIGH-INS =====
    getWeighIns() { return this.get('weighins', []); },

    saveWeighIn(entry) {
        const entries = this.getWeighIns();
        const idx = entries.findIndex(e => e.date === entry.date);
        if (idx >= 0) entries[idx] = entry;
        else entries.push(entry);
        entries.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.set('weighins', entries);
        // Sync to cloud
        if (typeof SupabaseSync !== 'undefined') SupabaseSync.weighIn(entry);
        return entries;
    },

    deleteWeighIn(date) {
        let entries = this.getWeighIns().filter(e => e.date !== date);
        this.set('weighins', entries);
        if (typeof SupabaseSync !== 'undefined') SupabaseSync.deleteWeighIn(date);
        return entries;
    },

    // ===== GYM LOGS =====
    getGymLogs() { return this.get('gymlogs', []); },

    saveGymLog(log) {
        const logs = this.getGymLogs();
        const idx = logs.findIndex(l => l.date === log.date && l.dayId === log.dayId);
        if (idx >= 0) logs[idx] = log;
        else logs.push(log);
        logs.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.set('gymlogs', logs);
        if (typeof SupabaseSync !== 'undefined') SupabaseSync.gymLog(log);

        // FIX: Always recalculate PRs from scratch for all exercises in this log.
        // This ensures that if a value was entered incorrectly and then corrected,
        // the PR reflects the actual best weight across all sessions.
        const exerciseNames = [...new Set(log.exercises.map(e => e.name))];
        exerciseNames.forEach(name => this.recalculatePRsForExercise(name));

        return logs;
    },

    deleteGymLog(date, dayId) {
        let logs = this.getGymLogs().filter(l => !(l.date === date && l.dayId === dayId));
        this.set('gymlogs', logs);
        if (typeof SupabaseSync !== 'undefined') SupabaseSync.deleteGymLog(date, dayId);
        return logs;
    },

    getGymLogsForDay(dayId) {
        return this.getGymLogs().filter(l => l.dayId === dayId);
    },

    getLatestGymLog(dayId) {
        const logs = this.getGymLogsForDay(dayId);
        return logs.length > 0 ? logs[0] : null;
    },

    getPreviousGymLog(dayId, currentDate) {
        return this.getGymLogsForDay(dayId).find(l => l.date < currentDate) || null;
    },

    // ===== PERSONAL RECORDS =====
    getPRs() { return this.get('prs', {}); },

    // FIX: PR is now based on max WEIGHT only (not volume/reps).
    // Kept for backwards-compatibility but saveGymLog now uses recalculatePRsForExercise instead.
    checkAndUpdatePR(exerciseName, weight, reps) {
        const prs    = this.getPRs();
        const current = prs[exerciseName];
        let newPR = false;

        // Compare by weight only
        if (!current || weight > current.bestWeight) {
            prs[exerciseName] = {
                bestWeight: weight,
                bestReps:   reps,
                bestVolume: weight * reps,
                date:       new Date().toISOString().split('T')[0]
            };
            newPR = true;
        }
        this.set('prs', prs);
        if (newPR && typeof SupabaseSync !== 'undefined') {
            SupabaseSync.pr(exerciseName, prs[exerciseName]);
        }
        return newPR;
    },

    // FIX: Rebuild the PR for a single exercise by scanning ALL gym logs.
    // This corrects PRs that were inflated by accidental entries.
    recalculatePRsForExercise(exerciseName) {
        const logs = this.getGymLogs();
        let bestWeight = 0;
        let bestDate   = null;
        let bestReps   = 0;

        logs.forEach(log => {
            log.exercises.forEach(ex => {
                if (ex.name !== exerciseName) return;
                const weightsArr = ex.weights
                    || (ex.weight ? Array((ex.sets || []).length || 1).fill(ex.weight) : []);
                const repsArr = ex.sets || [];

                weightsArr.forEach((w, i) => {
                    const r = repsArr[i] || 0;
                    if (w > bestWeight && r > 0) {
                        bestWeight = w;
                        bestDate   = log.date;
                        bestReps   = r;
                    }
                });
            });
        });

        const prs = this.getPRs();
        if (bestWeight > 0) {
            prs[exerciseName] = {
                bestWeight,
                bestReps,
                bestVolume: bestWeight * bestReps,
                date: bestDate
            };
        } else {
            // No valid data found — remove stale PR
            delete prs[exerciseName];
        }
        this.set('prs', prs);
        if (typeof SupabaseSync !== 'undefined' && prs[exerciseName]) {
            SupabaseSync.pr(exerciseName, prs[exerciseName]);
        }
        return prs[exerciseName] || null;
    },

    // ===== SETTINGS =====
    getSettings() {
        return this.get('settings', {
            startDate:     new Date().toISOString().split('T')[0],
            startWeight:   CLIENT_PROFILE.startWeight,
            goalWeight:    CLIENT_PROFILE.goalWeight,
            weeklyTarget:  CLIENT_PROFILE.weeklyRateLoss,
            units:         'lbs',
            setupComplete: false
        });
    },

    saveSettings(settings) {
        this.set('settings', settings);
        if (typeof SupabaseSync !== 'undefined') SupabaseSync.settings(settings);
    },

    // ===== PROJECTED WEIGHT =====
    getProjectedWeight(weekNumber) {
        const s = this.getSettings();
        return Math.max(s.goalWeight, s.startWeight - (weekNumber * s.weeklyTarget));
    },

    getWeekNumber(date) {
        const s     = this.getSettings();
        const start = new Date(s.startDate);
        const target = new Date(date);
        const diffMs = target - start;
        return Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
    },

    // ===== EXPORT / IMPORT =====
    exportAll() {
        return JSON.stringify({
            weighins:      this.getWeighIns(),
            gymlogs:       this.getGymLogs(),
            prs:           this.getPRs(),
            settings:      this.getSettings(),
            customProgram: (() => {
                try {
                    const v = localStorage.getItem('flt_custom_program');
                    return v ? JSON.parse(v) : null;
                } catch { return null; }
            })(),
            exportDate: new Date().toISOString()
        }, null, 2);
    },

    importAll(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.weighins)  this.set('weighins', data.weighins);
            if (data.gymlogs)   this.set('gymlogs',  data.gymlogs);
            if (data.prs)       this.set('prs',       data.prs);
            if (data.settings)  this.set('settings',  data.settings);
            if (data.customProgram) {
                localStorage.setItem('flt_custom_program', JSON.stringify(data.customProgram));
            }
            return true;
        } catch { return false; }
    },

    clearAll() {
        Object.keys(localStorage)
            .filter(k => k.startsWith(this.PREFIX))
            .forEach(k => localStorage.removeItem(k));
        localStorage.removeItem('flt_custom_program');
    }
};
