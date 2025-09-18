const resend = document.querySelector('.resend');
const verifyBtn = document.querySelector('.verify');
const timer = document.querySelector('.timer');
const expiretime = document.querySelector('.expire-time');
const errormessage = document.querySelector('.error-message');
const form = document.querySelector('form');
const input = document.querySelector('input');

const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");

const resendBtn = document.getElementById("resendBtn");
const btnTextResend = document.getElementById("btnText-resend");
const btnLoaderResend = document.getElementById("btnLoader-resend");

const urlParams = new URLSearchParams(window.location.search);
let otpSentAt = parseInt(urlParams.get("otpSentAt"), 10);
const email = urlParams.get("email");

// Toggle button loading state
function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
  } else {
    submitBtn.disabled = false;
    btnText.style.display = "inline";
    btnLoader.style.display = "none";
  }
}
function setLoadingResend(isLoading) {
  if (isLoading) {
    resendBtn.disabled = true;
    btnTextResend.style.display = "none";
    btnLoaderResend.style.display = "inline-block";
  } else {
    // resendBtn.disabled = false;
    btnTextResend.style.display = "inline";
    btnLoaderResend.style.display = "none";
  }
}

resend.disabled = true;

let countdown;
let expireCountdown;
const cooldown = 60 * 1000; // 30 seconds in ms
let now = Date.now();
let timeLeft = Math.floor((otpSentAt + cooldown - now) / 1000); // in seconds
let expireTimeLeft = Math.floor((otpSentAt + 300000 - now) / 1000);
function updateTimer() {
  if (timeLeft > 0) {
    timer.textContent = `Resend OTP in ${timeLeft} seconds`;
    timeLeft--;
  } else {
    clearInterval(countdown);
    resend.disabled = false;
    timer.textContent = "";
  }
}
function updateExpireTime(){
  if(expireTimeLeft > 0){
    let min = Math.floor(expireTimeLeft/60);
    let sec = expireTimeLeft%60;
    expiretime.textContent = `(OTP expires in ${min} min : ${sec} seconds)`;
    expireTimeLeft--;
  } else{
    clearInterval(expireCountdown);
    expiretime.textContent = "(OTP expired ! click resend to get the new OTP.)";
  }
}
updateExpireTime();
expireCountdown = setInterval(updateExpireTime,1000);
updateTimer();
countdown = setInterval(updateTimer, 1000);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errormessage.style.visibility = "hidden";

  setLoading(true);

  console.log("verify btn clicked");
  const otp = form.otp.value;
  if(otp.length<6){
    console.log('otp length < 6');
    errormessage.textContent = "Fill all the 6 digits";
    errormessage.style.visibility = "visible";
  } else{
    const data = {
      email,
      otp
    }
    try{
      const response = await fetch('/auth/verifyEmail', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      const result = await response.json();
      if(response.ok){
        window.location.href = "/user/uploadProfilePage";
      }
      else{
        errormessage.textContent = result.error;
        errormessage.style.visibility = "visible";
      }
    } catch(err){
      errormessage.textContent = err;
      errormessage.style.visibility = "visible";
    }
  }
  setLoading(false);
})

input.addEventListener('input', ()=>{
  errormessage.style.visibility = "hidden";
})


resend.addEventListener('click', async ()=>{
  // console.log("clicked");
  // console.log(email);
  errormessage.style.visibility = "hidden";
  setLoadingResend(true);
  try{
    const data = {email};
    // console.log(data);
    const response = await fetch("/auth/resendotp", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    const result = await response.json();
    // console.log(result);
    if(response.ok){

      // errormessage.textContent = "otp sent !";
      // errormessage.style.visibility = "visible";

      if (countdown) clearInterval(countdown);
      if (expireCountdown) clearInterval(expireCountdown);
      otpSentAt = result.otpSentAt;

      const url = new URL(window.location);
      url.searchParams.set("otpSentAt", otpSentAt);
      window.history.replaceState({}, "", url);

      resend.disabled = true;
      now = Date.now();
      timeLeft = Math.floor((otpSentAt + cooldown - now) / 1000); // in seconds
      expireTimeLeft = Math.floor((otpSentAt + 300000 - now) / 1000);
      updateTimer();
      countdown = setInterval(updateTimer, 1000);
      updateExpireTime();
      expireCountdown = setInterval(updateExpireTime,1000);

    } else{
      errormessage.textContent = result.error;
      errormessage.style.visibility = "visible";
    }

  }catch{
    alert("some error in otp resending");
  }
  setLoadingResend(false);
})