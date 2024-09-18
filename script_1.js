document.addEventListener('DOMContentLoaded', function () {
    const sectionsDataKey = 'sectionsData';
    const today = new Date().toISOString().split('T')[0];
    let charts = {};

    const loadSectionsData = () => JSON.parse(localStorage.getItem(sectionsDataKey)) || {};
    const saveSectionsData = (data) => localStorage.setItem(sectionsDataKey, JSON.stringify(data));

    const updateSectionCounts = (sectionName, countUpdate, binaryValue = null) => {
        const sectionsData = loadSectionsData();
        const section = sectionsData[sectionName] || {};
        section.history = section.history || {};
        section.count = section.count || 0;

        if (binaryValue !== null) {
            section.history[today] = binaryValue;
        } else {
            section.count += countUpdate;
            section.history[today] = (section.history[today] || 0) + countUpdate;
        }

        sectionsData[sectionName] = section;
        saveSectionsData(sectionsData);
        renderSections();
        renderCharts();
    };

    const createSectionTemplate = (section, sectionName) => {
        const sectionType = section.type;
        const sectionCount = section.count || 0;
        const isVisible = section.visible;

        let sectionHtml = `
            <h2>${sectionName}</h2>
            <p>${section.question}</p>
        `;

        if (sectionType === 'numerical') {
            sectionHtml += `
                <button onclick="updateSectionCounts('${sectionName}', 1)">Dodaj</button>
                <div>Liczba: ${sectionCount}</div>
            `;
        } else {
            sectionHtml += `
                <button onclick="updateSectionCounts('${sectionName}', 0, 'TAK')">TAK</button>
                <button onclick="updateSectionCounts('${sectionName}', 0, 'NIE')">NIE</button>
                <div>Status: ${section.history[today] || 'Brak danych'}</div>
            `;
        }

        sectionHtml += `
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>${sectionType === 'numerical' ? 'Ilość' : 'Status'}</th>
                    </tr>
                </thead>
                <tbody>${renderSectionHistory(section.history)}</tbody>
            </table>
        `;

        return `
            <div class="section-container">
                <section>${sectionHtml}</section>
            </div>
        `;
    };

    const renderSections = () => {
        const sectionsData = loadSectionsData();
        const sectionsContainer = document.getElementById('sectionsContainer');
        const editSectionsContainer = document.getElementById('editSectionsContainer');
        sectionsContainer.innerHTML = '';
        editSectionsContainer.innerHTML = '';

        for (const sectionName in sectionsData) {
            const section = sectionsData[sectionName];
            if (section.visible) {
                sectionsContainer.innerHTML += createSectionTemplate(section, sectionName);
                // Add edit section logic here similarly
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
                        <h2>${sectionName}</h2>
                        <label>
                            <input type="checkbox" id="${sectionName}_visible" ${isVisible ? 'checked' : ''} onchange="toggleSectionVisibility('${sectionName}')">
                            Widoczny
                        </label>
                        <button onclick="deleteSection('${sectionName}')">Usuń sekcję</button>
                    </section>
                </div>
            `;
        }
    };

    const renderSectionHistory = (history) => {
        return Object.entries(history || {})
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, count]) => `<tr><td>${date}</td><td>${count}</td></tr>`).join('');
    };

    const renderCharts = () => {
        const sectionsData = loadSectionsData();
        const chartsContainer = document.getElementById('chartsContainer');
        chartsContainer.innerHTML = '';

        for (const sectionName in sectionsData) {
            const history = sectionsData[sectionName].history || {};
            const canvasId = `chart_${sectionName}`;
            chartsContainer.innerHTML += `
                <div class="section-container">
                    <section>
                        <h2>${sectionName}</h2>
                        <canvas id="${canvasId}" width="400" height="200"></canvas>
                    </section>
                </div>
            `;
            // Assume Chart is a global variable from an inclusion of Chart.js
            const ctx = document.getElementById(canvasId).getContext('2d');
            const isBinary = sectionsData[sectionName].type === 'binary';
            const data = isBinary ? Object.keys(history).map(date => history[date] === 'TAK' ? 1 : -1) :
                Object.values(history);
            const backgroundColor = isBinary ? 'rgba(153, 102, 255, 0.5)' : 'rgba(75, 192, 192, 0.5)';
            const borderColor = isBinary ? 'rgba(153, 102, 255, 1)' : 'rgba(75, 192, 192, 1)';
            charts[canvasId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(history),
                    datasets: [{
                        label: sectionName,
                        data,
                        backgroundColor,
                        borderColor,
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };

    // Attach other functions here e.g., addNewSection, editSectionHistory, resetSectionHistory, toggleSectionVisibility

    renderSections();
});