document.addEventListener("DOMContentLoaded", function () {
  const switchButtons = document.querySelectorAll('.switch-btn');
  const usernameInput = document.getElementById('username');
  const submitBtn = document.getElementById('submitBtn');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  let currentRole = 'employee';

  togglePasswordBtn.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? 'Показать' : 'Скрыть';
    this.setAttribute('title', type === 'password' ? 'Показать пароль' : 'Скрыть пароль');
  });

  function updatePlaceholder(role) {
    if (role === 'company') {
      usernameInput.placeholder = "  ООО \"Компания\"";
    } else {
      usernameInput.placeholder = "  Никита Никитин";
    }
  }

	switchButtons.forEach(button => {
		button.addEventListener('click', async function () {
			switchButtons.forEach(btn => btn.classList.remove('active'));
			this.classList.add('active');
      		currentRole = this.getAttribute('data-value');
      		updatePlaceholder(currentRole);

      		let response = await fetch('https://qmv2api.onrender.com/api/Roles/');
			console.info(response.json());
    });
  });

  const form = document.getElementById("regForm");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const login = document.getElementById("login").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !login || !email || !password) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Пожалуйста, введите корректный email адрес");
      return;
    }

    if (password.length < 6) {
      alert("Пароль должен содержать минимум 6 символов");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      alert("Пользователь с таким email уже зарегистрирован");
      return;
    }

    const existingLogin = users.find(user => user.login === login);
    if (existingLogin) {
      alert("Пользователь с таким логином уже зарегистрирован");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Регистрация...";

    if (currentRole === 'employee') {
      try {
        const nameParts = username.split(' ');
        const name = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        const userData = {
          id: null,
          name: name,
          lastname: lastname,
          patronym: null,
          roleId: '123e4567-e89b-12d3-a456-426614174000',
          email: email,
          isEmailConfirmed: false,
          birthday: null,
          companyId: null,
          login: login,
          password: password
        };

        const response = await fetch('https://qmv2api.onrender.com/api/Users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(userData)
        });

        if (response.ok) {
          const result = await response.json();
          const formData = {
            username: username,
            login: login,
            email: email,
            password: password,
            role: currentRole,
            apiResponse: result
          };
          users.push(formData);
          localStorage.setItem("users", JSON.stringify(users));
          alert("Регистрация сотрудника успешна!");
          window.location.href = "enter.html";
        } else {
          let errorText = 'Неизвестная ошибка';
          try {
            const errorData = await response.json();
            errorText = errorData.message || JSON.stringify(errorData);
          } catch {
            errorText = await response.text();
          }

          if (response.status === 400 && errorText.includes('email') && errorText.includes('already')) {
            alert("Пользователь с таким email уже зарегистрирован");
          } else if (response.status === 400 && errorText.includes('login') && errorText.includes('already')) {
            alert("Пользователь с таким логином уже зарегистрирован");
          } else {
            alert(`Ошибка регистрации: ${response.status} - ${errorText}`);
          }
        }
      } catch (error) {
        console.error('Общая ошибка при отправке запроса:', error);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          try {
            const nameParts = username.split(' ');
            const name = nameParts[0] || '';
            const lastname = nameParts.slice(1).join(' ') || '';

            const userData = {
              id: null,
              name: name,
              lastname: lastname,
              patronym: null,
              roleId: '123e4567-e89b-12d3-a456-426614174000',
              email: email,
              isEmailConfirmed: false,
              birthday: null,
              companyId: null,
              login: login,
              password: password
            };

            const httpResponse = await fetch('https://qmv2api.onrender.com/api/Users/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(userData)
            });

            if (httpResponse.ok) {
              const result = await httpResponse.json();
              const formData = {
                username: username,
                login: login,
                email: email,
                password: password,
                role: currentRole,
                apiResponse: result
              };
              users.push(formData);
              localStorage.setItem("users", JSON.stringify(users));
              alert("Регистрация сотрудника успешна (через HTTP)!");
              window.location.href = "enter.html";
            } else {
              const errorText = await httpResponse.text();
              const formData = {
                username: username,
                login: login,
                email: email,
                password: password,
                role: currentRole,
              };
              users.push(formData);
              localStorage.setItem("users", JSON.stringify(users));
              alert("Регистрация успешна (данные сохранены локально). Ошибка сервера: " + errorText);
              window.location.href = "enter.html";
            }
          } catch (httpError) {
            console.error('Ошибка при HTTP запросе:', httpError);
            const formData = {
              username: username,
              login: login,
              email: email,
              password: password,
              role: currentRole,
            };
            users.push(formData);
            localStorage.setItem("users", JSON.stringify(users));
            alert("Регистрация успешна (данные сохранены локально). Ошибка сети: " + error.message);
            window.location.href = "enter.html";
          }
        } else {
          alert("Ошибка регистрации: " + error.message);
        }
      }
    } else {
      const formData = {
        username: username,
        login: login,
        email: email,
        password: password,
        role: currentRole,
      };

      users.push(formData);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Регистрация компании успешна!");
      window.location.href = "enter.html";
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Зарегистрироваться";
  });

});

