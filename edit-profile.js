// edit-profile.js - ИСПРАВЛЕННАЯ ВЕРСИЯ

// Функция загрузки данных пользователя
function loadUserData() {
    try {
        const userDataStr = localStorage.getItem('currentUser');
        const userMenuName = document.getElementById('userMenuName');
        
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            if (userMenuName) {
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
                
                userMenuName.textContent = shortName;
            }
        } else {
            // Если данных нет, используем значение по умолчанию
            if (userMenuName) {
                userMenuName.textContent = 'Никита Н';
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        const userMenuName = document.getElementById('userMenuName');
        if (userMenuName) {
            userMenuName.textContent = 'Никита Н';
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
        editProfileLink.style.fontWeight = 'normal'; // Убираем полужирный
        
        // НЕ изменяем цвет шестеренки
        const menuItem = editProfileLink.closest('.menu-item-with-icon');
        if (menuItem) {
            const icon = menuItem.querySelector('.menu-icon');
            if (icon) {
                // Оставляем иконку черной
                icon.style.filter = 'none';
            }
        }
    }
    
    // Для ссылки "Профиль" убираем подчеркивание
    const profileLink = document.querySelector('a[href="prof.html"]');
    if (profileLink) {
        profileLink.classList.remove('main-link');
        profileLink.style.color = '#000000';
        profileLink.style.textDecoration = 'none';
        profileLink.style.fontWeight = 'normal';
    }
}

// Инициализация меню навигации
function initNavigation() {
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (!userMenu || !dropdownMenu) return;

    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
        userMenu.classList.toggle('active');
    }

    function closeMenu() {
        dropdownMenu.classList.remove('active');
        userMenu.classList.remove('active');
    }

    // Удаляем старые обработчики событий
    userMenu.removeEventListener('click', toggleMenu);
    userMenu.removeEventListener('touchstart', toggleMenu);
    document.removeEventListener('click', closeMenu);
    document.removeEventListener('touchstart', closeMenu);

    // Добавляем новые обработчики событий
    userMenu.addEventListener('click', toggleMenu);
    userMenu.addEventListener('touchstart', toggleMenu);

    document.addEventListener('click', closeMenu);
    document.addEventListener('touchstart', closeMenu);

    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    dropdownMenu.addEventListener('touchstart', function(e) {
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

// Основная инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница редактирования профиля загружена');
    
    // 1. Загружаем данные пользователя
    loadUserData();
    
    // 2. Инициализируем навигацию
    initNavigation();
    
    // 3. Загрузка текущих данных пользователя в форму
    loadCurrentProfileData();
    
    // 4. Обработчик формы
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
    
    // 5. Обработчик загрузки аватара
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
    
    // 6. Выделение активного пункта меню
    setTimeout(() => {
        highlightActiveMenuItem();
    }, 100);
});

