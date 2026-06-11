// ========== MEALS PAGE ==========
function renderMeals() {
    const page = document.getElementById('page-meals');
    const mp = MEAL_PLAN;

    page.innerHTML = `
        <div class="section-title">🍽️ Daily Meal Plan</div>
        
        <div class="card">
            <div class="card-title" style="margin-bottom:10px">📐 Daily Targets vs. Plan</div>
            <div class="stat-grid" style="margin-bottom:0">
                <div class="stat-box accent">
                    <div class="stat-value" style="font-size:20px">${mp.dailyActual.calories}</div>
                    <div class="stat-label">Calories</div>
                    <div style="font-size:10px; color:var(--accent-green)">374 under budget</div>
                </div>
                <div class="stat-box green">
                    <div class="stat-value" style="font-size:20px">${mp.dailyActual.protein}g</div>
                    <div class="stat-label">Protein</div>
                    <div style="font-size:10px; color:var(--accent-orange)">33g below 250g</div>
                </div>
                <div class="stat-box blue">
                    <div class="stat-value" style="font-size:20px">${mp.dailyActual.carbs}g</div>
                    <div class="stat-label">Carbs</div>
                    <div style="font-size:10px; color:var(--accent-green)">✅ On target</div>
                </div>
                <div class="stat-box orange">
                    <div class="stat-value" style="font-size:20px">${mp.dailyActual.fat}g</div>
                    <div class="stat-label">Fat</div>
                    <div style="font-size:10px; color:var(--accent-green)">✅ On target</div>
                </div>
            </div>
        </div>

        ${mp.meals.map(meal => `
            <div class="meal-card">
                <div class="meal-title">${meal.emoji} ${meal.name}</div>
                <div class="meal-macros">
                    <span class="badge badge-red">${meal.calories} kcal</span>
                    <span class="badge badge-green">${meal.protein}g protein</span>
                    <span class="badge badge-blue">${meal.carbs}g carbs</span>
                    <span class="badge badge-orange">${meal.fat}g fat</span>
                </div>
                <div class="meal-items">
                    ${meal.items.map(item => `• ${item}`).join('<br>')}
                </div>
                ${meal.tip ? `<div style="margin-top:8px; font-size:12px; color:var(--accent-orange)">💡 ${meal.tip}</div>` : ''}
            </div>
        `).join('')}

        <div class="section-title">💡 Closing the Protein Gap</div>
        <div class="card">
            <div style="font-size:13px; color:var(--text-secondary); line-height:1.6">
                <div style="padding:4px 0">• Double-scoop one protein shake → <strong>+25g protein</strong></div>
                <div style="padding:4px 0">• Add 4 extra egg whites to Meal 2 → <strong>+14g protein</strong></div>
                <div style="padding:4px 0">• Add ½ cup black beans to Meal 4 → <strong>+8g protein</strong></div>
                <div style="padding:4px 0">• 150g Greek yogurt cup as snack → <strong>+15g protein</strong></div>
            </div>
            <div style="margin-top:10px; font-size:12px; color:var(--accent-green)">
                ✅ Any two of these fixes gets you to ~250g while staying under 2,500 calories.
            </div>
        </div>

        <div class="section-title">🧊 Meal Prep Tips</div>
        <div class="card" style="font-size:13px; color:var(--text-secondary); line-height:1.6">
            <div style="padding:4px 0">🥩 <strong>Bulk cook turkey</strong> on Sunday — season with taco spices, portion into containers</div>
            <div style="padding:4px 0">🌯 <strong>Pre-roll burritos</strong> and wrap in foil — refrigerate 3 days or freeze 2 weeks</div>
            <div style="padding:4px 0">☕ <strong>Prep shake ingredients</strong> in baggies — just add coffee and shake</div>
            <div style="padding:4px 0">🍫 <strong>Mug cake</strong> dry mix in containers — add egg white and microwave when ready</div>
            <div style="padding:4px 0">🧊 <strong>Freezer hack:</strong> Roll 4-5 burritos, wrap in foil, freeze. Microwave 2-3 min.</div>
        </div>
    `;
}
