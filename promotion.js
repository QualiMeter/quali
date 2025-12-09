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

    document.getElementById('userMenuName').textContent = shortName;

  } catch (error) {
    console.error('Ошибка:', error);
    document.getElementById('userMenuName').textContent = 'Пользователь';
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
  
  // Удалите этот блок, если он не нужен
  // Инициализируем график зарплаты (теперь цвета задаются в CSS)
  // initSalaryChart();
});