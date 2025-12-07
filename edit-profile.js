// edit-profile.js - ИСПРАВЛЕННАЯ ВЕРСИЯ ДЛЯ МОБИЛЬНЫХ

// Функция загрузки данных пользователя (ОБНОВЛЕННАЯ)
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
            userMenuName.textContent = 'Никита Н';
            
            // Создаем тестового пользователя если его нет
            const testUser = {
                firstName: 'Никита',
                lastName: 'Никитин',
                username: 'Nikiaz28',
                about: 'Люблю сосиски с кепчуком, макарошки с сыром и программировать на ассемблере.',
                name: 'Никита Никитин'
            };
            localStorage.setItem('currentUser', JSON.stringify(testUser));
        }
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        const userMenuName = document.getElementById('userMenuName');
        if (userMenuName) {
            userMenuName.textContent = 'Пользователь';
        }
    }
}

// Выделение активной ссылки в выпадающем меню
function highlightActiveMenuItem() {
    // Убираем все стили активных ссылок
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        // Убираем все классы
        link.classList.remove('active');
        link.classList.remove('inactive');
        
        // Убираем подчеркивание
        link.style.textDecoration = 'none';
        link.style.color = '#000000';
        link.style.fontWeight = 'normal';
    });
    
    // Убираем стиль main-link у всех ссылок
    menuLinks.forEach(link => {
        link.classList.remove('main-link');
    });
    
    // Добавляем стиль активной ссылки к "Настройки"
    const editProfileLink = document.querySelector('a[href="edit-profile.html"]');
    if (editProfileLink) {
        editProfileLink.style.color = '#155DFC';
        editProfileLink.style.textDecoration = 'underline';
        editProfileLink.style.fontWeight = 'normal';
    }
}

// Инициализация меню навигации (ОБНОВЛЕННАЯ ДЛЯ МОБИЛЬНЫХ)
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

    // Удаляем старые обработчики
    userMenu.removeEventListener('click', toggleMenu);
    userMenu.removeEventListener('touchend', toggleMenu);
    document.removeEventListener('click', closeMenu);
    document.removeEventListener('touchend', closeMenu);

    // Добавляем новые обработчики (используем touchend для мобильных)
    userMenu.addEventListener('click', toggleMenu);
    userMenu.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMenu(e);
    });

    document.addEventListener('click', closeMenu);
    document.addEventListener('touchend', function(e) {
        // Для мобильных устройств
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

// Функция загрузки текущих данных профиля
function loadCurrentProfileData() {
    try {
        const userDataStr = localStorage.getItem('currentUser');
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            
            // Заполняем поля формы данными из localStorage
            if (userData.firstName || userData.name) {
                const firstName = userData.firstName || (userData.name ? userData.name.split(' ')[0] : '');
                document.getElementById('firstName').value = firstName;
                document.getElementById('currentFirstName').textContent = firstName;
            }
            
            if (userData.lastName || userData.name) {
                const lastName = userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : '');
                document.getElementById('lastName').value = lastName;
                document.getElementById('currentLastName').textContent = lastName;
            }
            
            if (userData.username) {
                document.getElementById('username').value = userData.username;
                document.getElementById('currentUsername').textContent = userData.username;
            }
            
            if (userData.about) {
                document.getElementById('about').value = userData.about;
                document.getElementById('currentAbout').textContent = userData.about;
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки данных профиля:', error);
    }
}

// Функция сохранения изменений профиля
function saveProfileChanges() {
    try {
        // Собираем данные из формы
        const updatedData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            username: document.getElementById('username').value.trim(),
            about: document.getElementById('about').value.trim(),
            updatedAt: new Date().toISOString()
        };
        
        // Проверка заполненности обязательных полей
        if (!updatedData.firstName) {
            alert('Пожалуйста, введите имя');
            return;
        }
        
        if (!updatedData.username) {
            alert('Пожалуйста, введите логин');
            return;
        }
        
        // Получаем текущие данные пользователя
        const userDataStr = localStorage.getItem('currentUser');
        let userData = {};
        
        if (userDataStr) {
            userData = JSON.parse(userDataStr);
        }
        
        // Обновляем данные
        const mergedData = {
            ...userData,
            ...updatedData,
            // Сохраняем имя для меню (полное имя)
            name: `${updatedData.firstName} ${updatedData.lastName}`.trim()
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(mergedData));
        
        // Показываем сообщение об успехе
        alert('Профиль успешно обновлен!');
        
        // Обновляем отображение в меню
        loadUserData();
        
        // Обновляем текущие значения на странице
        document.getElementById('currentFirstName').textContent = updatedData.firstName;
        document.getElementById('currentLastName').textContent = updatedData.lastName;
        document.getElementById('currentUsername').textContent = updatedData.username;
        document.getElementById('currentAbout').textContent = updatedData.about;
        
        // Обновляем таблицу текущих данных
        const dataRows = document.querySelectorAll('.data-row');
        if (dataRows.length >= 4) {
            dataRows[0].querySelector('.data-value').textContent = updatedData.firstName;
            dataRows[1].querySelector('.data-value').textContent = updatedData.lastName;
            dataRows[2].querySelector('.data-value').textContent = updatedData.username;
            dataRows[3].querySelector('.data-value').textContent = updatedData.about;
        }
        
    } catch (error) {
        console.error('Ошибка сохранения профиля:', error);
        alert('Произошла ошибка при сохранении профиля');
    }
}

// Функция для мобильных устройств
function initMobileSupport() {
    // Добавляем CSS класс для мобильных
    if (window.innerWidth <= 768) {
        document.body.classList.add('is-mobile');
        
        // Увеличиваем область касания для элементов меню
        const touchElements = document.querySelectorAll('.part3, .menu-link, .btn-save, .btn-cancel');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
        });
    }
}

// Основная инициализация (ОБНОВЛЕННАЯ)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница редактирования профиля загружена');
    
    // 1. Инициализируем поддержку мобильных устройств
    initMobileSupport();
    
    // 2. Загружаем данные пользователя СРАЗУ
    loadUserData();
    
    // 3. Инициализируем навигацию
    setTimeout(() => {
        initNavigation();
    }, 100);
    
    // 4. Загрузка текущих данных пользователя в форму
    loadCurrentProfileData();
    
    // 5. Обработчик формы
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
    
    // 6. Обработчик загрузки аватара
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.querySelector('.avatar-preview');
    
    if (avatarInput && avatarPreview) {
        avatarPreview.addEventListener('click', function() {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = avatarPreview.querySelector('.current-avatar');
                    if (img) {
                        img.src = event.target.result;
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
    
    // 7. Выделение активного пункта меню
    setTimeout(() => {
        highlightActiveMenuItem();
    }, 200);
    
    // 8. Добавляем обработчик ресайза для мобильных
    window.addEventListener('resize', function() {
        initMobileSupport();
    });
});

// Также добавьте обработчик для предотвращения масштабирования на мобильных
window.addEventListener('load', function() {
    // Фиксируем данные в localStorage при загрузке
    setTimeout(() => {
        loadUserData();
    }, 500);
});
