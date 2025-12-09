// python-test-questions.js - JavaScript для страницы с вопросами теста

// Общая функция для загрузки данных пользователя
function loadUserData() {
    try {
        const userDataStr = localStorage.getItem('currentUser');
        const userMenuName = document.getElementById('userMenuName');
        
        if (!userMenuName) {
            console.warn('Элемент userMenuName не найден');
            return;
        }
        
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            
            let firstName = '';
            let lastName = '';

            // Получаем имя
            if (userData.name) {
                if (userData.name.includes(' ')) {
                    const nameParts = userData.name.split(' ');
                    firstName = nameParts[0] || '';
                    lastName = nameParts.slice(1).join(' ') || '';
                } else {
                    firstName = userData.name;
                }
            } else if (userData.firstName) {
                firstName = userData.firstName;
            } else if (userData.username) {
                firstName = userData.username;
            }

            // Получаем фамилию
            if (!lastName) {
                if (userData.lastname) {
                    lastName = userData.lastname;
                } else if (userData.lastName) {
                    lastName = userData.lastName;
                }
            }

            // Формируем короткое имя
            let shortName = firstName || 'Пользователь';
            if (lastName) {
                const lastNameInitial = lastName.charAt(0);
                shortName += ' ' + lastNameInitial + '.';
            }
            
            userMenuName.textContent = shortName;
        } else {
            // Если данных нет в localStorage
            userMenuName.textContent = 'Пользователь';
        }
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        const userMenuName = document.getElementById('userMenuName');
        if (userMenuName) {
            userMenuName.textContent = 'Пользователь';
        }
    }
}

// Инициализация меню навигации
function initNavigation() {
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (!userMenu || !dropdownMenu) {
        console.warn('Элементы меню не найдены');
        return;
    }

    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
        userMenu.classList.toggle('active');
    }

    function closeMenu(e) {
        // Закрываем меню только если клик был вне меню
        if (!userMenu.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
            userMenu.classList.remove('active');
        }
    }

    // Обработчики для десктопа
    userMenu.addEventListener('click', toggleMenu);
    document.addEventListener('click', closeMenu);

    // Обработчики для мобильных
    userMenu.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMenu(e);
    });
    
    document.addEventListener('touchend', function(e) {
        closeMenu(e);
    });

    // Предотвращаем закрытие при клике внутри меню
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    dropdownMenu.addEventListener('touchend', function(e) {
        e.stopPropagation();
    });
}

// Данные теста
const TestManager = {
    // Конфигурация теста
    config: {
        totalQuestions: 10,
        timeLimit: 15 * 60, // 15 минут в секундах
        passingScore: 70
    },
    
    // Текущее состояние теста
    state: {
        currentQuestion: 0,
        userAnswers: new Array(10).fill(null),
        startTime: null,
        timerInterval: null,
        testLevel: 'basic',
        isTestCompleted: false
    },
    
    // Вопросы теста
    questions: [
        {
            id: 1,
            question: "Что выведет следующий код?\nprint(type([]))",
            code: "print(type([]))",
            options: [
                "<class 'list'>",
                "<class 'array'>",
                "<class 'tuple'>",
                "<class 'dict'>"
            ],
            correctAnswer: 0,
            explanation: "В Python пустые квадратные скобки [] создают список (list)."
        },
        {
            id: 2,
            question: "Какой метод используется для добавления элемента в конец списка?",
            options: [
                "append()",
                "add()",
                "insert()",
                "push()"
            ],
            correctAnswer: 0,
            explanation: "Метод append() добавляет элемент в конец списка."
        },
        {
            id: 3,
            question: "Что делает оператор ** в Python?",
            options: [
                "Возведение в степень",
                "Умножение",
                "Получение остатка от деления",
                "Деление с округлением"
            ],
            correctAnswer: 0,
            explanation: "Оператор ** используется для возведения в степень. Например: 2**3 = 8."
        },
        {
            id: 4,
            question: "Какой из этих типов данных является неизменяемым (immutable)?",
            options: [
                "Кортеж (tuple)",
                "Список (list)",
                "Словарь (dict)",
                "Множество (set)"
            ],
            correctAnswer: 0,
            explanation: "Кортеж (tuple) - неизменяемая структура данных, в отличие от списков, словарей и множеств."
        },
        {
            id: 5,
            question: "Что выведет этот код?\nprint('Hello' + 3*'!')",
            code: "print('Hello' + 3*'!')",
            options: [
                "Hello!!!",
                "Hello!Hello!Hello!",
                "Ошибка",
                "Hello3!"
            ],
            correctAnswer: 0,
            explanation: "В Python строки можно умножать на числа: '!' * 3 = '!!!'."
        },
        {
            id: 6,
            question: "Как правильно объявить словарь?",
            options: [
                "{'key': 'value'}",
                "['key': 'value']",
                "('key': 'value')",
                "<'key': 'value'>"
            ],
            correctAnswer: 0,
            explanation: "Словарь объявляется с помощью фигурных скобок {} с парами ключ:значение."
        },
        {
            id: 7,
            question: "Что делает функция range(5)?",
            options: [
                "Создает последовательность чисел от 0 до 4",
                "Создает список из 5 нулей",
                "Возвращает случайное число от 0 до 5",
                "Округляет число до 5 знаков"
            ],
            correctAnswer: 0,
            explanation: "range(5) создает последовательность: 0, 1, 2, 3, 4."
        },
        {
            id: 8,
            question: "Как получить длину списка?",
            options: [
                "len(list)",
                "list.length()",
                "list.size()",
                "length(list)"
            ],
            correctAnswer: 0,
            explanation: "В Python для получения длины используется функция len()."
        },
        {
            id: 9,
            question: "Что такое 'list comprehension'?",
            options: [
                "Краткий способ создания списков",
                "Метод сортировки списка",
                "Функция для фильтрации списка",
                "Оператор для объединения списков"
            ],
            correctAnswer: 0,
            explanation: "List comprehension - это синтаксис для создания списков в одну строку."
        },
        {
            id: 10,
            question: "Как импортировать модуль math?",
            options: [
                "import math",
                "include math",
                "require math",
                "using math"
            ],
            correctAnswer: 0,
            explanation: "В Python модули импортируются с помощью ключевого слова import."
        }
    ],
    
    // Инициализация теста
    init() {
        this.loadStateFromStorage();
        this.loadQuestion(this.state.currentQuestion);
        this.startTimer();
        this.updateProgressBar();
    },
    
    // Загрузка состояния из localStorage
    loadStateFromStorage() {
        const savedState = localStorage.getItem('pythonTestState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                this.state.currentQuestion = parsed.currentQuestion || 0;
                this.state.userAnswers = parsed.userAnswers || new Array(10).fill(null);
                this.state.testLevel = parsed.testLevel || localStorage.getItem('selectedTestLevel') || 'basic';
            } catch (error) {
                console.error('Ошибка загрузки состояния теста:', error);
            }
        } else {
            this.state.testLevel = localStorage.getItem('selectedTestLevel') || 'basic';
        }
    },
    
    // Сохранение состояния в localStorage
    saveStateToStorage() {
        const stateToSave = {
            currentQuestion: this.state.currentQuestion,
            userAnswers: this.state.userAnswers,
            testLevel: this.state.testLevel,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('pythonTestState', JSON.stringify(stateToSave));
    },
    
    // Загрузка вопроса
    loadQuestion(questionIndex) {
        this.state.currentQuestion = questionIndex;
        const question = this.questions[questionIndex];
        const container = document.getElementById('questionsContainer');
        
        container.innerHTML = `
            <div class="question-container">
                <div class="question-header">
                    <div class="question-number">Вопрос ${question.id}</div>
                    <div class="question-text">${question.question}</div>
                    ${question.code ? `<div class="code-block">${question.code}</div>` : ''}
                </div>
                
                <div class="answer-options">
                    ${question.options.map((option, index) => `
                        <div class="answer-option ${this.state.userAnswers[questionIndex] === index ? 'selected' : ''}" 
                             onclick="TestManager.selectAnswer(${index})">
                            <div class="option-content">
                                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                                <div class="option-text">${option}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Обновляем счетчик
        document.getElementById('currentQuestion').textContent = questionIndex + 1;
        
        // Обновляем кнопки навигации
        this.updateNavigationButtons(questionIndex);
        this.updateProgressBar();
        
        // Сохраняем состояние
        this.saveStateToStorage();
    },
    
    // Выбор ответа
    selectAnswer(answerIndex) {
        this.state.userAnswers[this.state.currentQuestion] = answerIndex;
        
        // Обновляем визуальное состояние
        const options = document.querySelectorAll('.answer-option');
        options.forEach((option, index) => {
            option.classList.toggle('selected', index === answerIndex);
        });
        
        // Сохраняем состояние
        this.saveStateToStorage();
        
        // Автоматический переход к следующему вопросу через 1 секунду
        setTimeout(() => {
            if (this.state.currentQuestion < this.config.totalQuestions - 1) {
                this.nextQuestion();
            } else {
                // Если это последний вопрос, меняем кнопку
                this.updateNavigationButtons(this.state.currentQuestion);
            }
        }, 1000);
    },
    
    // Следующий вопрос
    nextQuestion() {
        if (this.state.currentQuestion < this.config.totalQuestions - 1) {
            this.loadQuestion(this.state.currentQuestion + 1);
        } else {
            this.submitTest();
        }
    },
    
    // Предыдущий вопрос
    prevQuestion() {
        if (this.state.currentQuestion > 0) {
            this.loadQuestion(this.state.currentQuestion - 1);
        }
    },
    
    // Обновление кнопок навигации
    updateNavigationButtons(currentIndex) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = currentIndex === 0;
        
        if (currentIndex === this.config.totalQuestions - 1) {
            nextBtn.textContent = 'Завершить тест';
            nextBtn.className = 'nav-btn submit-btn';
            nextBtn.onclick = () => TestManager.submitTest();
        } else {
            nextBtn.textContent = 'Далее →';
            nextBtn.className = 'nav-btn next-btn';
            nextBtn.onclick = () => TestManager.nextQuestion();
        }
    },
    
    // Обновление прогресс-бара
    updateProgressBar() {
        const progressPercent = ((this.state.currentQuestion + 1) / this.config.totalQuestions) * 100;
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
    },
    
    // Таймер
    startTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }
        
        this.state.startTime = Date.now();
        const endTime = this.state.startTime + this.config.timeLimit * 1000;
        
        this.state.timerInterval = setInterval(() => {
            const now = Date.now();
            const timeLeft = Math.max(0, endTime - now);
            
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Меняем цвет при низком времени
            if (timeLeft < 60000) { // Меньше минуты
                document.getElementById('timer').style.background = '#ff4757';
            }
            
            if (timeLeft === 0) {
                clearInterval(this.state.timerInterval);
                this.submitTest();
            }
        }, 1000);
    },
    
    // Отправка теста
    submitTest() {
        // Останавливаем таймер
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }
        
        // Подсчет результатов
        let correctAnswers = 0;
        this.questions.forEach((question, index) => {
            if (this.state.userAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        
        const score = Math.round((correctAnswers / this.config.totalQuestions) * 100);
        const timeSpent = Math.round((Date.now() - this.state.startTime) / 1000);
        
        // Определение результата
        const result = this.calculateResult(score, correctAnswers, timeSpent);
        
        // Сохраняем результат
        this.saveTestResult(result);
        
        // Создаем уведомление
        this.createTestResultNotification(result);
        
        // Показываем результаты
        this.showResults(result);
        
        // Очищаем состояние теста
        localStorage.removeItem('pythonTestState');
        this.state.isTestCompleted = true;
    },
    
    // Расчет результата
    calculateResult(score, correctAnswers, timeSpent) {
        let level = '';
        let icon = '';
        let message = '';
        
        if (score >= 90) {
            level = 'Отличный';
            icon = '🏆';
            message = 'Превосходный результат! Вы отлично владеете основами Python.';
        } else if (score >= 70) {
            level = 'Хороший';
            icon = '👍';
            message = 'Хороший результат! Вы хорошо знаете основы Python.';
        } else if (score >= 50) {
            level = 'Средний';
            icon = '📊';
            message = 'Средний результат. Рекомендуем повторить материал.';
        } else {
            level = 'Начальный';
            icon = '📚';
            message = 'Нужно больше практики. Рекомендуем пройти обучение заново.';
        }
        
        return {
            testName: 'Python разработчик',
            testLevel: this.state.testLevel,
            score: score,
            correctAnswers: correctAnswers,
            totalQuestions: this.config.totalQuestions,
            timeSpent: timeSpent,
            timeSpentFormatted: this.formatTime(timeSpent),
            level: level,
            icon: icon,
            message: message,
            passed: score >= this.config.passingScore,
            timestamp: new Date().toISOString(),
            userAnswers: [...this.state.userAnswers],
            questions: this.questions.map((q, index) => ({
                id: q.id,
                question: q.question,
                userAnswer: this.state.userAnswers[index] !== null ? 
                    q.options[this.state.userAnswers[index]] : 'Нет ответа',
                correctAnswer: q.options[q.correctAnswer],
                isCorrect: this.state.userAnswers[index] === q.correctAnswer,
                explanation: q.explanation
            }))
        };
    },
    
    // Форматирование времени
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    // Сохранение результата теста
    saveTestResult(result) {
        // Получаем существующие результаты
        const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]');
        
        // Добавляем новый результат
        existingResults.push(result);
        
        // Сохраняем обратно
        localStorage.setItem('testResults', JSON.stringify(existingResults));
        
        // Также сохраняем последний результат
        localStorage.setItem('lastTestResult', JSON.stringify(result));
        
        // Обновляем статистику пользователя
        this.updateUserStatistics(result);
    },
    
    // Обновление статистики пользователя
    updateUserStatistics(result) {
        const userDataStr = localStorage.getItem('currentUser');
        if (userDataStr) {
            try {
                const userData = JSON.parse(userDataStr);
                
                if (!userData.statistics) {
                    userData.statistics = {
                        testsCompleted: 0,
                        totalScore: 0,
                        averageScore: 0,
                        lastTestDate: null,
                        testsHistory: []
                    };
                }
                
                userData.statistics.testsCompleted = (userData.statistics.testsCompleted || 0) + 1;
                userData.statistics.totalScore = (userData.statistics.totalScore || 0) + result.score;
                userData.statistics.averageScore = Math.round(
                    userData.statistics.totalScore / userData.statistics.testsCompleted
                );
                userData.statistics.lastTestDate = new Date().toISOString();
                userData.statistics.testsHistory = userData.statistics.testsHistory || [];
                userData.statistics.testsHistory.unshift({
                    testName: result.testName,
                    score: result.score,
                    date: result.timestamp
                });
                
                // Сохраняем обновленные данные
                localStorage.setItem('currentUser', JSON.stringify(userData));
            } catch (error) {
                console.error('Ошибка обновления статистики пользователя:', error);
            }
        }
    },
    
    // Создание уведомления о результате теста
    createTestResultNotification(result) {
        // Получаем существующие уведомления
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Создаем новое уведомление
        const newNotification = {
            id: 'test-result-' + Date.now(),
            type: 'test',
            category: 'test',
            title: `Тест "${result.testName}" завершен!`,
            message: `Ваш результат: ${result.score}%. ${result.correctAnswers} из ${result.totalQuestions} правильных ответов.`,
            sender: 'Система Qualimeter',
            date: new Date().toLocaleDateString('ru-RU'),
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isNew: true,
            isFavorite: false,
            isRead: false,
            timestamp: new Date().toISOString(),
            testResult: result
        };
        
        // Добавляем в начало списка
        notifications.unshift(newNotification);
        
        // Сохраняем обратно
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        // Обновляем счетчик непрочитанных
        this.updateUnreadCount();
    },
    
    // Обновление счетчика непрочитанных уведомлений
    updateUnreadCount() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const unreadCount = notifications.filter(n => n.isNew && !n.isRead).length;
        
        // Обновляем в localStorage для других страниц
        localStorage.setItem('unreadNotificationsCount', unreadCount);
    },
    
    // Показ результатов
    showResults(result) {
        const overlay = document.getElementById('resultOverlay');
        const resultScore = document.getElementById('resultScore');
        const resultLevel = document.getElementById('resultLevel');
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        
        resultScore.textContent = `${result.score}/100`;
        resultLevel.textContent = `Уровень: ${result.level}`;
        resultIcon.textContent = result.icon;
        resultMessage.textContent = result.message;
        
        // Добавляем подробную информацию
        const existingDetails = document.querySelector('.result-details');
        if (existingDetails) {
            existingDetails.remove();
        }
        
        const detailsHtml = `
            <div class="result-details">
                <div class="detail-item">
                    <span>Правильных ответов:</span>
                    <span class="detail-value">${result.correctAnswers}/${result.totalQuestions}</span>
                </div>
                <div class="detail-item">
                    <span>Затраченное время:</span>
                    <span class="detail-value">${result.timeSpentFormatted}</span>
                </div>
                <div class="detail-item">
                    <span>Минимальный проходной балл:</span>
                    <span class="detail-value">${this.config.passingScore}%</span>
                </div>
                <div class="detail-item">
                    <span>Статус:</span>
                    <span class="detail-value" style="color: ${result.passed ? '#27ae60' : '#ff4757'}">
                        ${result.passed ? 'Сдан ✓' : 'Не сдан ✗'}
                    </span>
                </div>
            </div>
        `;
        
        resultMessage.insertAdjacentHTML('afterend', detailsHtml);
        
        // Показываем оверлей
        overlay.classList.add('active');
        
        // Добавляем анимацию
        overlay.style.animation = 'fadeIn 0.3s ease';
        
        // Запрещаем прокрутку основного контента
        document.body.style.overflow = 'hidden';
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница вопросов теста загружена');
    
    // 1. Загружаем данные пользователя
    loadUserData();
    
    // 2. Инициализируем навигацию
    setTimeout(() => {
        initNavigation();
    }, 100);
    
    // 3. Инициализируем тест
    TestManager.init();
    
    // 4. Добавляем обработчик для закрытия теста при нажатии ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && TestManager.state.isTestCompleted) {
            const overlay = document.getElementById('resultOverlay');
            if (overlay && overlay.classList.contains('active')) {
                window.location.href = 'python-test.html';
            }
        }
    });
    
    // 5. Предупреждение при закрытии страницы
    window.addEventListener('beforeunload', function(e) {
        if (!TestManager.state.isTestCompleted) {
            e.preventDefault();
            e.returnValue = 'Тест еще не завершен. Вы уверены, что хотите уйти?';
        }
    });
});

// Экспортируем функции для использования в HTML
window.selectAnswer = (index) => TestManager.selectAnswer(index);
window.nextQuestion = () => TestManager.nextQuestion();
window.prevQuestion = () => TestManager.prevQuestion();
window.submitTest = () => TestManager.submitTest();