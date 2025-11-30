// --- KONFIGURACJA ---
// WERSJA PRODUKCYJNA: Blokada daty i odliczanie czasu.

const ADVENT_START_YEAR = new Date().getFullYear(); 
const ADVENT_START_MONTH = 11; // 11 to grudzień (indeksowanie od 0)

// W tablicy musisz podać ŚCIEŻKI do 24 plików graficznych z zadaniami.
const TASKS = [
    { day: 1, image: 'tasks/task_1.jpg' },
    { day: 2, image: 'tasks/task_2.jpg' },
    { day: 3, image: 'tasks/task_3.jpg' },
    { day: 4, image: 'tasks/task_4.jpg' },
    { day: 5, image: 'tasks/task_5.jpg' },
    { day: 6, image: 'tasks/task_6.jpg' },
    { day: 7, image: 'tasks/task_7.jpg' },
    { day: 8, image: 'tasks/task_8.jpg' },
    { day: 9, image: 'tasks/task_9.jpg' },
    { day: 10, image: 'tasks/task_10.jpg' },
    { day: 11, image: 'tasks/task_11.jpg' },
    { day: 12, image: 'tasks/task_12.jpg' },
    { day: 13, image: 'tasks/task_13.jpg' },
    { day: 14, image: 'tasks/task_14.jpg' },
    { day: 15, image: 'tasks/task_15.jpg' },
    { day: 16, image: 'tasks/task_16.jpg' },
    { day: 17, image: 'tasks/task_17.jpg' },
    { day: 18, image: 'tasks/task_18.jpg' },
    { day: 19, image: 'tasks/task_19.jpg' },
    { day: 20, image: 'tasks/task_20.jpg' },
    { day: 21, image: 'tasks/task_21.jpg' },
    { day: 22, image: 'tasks/task_22.jpg' },
    { day: 23, image: 'tasks/task_23.jpg' },
    { day: 24, image: 'tasks/task_24.jpg' }
];

// --- ELEMENTY DOM ---
const calendarContainer = document.querySelector('.calendar-container');
const modal = document.getElementById('task-modal');
const closeButton = document.querySelector('.close-button');
const taskImage = document.getElementById('task-image');
const modalTitle = document.getElementById('modal-title');
const countdownTimer = document.getElementById('countdown-timer');
const countdownSectionTitle = document.querySelector('.countdown h2');

// --- LOGIKA DATY ---

/**
 * Zwraca aktualny dzień grudnia (1-24), 0 jeśli jest listopad, lub -1 jeśli po 24 grudnia.
 */
function getCurrentAdventDay() {
    const today = new Date();
    if (today.getMonth() === ADVENT_START_MONTH && today.getFullYear() === ADVENT_START_YEAR && today.getDate() <= 24) {
        return today.getDate();
    }
    if (today.getMonth() < ADVENT_START_MONTH && today.getFullYear() === ADVENT_START_YEAR) {
        return 0; 
    }
    return -1; // Po 24 grudnia
}

const currentAdventDay = getCurrentAdventDay();

// --- FUNKCJE ---

/**
 * Generuje okienka kalendarza.
 */
function generateCalendar() {
    TASKS.forEach(task => {
        const windowDiv = document.createElement('div');
        windowDiv.classList.add('calendar-window');
        windowDiv.dataset.day = task.day;
        
        let isLocked = true;

        // Okienka są odblokowane, jeśli numer dnia jest mniejszy lub równy aktualnemu dniu Adwentu
        if (task.day <= currentAdventDay) {
            isLocked = false;
        }

        if (isLocked) {
            windowDiv.classList.add('locked');
        } else {
            // Dodajemy zdarzenie kliknięcia tylko dla okienek otwartych
            windowDiv.addEventListener('click', () => openTask(task.day, task.image));
        }

        // DYNAMICZNA KONTENT:
        // Zablokowane: Prezent i numer pod spodem + "Zadanie"
        // Odblokowane: Tylko numer
        if (isLocked) {
            windowDiv.innerHTML = `
                <span class="window-icon">🎁</span>
                <span class="window-number">${task.day}</span>
                <span class="window-label">Zadanie</span>
            `;
        } else {
            windowDiv.innerHTML = `
                <span class="window-number">${task.day}</span>
            `;
        }
        
        calendarContainer.appendChild(windowDiv);
    });
}

/**
 * Obsługuje otwieranie zadania w modalu.
 */
function openTask(day, imagePath) {
    modalTitle.textContent = `Zadanie Dzień ${day}`;
    taskImage.src = imagePath;
    modal.style.display = 'block';

    localStorage.setItem(`advent_task_${day}_open`, 'true');

    const windowDiv = document.querySelector(`.calendar-window[data-day="${day}"]`);
    if (windowDiv) {
        windowDiv.classList.add('open');
        windowDiv.classList.remove('locked');
        // Usunięcie ikon i tekstu "Zadanie" po otwarciu
        windowDiv.innerHTML = `<span class="window-number">${day}</span>`;
    }
}

/**
 * Aktualizuje licznik odliczający do otwarcia kolejnego zadania.
 */
function updateCountdown() {
    const now = new Date();
    let targetTime;
    let message = 'Odliczanie do następnego zadania:';

    if (now.getMonth() === ADVENT_START_MONTH && now.getDate() < 24) {
        // Jest grudzień: Odliczamy do północy bieżącego dnia
        targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0); 
    } else if (now.getMonth() < ADVENT_START_MONTH && now.getFullYear() === ADVENT_START_YEAR) {
        // Jest listopad: Odliczamy do 1 grudnia
        targetTime = new Date(now.getFullYear(), ADVENT_START_MONTH, 1, 0, 0, 0, 0); 
        message = 'Odliczanie do startu kalendarza:';
    } else {
        // Kalendarz jest zakończony
        countdownTimer.textContent = 'Kalendarz jest już zakończony!';
        clearInterval(countdownInterval);
        return;
    }

    const diff = targetTime - now; 

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const format = num => String(num).padStart(2, '0');
    
    // Używamy dni tylko jeśli jest to odliczanie do 1 grudnia
    if (days > 0) {
        countdownTimer.textContent = `${days} dni, ${format(hours)}:${format(minutes)}:${format(seconds)}`;
    } else {
        countdownTimer.textContent = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
    }

    if (countdownSectionTitle) {
        countdownSectionTitle.textContent = message;
    }
}

// --- INICJALIZACJA ---

// 1. Generowanie kalendarza po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    // Sprawdzenie, które zadania były już otwarte i ich oznaczenie
    TASKS.forEach(task => {
        if (localStorage.getItem(`advent_task_${task.day}_open`)) {
            const windowDiv = document.querySelector(`.calendar-window[data-day="${task.day}"]`);
            if (windowDiv) {
                windowDiv.classList.add('open');
                windowDiv.classList.remove('locked'); // Upewniamy się, że nie jest zablokowany
                windowDiv.innerHTML = `<span class="window-number">${task.day}</span>`; // Zmieniamy zawartość
            }
        }
    });
});

// 2. Obsługa Modala
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Kliknięcie poza obrazkiem zamyka modal
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// 3. Uruchomienie odliczania
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
