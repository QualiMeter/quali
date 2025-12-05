function loadUserData() {
  try {
    const userDataStr = localStorage.getItem('currentUser');
    if (!userDataStr) return;

    const userData = JSON.parse(userDataStr);

    let firstName = '';
    let lastName = '';

    if (userData.name) firstName = userData.name;
    else if (userData.firstName) firstName = userData.firstName;
    else if (userData.username) firstName = userData.username;
    else if (userData.login) firstName = userData.login;

    if (userData.lastname) lastName = userData.lastname;
    else if (userData.lastName) lastName = userData.lastName;

    if (userData.name && userData.name.includes(' ')) {
      const nameParts = userData.name.split(' ');
      firstName = nameParts[0] || firstName;
      lastName = nameParts.slice(1).join(' ') || lastName;
    }

    document.getElementById('userFirstName').textContent = firstName;
    document.getElementById('userLastName').textContent = lastName;

    let shortName = firstName;
    if (lastName) {
      const lastNameInitial = lastName.charAt(0);
      shortName += ' ' + lastNameInitial + '.';
    }
    document.getElementById('userMenuName').textContent = shortName;

    document.getElementById('userId').textContent = `ID: ${userData.id || userData.userId || 'Не указан'}`;

    if (userData.bio) {
      document.getElementById('userBio').textContent = userData.bio;
    }

  } catch (error) {
    console.error('Ошибка:', error);
    document.getElementById('userFirstName').textContent = 'Ошибка';
    document.getElementById('userLastName').textContent = 'загрузки';
    document.getElementById('userMenuName').textContent = 'Пользователь';
  }
}

function setupLogout() {
  const logoutLink = document.querySelector('.logout a');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      // УДАЛИТЬ ЭТИ СТРОКИ:
      // localStorage.removeItem('currentUser');
      // localStorage.setItem('lastLogout', new Date().toISOString());
      
      // Просто перейти на страницу подтверждения выхода
      window.location.href = 'profend.html';
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadUserData();
  setupLogout();

  const userMenu = document.getElementById("userMenu");
  const dropdownMenu = document.getElementById("dropdownMenu");

  function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    dropdownMenu.classList.toggle("active");
    userMenu.classList.toggle("active");
  }

  userMenu.addEventListener("click", toggleMenu);
  userMenu.addEventListener("touchstart", toggleMenu);

  function closeMenu() {
    dropdownMenu.classList.remove("active");
    userMenu.classList.remove("active");
  }

  document.addEventListener("click", closeMenu);
  document.addEventListener("touchstart", closeMenu);

  dropdownMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
  dropdownMenu.addEventListener("touchstart", function (e) {
    e.stopPropagation();
  });
});

window.addEventListener('storage', function (e) {
  if (e.key === 'currentUser') {
    loadUserData();
  }
});