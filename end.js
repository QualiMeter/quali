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
    console.error('Ошибка:', error);
    const userMenuNameElement = document.getElementById('userMenuName');
    if (userMenuNameElement) {
      userMenuNameElement.textContent = 'Пользователь';
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadUserData();

  const userMenu = document.getElementById("userMenu");
  const dropdownMenu = document.getElementById("dropdownMenu");

  function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    dropdownMenu.classList.toggle("active");
    userMenu.classList.toggle("active");
  }

  if (userMenu) {
    userMenu.addEventListener("click", toggleMenu);
    userMenu.addEventListener("touchstart", toggleMenu);
  }

  function closeMenu() {
    if (dropdownMenu) dropdownMenu.classList.remove("active");
    if (userMenu) userMenu.classList.remove("active");
  }

  document.addEventListener("click", closeMenu);
  document.addEventListener("touchstart", closeMenu);

  if (dropdownMenu) {
    dropdownMenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    dropdownMenu.addEventListener("touchstart", function (e) {
      e.stopPropagation();
    });
  }

  const logoutButton = document.querySelector('.a2 a');
  if (logoutButton) {
    logoutButton.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }
});