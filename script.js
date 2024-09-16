// Funkcja do ustawiania danych w localStorage
function setStorageItem(name, value) {
    localStorage.setItem(name, value);
}

// Funkcja do pobierania danych z localStorage
function getStorageItem(name) {
    return localStorage.getItem(name);
}

// Funkcja do usuwania danych z localStorage
function removeStorageItem(name) {
    localStorage.removeItem(name);
}

// Pobranie zapisanej liczby kaw i wody, historii oraz statusu suplementów z localStorage
let coffeeCount = parseInt(getStorageItem('coffeeCount') || 0);
let coffeeHistory = JSON.parse(getStorageItem('coffeeHistory')) || {};
let waterCount = parseFloat(getStorageItem('waterCount') || 0);
let waterHistory = JSON.parse(getStorageItem('waterHistory')) || {};
let supplementStatus = JSON.parse(getStorageItem('supplementStatus')) || {};
let oilStatus = JSON.parse(getStorageItem('oilStatus')) || {};
let spanishStatus = JSON.parse(getStorageItem('spanishStatus')) || {};

const today = new Date().toISOString().split('T')[0]; // Data w formacie YYYY-MM-DD
let coffeeChart = null;
let waterChart = null;
let supplementChart = null;
let oilChart = null;
let spanishChart = null;

// Funkcja do dodawania kawy
function addCoffee() {
    coffeeCount = (parseInt(coffeeCount) || 0) + 1;
    setStorageItem('coffeeCount', coffeeCount);

    // Aktualizacja historii kaw
    coffeeHistory[today] = (coffeeHistory[today] || 0) + 1;
    setStorageItem('coffeeHistory', JSON.stringify(coffeeHistory));

    updateCoffeeResult();
    updateCoffeeHistory();
    updateCharts();
}

// Funkcja do dodawania wody
function addWater() {
    waterCount = (parseFloat(waterCount) || 0) + 0.25; // Załóżmy, że każdorazowo dodajemy 0.25 litra wody
    setStorageItem('waterCount', waterCount);

    // Aktualizacja historii wody
    waterHistory[today] = (waterHistory[today] || 0) + 0.25;
    setStorageItem('waterHistory', JSON.stringify(waterHistory));

    updateWaterResult();
    updateWaterHistory();
    updateCharts();
}

// Funkcja do resetowania licznika kawy
function resetCoffeeCounter() {
    coffeeCount = 0;
    setStorageItem('coffeeCount', coffeeCount);

    // Wyczyszczenie historii kawy
    coffeeHistory = {};
    setStorageItem('coffeeHistory', JSON.stringify(coffeeHistory));

    updateCoffeeResult();
    updateCoffeeHistory();
    updateCharts();
}

// Funkcja do resetowania licznika wody
function resetWaterCounter() {
    waterCount = 0;
    setStorageItem('waterCount', waterCount);

    // Wyczyszczenie historii wody
    waterHistory = {};
    setStorageItem('waterHistory', JSON.stringify(waterHistory));

    updateWaterResult();
    updateWaterHistory();
    updateCharts();
}

// Funkcja do aktualizacji liczby kawy
function updateCoffeeCount() {
    const newCount = parseInt(document.getElementById('editCoffeeCount').value) || 0;
    const editDate = document.getElementById('editCoffeeDate').value;

    coffeeHistory[editDate] = newCount;
    setStorageItem('coffeeHistory', JSON.stringify(coffeeHistory));

    updateCoffeeHistory();
    updateCharts();
}

// Funkcja do aktualizacji liczby wody
function updateWaterCount() {
    const newCount = parseFloat(document.getElementById('editWaterCount').value) || 0;
    const editDate = document.getElementById('editWaterDate').value;

    waterHistory[editDate] = newCount;
    setStorageItem('waterHistory', JSON.stringify(waterHistory));

    updateWaterHistory();
    updateCharts();
}

// Funkcja do aktualizacji liczby kawy
function historicSupplement(status) {
    const editDate = document.getElementById('editSupplementsDate').value;

    supplementStatus[editDate] = status;
    setStorageItem('supplementStatus', JSON.stringify(supplementStatus));

    updateSupplementHistory();
    updateCharts();
}


function historicOil(status) {
    const editDate = document.getElementById('editOilDate').value;

    oilStatus[editDate] = status;
    setStorageItem('oilStatus', JSON.stringify(oilStatus));

    updateOilHistory();
    updateCharts();
}

function historicSpanish(status) {
    const editDate = document.getElementById('editSpanishDate').value;

    spanishStatus[editDate] = status;
    setStorageItem('spanishStatus', JSON.stringify(oilStatus));

    updateSpanishHistory();
    updateCharts();
}

// Funkcja do aktualizacji wyświetlanej liczby kawy
function updateCoffeeResult() {
    document.getElementById('coffeeResult').innerHTML = `Liczba wypitych kaw: <b>${coffeeCount}</b>`;
}

// Funkcja do aktualizacji wyświetlanej liczby wody
function updateWaterResult() {
    document.getElementById('waterResult').innerHTML = `Liczba wypitych litrów wody: <b>${parseFloat(waterCount).toFixed(2)}</b>`;
}

function updateSupplementResult() {
    const status = supplementStatus[today] || 'Brak danych';
    document.getElementById('supplementResult').innerHTML = `Czy zażyłeś suplementy dzisiaj? <b>${status}</b>`;
}

function updateSupplementHistory() {
    const sortedEntries = Object.entries(supplementStatus).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));
    const tbody = document.getElementById('supplementHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, status] of sortedEntries) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellStatus = row.insertCell(1);

        cellDate.textContent = date;
        cellStatus.textContent = status;
    }
}

function updateWaterHistory() {
    const sortedEntries = Object.entries(waterHistory).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));
    const tbody = document.getElementById('waterHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, count] of sortedEntries) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellCount = row.insertCell(1);

        cellDate.textContent = date;
        cellCount.textContent = parseFloat(count).toFixed(2); // Format the number
    }
}

function updateCoffeeHistory() {
    const sortedEntries = Object.entries(coffeeHistory).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));
    const tbody = document.getElementById('coffeeHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, count] of sortedEntries) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellCount = row.insertCell(1);

        cellDate.textContent = date;
        cellCount.textContent = count;
    }
}

// Funkcja do resetowania historii suplementów
function resetOilHistory() {
    oilStatus = {}; // Wyczyszczenie historii suplementów
    getStorageItem('oilStatus', JSON.stringify(oilStatus), 7); // Zapisz w ciasteczkach

    updateOilHistory();
    updateOilResult();
}

// Funkcja do resetowania historii suplementów
function resetSpanishHistory() {
    spanishStatus = {}; // Wyczyszczenie historii suplementów
    getStorageItem('spanishStatus', JSON.stringify(spanishStatus), 7); // Zapisz w ciasteczkach

    updateSpanishHistory();
    updateSpanishResult();
}


// Funkcja do rysowania wykresów
function updateCharts() {
    const coffeeHistory = JSON.parse(getStorageItem('coffeeHistory') || '{}');
    const waterHistory = JSON.parse(getStorageItem('waterHistory') || '{}');
    const supplementHistory = JSON.parse(getStorageItem('supplementStatus') || '{}');
    const oilHistory = JSON.parse(getStorageItem('oilStatus') || '{}');
    const spanishHistory = JSON.parse(getStorageItem('spanishStatus') || '{}');

    const ctxCoffee = document.getElementById('coffeeChart').getContext('2d');
    const ctxWater = document.getElementById('waterChart').getContext('2d');
    const ctxSupplement = document.getElementById('supplementChart').getContext('2d');
    const ctxOil = document.getElementById('oilChart').getContext('2d');
    const ctxSpanish = document.getElementById('spanishChart').getContext('2d');

    // Sprawdzenie i zniszczenie poprzednich wykresów
    if (coffeeChart) {
        coffeeChart.destroy();
    }
    if (waterChart) {
        waterChart.destroy();
    }
    if (supplementChart) {
        supplementChart.destroy();
    }
    if (oilChart) {
        oilChart.destroy();
    }
    if (spanishChart) {
        spanishChart.destroy();
    }

    // Tworzenie nowych wykresów
    coffeeChart = new Chart(ctxCoffee, {
        type: 'bar',
        data: {
            labels: Object.keys(coffeeHistory),
            datasets: [{
                label: 'Liczba wypitych kaw',
                data: Object.values(coffeeHistory),
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // Nice pink color
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    waterChart = new Chart(ctxWater, {
        type: 'bar',
        data: {
            labels: Object.keys(waterHistory),
            datasets: [{
                label: 'Liczba wypitych litrów wody',
                data: Object.values(waterHistory),
                backgroundColor: 'rgba(54, 162, 235, 0.5)', // Cool blue color
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    supplementChart = new Chart(ctxSupplement, {
        type: 'bar',
        data: {
            labels: Object.keys(supplementHistory),
            datasets: [{
                label: 'Zażyte suplementy',
                data: Object.keys(supplementHistory).map(date => supplementHistory[date] === 'TAK' ? 1 : -1),
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Soft teal color
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    oilChart = new Chart(ctxOil, {
        type: 'bar',
        data: {
            labels: Object.keys(oilHistory),
            datasets: [{
                label: 'Olejowanie',
                data: Object.keys(oilHistory).map(date => oilHistory[date] === 'TAK' ? 1 : -1),
                backgroundColor: 'rgba(255, 159, 64, 0.5)', // Warm orange color
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    spanishChart = new Chart(ctxSpanish, {
        type: 'bar',
        data: {
            labels: Object.keys(spanishHistory),
            datasets: [{
                label: 'Hiszpański',
                data: Object.keys(spanishHistory).map(date => spanishHistory[date] === 'TAK' ? 1 : -1),
                backgroundColor: 'rgba(153, 102, 255, 0.5)', // Light purple color
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
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




function updateOilResult() {
    const status = oilStatus[today] || 'Brak danych';
    document.getElementById('oilStatusResult').innerHTML = `Czy olejowałaś dzisiaj? <b>${status}</b>`;
}

function updateOilHistory() {
    const sortedEntries = Object.entries(oilStatus).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));

    const tbody = document.getElementById('oilHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, status] of sortedEntries) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellStatus = row.insertCell(1);

        cellDate.textContent = date;
        cellStatus.textContent = status;
    }
}

function updateSpanishResult() {
    const status = spanishStatus[today] || 'Brak danych';
    document.getElementById('spanishStatusResult').innerHTML = `Czy hiszpański był? <b>${status}</b>`;
}

function updateSpanishHistory() {
    const sortedEntries = Object.entries(spanishStatus).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));

    const tbody = document.getElementById('spanishHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, status] of sortedEntries) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellStatus = row.insertCell(1);

        cellDate.textContent = date;
        cellStatus.textContent = status;
    }
}



// Funkcja do zaznaczenia, czy zażyłeś suplementy
function takeSupplement(status) {
    supplementStatus[today] = status;
    setStorageItem('supplementStatus', JSON.stringify(supplementStatus));

    updateSupplementResult();
    updateSupplementHistory();
}

// Funkcja do resetowania historii suplementów
function resetSupplementHistory() {
    supplementStatus = {}; // Wyczyszczenie historii suplementów
    setStorageItem('supplementStatus', JSON.stringify(supplementStatus)); // Zapisz w localStorage

    updateSupplementHistory();
    updateSupplementResult();
}

function didOil(status) {
    oilStatus[today] = status;
    setStorageItem('oilStatus', JSON.stringify(oilStatus), 7);

    updateOilResult();
    updateOilHistory();
}

function didSpanish(status) {
    spanishStatus[today] = status;
    localStorage.setItem('spanishStatus', JSON.stringify(spanishStatus));

    updateSpanishResult();
    updateSpanishHistory();
}


function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    document.getElementById('editWaterDate').value = today;
    document.getElementById('editCoffeeDate').value = today;
    document.getElementById('editSupplementsDate').value = today;
    document.getElementById('editOilDate').value = today;
    document.getElementById('editSpanishDate').value = today;
}


// Funkcja do pokazania strony głównej
function showHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('editPage').style.display = 'none';
    document.getElementById('reportsPage').style.display = 'none';

    setActiveLink('homeLink');
}

// Funkcja do pokazania strony edycji
function showEdit() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('reportsPage').style.display = 'none';
    document.getElementById('editPage').style.display = 'block';

    setActiveLink('editLink');
}

// Funkcja do wyświetlania zakładki Raporty
function showReports() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('editPage').style.display = 'none';
    document.getElementById('reportsPage').style.display = 'block';

    setActiveLink('reportsLink');

    updateCharts(); // Rysowanie wykresów po przejściu na stronę raportów
}

function setActiveLink(activeLinkId) {
    ['homeLink', 'editLink', 'reportsLink'].forEach(linkId => {
        document.getElementById(linkId).classList.toggle('active', linkId === activeLinkId);
    });
}


// Funkcja inicjalizacyjna
function init() {
    console.log('Initializing from localStorage...');
    initializeSectionVisibility();
    coffeeCount = parseInt(getStorageItem('coffeeCount') || 0);
    coffeeHistory = JSON.parse(getStorageItem('coffeeHistory')) || {};
    waterCount = parseFloat(getStorageItem('waterCount') || 0);
    waterHistory = JSON.parse(getStorageItem('waterHistory')) || {};
    supplementStatus = JSON.parse(getStorageItem('supplementStatus')) || {};
    oilStatus = JSON.parse(getStorageItem('oilStatus')) || {};
    spanishStatus = JSON.parse(getStorageItem('spanishStatus')) || {};

    console.log('Retrieved coffeeCount:', coffeeCount);
    console.log('Retrieved coffeeHistory:', coffeeHistory);
    console.log('Retrieved waterCount:', waterCount);
    console.log('Retrieved waterHistory:', waterHistory);
    console.log('Retrieved supplementStatus:', supplementStatus);
    console.log('Retrieved oilStatus:', oilStatus);
    console.log('Retrieved spanishStatus:', spanishStatus);

    updateCoffeeResult();
    updateWaterResult();
    updateSupplementResult();
    updateCoffeeHistory();
    updateWaterHistory();
    updateSupplementHistory();
    updateOilResult();
    updateOilHistory();
    updateSpanishResult();
    updateSpanishHistory();

    setDefaultDate();
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const isVisible = section.style.display !== 'none';

    section.style.display = isVisible ? 'none' : 'block';
    localStorage.setItem(sectionId, isVisible ? 'hidden' : 'visible');

    let visibility = isVisible ? 'hidden' : 'visible';
    const div = document.getElementById(sectionId + '_chart');
    if (div) {
        console.log(`Updating visibility for ${sectionId}_chart to ${visibility}`);
        div.style.display = visibility === 'visible' ? 'block' : 'none';
    }
}


// Funkcja inicjalizująca widoczność sekcji
function initializeSectionVisibility() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionId = section.id;
        let visibility = localStorage.getItem(sectionId);

        if (visibility === null) {
            visibility = 'visible';
            localStorage.setItem(sectionId, visibility);
        }

        section.style.display = visibility === 'visible' ? 'block' : 'none';

        // Ustawienie checkboxa
        const checkbox = document.getElementById(sectionId + '_checkbox');
        if (checkbox) {
            checkbox.checked = visibility === 'visible';
        }

        const div = document.getElementById(sectionId + '_chart');
        console.log(`Updating visibility for ${div}`);

        if (div) {
            div.style.display = visibility === 'visible' ? 'block' : 'none';
        }
    });
}


// Wywołanie funkcji inicjalizującej przy załadowaniu strony
window.onload = function() {
    init();
};
