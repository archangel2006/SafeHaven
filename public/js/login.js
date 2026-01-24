// OTP and Login functionality for Safe Haven Auth
let generatedOTP = "";
const otpInputs = document.querySelectorAll('.otp-input');

// Focus handling for OTP boxes
otpInputs.forEach((input, index) => {
    input.addEventListener('keyup', (e) => {
        if (e.key >= 0 && e.key <= 9) {
            if (index < otpInputs.length - 1) otpInputs[index + 1].focus();
        } else if (e.key === 'Backspace') {
            if (index > 0) otpInputs[index - 1].focus();
        }
    });
});

function togglePassword() {
    const pwdInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    const eyeOpen = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
    const eyeClosed = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;

    if (pwdInput.type === "password") {
        pwdInput.type = "text";
        eyeIcon.innerHTML = eyeClosed;
    } else {
        pwdInput.type = "password";
        eyeIcon.innerHTML = eyeOpen;
    }
}

function validateId(id) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(id) || phoneRegex.test(id);
}

function sendOTP() {
    const id = document.getElementById("loginId").value.trim();
    const error = document.getElementById("error");

    if (!validateId(id)) {
        error.textContent = "Please enter a valid email or 10-digit phone number";
        return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    error.textContent = "";
    alert("OTP sent successfully through Mail and Phone! Your OTP is: " + generatedOTP);
    console.log("Debug OTP:", generatedOTP);
}

function login() {
    const id = document.getElementById("loginId").value.trim();
    const pwd = document.getElementById("password").value.trim();
    const otp = Array.from(otpInputs).map(i => i.value).join("");
    const error = document.getElementById("error");

    if (id === "" || pwd === "" || otp === "") {
        error.textContent = "All fields and OTP are required";
        return;
    }
    
    if (!validateId(id)) {
        error.textContent = "Invalid Email or Phone format";
        return;
    }

    if (pwd.length < 6) {
        error.textContent = "Password must be at least 6 characters";
        return;
    }

    if (otp !== generatedOTP) {
        error.textContent = "Invalid OTP verification";
        return;
    }

    error.textContent = "";
    alert("Login successful! Redirecting to dashboard...");
    window.location.href = "../index.html"; 
}
