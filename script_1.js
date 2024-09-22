const sectionsDataKey = 'sectionsData';
const today = new Date().toISOString().split('T')[0];
let charts = {};

// Storage Functions
const loadSectionsData = () => JSON.parse(localStorage.getItem(sectionsDataKey)) || {};
const saveSectionsData = (data) => localStorage.setItem(sectionsDataKey, JSON.stringify(data));

// Section Management Functions
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

const deleteSection = (sectionName) => {
    const sectionsData = loadSectionsData();
    delete sectionsData[sectionName];
    saveSectionsData(sectionsData);
    renderSections();
};

const addNewSection = () => {
    const newSectionName = document.getElementById('newSectionName').value;
    const newSectionType = document.getElementById('newSectionType').value;
    const newSectionQuestion = document.getElementById('newSectionQuestion').value;

    if (newSectionName && newSectionQuestion) {
        const sectionsData = loadSectionsData();
        sectionsData[newSectionName] = {
            type: newSectionType,
            question: newSectionQuestion,
            count: 0,
            history: {},
            visible: true,
        };
        saveSectionsData(sectionsData);
        renderSections();
    } else {
        alert('Wszystkie pola są wymagane!');
    }
};

// Data Export/Import Functions
const exportData = () => {
    const sectionsData = loadSectionsData();
    const dataStr = JSON.stringify(sectionsData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sections_data.json';
    a.click();
    URL.revokeObjectURL(url);
};

const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const sectionsData = JSON.parse(e.target.result);
            saveSectionsData(sectionsData);
            renderSections();
            renderCharts();
        } catch (error) {
            alert('Błąd podczas importowania danych: ' + error.message);
        }
    };
    reader.readAsText(file);
};

// Render Functions
const renderSections = () => {
    const sectionsData = loadSectionsData();
    const sectionsContainer = document.getElementById('sectionsContainer');
    const editSectionsContainer = document.getElementById('editSectionsContainer');
    const addSectionContainer = document.getElementById('addSectionsContainer');

    sectionsContainer.innerHTML = '';
    editSectionsContainer.innerHTML = '';
    addSectionContainer.innerHTML = getAddSectionHTML();

    for (const sectionName in sectionsData) {
        const section = sectionsData[sectionName];
        if (section.visible) {
            sectionsContainer.innerHTML += getSectionHTML(sectionName, section);
            renderCharts();
        }
        editSectionsContainer.innerHTML += getEditSectionHTML(sectionName);
    }
};

const getAddSectionHTML = () => `
    <h2>Dodaj nową sekcję</h2>
    <div class="section">
        <div class="input-wrapper">
            <label for="newSectionType">Nazwa:</label>
            <input id="newSectionName" placeholder="Nazwa sekcji" type="text">
        </div>
        <div class="select-wrapper">
            <label for="newSectionType">Typ:</label>
            <select id="newSectionType">
                <option value="numerical">Licznik +1</option>
                <option value="binary">"Tak" lub "Nie"</option>
            </select>
        </div>
        <div class="input-wrapper">
            <label for="newSectionType">Pytanie:</label>
            <input id="newSectionQuestion" placeholder="Pytanie do sekcji" type="text">
        </div>
        <button onclick="addNewSection()">Dodaj</button>
    </div>
`;

const getSectionHTML = (sectionName, section) => `
    <div class="section">
        <section>
            <h2>${sectionName}</h2>
            <p>${section.question}</p>
            ${section.type === 'numerical' ? getNumericalSectionButtons(sectionName) : getBinarySectionButtons(sectionName)}
            <table class="section" id="${sectionName}_history_table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>${section.type === 'numerical' ? 'Ilość' : 'Status'}</th>
                    </tr>
                </thead>
                <tbody>${renderSectionHistory(section.history)}</tbody>
            </table>
            <canvas id="${sectionName}_chart" width="400" height="200"></canvas>
        </section>
    </div>
`;

const getNumericalSectionButtons = (sectionName) => `
    <button onclick="updateSectionCounts('${sectionName}', 1)">+1</button>
    <button onclick="updateSectionCounts('${sectionName}', -1)">-1</button>
`;

const getBinarySectionButtons = (sectionName) => `
    <button onclick="updateSectionCounts('${sectionName}', 0, 'TAK')">Tak</button>
    <button onclick="updateSectionCounts('${sectionName}', 0, 'NIE')">Nie</button>
`;

const renderSectionHistory = (history) => {
    return Object.keys(history).map(date => `
        <tr>
            <td>${date}</td>
            <td>${history[date]}</td>
        </tr>
    `).join('');
};

const renderCharts = () => {
    const sectionsData = loadSectionsData();
    for (const sectionName in sectionsData) {
        const section = sectionsData[sectionName];
        const ctx = document.getElementById(`${sectionName}_chart`).getContext('2d');
        const chartData = {
            labels: Object.keys(section.history),
            datasets: [{
                label: sectionName,
                data: Object.values(section.history),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        };
        if (charts[sectionName]) {
            charts[sectionName].destroy();
        }
        charts[sectionName] = new Chart(ctx, {
            type: 'line',
            data: chartData,
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

const getEditSectionHTML = (sectionName) => `
    <div class="section">
        <h2>${sectionName}</h2>
        <button onclick="deleteSection('${sectionName}')">Usuń</button>
    </div>
`;

// Toggle Functions
const toggleHistoryVisibility = () => {
    const historyTables = document.querySelectorAll('[id$="_history_table"]');
    historyTables.forEach(table => {
        table.style.display = table.style.display === 'none' ? 'table' : 'none';
    });
};

const toggleChartsVisibility = () => {
    const chartContainers = document.querySelectorAll('[id$="_chart"]');
    chartContainers.forEach(container => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });
};

// Section Display Function
const displaySection = (sectionId) => {
    const sections = document.querySelectorAll('main > div');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
};

// Initialization Function
const init = () => {
    renderSections();
};

// Call init to start the application
init();
