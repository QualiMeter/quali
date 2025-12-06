// JavaScript для страницы Python теста
        document.addEventListener('DOMContentLoaded', function() {
            // Навигация
            const userMenu = document.getElementById('userMenu');
            const dropdownMenu = document.getElementById('dropdownMenu');
            
            userMenu.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });
            
            document.addEventListener('click', function(e) {
                if (!userMenu.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('active');
                }
            });
            
            // Устанавливаем имя пользователя
            document.getElementById('userMenuName').textContent = 'Никита Н';
            
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
            }
        });