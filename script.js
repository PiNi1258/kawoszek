// Funkcja do ustawiania localStorage
function setLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

// Funkcja do pobierania z localStorage
function getLocalStorage(name) {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
}

// Funkcja do usuwania z localStorage
function eraseLocalStorage(name) {
    localStorage.removeItem(name);
}

// Pobranie zapisanej liczby kaw i wody, historii oraz statusu suplementów z localStorage
let coffeeCount = parseInt(getLocalStorage('coffeeCount') || 0);
let coffeeHistory = getLocalStorage('coffeeHistory') || {};
let waterCount = parseFloat(getLocalStorage('waterCount') || 0);
let waterHistory = getLocalStorage('waterHistory') || {};
let supplementStatus = getLocalStorage('supplementStatus') || {};
const today = new Date().toISOString().split('T')[0]; // Data w formacie YYYY-MM-DD
let coffeeChart = null;
let waterChart = null;
let supplementChart = null;

// Funkcja do dodawania kawy
function addCoffee() {
    coffeeCount = (parseInt(coffeeCount) || 0) + 1;
    setLocalStorage('coffeeCount', coffeeCount);

    // Aktualizacja historii kaw
    coffeeHistory[today] = (coffeeHistory[today] || 0) + 1;
    setLocalStorage('coffeeHistory', coffeeHistory);

    updateCoffeeResult();
    updateCoffeeHistory();
    updateCharts();
}

// Funkcja do dodawania wody
function addWater() {
    waterCount = (parseFloat(waterCount) || 0) + 0.25; // Załóżmy, że każdorazowo dodajemy 0.25 litra wody
    setLocalStorage('waterCount', waterCount);

    // Aktualizacja historii wody
    waterHistory[today] = (waterHistory[today] || 0) + 0.25;
    setLocalStorage('waterHistory', waterHistory);

    updateWaterResult();
    updateWaterHistory();
    updateCharts();
}

// Funkcja do resetowania licznika kawy
function resetCoffeeCounter() {
    coffeeCount = 0;
    setLocalStorage('coffeeCount', coffeeCount);

    // Wyczyszczenie historii kawy
    coffeeHistory = {};
    setLocalStorage('coffeeHistory', coffeeHistory);

    updateCoffeeResult();
    updateCoffeeHistory();
    updateCharts();
}

// Funkcja do resetowania licznika wody
function resetWaterCounter() {
    waterCount = 0;
    setLocalStorage('waterCount', waterCount);

    // Wyczyszczenie historii wody
    waterHistory = {};
    setLocalStorage('waterHistory', waterHistory);

    updateWaterResult();
    updateWaterHistory();
    updateCharts();
}

// Funkcja do aktualizacji liczby kawy
function updateCoffeeCount() {
    const newCount = parseInt(document.getElementById('editCoffeeCount').value) || 0;
    const editDate = document.getElementById('editCoffeeDate').value;

    coffeeHistory[editDate] = newCount;
    setLocalStorage('coffeeHistory', coffeeHistory);

    updateCoffeeHistory();
    updateCharts();
}

// Funkcja do aktualizacji liczby wody
function updateWaterCount() {
    const newCount = parseFloat(document.getElementById('editWaterCount').value) || 0;
    const editDate = document.getElementById('editWaterDate').value;

    waterHistory[editDate] = newCount;
    setLocalStorage('waterHistory', waterHistory);

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

// Funkcja do aktualizacji tabeli historycznej kaw
function updateCoffeeHistory() {
    const tbody = document.getElementById('coffeeHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Wyczyść tabelę przed dodaniem nowych danych

    for (const [date, count] of Object.entries(coffeeHistory)) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellCount = row.insertCell(1);

        cellDate.textContent = date;
        cellCount.textContent = count;
    }
}

// Funkcja do aktualizacji tabeli historycznej wody
function updateWaterHistory() {
    const tbody = document.getElementById('waterHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Wyczyść tabelę przed dodaniem nowych danych

    for (const [date, count] of Object.entries(waterHistory)) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellCount = row.insertCell(1);

        cellDate.textContent = date;
        cellCount.textContent = parseFloat(count).toFixed(2); // Poprawka: używaj wartości z pętli
    }
}

// Funkcja do zaznaczenia, czy zażyłeś suplementy
function takeSupplement(status) {
    supplementStatus[today] = status;
    setLocalStorage('supplementStatus', supplementStatus);

    updateSupplementResult();
    updateSupplementHistory();
}

// Funkcja do aktualizacji wyświetlanej informacji o suplementach
function updateSupplementResult() {
    const status = supplementStatus[today] || 'Brak danych';
    document.getElementById('supplementResult').innerHTML = `Czy zażyłeś suplementy dzisiaj? <b>${status}</b>`;
}

// Funkcja do aktualizacji tabeli historycznej suplementów
function updateSupplementHistory() {
    const tbody = document.getElementById('supplementHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Wyczyść tabelę przed dodaniem nowych danych

    for (const [date, status] of Object.entries(supplementStatus)) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellStatus = row.insertCell(1);

        cellDate.textContent = date;
        cellStatus.textContent = status;
    }
}

// Funkcja do resetowania historii suplementów
function resetSupplementHistory() {
    supplementStatus = {}; // Wyczyszczenie historii suplementów
    setLocalStorage('supplementStatus', supplementStatus); // Zapisz w localStorage

    updateSupplementHistory();
    updateSupplementResult();
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

// Funkcja do rysowania wykresów
function updateCharts() {
    const coffeeHistory = getLocalStorage('coffeeHistory') || {};
    const waterHistory = getLocalStorage('waterHistory') || {};
    const supplementHistory = getLocalStorage('supplementStatus') || {};

    const ctxCoffee = document.getElementById('coffeeChart').getContext('2d');
    const ctxWater = document.getElementById('waterChart').getContext('2d');
    const ctxSupplement = document.getElementById('supplementChart').getContext('2d');

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

    // Tworzenie nowych wykresów
    coffeeChart = new Chart(ctxCoffee, {
        type: 'bar',
        data: {
            labels: Object.keys(coffeeHistory),
            datasets: [{
                label: 'Liczba wypitych kaw',
                data: Object.values(coffeeHistory),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
                data: Object.keys(supplementHistory).map(date => supplementHistory[date] === 'TAK' ? 1 : 0),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
}

// Funkcja pomocnicza do ustawiania aktywnego linku
function setActiveLink(activeLinkId) {
    ['homeLink', 'editLink', 'reportsLink'].forEach(linkId => {
        document.getElementById(linkId).classList.toggle('active', linkId === activeLinkId);
    });
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    document.getElementById('editWaterDate').value = today;
    document.getElementById('editCoffeeDate').value = today;
}

// Funkcja inicjalizacyjna
function init() {
    console.log('Initializing from localStorage...');

    coffeeCount = parseInt(getLocalStorage('coffeeCount') || 0);
    coffeeHistory = getLocalStorage('coffeeHistory') || {};
    waterCount = parseFloat(getLocalStorage('waterCount') || 0);
    waterHistory = getLocalStorage('waterHistory') || {};
    supplementStatus = getLocalStorage('supplementStatus') || {};

    console.log('Retrieved coffeeCount:', coffeeCount);
    console.log('Retrieved coffeeHistory:', coffeeHistory);
    console.log('Retrieved waterCount:', waterCount);
    console.log('Retrieved waterHistory:', waterHistory);
    console.log('Retrieved supplementStatus:', supplementStatus);

    updateCoffeeResult();
    updateWaterResult();
    updateSupplementResult();
    updateCoffeeHistory();
    updateWaterHistory();
    updateSupplementHistory();

    setDefaultDate();
}

// Wywołanie funkcji inicjalizującej przy załadowaniu strony
window.onload = function () {
    init();
};