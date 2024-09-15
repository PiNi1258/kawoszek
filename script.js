// Funkcja do ustawiania ciasteczek
function setCookie(name, value, days) {
    const expires = days ? `; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}` : '';
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

// Funkcja do pobierania ciasteczek
function getCookie(name) {
    const nameEQ = `${name}=`;
    return document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(nameEQ))?.substring(nameEQ.length) || null;
}

// Funkcja do usuwania ciasteczek
function eraseCookie(name) {
    setCookie(name, '', -1);
}

// Pobranie zapisanej liczby kaw, wody, historii oraz statusu suplementów z ciasteczek
let coffeeCount = parseInt(getCookie('coffeeCount') || '0');
let coffeeHistory = JSON.parse(getCookie('coffeeHistory') || '{}');
let waterCount = parseFloat(getCookie('waterCount') || '0');
let waterHistory = JSON.parse(getCookie('waterHistory') || '{}');
let supplementStatus = JSON.parse(getCookie('supplementStatus') || '{}');
const today = new Date().toISOString().split('T')[0]; // Data w formacie YYYY-MM-DD

// Funkcja do dodawania kawy
function addCoffee() {
    coffeeCount++;
    setCookie('coffeeCount', coffeeCount, 7);
    coffeeHistory[today] = (coffeeHistory[today] || 0) + 1;
    setCookie('coffeeHistory', JSON.stringify(coffeeHistory), 7);
    updateCoffeeResult();
    updateCoffeeHistory();
}

// Funkcja do dodawania wody
function addWater() {
    waterCount += 0.25; // Załóżmy, że każdorazowo dodajemy 0.25 litra wody
    setCookie('waterCount', waterCount, 7);
    waterHistory[today] = (waterHistory[today] || 0) + 0.25;
    setCookie('waterHistory', JSON.stringify(waterHistory), 7);
    updateWaterResult();
    updateWaterHistory();
}

// Funkcja do resetowania licznika kawy
function resetCoffeeCounter() {
    coffeeCount = 0;
    coffeeHistory = {};
    setCookie('coffeeCount', coffeeCount, 7);
    setCookie('coffeeHistory', JSON.stringify(coffeeHistory), 7);
    updateCoffeeResult();
    updateCoffeeHistory();
}

// Funkcja do resetowania licznika wody
function resetWaterCounter() {
    waterCount = 0;
    waterHistory = {};
    setCookie('waterCount', waterCount, 7);
    setCookie('waterHistory', JSON.stringify(waterHistory), 7);
    updateWaterResult();
    updateWaterHistory();
}

// Funkcja do aktualizacji liczby kawy
function updateCoffeeCount() {
    const newCount = parseInt(document.getElementById('editCoffeeCount').value) || 0;
    const editDate = document.getElementById('editCoffeeDate').value;
    coffeeCount = newCount;
    setCookie('coffeeCount', coffeeCount, 7);
    coffeeHistory[editDate] = coffeeCount;
    setCookie('coffeeHistory', JSON.stringify(coffeeHistory), 7);
    updateCoffeeResult();
    updateCoffeeHistory();
}

// Funkcja do aktualizacji liczby wody
function updateWaterCount() {
    const newCount = parseFloat(document.getElementById('editWaterCount').value) || 0;
    const editDate = document.getElementById('editWaterDate').value;
    waterCount = newCount;
    setCookie('waterCount', waterCount, 7);
    waterHistory[editDate] = waterCount;
    setCookie('waterHistory', JSON.stringify(waterHistory), 7);
    updateWaterResult();
    updateWaterHistory();
}

// Funkcja do aktualizacji wyświetlanej liczby kawy
function updateCoffeeResult() {
    document.getElementById('coffeeResult').textContent = `Liczba wypitych kaw: ${coffeeCount}`;
}

// Funkcja do aktualizacji wyświetlanej liczby wody
function updateWaterResult() {
    document.getElementById('waterResult').textContent = `Liczba wypitych litrów wody: ${waterCount.toFixed(2)}`;
}

// Funkcja do aktualizacji tabeli historycznej kaw
function updateCoffeeHistory() {
    const tbody = document.getElementById('coffeeHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    Object.entries(coffeeHistory).forEach(([date, count]) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = date;
        row.insertCell(1).textContent = count;
    });
}

// Funkcja do aktualizacji tabeli historycznej wody
function updateWaterHistory() {
    const tbody = document.getElementById('waterHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    Object.entries(waterHistory).forEach(([date, count]) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = date;
        row.insertCell(1).textContent = count.toFixed(2);
    });
}

// Funkcja do zaznaczenia, czy zażyłeś suplementy
function takeSupplement(status) {
    supplementStatus[today] = status;
    setCookie('supplementStatus', JSON.stringify(supplementStatus), 7);
    updateSupplementResult();
    updateSupplementHistory();
}

// Funkcja do aktualizacji wyświetlanej informacji o suplementach
function updateSupplementResult() {
    const status = supplementStatus[today] || 'Brak danych';
    document.getElementById('supplementResult').textContent = `Czy zażyłeś suplementy dzisiaj? ${status}`;
}

// Funkcja do aktualizacji tabeli historycznej suplementów
function updateSupplementHistory() {
    const tbody = document.getElementById('supplementHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    Object.entries(supplementStatus).forEach(([date, status]) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = date;
        row.insertCell(1).textContent = status;
    });
}

// Funkcja do resetowania historii suplementów
function resetSupplementHistory() {
    supplementStatus = {};
    setCookie('supplementStatus', JSON.stringify(supplementStatus), 7);
    updateSupplementHistory();
    updateSupplementResult();
}

// Funkcja do pokazania strony głównej
function showHome() {
    togglePageVisibility('homePage');
    setActiveLink('homeLink');
}

// Funkcja do pokazania strony edycji
function showEdit() {
    togglePageVisibility('editPage');
    setActiveLink('editLink');
}

// Funkcja do wyświetlania zakładki Raporty
function showReports() {
    togglePageVisibility('reportsPage');
    setActiveLink('reportsLink');
    drawCharts();
}

// Funkcja pomocnicza do przełączania widoczności stron
function togglePageVisibility(visiblePageId) {
    ['homePage', 'editPage', 'reportsPage'].forEach(pageId => {
        document.getElementById(pageId).style.display = pageId === visiblePageId ? 'block' : 'none';
    });
}

// Funkcja pomocnicza do ustawiania aktywnego linku
function setActiveLink(activeLinkId) {
    ['homeLink', 'editLink', 'reportsLink'].forEach(linkId => {
        document.getElementById(linkId).classList.toggle('active', linkId === activeLinkId);
    });
}

// Funkcja do rysowania wykresów
function drawCharts() {
    const coffeeHistory = JSON.parse(getCookie('coffeeHistory') || '{}');
    const waterHistory = JSON.parse(getCookie('waterHistory') || '{}');
    const supplementStatus = JSON.parse(getCookie('supplementStatus') || '{}');

    const ctxCoffee = document.getElementById('coffeeChart').getContext('2d');
    const ctxWater = document.getElementById('waterChart').getContext('2d');
    const ctxSupplement = document.getElementById('supplementChart').getContext('2d');

    new Chart(ctxCoffee, {
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
            scales: { y: { beginAtZero: true } }
        }
    });

    new Chart(ctxWater, {
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
            scales: { y: { beginAtZero: true } }
        }
    });

    new Chart(ctxSupplement, {
        type: 'bar',
        data: {
            labels: Object.keys(supplementStatus),
            datasets: [{
                label: 'Zażyte suplementy',
                data: Object.values(supplementStatus).map(status => status === 'TAK' ? 1 : 0),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Inicjalizacja
function init() {
    console.log('Initializing from cookies...');
    coffeeCount = parseInt(getCookie('coffeeCount') || '0');
    coffeeHistory = JSON.parse(getCookie('coffeeHistory') || '{}');
    waterCount = parseFloat(getCookie('waterCount') || '0');
    waterHistory = JSON.parse(getCookie('waterHistory') || '{}');
    supplementStatus = JSON.parse(getCookie('supplementStatus') || '{}');
    updateCoffeeResult();
    updateWaterResult();
    updateSupplementResult();
    updateCoffeeHistory();
    updateWaterHistory();
    updateSupplementHistory();
}

// Wywołanie funkcji inicjalizującej przy załadowaniu strony
window.onload = init;
