// Funkcja do ustawiania ciasteczek
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${(value || "")}${expires}; path=/`;
}

// Funkcja do pobierania ciasteczek
function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Funkcja do usuwania ciasteczek
function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=-99999999;`;
}

 // Pobranie zapisanej liczby kaw i wody, historii oraz statusu suplementów z ciasteczek
    let coffeeCount = parseInt(getCookie('coffeeCount') || 0);
    let coffeeHistory = JSON.parse(getCookie('coffeeHistory')) || {};
    let waterCount = parseFloat(getCookie('waterCount') || 0);
    let waterHistory = JSON.parse(getCookie('waterHistory')) || {};
    let supplementStatus = JSON.parse(getCookie('supplementStatus')) || {};
    const lastUpdateDate = getCookie('lastUpdateDate');
    const today = new Date().toISOString().split('T')[0]; // Data w formacie YYYY-MM-DD

// Funkcja do dodawania kawy
function addCoffee() {
    coffeeCount = (parseInt(coffeeCount) || 0) + 1;
    setCookie('coffeeCount', coffeeCount, 7);

    // Aktualizacja historii kaw
    coffeeHistory[today] = (coffeeHistory[today] || 0) + 1;
    setCookie('coffeeHistory', JSON.stringify(coffeeHistory), 7);

    updateCoffeeResult();
    updateCoffeeHistory();
}

// Funkcja do dodawania wody
function addWater() {
    waterCount = (parseFloat(waterCount) || 0) + 0.25; // Załóżmy, że każdorazowo dodajemy 0.25 litra wody
    setCookie('waterCount', waterCount, 7);

    // Aktualizacja historii wody
    waterHistory[today] = (waterHistory[today] || 0) + 0.25;
    setCookie('waterHistory', JSON.stringify(waterHistory), 7);

    updateWaterResult();
    updateWaterHistory();
}

// Funkcja do resetowania licznika kawy
function resetCoffeeCounter() {
    coffeeCount = 0;
    setCookie('coffeeCount', coffeeCount, 7);

    // Wyczyszczenie historii kawy
    coffeeHistory = {};
    setCookie('coffeeHistory', JSON.stringify(coffeeHistory), 7);

    updateCoffeeResult();
    updateCoffeeHistory();
}

// Funkcja do resetowania licznika wody
function resetWaterCounter() {
    waterCount = 0;
    setCookie('waterCount', waterCount, 7);

    // Wyczyszczenie historii wody
    waterHistory = {};
    setCookie('waterHistory', JSON.stringify(waterHistory), 7);

    updateWaterResult();
    updateWaterHistory();
}


// Funkcja do aktualizacji liczby kawy
function updateCoffeeCount() {
    const newCount = parseInt(document.getElementById('editCoffeeCount').value) || 0;
    coffeeCount = newCount;
    setCookie('coffeeCount', coffeeCount, 7);

    coffeeHistory[today] = coffeeCount;
    setCookie('coffeeHistory', JSON.stringify(coffeeHistory), 7);
    updateCoffeeResult();
    updateCoffeeHistory();
}


// Funkcja do aktualizacji liczby wody
function updateWaterCount() {
    const newCount = parseFloat(document.getElementById('editWaterCount').value) || 0;
    waterCount = newCount;
    setCookie('waterCount', waterCount, 7);

    waterHistory[today] = waterCount;
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
    document.getElementById('waterResult').textContent = `Liczba wypitych litrów wody: ${parseFloat(waterCount).toFixed(2)}`;
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
        cellCount.textContent = parseFloat(waterCount).toFixed(2);
    }
}

// Funkcja do zaznaczenia, czy zażyłeś suplementy
function takeSupplement(status) {
    supplementStatus[today] = status;
    setCookie('supplementStatus', JSON.stringify(supplementStatus), 7);
    updateSupplementResult();
    updateSupplementHistory();

    can
    drawCharts();
}

// Funkcja do aktualizacji wyświetlanej informacji o suplementach
function updateSupplementResult() {
    const status = supplementStatus[today] || 'Brak danych';
    document.getElementById('supplementResult').textContent = `Czy zażyłeś suplementy dzisiaj? ${status}`;
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
    setCookie('supplementStatus', JSON.stringify(supplementStatus), 7); // Zapisz w ciasteczkach

    updateSupplementHistory();
    updateSupplementResult();
}

// Funkcja do pokazania strony głównej
function showHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('editPage').style.display = 'none';
    document.getElementById('reportsPage').style.display = 'none';
    document.getElementById('homeLink').classList.add('active');
    document.getElementById('editLink').classList.remove('active');
    document.getElementById('reportsLink').classList.remove('active');
}

// Funkcja do pokazania strony edycji
function showEdit() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('reportsPage').style.display = 'none';
    document.getElementById('editPage').style.display = 'block';
    document.getElementById('homeLink').classList.remove('active');
    document.getElementById('reportsLink').classList.remove('active');
    document.getElementById('editLink').classList.add('active');
}

// Funkcja do wyświetlania zakładki Raporty
function showReports() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('editPage').style.display = 'none';
    document.getElementById('reportsPage').style.display = 'block';
    document.getElementById('homeLink').classList.remove('active');
    document.getElementById('editLink').classList.remove('active');
    document.getElementById('reportsLink').classList.add('active');

    // Rysowanie wykresów
    drawCharts();
}

// Funkcja do rysowania wykresów
function drawCharts() {
    const coffeeHistory = JSON.parse(getCookie('coffeeHistory') || '{}');
    const waterHistory = JSON.parse(getCookie('waterHistory') || '{}');
    const supplementHistory = JSON.parse(getCookie('supplementStatus') || '{}');

    const ctxCoffee = document.getElementById('coffeeChart').getContext('2d');
    const ctxWater = document.getElementById('waterChart').getContext('2d');
    const ctxSupplement = document.getElementById('supplementChart').getContext('2d');

    const coffeeLabels = Object.keys(coffeeHistory);
    const coffeeData = Object.values(coffeeHistory);

    const waterLabels = Object.keys(waterHistory);
    const waterData = Object.values(waterHistory);

    const supplementLabels = Object.keys(supplementHistory);
    const supplementData = supplementLabels.map(date => supplementHistory[date]);

    new Chart(ctxCoffee, {
        type: 'bar',
        data: {
            labels: coffeeLabels,
            datasets: [{
                label: 'Liczba wypitych kaw',
                data: coffeeData,
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

    new Chart(ctxWater, {
        type: 'bar',
        data: {
            labels: waterLabels,
            datasets: [{
                label: 'Liczba wypitych litrów wody',
                data: waterData,
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

    console.log('Supplement data:', supplementData);
    console.log('Mapped supplement data:', supplementData.map(status => status === 'TAK' ? 1 : 0));

    new Chart(ctxSupplement, {
        type: 'bar',
        data: {
            labels: supplementLabels,
            datasets: [{
                label: 'Zażyte suplementy',
                data: supplementData.map(status => status === 'TAK' ? 1 : 0),
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

// Inicjalizacja
function init() {
    console.log('Initializing from cookies...');

    coffeeCount = parseInt(getCookie('coffeeCount') || 0);
    coffeeHistory = JSON.parse(getCookie('coffeeHistory')) || {};
    waterCount = parseFloat(getCookie('waterCount') || 0);
    waterHistory = JSON.parse(getCookie('waterHistory')) || {};
    supplementStatus = JSON.parse(getCookie('supplementStatus')) || {};

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
}

// Wywołanie funkcji inicjalizującej przy załadowaniu strony
window.onload = init;
