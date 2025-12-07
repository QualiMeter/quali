// JavaScript для страницы редактирования профиля
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные пользователя
    loadUserData();
    
    // Инициализация навигации
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (userMenu && dropdownMenu) {
        userMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
            userMenu.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
                userMenu.classList.remove('active');
            }
        });
    }
    
    // Загрузка текущих данных пользователя
    loadCurrentProfileData();
    
    // Обработчик формы
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
    
    // Обработчик загрузки аватара
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
});

// Функция загрузки текущих данных профиля
function loadCurrentProfileData() {
    try {
        const userDataStr = localStorage.getItem('currentUser');
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            
            // Заполняем поля формы данными из localStorage
            if (userData.firstName) {
                document.getElementById('firstName').value = userData.firstName;
                document.getElementById('currentFirstName').textContent = userData.firstName;
            }
            
            if (userData.lastName) {
                document.getElementById('lastName').value = userData.lastName;
                document.getElementById('currentLastName').textContent = userData.lastName;
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
        const userMenuName = document.getElementById('userMenuName');
        if (userMenuName) {
            let shortName = updatedData.firstName;
            if (updatedData.lastName) {
                const lastNameInitial = updatedData.lastName.charAt(0);
                shortName += ' ' + lastNameInitial + '.';
            }
            userMenuName.textContent = shortName;
        }
        
        // Обновляем текущие значения на странице
        document.getElementById('currentFirstName').textContent = updatedData.firstName;
        document.getElementById('currentLastName').textContent = updatedData.lastName;
        document.getElementById('currentUsername').textContent = updatedData.username;
        document.getElementById('currentAbout').textContent = updatedData.about;
        
        // Обновляем таблицу текущих данных
        document.querySelectorAll('.data-row')[0].querySelector('.data-value').textContent = updatedData.firstName;
        document.querySelectorAll('.data-row')[1].querySelector('.data-value').textContent = updatedData.lastName;
        document.querySelectorAll('.data-row')[2].querySelector('.data-value').textContent = updatedData.username;
        document.querySelectorAll('.data-row')[3].querySelector('.data-value').textContent = updatedData.about;
        
    } catch (error) {
        console.error('Ошибка сохранения профиля:', error);
        alert('Произошла ошибка при сохранении профиля');
    }
}

