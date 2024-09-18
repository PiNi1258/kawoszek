document.addEventListener('DOMContentLoaded', function () {
    const sectionsDataKey = 'sectionsData';
    const today = new Date().toISOString().split('T')[0];
    let charts = {};

    const loadSectionsData = () => JSON.parse(localStorage.getItem(sectionsDataKey)) || {};

    const saveSectionsData = (data) => localStorage.setItem(sectionsDataKey, JSON.stringify(data));

    const updateSectionCounts = (sectionName, countUpdate, binaryValue = null) => {
        const sectionsData = loadSectionsData();
        const history = sectionsData[sectionName].history || {};
        const count = sectionsData[sectionName].count || 0;

        if (binaryValue !== null) {
            history[today] = binaryValue;
        } else {
            sectionsData[sectionName].count = count + countUpdate;
            history[today] = (history[today] || 0) + countUpdate;
        }
        sectionsData[sectionName].history = history;

        saveSectionsData(sectionsData);
        renderSections();
        renderCharts();
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
                          <h2>${sectionName}</h2>
                          <p>${section.question}</p>
                          ${sectionType === 'numerical' ? `
                              <button onclick="updateSectionCounts('${sectionName}', 1)">Dodaj</button>
                              <div>Liczba: ${sectionCount}</div>
                          ` : `
                              <button onclick="updateSectionCounts('${sectionName}', 0, 'TAK')">TAK</button>
                              <button onclick="updateSectionCounts('${sectionName}', 0, 'NIE')">NIE</button>
                              <div>Status: ${section.history[today] || 'Brak danych'}</div>
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
                          <h2>${sectionName}</h2>
                          <input type="date" id="${sectionName}_date" value="${today}">
                          ${sectionType === 'numerical' ? `
                              <input type="number" id="${sectionName}_count" placeholder="Liczba">
                              <button onclick="editSectionHistory('${sectionName}')">Aktualizuj</button>
                          ` : `
                              <button onclick="editSectionHistory('${sectionName}', 'TAK')">TAK</button>
                              <button onclick="editSectionHistory('${sectionName}', 'NIE')">NIE</button>
                          `}
                          <button onclick="resetSectionHistory('${sectionName}')">Resetuj</button>
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

            let ctx = document.getElementById(canvasId).getContext('2d');

            let isBinary = sectionsData[sectionName].type === 'binary';
            let data = isBinary ? Object.keys(history).map(date => history[date] === 'TAK' ? 1 : -1) : Object.values(history);
            let backgroundColor = isBinary ? 'rgba(153, 102, 255, 0.5)' : 'rgba(75, 192, 192, 0.5)';
            let borderColor = isBinary ? 'rgba(153, 102, 255, 1)' : 'rgba(75, 192, 192, 1)';

            charts[canvasId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(history),
                    datasets: [{
                        label: sectionName,
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
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

    const addNewSection = () => {
        const newSectionName = document.getElementById('newSectionName').value;
        const newSectionType = document.getElementById('newSectionType').value;
        const newSectionQuestion = document.getElementById('newSectionQuestion').value;

        if (!newSectionName) {
            alert('Proszę wprowadzić nazwę sekcji.');
            return;
        }

        const sectionsData = loadSectionsData();

        if (sectionsData[newSectionName]) {
            alert('Sekcja o tej nazwie już istnieje.');
            return;
        }

        sectionsData[newSectionName] = {
            name: newSectionName,
            type: newSectionType,
            question: newSectionQuestion,
            count: 0,
            history: {},
            visible: true,
        };

        saveSectionsData(sectionsData);
        renderSections();
    };

    const editSectionHistory = (sectionName, binaryValue = null) => {
        const selectedDate = document.getElementById(`${sectionName}_date`).value;
        const countValue = binaryValue === null ? parseInt(document.getElementById(`${sectionName}_count`).value) : binaryValue;

        const sectionsData = loadSectionsData();
        const history = sectionsData[sectionName].history || {};

        if (binaryValue !== null) {
            history[selectedDate] = binaryValue;
        } else {
            if (isNaN(countValue)) {
                alert('Proszę wprowadzić liczbę.');
                return;
            }
            history[selectedDate] = countValue;
        }

        sectionsData[sectionName].history = history;
        saveSectionsData(sectionsData);
        renderSections();
        renderCharts();
    };

    const resetSectionHistory = (sectionName) => {
        if (confirm('Czy na pewno chcesz zresetować historię tej sekcji?')) {
            const sectionsData = loadSectionsData();
            sectionsData[sectionName].history = {};
            saveSectionsData(sectionsData);
            renderSections();
            renderCharts();
        }
    };

    const toggleSectionVisibility = (sectionName) => {
        const isVisible = document.getElementById(`${sectionName}_visible`).checked;
        const sectionsData = loadSectionsData();
        sectionsData[sectionName].visible = isVisible;
        saveSectionsData(sectionsData);
        renderSections();
    };

    const deleteSection = (sectionName) => {
        if (confirm('Czy na pewno chcesz usunąć tę sekcję?')) {
            const sectionsData = loadSectionsData();
            delete sectionsData[sectionName];
            saveSectionsData(sectionsData);
            renderSections();
            renderCharts();
        }
    };

    const displaySection = (sectionId) => {
        document.querySelectorAll('main .container > div').forEach(div => {
            div.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';

        if (sectionId === 'reportsPage') {
            renderCharts();
        }
    };

    renderSections();
});
