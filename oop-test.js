// oop-test.js - JavaScript для страницы теста ООП

// Общая функция для загрузки данных пользователя
function loadUserData() {
    try {
        const userDataStr = localStorage.getItem('currentUser');
        if (!userDataStr) {
            // Если данных нет, устанавливаем имя по умолчанию
            const userMenuNameElement = document.getElementById('userMenuName');
            if (userMenuNameElement) {
                userMenuNameElement.textContent = 'Пользователь';
            }
            return;
        }

        const userData = JSON.parse(userDataStr);
        let firstName = '';
        let lastName = '';

        if (userData.name) firstName = userData.name;
        else if (userData.firstName) firstName = userData.firstName;
        else if (userData.username) firstName = userData.username;

        if (userData.lastname) lastName = userData.lastname;
        else if (userData.lastName) lastName = userData.lastName;

        if (userData.name && userData.name.includes(' ')) {
            const nameParts = userData.name.split(' ');
            firstName = nameParts[0] || firstName;
            lastName = nameParts.slice(1).join(' ') || lastName;
        }

        let shortName = firstName;
        if (lastName) {
            const lastNameInitial = lastName.charAt(0);
            shortName += ' ' + lastNameInitial + '.';
        }

        const userMenuNameElement = document.getElementById('userMenuName');
        if (userMenuNameElement) {
            userMenuNameElement.textContent = shortName;
        }

    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        const userMenuNameElement = document.getElementById('userMenuName');
        if (userMenuNameElement) {
            userMenuNameElement.textContent = 'Пользователь';
        }
    }
}

// Переменные для управления тестом
let currentLevel = 'basic';
let testStarted = false;

// Функция выбора уровня сложности
function selectLevel(levelElement) {
    const levels = document.querySelectorAll('.difficulty-level');
    
    levels.forEach(level => {
        level.classList.remove('active');
    });
    
    levelElement.classList.add('active');
    currentLevel = levelElement.getAttribute('data-level');
    updateLevelIndicator();
}

// Обновление индикатора уровня
function updateLevelIndicator() {
    const indicator = document.getElementById('levelIndicator');
    if (!indicator) return;
    
    let levelName = '';
    let description = '';
    
    switch(currentLevel) {
        case 'basic':
            levelName = 'Базовый';
            description = 'Основы ООП для начинающих';
            break;
        case 'intermediate':
            levelName = 'Средний';
            description = 'Для разработчиков с опытом';
            break;
        case 'advanced':
            levelName = 'Продвинутый';
            description = 'Для опытных программистов';
            break;
        default:
            levelName = 'Базовый';
            description = 'Основы ООП для начинающих';
    }
    
    indicator.innerHTML = `Выбран уровень: <strong>${levelName}</strong><br><small>${description}</small>`;
}

// Функция начала теста
function startOOPTest() {
    if (testStarted) {
        alert('Тест уже начат!');
        return;
    }
    
    let levelName = '';
    let timeLimit = 20; // минут
    let questionsCount = 12;
    
    switch(currentLevel) {
        case 'basic':
            levelName = 'базовом';
            timeLimit = 15;
            questionsCount = 10;
            break;
        case 'intermediate':
            levelName = 'среднем';
            timeLimit = 20;
            questionsCount = 12;
            break;
        case 'advanced':
            levelName = 'продвинутом';
            timeLimit = 25;
            questionsCount = 15;
            break;
    }
    
    const confirmStart = confirm(`Тест "Работа с ООП" начат!\n\nУровень: ${levelName}\nВремя: ${timeLimit} минут\nВопросов: ${questionsCount}\nМинимальный балл: 70%\n\nНачать тест?`);
    
    if (confirmStart) {
        testStarted = true;
        
        // Изменяем кнопку
        const startBtn = document.querySelector('.start-test-btn');
        startBtn.textContent = 'Тест начат...';
        startBtn.disabled = true;
        startBtn.style.opacity = '0.7';
        
        // Показываем таймер (в реальном проекте здесь будет полноценный таймер)
        showTestTimer(timeLimit);
        
        // В реальном проекте здесь будет переход на страницу с вопросами
        // window.location.href = 'oop-questions.html?level=' + currentLevel;
        
        console.log(`Тест ООП начат. Уровень: ${currentLevel}, Время: ${timeLimit} мин.`);
    }
}

// Показать таймер теста
function showTestTimer(minutes) {
    const warningDiv = document.querySelector('.test-warning');
    if (!warningDiv) return;
    
    const timerId = `timer-${Date.now()}`;
    warningDiv.innerHTML = `
        <div id="${timerId}" style="text-align: center;">
            <p style="font-weight: bold; color: #155DFC; margin-bottom: 10px;">⏰ Тест начат!</p>
            <p style="margin-bottom: 10px;">Оставшееся время: <span id="time-display">${minutes}:00</span></p>
            <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden; margin: 15px 0;">
                <div id="progress-bar" style="height: 100%; background: #4CAF50; width: 100%; transition: width 1s linear;"></div>
            </div>
            <button onclick="cancelTest('${timerId}')" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                Отменить тест
            </button>
        </div>
    `;
    
    // В реальном проекте здесь будет полноценный таймер
    startTimer(minutes, timerId);
}

// Функция таймера (упрощенная версия)
function startTimer(minutes, timerId) {
    let totalSeconds = minutes * 60;
    const timeDisplay = document.getElementById('time-display');
    const progressBar = document.getElementById('progress-bar');
    
    const interval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            alert('Время вышло! Тест завершен.');
            resetTest();
            return;
        }
        
        totalSeconds--;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        
        if (timeDisplay) {
            timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        
        if (progressBar) {
            const progressPercentage = (totalSeconds / (minutes * 60)) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            
            // Меняем цвет при малом времени
            if (progressPercentage < 20) {
                progressBar.style.background = '#f44336';
            } else if (progressPercentage < 50) {
                progressBar.style.background = '#ff9800';
            }
        }
    }, 1000);
    
    // Сохраняем ID интервала для возможности отмены
    window.currentTimer = interval;
}

// Отмена теста
function cancelTest(timerId) {
    if (confirm('Вы уверены, что хотите отменить тест? Весь прогресс будет потерян.')) {
        clearInterval(window.currentTimer);
        resetTest();
        
        const timerElement = document.getElementById(timerId);
        if (timerElement && timerElement.parentElement) {
            timerElement.parentElement.innerHTML = '<p>Чтобы подтвердить навыки, сдайте тест. Если не сдадите, результат не будет отображен в профиле.</p>';
        }
    }
}

// Сброс состояния теста
function resetTest() {
    testStarted = false;
    const startBtn = document.querySelector('.start-test-btn');
    if (startBtn) {
        startBtn.textContent = 'Начать тест';
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем имя пользователя
    loadUserData();
    
    // Навигация
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (userMenu && dropdownMenu) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }
    
    // Инициализация уровня по умолчанию
    const basicLevel = document.querySelector('[data-level="basic"]');
    if (basicLevel) {
        basicLevel.classList.add('active');
        updateLevelIndicator();
    }
    
    // Добавляем анимацию для элементов контента
    const contentItems = document.querySelectorAll('.content-item');
    contentItems.forEach((item, index) => {
        item.style.animationDelay = `${0.1 + index * 0.05}s`;
        item.style.animation = 'fadeIn 0.5s ease forwards';
        item.style.opacity = '0';
    });
    
    // Делаем функции глобальными
    window.selectLevel = selectLevel;
    window.startOOPTest = startOOPTest;
    window.cancelTest = cancelTest;
});

// Анимация появления
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Наблюдаем за всеми анимируемыми элементами
document.querySelectorAll('.test-detail-card, .content-section, .additional-info').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});