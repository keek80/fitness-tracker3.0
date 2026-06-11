// ========== WEIGH-IN PAGE ==========
function renderWeighIn() {
    const page = document.getElementById('page-weighin');
    const weighIns = Storage.getWeighIns();
    const settings = Storage.getSettings();
    const today = new Date().toISOString().split('T')[0];

    page.innerHTML = `
        <div class="section-title">⚖️ Log Weigh-In</div>
        <div class="card">
            <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" id="weighInDate" class="form-input" value="${today}">
            </div>
            <div class="form-group">
                <label class="form-label">Weight (lbs)</label>
                <input type="number" id="weighInWeight" class="form-input" placeholder="Enter weight" step="0.1" inputmode="decimal">
            </div>
            <div class="form-group">
                <label class="form-label">Notes (optional)</label>
                <textarea id="weighInNotes" class="form-input" placeholder="How are you feeling? Sleep quality, stress, etc." rows="2"></textarea>
            </div>
            <button class="btn btn-primary" onclick="saveWeighIn()">💾 Save Weigh-In</button>
        </div>

        <div class="section-title">📉 Weight Trend</div>
        <div class="chart-container">
            <canvas id="weighInChart"></canvas>
        </div>

        <div class="section-title flex-between">
            <span>📋 History</span>
            <span class="text-muted" style="font-size:12px">${weighIns.length} entries</span>
        </div>
        <div id="weighInHistory">
            ${weighIns.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-icon">⚖️</div>
                    <p>No weigh-ins yet. Log your first one above!</p>
                </div>
            ` : weighIns.slice().reverse().map((entry, i, arr) => {
                const prev = i < arr.length - 1 ? arr[i + 1] : null;
                const change = prev ? entry.weight - prev.weight : 0;
                const changeStr = change === 0 ? '—' : (change > 0 ? '+' : '') + change.toFixed(1);
                const changeClass = change <= 0 ? 'negative' : 'positive';
                const weekNum = Storage.getWeekNumber(entry.date);
                const projected = Storage.getProjectedWeight(weekNum);
                const vsProj = entry.weight - projected;
                return `
                    <div class="history-item">
                        <div>
                            <div class="history-date">${formatDate(entry.date)}</div>
                            ${entry.notes ? `<div style="font-size:11px; color:var(--text-muted); margin-top:2px">${entry.notes}</div>` : ''}
                        </div>
                        <div style="display:flex; align-items:center; gap:12px">
                            <div style="text-align:right">
                                <div class="history-weight">${entry.weight}</div>
                                <div class="history-change ${changeClass}">${changeStr} lbs</div>
                            </div>
                            <button class="delete-btn" onclick="deleteWeighIn('${entry.date}')" title="Delete">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    renderWeighInChart(weighIns, settings);
}

function saveWeighIn() {
    const date = document.getElementById('weighInDate').value;
    const weight = parseFloat(document.getElementById('weighInWeight').value);
    const notes = document.getElementById('weighInNotes').value.trim();

    if (!date || !weight || weight < 100 || weight > 600) {
        showToast('Please enter a valid weight', 'error');
        return;
    }

    Storage.saveWeighIn({ date, weight, notes });
    showToast('✅ Weigh-in saved!');
    renderWeighIn();
    renderDashboard();
}

function deleteWeighIn(date) {
    if (confirm('Delete this weigh-in?')) {
        Storage.deleteWeighIn(date);
        showToast('Weigh-in deleted');
        renderWeighIn();
        renderDashboard();
    }
}

function renderWeighInChart(weighIns, settings) {
    const canvas = document.getElementById('weighInChart');
    if (!canvas || weighIns.length === 0) return;

    // Destroy any existing chart on this canvas
    destroyAllCharts();

    const labels = weighIns.map(e => formatDateShort(e.date));
    const actualData = weighIns.map(e => e.weight);
    const projOnActualDates = weighIns.map(e => {
        const wk = Storage.getWeekNumber(e.date);
        return Storage.getProjectedWeight(wk);
    });

    const chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Actual',
                    data: actualData,
                    borderColor: '#e94560',
                    backgroundColor: 'rgba(233,69,96,0.1)',
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#e94560',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Projected',
                    data: projOnActualDates,
                    borderColor: '#0095ff',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.6,
            plugins: {
                legend: { 
                    position: 'top', 
                    labels: { color: '#a0aec0', font: { size: 11 }, boxWidth: 12 } 
                }
            },
            scales: {
                x: { 
                    ticks: { color: '#718096', font: { size: 10 }, maxRotation: 45 },
                    grid: { color: 'rgba(45,55,72,0.5)' }
                },
                y: { 
                    ticks: { color: '#718096', font: { size: 10 } },
                    grid: { color: 'rgba(45,55,72,0.5)' },
                    suggestedMin: settings.goalWeight - 10,
                    suggestedMax: settings.startWeight + 5
                }
            }
        }
    });

    window.currentCharts.push(chart);
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
