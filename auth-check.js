const currentUser = localStorage.getItem('currentUser');
// Получаем текущую страницу
const currentPage = window.location.pathname.split('/').pop();

// Если это страница подтверждения выхода (profend.html), не проверяем авторизацию
if (!currentUser && currentPage !== 'profend.html') {
  alert('Пожалуйста, войдите в систему');
  window.location.href = 'enter.html';
}