const form = document.getElementById("registerForm");
const email = document.getElementById("email");
const password = document.getElementById("set-password");
const confirmPassword = document.getElementById("confirm-password");
const errorMessage = document.getElementById("error");

// Utility: show error
function showError(input, message) {
  input.classList.add("border-red");
  errorMessage.innerText = message;
  errorMessage.style.visibility = "visible";
}

let errorstate = 0; // 0 means error is in password, 1 means error is in email validation

// Utility: clear error
function clearError(input) {
  input.classList.remove("border-red");
  errorMessage.style.visibility = "hidden";
}

// Password match check + backend validation
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Reset errors first
  clearError(email);
  clearError(password);
  clearError(confirmPassword);

  // 1. Password match check
  if (password.value !== confirmPassword.value) {
    showError(password, "Passwords do not match !");
    confirmPassword.classList.add("border-red");
    errorstate=0;
    return;
  }

  // 2. Collect form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    // 3. Send to backend
    const response = await fetch("/auth/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.status === 400) {
      // Invalid email from backend
      showError(email, result.error);
      errorstate=1;
    } else if (response.ok) {
      console.log("✅ Email valid, OTP sent");
      showError(email, `${result.email} ${result.otpSentAt}`);
      window.location.href = `/auth/verifyPage?email=${result.email}&otpSentAt=${result.otpSentAt}`;

    } else {
      alert(result.error || "Something went wrong!");
    }
  } catch (err) {
    alert("Network error. Please try again later.");
  }
});

// Clear error when user starts typing again
password.addEventListener('input', ()=>{
  if(errorstate===0){
    password.classList.remove('border-red');
    confirmPassword.classList.remove('border-red');
    errorMessage.style.visibility = "hidden";
  }
})
confirmPassword.addEventListener('input', ()=>{
  if(errorstate===0){
    password.classList.remove('border-red');
    confirmPassword.classList.remove('border-red');
    errorMessage.style.visibility = "hidden";
  }
})
email.addEventListener('input',()=>{
  if(errorstate===1){
    email.classList.remove('border-red');
    errorMessage.style.visibility = 'hidden';
  }
})
