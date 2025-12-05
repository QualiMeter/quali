document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("Ent");
  const submitBtn = document.getElementById("submitBtn");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById('togglePassword');

  togglePasswordBtn.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? 'Показать' : 'Скрыть';
    this.setAttribute('title', type === 'password' ? 'Показать пароль' : 'Скрыть пароль');
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const loginOrEmail = document.getElementById("loginOrEmail").value.trim();
    const password = document.getElementById("password").value;

    if (!loginOrEmail || !password) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    if (password.length < 1) {
      alert("Пожалуйста, введите пароль");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Вход...";
    submitBtn.classList.add('loading');

    try {
      const isEmail = loginOrEmail.includes('@');
      const loginParam = isEmail ? null : loginOrEmail;
      const emailParam = isEmail ? loginOrEmail : null;

      let apiUrl = 'https://qmv2api.onrender.com/api/Users/login';
      if (loginParam) {
        apiUrl += `?login=${encodeURIComponent(loginParam)}`;
      } else if (emailParam) {
        apiUrl += `?email=${encodeURIComponent(emailParam)}`;
      }
      apiUrl += `&password=${encodeURIComponent(password)}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const userData = await response.json();
        const currentUser = {
          id: userData.id || '',
          name: userData.name || '',
          lastname: userData.lastname || '',
          login: userData.login || loginOrEmail,
          email: userData.email || (isEmail ? loginOrEmail : ''),
          role: userData.role || 'employee',
          token: userData.token || null,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUserIndex = users.findIndex(u =>
          u.email === currentUser.email || u.login === currentUser.login
        );

        if (existingUserIndex !== -1) {
          users[existingUserIndex] = { ...users[existingUserIndex], ...currentUser };
        } else {
          users.push(currentUser);
        }

        localStorage.setItem("users", JSON.stringify(users));

        alert("Вход успешен!");
        window.location.href = "prof.html";
      } else {
        let errorText = 'Неизвестная ошибка';
        try {
          const errorData = await response.json();
          errorText = errorData.message || JSON.stringify(errorData);
        } catch {
          errorText = await response.text();
        }

        console.error("Ошибка сервера:", errorText);

        try {
          const postResponse = await fetch('https://qmv2api.onrender.com/api/Users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ login: loginParam, email: emailParam, password: password })
          });

          if (postResponse.ok) {
            const userData = await postResponse.json();
            const currentUser = {
              id: userData.id || '',
              name: userData.name || '',
              lastname: userData.lastname || '',
              login: userData.login || loginOrEmail,
              email: userData.email || (isEmail ? loginOrEmail : ''),
              role: userData.role || 'employee',
              token: userData.token || null,
              lastLogin: new Date().toISOString()
            };

            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert("Вход успешен!");
            window.location.href = "prof.html";
            return;
          }
        } catch (postError) {
          console.error("Ошибка при POST запросе:", postError);
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u =>
          (u.email === loginOrEmail || u.login === loginOrEmail) &&
          u.password === password
        );

        if (user) {
          const currentUser = {
            username: user.username || user.login,
            login: user.login,
            email: user.email,
            role: user.role || 'employee',
            lastLogin: new Date().toISOString()
          };

          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          alert("Локальный вход успешен!");
          window.location.href = "prof.html";
        } else {
          const fixedEmail = "helloworldd401@gmail.com";
          const fixedPassword = "qwerty1";

          if (loginOrEmail === fixedEmail && password === fixedPassword) {
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                email: fixedEmail,
                username: "Фиксированный пользователь",
                login: "fixeduser",
                role: "employee",
                lastLogin: new Date().toISOString()
              })
            );
            alert("Вход успешен (фиксированный пользователь)!");
            window.location.href = "prof.html";
          } else {
            alert("Ошибка входа: Неверный email/логин или пароль");
          }
        }
      }

    } catch (error) {
      console.error('Общая ошибка при входе:', error);

      try {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u =>
          (u.email === loginOrEmail || u.login === loginOrEmail) &&
          u.password === password
        );

        if (user) {
          const currentUser = {
            username: user.username || user.login,
            login: user.login,
            email: user.email,
            role: user.role || 'employee',
            lastLogin: new Date().toISOString()
          };

          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          alert("Локальный вход успешен (API недоступен)!");
          window.location.href = "prof.html";
        } else {
          const fixedEmail = "helloworldd401@gmail.com";
          const fixedPassword = "qwerty1";

          if (loginOrEmail === fixedEmail && password === fixedPassword) {
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                email: fixedEmail,
                username: "Фиксированный пользователь",
                login: "fixeduser",
                role: "employee",
                lastLogin: new Date().toISOString()
              })
            );
            alert("Вход успешен (фиксированный пользователь)!");
            window.location.href = "prof.html";
          } else {
            alert("Ошибка входа: " + error.message);
          }
        }
      } catch (localError) {
        alert("Ошибка при попытке локального входа: " + error.message);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Войти";
      submitBtn.classList.remove('loading');
    }
  });
});