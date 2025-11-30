// --- KONFIGURACJA ---
// WERSJA TESTOWA: Wszystkie dni są natychmiast odblokowane do podglądu.

const ADVENT_START_YEAR = new Date().getFullYear(); 
const ADVENT_START_MONTH = 11; // 11 to grudzień

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


// --- LOGIKA DATY (POMIJAMY BLOKADĘ) ---
// W trybie testowym ustawiamy, że aktualny dzień to 24, aby wszystko odblokować.
const currentAdventDay = 24; 


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

        // W trybie testowym zawsze odblokowujemy
        if (task.day <= currentAdventDay) {
            isLocked = false;
        }

        if (isLocked) {
            windowDiv.classList.add('locked');
        } else {
            // Dodajemy zdarzenie kliknięcia dla wszystkich okienek
            windowDiv.addEventListener('click', () => openTask(task.day, task.image));
        }

        // KONTENT W TRYBIE TESTOWYM: Zawsze tylko numer (bo wszystkie są odblokowane)
        windowDiv.innerHTML = `
            <span class="window-number">${task.day}</span>
        `;
        
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

    // W trybie testowym możemy zapamiętywać w localStorage
    localStorage.setItem(`advent_task_${day}_open`, 'true');

    const windowDiv = document.querySelector(`.calendar-window[data-day="${day}"]`);
    if (windowDiv) {
        windowDiv.classList.add('open');
        windowDiv.classList.remove('locked');
        windowDiv.innerHTML = `<span class="window-number">${day}</span>`; // Upewniamy się, że jest tylko numer
    }
}

/**
 * Ustawia komunikat o trybie testowym.
 */
function updateCountdown() {
    if (countdownSectionTitle) {
        countdownSectionTitle.textContent = 'Informacja:';
    }
    if (countdownTimer) {
        countdownTimer.textContent = 'Kalendarz jest w trybie podglądu (wszystkie dni otwarte).';
    }
    if (typeof countdownInterval !== 'undefined') {
        clearInterval(countdownInterval);
    }
}

// --- INICJALIZACJA ---

document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    // Sprawdzenie, które zadania były już otwarte i ich oznaczenie
    TASKS.forEach(task => {
        if (localStorage.getItem(`advent_task_${task.day}_open`)) {
            const windowDiv = document.querySelector(`.calendar-window[data-day="${task.day}"]`);
            if (windowDiv) {
                windowDiv.classList.add('open');
                windowDiv.classList.remove('locked');
                windowDiv.innerHTML = `<span class="window-number">${task.day}</span>`; // Upewniamy się, że jest tylko numer
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

// 3. Uruchomienie komunikatu testowego
updateCountdown();
const countdownInterval = null; 
```http://googleusercontent.com/image_generation_content/5
