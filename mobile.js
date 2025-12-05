document.addEventListener('DOMContentLoaded', function () {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    document.querySelectorAll('a, button, .menu-item-with-icon, .switch-btn').forEach(element => {
      element.style.minHeight = '44px';
      element.style.minWidth = '44px';
    });

    document.querySelectorAll('.password-toggle, .btn, .switch-btn').forEach(button => {
      button.addEventListener('touchstart', function () {
        this.style.transform = 'scale(0.98)';
      });

      button.addEventListener('touchend', function () {
        this.style.transform = 'scale(1)';
      });
    });

    document.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
    });

    document.body.style.overflow = 'auto';
    document.body.style.webkitOverflowScrolling = 'touch';

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      document.querySelectorAll('input[type="number"]').forEach(input => {
        input.style.appearance = 'none';
        input.style.MozAppearance = 'textfield';
      });
    }
  }
});