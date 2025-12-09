// notifications.js - JavaScript для страницы уведомлений

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

// Функция для фильтрации уведомлений
function initNotificationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notificationItems = document.querySelectorAll('.notification-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Фильтрация уведомлений
            notificationItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const isNew = item.classList.contains('new');
                const isFavorite = item.querySelector('.favorite-btn')?.classList.contains('active');
                
                let showItem = true;
                
                switch(filter) {
                    case 'all':
                        showItem = true;
                        break;
                    case 'new':
                        showItem = isNew;
                        break;
                    case 'read':
                        showItem = !isNew;
                        break;
                    case 'favorite':
                        showItem = isFavorite;
                        break;
                    case 'deleted':
                        showItem = false; // В реальном приложении здесь была бы логика для удаленных
                        break;
                    case 'sent':
                        showItem = category === 'system' || category === 'message';
                        break;
                }
                
                if (showItem) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Функция для работы с действиями уведомлений
function initNotificationActions() {
    // Обработка кнопки "В избранное"
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            const starIcon = this.querySelector('.star-icon');
            const actionText = this.querySelector('.action-text');
            
            if (this.classList.contains('active')) {
                starIcon.textContent = '★';
                starIcon.classList.add('active');
                actionText.textContent = 'В избранном';
                
                // Добавляем анимацию
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                // Обновляем счетчик избранных
                updateFavoriteCount();
            } else {
                starIcon.textContent = '☆';
                starIcon.classList.remove('active');
                actionText.textContent = 'В избранное';
            }
        });
    });
    
    // Обработка кнопки "Удалить"
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const notificationItem = this.closest('.notification-item');
            
            // Добавляем анимацию удаления
            notificationItem.style.opacity = '0';
            notificationItem.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                notificationItem.style.display = 'none';
                
                // В реальном приложении здесь был бы запрос к серверу
                console.log('Уведомление удалено');
                
                // Обновляем статистику
                updateNotificationStats();
            }, 300);
        });
    });
    
    // Обработка кнопки "Ответить"
    const replyButtons = document.querySelectorAll('.reply-btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Функция ответа на сообщение будет доступна в следующем обновлении!');
        });
    });
    
    // Клик по уведомлению помечает его как прочитанное
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.action-btn')) {
                const statusElement = this.querySelector('.status');
                if (statusElement && statusElement.classList.contains('unread')) {
                    statusElement.classList.remove('unread');
                    statusElement.classList.add('read');
                    statusElement.textContent = 'Прочитано';
                    
                    // Убираем класс new
                    this.classList.remove('new');
                    
                    // Обновляем счетчик новых уведомлений
                    updateNewNotificationCount();
                }
            }
        });
    });
}

// Функция для обновления счетчика новых уведомлений
function updateNewNotificationCount() {
    const newNotifications = document.querySelectorAll('.notification-item.new').length;
    const badge = document.querySelector('.filter-btn[data-filter="new"] .badge');
    
    if (badge) {
        if (newNotifications > 0) {
            badge.textContent = newNotifications;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
    
    // Обновляем статистику
    updateNotificationStats();
}

// Функция для обновления счетчика избранных уведомлений
function updateFavoriteCount() {
    const favoriteNotifications = document.querySelectorAll('.favorite-btn.active').length;
    const statFavorite = document.querySelector('.stat-item:nth-child(4) .stat-number');
    
    if (statFavorite) {
        statFavorite.textContent = favoriteNotifications;
    }
}

// Функция для обновления всей статистики
function updateNotificationStats() {
    const totalNotifications = document.querySelectorAll('.notification-item:not([style*="display: none"])').length;
    const newNotifications = document.querySelectorAll('.notification-item.new:not([style*="display: none"])').length;
    const readNotifications = totalNotifications - newNotifications;
    const favoriteNotifications = document.querySelectorAll('.favorite-btn.active:not([style*="display: none"])').length;
    
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length >= 4) {
        stats[0].textContent = totalNotifications;
        stats[1].textContent = newNotifications;
        stats[2].textContent = readNotifications;
        stats[3].textContent = favoriteNotifications;
    }
}

// Функция для настройки уведомлений
function initNotificationSettings() {
    const settingItems = document.querySelectorAll('.setting-item input[type="checkbox"]');
    
    settingItems.forEach(checkbox => {
        // Загружаем сохраненные настройки
        const settingKey = checkbox.nextElementSibling.textContent.trim();
        const savedSetting = localStorage.getItem(`notification_${settingKey}`);
        
        if (savedSetting !== null) {
            checkbox.checked = savedSetting === 'true';
        }
        
        // Сохраняем настройки при изменении
        checkbox.addEventListener('change', function() {
            const settingKey = this.nextElementSibling.textContent.trim();
            localStorage.setItem(`notification_${settingKey}`, this.checked);
            
            // Показываем подтверждение
            if (this.checked) {
                console.log(`Уведомления "${settingKey}" включены`);
            } else {
                console.log(`Уведомления "${settingKey}" отключены`);
            }
        });
    });
}

// Основная инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница уведомлений загружена');
    
    // 1. Загружаем данные пользователя
    loadUserData();
    
    // 2. Инициализируем навигацию
    setTimeout(() => {
        initNavigation();
    }, 100);
    
    // 3. Инициализируем фильтры уведомлений
    initNotificationFilters();
    
    // 4. Инициализируем действия с уведомлениями
    initNotificationActions();
    
    // 5. Инициализируем настройки уведомлений
    initNotificationSettings();
    
    // 6. Обновляем статистику при загрузке
    updateNotificationStats();
    
    // 7. Добавляем обработчик для ресайза
    window.addEventListener('resize', function() {
        // Адаптация для мобильных
        if (window.innerWidth <= 768) {
            const filters = document.querySelector('.notification-filters');
            if (filters) {
                filters.scrollLeft = 0;
            }
        }
    });
    
    // 8. Создаем несколько тестовых уведомлений для демонстрации
    createDemoNotifications();
});

// Функция для создания демо-уведомлений (для примера)
function createDemoNotifications() {
    // В реальном приложении уведомления приходили бы с сервера
    console.log('Созданы демо-уведомления');
}

// Обработчик для обновления уведомлений при возвращении на страницу
window.addEventListener('pageshow', function() {
    // Обновляем счетчики при возвращении на страницу
    updateNotificationStats();
});

// Добавляем стили для мобильных устройств
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', function() {
        const touchElements = document.querySelectorAll('.filter-btn, .action-btn, .notification-item');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.touchAction = 'manipulation';
        });
    });
}
// Вместо этого добавьте или оставьте только базовую адаптацию:
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', function() {
        const touchElements = document.querySelectorAll('.filter-btn, .action-btn, .notification-item');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.touchAction = 'manipulation';
        });
    });
}