// edit-profile.js - ИСПРАВЛЕННАЯ ВЕРСИЯ С ПРАВИЛЬНОЙ СТРУКТУРОЙ ДЛЯ СЕРВЕРА

const API_BASE_URL = 'https://qmv2api.onrender.com';

// Функция загрузки данных пользователя с сервера
async function loadUserData() {
    try {
        const userMenuName = document.getElementById('userMenuName');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userId = currentUser.id;

        if (!userMenuName) {
            console.warn('Элемент userMenuName не найден');
            return;
        }

        if (userId) {
            // Пробуем загрузить данные с сервера
            try {
                const response = await fetch(`${API_BASE_URL}/api/Users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    
                    // Сохраняем актуальные данные в localStorage
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // Формируем короткое имя для меню
                    let shortName = userData.name || 'Пользователь';
                    if (shortName.includes(' ')) {
                        const parts = shortName.split(' ');
                        const lastNameInitial = parts[1] ? parts[1].charAt(0) + '.' : '';
                        shortName = parts[0] + ' ' + lastNameInitial;
                    }
                    
                    userMenuName.textContent = shortName;
                    return userData;
                }
            } catch (serverError) {
                console.log('Не удалось загрузить данные с сервера, используем локальные:', serverError);
            }
        }

        // Если нет ID или сервер не ответил, используем локальные данные
        if (currentUser.name) {
            let shortName = currentUser.name;
            if (shortName.includes(' ')) {
                const parts = shortName.split(' ');
                const lastNameInitial = parts[1] ? parts[1].charAt(0) + '.' : '';
                shortName = parts[0] + ' ' + lastNameInitial;
            }
            userMenuName.textContent = shortName;
        } else {
            userMenuName.textContent = 'Пользователь';
        }

        return currentUser;
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        const userMenuName = document.getElementById('userMenuName');
        if (userMenuName) {
            userMenuName.textContent = 'Пользователь';
        }
        return {};
    }
}

// Функция загрузки текущих данных профиля
async function loadCurrentProfileData() {
    try {
        const userData = await loadUserData();
        
        if (userData) {
            // Разделяем полное имя на имя и фамилию
            let firstName = '';
            let lastName = '';
            
            if (userData.name) {
                const nameParts = userData.name.split(' ');
                firstName = nameParts[0] || '';
                lastName = nameParts.slice(1).join(' ') || '';
            }
            
            // Заполняем поля формы
            document.getElementById('firstName').value = firstName;
            document.getElementById('currentFirstName').textContent = firstName;
            document.getElementById('displayFirstName').textContent = firstName;
            
            document.getElementById('lastName').value = lastName;
            document.getElementById('currentLastName').textContent = lastName;
            document.getElementById('displayLastName').textContent = lastName;
            
            // Используем login из данных пользователя
            const login = userData.login || userData.username || '';
            document.getElementById('login').value = login;
            document.getElementById('currentLogin').textContent = login;
            document.getElementById('displayLogin').textContent = login;
            
            // Обо мне
            const about = userData.about || '';
            document.getElementById('about').value = about;
            document.getElementById('currentAbout').textContent = about;
            document.getElementById('displayAbout').textContent = about;
        }
    } catch (error) {
        console.error('Ошибка загрузки данных профиля:', error);
    }
}

// Функция сохранения изменений на сервере
async function saveProfileChanges() {
    const saveButton = document.getElementById('saveButton');
    const originalText = saveButton.textContent;
    
    try {
        // Показываем состояние загрузки
        saveButton.classList.add('loading');
        saveButton.disabled = true;
        saveButton.textContent = 'Сохранение';
        
        // Собираем данные из формы
        const updatedData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            login: document.getElementById('login').value.trim(),
            about: document.getElementById('about').value.trim()
        };
        
        // Проверка заполненности обязательных полей
        if (!updatedData.firstName) {
            alert('Пожалуйста, введите имя');
            return;
        }
        
        if (!updatedData.login) {
            alert('Пожалуйста, введите логин');
            return;
        }
        
        // Получаем текущие данные пользователя
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userId = currentUser.id;
        
        if (!userId) {
            alert('Ошибка: ID пользователя не найден. Пожалуйста, войдите заново.');
            return;
        }
        
        // Формируем полное имя (как в reg.js)
        const fullName = `${updatedData.firstName} ${updatedData.lastName}`.trim();
        
        // Подготавливаем данные для отправки на сервер
        // СТРУКТУРА ДОЛЖНА БЫТЬ ТАКОЙ ЖЕ, КАК В reg.js при регистрации
        const serverData = {
            id: userId, // Добавляем ID для обновления
            name: fullName, // Полное имя как в reg.js
            login: updatedData.login,
            email: currentUser.email || '', // Email должен быть обязательным
            roleId: currentUser.roleId || null, // Роль из текущих данных
            isEmailConfirmed: currentUser.isEmailConfirmed || false,
            birthday: currentUser.birthday || null,
            companyId: currentUser.companyId || null,
            password: null // При обновлении не меняем пароль
        };
        
        // Отправляем PUT запрос для обновления пользователя
        console.log('Отправка данных на сервер:', serverData);
        const response = await fetch(`${API_BASE_URL}/api/Users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(serverData)
        });
        
        if (response.ok) {
            const updatedUser = await response.json();
            
            // Добавляем поле about в обновленные данные (сервер может не возвращать его)
            updatedUser.about = updatedData.about;
            
            // Сохраняем актуальные данные в localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            // Обновляем отображение на странице
            document.getElementById('currentFirstName').textContent = updatedData.firstName;
            document.getElementById('currentLastName').textContent = updatedData.lastName;
            document.getElementById('currentLogin').textContent = updatedData.login;
            document.getElementById('currentAbout').textContent = updatedData.about;
            
            document.getElementById('displayFirstName').textContent = updatedData.firstName;
            document.getElementById('displayLastName').textContent = updatedData.lastName;
            document.getElementById('displayLogin').textContent = updatedData.login;
            document.getElementById('displayAbout').textContent = updatedData.about;
            
            // Обновляем имя в меню
            await loadUserData();
            
            alert('Профиль успешно обновлен на сервере!');
        } else {
            const errorText = await response.text();
            console.error('Ошибка сервера при обновлении:', response.status, errorText);
            
            // Пробуем альтернативный подход: возможно нужно отправлять без ID в теле
            try {
                const altServerData = { ...serverData };
                delete altServerData.id; // Удаляем ID из тела запроса
                
                console.log('Пробуем альтернативную структуру:', altServerData);
                const altResponse = await fetch(`${API_BASE_URL}/api/Users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(altServerData)
                });
                
                if (altResponse.ok) {
                    const updatedUser = await altResponse.json();
                    updatedUser.about = updatedData.about;
                    
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    
                    // Обновляем отображение
                    document.getElementById('currentFirstName').textContent = updatedData.firstName;
                    document.getElementById('currentLastName').textContent = updatedData.lastName;
                    document.getElementById('currentLogin').textContent = updatedData.login;
                    document.getElementById('currentAbout').textContent = updatedData.about;
                    
                    document.getElementById('displayFirstName').textContent = updatedData.firstName;
                    document.getElementById('displayLastName').textContent = updatedData.lastName;
                    document.getElementById('displayLogin').textContent = updatedData.login;
                    document.getElementById('displayAbout').textContent = updatedData.about;
                    
                    await loadUserData();
                    
                    alert('Профиль успешно обновлен! (альтернативный метод)');
                } else {
                    throw new Error(`Альтернативный метод тоже не сработал: ${altResponse.status}`);
                }
            } catch (altError) {
                console.error('Альтернативный метод тоже не сработал:', altError);
                
                // Если сервер вернул ошибку, сохраняем локально (только about поле)
                const mergedData = {
                    ...currentUser,
                    name: fullName,
                    login: updatedData.login,
                    about: updatedData.about
                };
                
                localStorage.setItem('currentUser', JSON.stringify(mergedData));
                
                // Обновляем отображение
                document.getElementById('currentFirstName').textContent = updatedData.firstName;
                document.getElementById('currentLastName').textContent = updatedData.lastName;
                document.getElementById('currentLogin').textContent = updatedData.login;
                document.getElementById('currentAbout').textContent = updatedData.about;
                
                document.getElementById('displayFirstName').textContent = updatedData.firstName;
                document.getElementById('displayLastName').textContent = updatedData.lastName;
                document.getElementById('displayLogin').textContent = updatedData.login;
                document.getElementById('displayAbout').textContent = updatedData.about;
                
                await loadUserData();
                
                alert('Профиль обновлен локально. Ошибка сервера: ' + response.status);
            }
        }
        
    } catch (error) {
        console.error('Ошибка сохранения профиля:', error);
        
        // Сохраняем локально при ошибке сети
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const updatedData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            login: document.getElementById('login').value.trim(),
            about: document.getElementById('about').value.trim()
        };
        
        const fullName = `${updatedData.firstName} ${updatedData.lastName}`.trim();
        const mergedData = {
            ...currentUser,
            name: fullName,
            login: updatedData.login,
            about: updatedData.about
        };
        
        localStorage.setItem('currentUser', JSON.stringify(mergedData));
        
        // Обновляем отображение
        document.getElementById('currentFirstName').textContent = updatedData.firstName;
        document.getElementById('currentLastName').textContent = updatedData.lastName;
        document.getElementById('currentLogin').textContent = updatedData.login;
        document.getElementById('currentAbout').textContent = updatedData.about;
        
        document.getElementById('displayFirstName').textContent = updatedData.firstName;
        document.getElementById('displayLastName').textContent = updatedData.lastName;
        document.getElementById('displayLogin').textContent = updatedData.login;
        document.getElementById('displayAbout').textContent = updatedData.about;
        
        await loadUserData();
        
        alert('Профиль обновлен локально. Ошибка сети: ' + error.message);
    } finally {
        // Восстанавливаем кнопку
        saveButton.classList.remove('loading');
        saveButton.disabled = false;
        saveButton.textContent = originalText;
    }
}

// Выделение активной ссылки в выпадающем меню
function highlightActiveMenuItem() {
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.classList.remove('active');
        link.classList.remove('inactive');
        link.style.textDecoration = 'none';
        link.style.color = '#000000';
        link.style.fontWeight = 'normal';
    });
    
    const editProfileLink = document.querySelector('a[href="edit-profile.html"]');
    if (editProfileLink) {
        editProfileLink.style.color = '#155DFC';
        editProfileLink.style.textDecoration = 'underline';
        editProfileLink.style.fontWeight = 'normal';
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
        if (!userMenu.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
            userMenu.classList.remove('active');
        }
    }

    userMenu.removeEventListener('click', toggleMenu);
    userMenu.removeEventListener('touchend', toggleMenu);
    document.removeEventListener('click', closeMenu);
    document.removeEventListener('touchend', closeMenu);

    userMenu.addEventListener('click', toggleMenu);
    userMenu.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMenu(e);
    });

    document.addEventListener('click', closeMenu);
    document.addEventListener('touchend', function(e) {
        closeMenu(e);
    });

    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    dropdownMenu.addEventListener('touchend', function(e) {
        e.stopPropagation();
    });
}

// Функция для мобильных устройств
function initMobileSupport() {
    if (window.innerWidth <= 768) {
        document.body.classList.add('is-mobile');
        
        const touchElements = document.querySelectorAll('.part3, .menu-link, .btn-save, .btn-cancel');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
        });
    }
}

// Обработчик загрузки аватара
function initAvatarUpload() {
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
                    const img = document.getElementById('currentAvatar');
                    if (img) {
                        img.src = event.target.result;
                        
                        // Сохраняем аватар в localStorage
                        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                        currentUser.avatar = event.target.result;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
}

// Основная инициализация
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Страница редактирования профиля загружена');
    
    // 1. Инициализируем поддержку мобильных устройств
    initMobileSupport();
    
    // 2. Загружаем данные пользователя
    await loadUserData();
    
    // 3. Загружаем текущие данные профиля в форму
    await loadCurrentProfileData();
    
    // 4. Инициализируем навигацию
    setTimeout(() => {
        initNavigation();
    }, 100);
    
    // 5. Обработчик формы
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
    
    // 6. Инициализируем загрузку аватара
    initAvatarUpload();
    
    // 7. Выделение активного пункта меню
    setTimeout(() => {
        highlightActiveMenuItem();
    }, 200);
    
    // 8. Добавляем обработчик ресайза для мобильных
    window.addEventListener('resize', function() {
        initMobileSupport();
    });
});

// Обработчик для предотвращения масштабирования на мобильных
window.addEventListener('load', function() {
    setTimeout(async () => {
        await loadUserData();
    }, 500);
});