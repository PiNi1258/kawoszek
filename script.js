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
let oilStatus = JSON.parse(getCookie('oilStatus')) || {};
let spanishStatus = JSON.parse(getCookie('spanishStatus')) || {};

const today = new Date().toISOString().split('T')[0]; // Data w formacie YYYY-MM-DD
let coffeeChart = null;
let waterChart = null;
let supplementChart = null;
let oilChart = null;
let spanishChart = null;


// Funkcja do dodawania kawy
function addCoffee() {
    coffeeCount = (parseInt(coffeeCount) || 0) + 1;
    setCookie('coffeeCount', coffeeCount, 7);

    // Aktualizacja historii kaw
    coffeeHistory[today] = (coffeeHistory[today] || 0) + 1;
    setCookie('coffeeHistory', JSON.stringify(coffeeHistory), 7);

    updateCoffeeResult();
    updateCoffeeHistory();
    updateCharts();
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
    updateCharts();
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
    updateCharts();
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
    updateCharts();
}

// Funkcja do aktualizacji liczby kawy
function updateCoffeeCount() {
    const newCount = parseInt(document.getElementById('editCoffeeCount').value) || 0;
    const editDate = document.getElementById('editCoffeeDate').value;

    coffeeHistory[editDate] = newCount;
    setCookie('coffeeHistory', JSON.stringify(coffeeHistory), 7);

    updateCoffeeHistory();

    updateCharts();

}

// Funkcja do aktualizacji liczby wody
function updateWaterCount() {
    const newCount = parseFloat(document.getElementById('editWaterCount').value) || 0;
    const editDate = document.getElementById('editWaterDate').value;

    waterHistory[editDate] = newCount;
    setCookie('waterHistory', JSON.stringify(waterHistory), 7);

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
    setCookie('supplementStatus', JSON.stringify(supplementStatus), 7);

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
    setCookie('supplementStatus', JSON.stringify(supplementStatus), 7); // Zapisz w ciasteczkach

    updateSupplementHistory();
    updateSupplementResult();
}

// Funkcja do zaznaczenia, czy zażyłeś suplementy
function didOil(status) {
    oilStatus[today] = status;
    setCookie('oilStatus', JSON.stringify(oilStatus), 7);

    updateOilResult();
    updateOilHistory();
}

// Funkcja do aktualizacji wyświetlanej informacji o suplementach
function updateOilResult() {
    const status = oilStatus[today] || 'Brak danych';
    document.getElementById('oilStatusResult').innerHTML = `Czy olejowałaś dzisiaj? <b>${status}</b>`;
}

// Funkcja do aktualizacji tabeli historycznej suplementów
function updateOilHistory() {
    const tbody = document.getElementById('oilHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Wyczyść tabelę przed dodaniem nowych danych

    for (const [date, status] of Object.entries(oilStatus)) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellStatus = row.insertCell(1);

        cellDate.textContent = date;
        cellStatus.textContent = status;
    }
}

// Funkcja do resetowania historii suplementów
function resetOilHistory() {
    oilStatus = {}; // Wyczyszczenie historii suplementów
    setCookie('oilStatus', JSON.stringify(oilStatus), 7); // Zapisz w ciasteczkach

    updateOilHistory();
    updateOilResult();
}

// Funkcja do zaznaczenia, czy zażyłeś suplementy
function didSpanish(status) {
    spanishStatus[today] = status;
    setCookie('spanishStatus', JSON.stringify(spanishStatus), 7);

    updateSpanishResult();
    updateSpanishHistory();
}

// Funkcja do aktualizacji wyświetlanej informacji o suplementach
function updateSpanishResult() {
    const status = spanishStatus[today] || 'Brak danych';
    document.getElementById('spanishStatusResult').innerHTML = `Czy hiszpański był? <b>${status}</b>`;
}

// Funkcja do aktualizacji tabeli historycznej suplementów
function updateSpanishHistory() {
    const tbody = document.getElementById('spanishHistoryTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Wyczyść tabelę przed dodaniem nowych danych

    for (const [date, status] of Object.entries(spanishStatus)) {
        const row = tbody.insertRow();
        const cellDate = row.insertCell(0);
        const cellStatus = row.insertCell(1);

        cellDate.textContent = date;
        cellStatus.textContent = status;
    }
}

// Funkcja do resetowania historii suplementów
function resetSpanishHistory() {
    spanishStatus = {}; // Wyczyszczenie historii suplementów
    setCookie('spanishStatus', JSON.stringify(spanishStatus), 7); // Zapisz w ciasteczkach

    updateSpanishHistory();
    updateSpanishResult();
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
    const coffeeHistory = JSON.parse(getCookie('coffeeHistory') || '{}');
    const waterHistory = JSON.parse(getCookie('waterHistory') || '{}');
    const supplementHistory = JSON.parse(getCookie('supplementStatus') || '{}');
    const oilHistory = JSON.parse(getCookie('oilStatus') || '{}');
    const spanishHistory = JSON.parse(getCookie('spanishStatus') || '{}');


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
    oilChart = new Chart(ctxOil, {
        type: 'bar',
        data: {
            labels: Object.keys(oilHistory),
            datasets: [{
                label: 'Olejowanie',
                data: Object.keys(oilHistory).map(date => oilHistory[date] === 'TAK' ? 1 : 0),
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
     spanishChart = new Chart(ctxSpanish, {
        type: 'bar',
        data: {
            labels: Object.keys(spanishHistory),
            datasets: [{
                label: 'Hiszpański',
                data: Object.keys(spanishHistory).map(date => spanishHistory[date] === 'TAK' ? 1 : 0),
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
    console.log('Initializing from cookies...');

    coffeeCount = parseInt(getCookie('coffeeCount') || 0);
    coffeeHistory = JSON.parse(getCookie('coffeeHistory')) || {};
    waterCount = parseFloat(getCookie('waterCount') || 0);
    waterHistory = JSON.parse(getCookie('waterHistory')) || {};
    supplementStatus = JSON.parse(getCookie('supplementStatus')) || {};
    oilStatus = JSON.parse(getCookie('oilStatus')) || {};
    spanishStatus = JSON.parse(getCookie('spanishStatus')) || {};

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

    setDefaultDate()
}

// Wywołanie funkcji inicjalizującej przy załadowaniu strony
window.onload = function() {
    init();
};
