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

// JavaScript для страницы Python теста
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
    
    // Функции для уровней сложности
    let currentLevel = 'basic';
    
    function selectLevel(levelElement) {
        const levels = document.querySelectorAll('.difficulty-level');
        
        levels.forEach(level => {
            level.classList.remove('active');
        });
        
        levelElement.classList.add('active');
        currentLevel = levelElement.getAttribute('data-level');
        updateLevelIndicator();
    }
    
    function updateLevelIndicator() {
        const indicator = document.getElementById('levelIndicator');
        if (!indicator) return;
        
        let levelName = '';
        
        switch(currentLevel) {
            case 'basic':
                levelName = 'Базовый';
                break;
            case 'intermediate':
                levelName = 'Средний';
                break;
            case 'advanced':
                levelName = 'Продвинутый';
                break;
            default:
                levelName = 'Базовый';
        }
        
        indicator.innerHTML = `Выбран уровень: <strong>${levelName}</strong>`;
    }
    
    window.selectLevel = selectLevel;
    window.updateLevelIndicator = updateLevelIndicator;
    
    // Функция начала теста
    window.startTest = function() {
        let levelName = '';
        
        switch(currentLevel) {
            case 'basic':
                levelName = 'базовом';
                break;
            case 'intermediate':
                levelName = 'среднем';
                break;
            case 'advanced':
                levelName = 'продвинутом';
                break;
        }
        
        alert(`Тест "Python разработчик" начат!\nУровень: ${levelName}\nВремя: 15 минут\nВопросов: 10`);
        
        // Здесь можно добавить переход на страницу с вопросами
        // window.location.href = 'test-questions.html?level=' + currentLevel;
    };
    
    // Инициализация
    const basicLevel = document.querySelector('[data-level="basic"]');
    if (basicLevel) {
        basicLevel.classList.add('active');
        updateLevelIndicator();
    }
});
