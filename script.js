// --- KONFIGURACJA ---
// UWAGA: TA WERSJA JEST TYMCZASOWA! ZAWSZE ODBLOKOWUJE WSZYSTKIE 24 OKIENKA DO TESTOWANIA!

const ADVENT_START_YEAR = new Date().getFullYear(); 
const ADVENT_START_MONTH = 11; // 11 to grudzień (indeksowanie od 0)

// W tablicy musisz podać ŚCIEŻKI do 24 plików graficznych z zadaniami.
// WAŻNE: Upewnij się, że masz folder 'tasks' i pliki task_1.jpg, task_2.jpg itd. (zgodnie z rozszerzeniem, którego używasz)
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

// --- LOGIKA DATY ---

/**
 * Zwraca aktualny dzień grudnia lub -1, jeśli nie jest grudzień.
 * WAŻNE: W TEJ WERSJI ZAWSZE ZWRACA 24 DLA TESTÓW!
 */
function getCurrentAdventDay() {
    return 23; 
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
        
        // Ponieważ currentAdventDay jest 24, isLocked będzie zawsze false, odblokowując okienka.
        let isLocked = task.day > currentAdventDay;

        if (isLocked) {
            windowDiv.classList.add('locked');
        } else {
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
    // W trybie testowym, licznik pokazuje "Zakończony"
    countdownTimer.textContent = 'Kalendarz jest w trybie testowym (wszystkie zadania otwarte).';
    clearInterval(countdownInterval);
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

