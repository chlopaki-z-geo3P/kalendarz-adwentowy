// --- KONFIGURACJA ---
// UWAGA: TEN KOD JEST TYMCZASOWY DO TESTOWANIA.
// Zostaje odblokowane tylko zadanie nr 1 i nr 2.

const ADVENT_START_YEAR = new Date().getFullYear(); 
const ADVENT_START_MONTH = new Date().getMonth(); 

// W tablicy musisz podać ŚCIEŻKI do 24 plików graficznych z zadaniami.
// Założyłem, że obrazki będą w folderze 'tasks' i będą się nazywały task_1.jpg, task_2.jpg, itd.
const TASKS = [
    { day: 1, image: 'tasks/task_1.jpg' },

];

// --- ELEMENTY DOM ---
const calendarContainer = document.querySelector('.calendar-container');
const modal = document.getElementById('task-modal');
const closeButton = document.querySelector('.close-button');
const taskImage = document.getElementById('task-image');
const modalTitle = document.getElementById('modal-title');
const countdownTimer = document.getElementById('countdown-timer');

// --- LOGIKA DATY ---

/**
 * Zwraca aktualny dzień grudnia lub -1, jeśli nie jest grudzień.
 * TYMCZASOWO ZWRACA 2 DLA TESTÓW!
 */
function getCurrentAdventDay() {
    // W TYM TRYBIE TESTOWYM WŁĄCZAMY TYLKO 2 PIERWSZE ZADANIA
    return 2; 
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

        // Okienka są odblokowane, jeśli numer dnia jest mniejszy lub równy '2' (currentAdventDay)
        if (task.day <= currentAdventDay) {
            isLocked = false;
        }

        if (isLocked) {
            windowDiv.classList.add('locked');
        } else {
            // Dodajemy zdarzenie kliknięcia tylko dla okienek otwartych
            windowDiv.addEventListener('click', () => openTask(task.day, task.image));
        }

        // Zawartość okienka
        windowDiv.innerHTML = `
            <span class="tree-icon">🎄</span>
            <span class="window-number">${task.day}</span>
            <span class="window-label">Zadanie</span>
        `;
        
        calendarContainer.appendChild(windowDiv);
    });
}

/**
 * Obsługuje otwieranie zadania w modalu.
 * @param {number} day Numer dnia zadania.
 * @param {string} imagePath Ścieżka do obrazka zadania.
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
    }
}

/**
 * Aktualizuje licznik odliczający do północy (otwarcie kolejnego zadania).
 */
function updateCountdown() {
    const now = new Date();
    
    // Następny dzień (północ bieżącego dnia)
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0); 
    
    const diff = nextDay - now; 

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const format = num => String(num).padStart(2, '0');

    countdownTimer.textContent = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
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

const countdownInterval = setInterval(updateCountdown, 1000); // Aktualizacja co sekundę
