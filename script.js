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
    const tbody = document.getElementById('supplementHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, status] of Object.entries(supplementStatus)) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellStatus = row.insertCell(1);

        cellDate.textContent = date;
        cellStatus.textContent = status;
    }
}

function updateWaterHistory() {
    const tbody = document.getElementById('waterHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, count] of Object.entries(waterHistory)) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellCount = row.insertCell(1);

        cellDate.textContent = date;
        cellCount.textContent = parseFloat(count).toFixed(2); // Format the number
    }
}

function updateCoffeeHistory() {
    const tbody = document.getElementById('coffeeHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, count] of Object.entries(coffeeHistory)) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellCount = row.insertCell(1);

        cellDate.textContent = date;
        cellCount.textContent = count;
    }
}


function updateCharts() {
    // Assuming you have a global Chart.js instance for water consumption
    const waterData = Object.values(waterHistory);
    const waterLabels = Object.keys(waterHistory);

    // Update water chart (assuming it's already initialized)
    waterChart.data.labels = waterLabels; // Update labels (dates)
    waterChart.data.datasets[0].data = waterData; // Update data (water counts)
    waterChart.update(); // Refresh the chart

    // Similar logic can be used for other charts (coffee, etc.)
}


function updateOilResult() {
    const status = oilStatus[today] || 'Brak danych';
    document.getElementById('oilStatusResult').innerHTML = `Czy olejowałaś dzisiaj? <b>${status}</b>`;
}

function updateOilHistory() {
    const tbody = document.getElementById('oilHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, status] of Object.entries(oilStatus)) {
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
    const tbody = document.getElementById('spanishHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear the table before adding new data

    for (const [date, status] of Object.entries(spanishStatus)) {
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
}


// Funkcja inicjalizacyjna
function init() {
    console.log('Initializing from localStorage...');

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

// Wywołanie funkcji inicjalizującej przy załadowaniu strony
window.onload = function() {
    init();
};
