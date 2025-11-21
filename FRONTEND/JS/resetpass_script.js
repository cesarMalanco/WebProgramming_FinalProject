document.addEventListener('DOMContentLoaded', function() {
    // ========================= Obtención de elementos del DOM =========================
    const formContainers = document.querySelectorAll('.form-container');
    const progressSteps = document.querySelectorAll('.progress-step');
    const vinylContainer = document.querySelector('.vinyl-container');
    
    // Formularios
    const emailForm = document.getElementById('email-form');
    const codeForm = document.getElementById('code-form');
    const passwordForm = document.getElementById('password-form');
    
    // Elementos de entrada
    const emailInput = document.getElementById('email');
    const codeInput = document.getElementById('verification-code');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // Elementos de temporizador
    const countdownElement = document.getElementById('countdown');
    const resendButton = document.getElementById('resend-code');
    const timerText = document.getElementById('timer-text');
    
    // Elementos de fuerza de contraseña
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    // Variables de estado
    let currentStep = 1;
    let countdown;
    let countdownTime = 300;

    // ========================= Función para controlar todo el flujo visual =========================
    function goToStep(step) {
        if (step < 1 || step > 3) return;

        currentStep = step;

        // ---------- ACTIVAR FORMULARIOS ----------
        formContainers.forEach(container => {
            container.classList.remove('active');
            if (container.classList.contains(`step-${step}`)) {
                container.classList.add('active');
            }
        });

        // ---------- ACTIVAR PROGRESO ----------
        progressSteps.forEach((stepElement) => {
            const stepNumber = parseInt(stepElement.dataset.step);
            
            // Remover todas las clases primero
            stepElement.classList.remove('active', 'completed');
            
            // Paso completado (antes del actual)
            if (stepNumber < step) {
                stepElement.classList.add('completed');
            }
            // Paso activo (actual)
            else if (stepNumber === step) {
                stepElement.classList.add('active');
            }
            
        });

        // ---------- MOVER DISCO ----------
        if (step === 1) {
            vinylContainer.classList.remove('move-right');
        } else {
            vinylContainer.classList.add('move-right');
        }

        // ---------- TEMPORIZADOR EN PASO 2 ----------
        if (step === 2) startCountdown();
    }

    // ========================= Temporizador del código de reenvío =========================
    function startCountdown() {
        clearInterval(countdown);
        countdownTime = 300;
        
        updateCountdownDisplay();
        
        countdown = setInterval(() => {
            countdownTime--;
            updateCountdownDisplay();
            
            if (countdownTime <= 0) {
                clearInterval(countdown);
                resendButton.disabled = false;
                timerText.textContent = '¿No recibiste el código?';
            }
        }, 1000);
    }

    // actualizar en la pantalla el paso del tiempo del temporizador
    function updateCountdownDisplay() {
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // ========================= Contraseña y fuerza de la misma =========================
    function checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        
        strengthFill.style.width = `${strength}%`;
        
        if (strength === 0) {
            strengthFill.style.background = 'transparent';
            strengthText.textContent = 'Seguridad de la contraseña';
            strengthText.style.color = 'var(--text-muted)';
        } else if (strength <= 25) {
            strengthFill.style.background = 'Red';
            strengthText.textContent = 'Débil';
            strengthText.style.color = 'Red';
        } else if (strength <= 50) {
            strengthFill.style.background = 'yellow';
            strengthText.textContent = 'Regular';
            strengthText.style.color = 'yellow';
        } else if (strength <= 75) {
            strengthFill.style.background = 'LIMEGREEN';
            strengthText.textContent = 'Buena';
            strengthText.style.color = 'LIMEGREEN';
        } else {
            strengthFill.style.background = 'lightblue';
            strengthText.textContent = 'Excelente';
            strengthText.style.color = 'lightblue';
        }
    }

    // ========================= Validación de la contraseña ingresada =========================
    function validatePasswords() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password !== confirmPassword) {
            confirmPasswordInput.style.borderBottomColor = 'var(--accent)';
            return false;
        } else {
            confirmPasswordInput.style.borderBottomColor = '';
            return true;
        }
    }
    
    // ========================= Formulario del email y validaciones =========================
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'Por favor ingresa tu email'
            });
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Email inválido',
                text: 'Por favor ingresa un email válido'
            });
            return;
        }
        
        Swal.fire({
            icon: 'success',
            title: 'Código enviado',
            text: `Hemos enviado un código de verificación a ${email}`,
            timer: 3000,
            showConfirmButton: false
        }).then(() => {
            goToStep(2);
        });
    });
    
    codeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const code = codeInput.value.trim();
        
        if (!code) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'Por favor ingresa el código de verificación'
            });
            return;
        }
        
        if (code.length !== 6) {
            Swal.fire({
                icon: 'error',
                title: 'Código inválido',
                text: 'El código debe tener 6 dígitos'
            });
            return;
        }
        
        Swal.fire({
            icon: 'success',
            title: 'Código verificado',
            text: 'Tu código ha sido verificado correctamente',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            goToStep(3);
        });
    });
    
    resendButton.addEventListener('click', function() {
        if (!this.disabled) {
            Swal.fire({
                icon: 'info',
                title: 'Código reenviado',
                text: 'Hemos enviado un nuevo código a tu email',
                timer: 2000,
                showConfirmButton: false
            });
            
            startCountdown();
            this.disabled = true;
        }
    });

    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!password || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor completa ambos campos de contraseña'
            });
            return;
        }
        
        if (!validatePasswords()) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseñas no coinciden',
                text: 'Las contraseñas ingresadas no coinciden'
            });
            return;
        }
        
        if (password.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña muy corta',
                text: 'La contraseña debe tener al menos 8 caracteres'
            });
            return;
        }
        
        Swal.fire({
            icon: 'success',
            title: '¡Contraseña cambiada!',
            text: 'Tu contraseña ha sido actualizada correctamente',
            confirmButtonText: 'Iniciar sesión'
        }).then(() => {
            window.location.href = '/PAGES/login.html';
        });
    });
    
    newPasswordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        validatePasswords();
    });
    
    confirmPasswordInput.addEventListener('input', validatePasswords);
    
    codeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Inicializar en el paso 1
    goToStep(1);
});