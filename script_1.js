document.addEventListener('DOMContentLoaded', () => {
    const homeLink = document.getElementById('homeLink');
    const reportsLink = document.getElementById('reportsLink');
    const editLink = document.getElementById('editLink');
    const manageLink = document.getElementById('manageLink');
    const addSectionBtn = document.getElementById('addSectionBtn');

    homeLink.addEventListener('click', () => displaySection('homePage'));
    reportsLink.addEventListener('click', () => displaySection('reportsPage'));
    editLink.addEventListener('click', () => displaySection('editPage'));
    manageLink.addEventListener('click', () => displaySection('managePage'));
    addSectionBtn.addEventListener('click', addNewSection);

    const sectionsDataKey = 'sectionsData';
    const today = new Date().toISOString().split('T')[0];
    let charts = {};

    const loadSectionsData = () => JSON.parse(localStorage.getItem(sectionsDataKey)) || {};
    const saveSectionsData = data => localStorage.setItem(sectionsDataKey, JSON.stringify(data));
    const escapeHtml = unsafe => unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

    const updateSectionCounts = (sectionName, countUpdate, binaryValue = null) => {
        const sectionsData = loadSectionsData();
        const history = sectionsData[sectionName].history || {};
        const count = sectionsData[sectionName].count || 0;
        if (binaryValue !== null) {
            history[today] = binaryValue;
            sectionsData[sectionName].count = binaryValue === 'TAK' ? 1 : 0;
        } else {
            sectionsData[sectionName].count = count + countUpdate;
            history[today] = (history[today] || 0) + countUpdate;
        }
        sectionsData[sectionName].history = history;
        saveSectionsData(sectionsData);
        renderSections();
        renderCharts();
    };

    const renderSectionHistory = history => {
        return Object.entries(history || {}).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, count]) => `<tr><td>${date}</td><td>${count}</td></tr>`).join('');
    };

    const renderSections = () => {
        const sectionsData = loadSectionsData();
        const sectionsContainer = document.getElementById('sectionsContainer');
        const editSectionsContainer = document.getElementById('editSectionsContainer');
        sectionsContainer.innerHTML = '';
        editSectionsContainer.innerHTML = '';

        for (const sectionName in sectionsData) {
            const section = sectionsData[sectionName];
            const sectionType = section.type;
            const sectionCount = section.count || 0;
            const isVisible = section.visible;
            if (isVisible) {
                sectionsContainer.innerHTML += `
                    <div class="section-container">
                        <section>
                            <h2>${escapeHtml(sectionName)}</h2>
                            <p>${escapeHtml(section.question)}</p>
                            ${sectionType === 'numerical' ? `
                                <button onclick="updateSectionCounts(${escapeHtml(sectionName)}, 1)">Dodaj</button>
                                <div>Liczba: ${sectionCount}</div>
                            ` : `
                                <button onclick="updateSectionCounts(${escapeHtml(sectionName)}, 0, 'TAK')">TAK</button>
                                <button onclick="updateSectionCounts(${escapeHtml(sectionName)}, 0, 'NIE')">NIE</button>
                                <div>Status: ${escapeHtml(section.history[today] || 'Brak danych')}</div>
                            `}
                            <table>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>${sectionType === 'numerical' ? 'Ilość' : 'Status'}</th>
                                    </tr>
                                </thead>
                                <tbody>${renderSectionHistory(section.history)}</tbody>
                            </table>
                        </section>
                    </div>
                `;

                editSectionsContainer.innerHTML += `
                    <div class="section-container">
                        <section>
                            <h2>${escapeHtml(sectionName)}</h2>
                            <input type="date" id="${escapeHtml(sectionName)}_date" value="${today}">
                            ${sectionType === 'numerical' ? `
                                <input type="number" id="${escapeHtml(sectionName)}_count" placeholder="Liczba">
                                <button onclick="editSectionHistory('${escapeHtml(sectionName)}')">Aktualizuj</button>
                            ` : `
                                <button onclick="editSectionHistory('${escapeHtml(sectionName)}', 'TAK')">TAK</button>
                                <button onclick="editSectionHistory('${escapeHtml(sectionName)}', 'NIE')">NIE</button>
                            `}
                            <button onclick="resetSectionHistory('${escapeHtml(sectionName)}')">Resetuj</button>
                        </section>
                    </div>
                `;
            }
        }
        renderManageSections();
    };

    const renderManageSections = () => {
        const sectionsData = loadSectionsData();
        const manageSectionsContainer = document.getElementById('manageSectionsContainer');
        manageSectionsContainer.innerHTML = '';
        for (const sectionName in sectionsData) {
            const isVisible = sectionsData[sectionName].visible;
            manageSectionsContainer.innerHTML += `
                <div class="section-container">
                    <section>
                        <h2>${escapeHtml(sectionName)}</h2>
                        <label>
                            <input type="checkbox" id="${escapeHtml(sectionName)}_visible" ${isVisible ? 'checked' : ''} onchange="toggleSectionVisibility('${escapeHtml(sectionName)}')">
                            Widoczny
                        </label>
                        <button onclick="deleteSection('${escapeHtml(sectionName)}')">Usuń sekcję</button>
                    </section>
                </div>
            `;
        }
    };

    const renderCharts = () => {
        const sectionsData = loadSectionsData();
        const chartsContainer = document.getElementById('chartsContainer');
        chartsContainer.innerHTML = '';
        for (const sectionName in sectionsData) {
            const history = sectionsData[sectionName].history || {};
            if (history && Object.keys(history).length) {
                const ctx = document.createElement('canvas');
                chartsContainer.appendChild(ctx);
                const data = {
                    labels: Object.keys(history),
                    datasets: [{
                        label: sectionName,
                        data: Object.values(history),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                };
                const config = {
                    type: 'line',
                    data: data,
                };
                new Chart(ctx, config);
            }
        }
    };

    renderSections();
    renderCharts();
});

function displaySection(sectionId) {
    document.querySelectorAll('main .container > div').forEach(el => el.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function toggleSectionVisibility(sectionName) {
    const sectionsData = loadSectionsData();
    sectionsData[sectionName].visible = !sectionsData[sectionName].visible;
    saveSectionsData(sectionsData);
    renderSections();
    renderCharts();
}

function deleteSection(sectionName) {
    const sectionsData = loadSectionsData();
    delete sectionsData[sectionName];
    saveSectionsData(sectionsData);
    renderSections();
    renderCharts();
}

function addNewSection() {
    const sectionName = document.getElementById('newSectionName').value.trim();
    const sectionType = document.getElementById('newSectionType').value;
    const sectionQuestion = document.getElementById('newSectionQuestion').value.trim();

    if (sectionName && sectionType) {
        const sectionsData = loadSectionsData();
        sectionsData[sectionName] = {
            type: sectionType,
            question: sectionQuestion,
            count: 0,
            history: {},
            visible: true
        };
        saveSectionsData(sectionsData);
        renderSections();
        renderCharts();
    }
}