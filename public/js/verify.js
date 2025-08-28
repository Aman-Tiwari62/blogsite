const resendBtn = document.querySelector('.resend');
const verifyBtn = document.querySelector('.verify');
const timer = document.querySelector('.timer');
const expiretime = document.querySelector('.expire-time');
const errormessage = document.querySelector('.error-message');
const form = document.querySelector('form');
const input = document.querySelector('input');
const successwrapper = document.querySelector('.success-wrapper');
const success = document.querySelector('.success');
const continuebtn = document.querySelector('.continue');

const urlParams = new URLSearchParams(window.location.search);
let otpSentAt = parseInt(urlParams.get("otpSentAt"), 10);
const email = urlParams.get("email");

resendBtn.disabled = true;

let countdown;
let expireCountdown;
const cooldown = 60 * 1000; // 30 seconds in ms
let now = Date.now();
let timeLeft = Math.floor((otpSentAt + cooldown - now) / 1000); // in seconds
let expireTimeLeft = Math.floor((otpSentAt + 300000 - now) / 1000);
console.log(timeLeft);
function updateTimer() {
  if (timeLeft > 0) {
    timer.textContent = timeLeft;
    timeLeft--;
  } else {
    clearInterval(countdown);
    resendBtn.disabled = false;
    // message.textContent = "( Click to Resend )";
    timer.textContent = "0";
  }
}
function updateExpireTime(){
  if(expireTimeLeft > 0){
    let min = Math.floor(expireTimeLeft/60);
    let sec = expireTimeLeft%60;
    expiretime.textContent = min+" : "+sec;
    expireTimeLeft--;
  } else{
    clearInterval(expireCountdown);
  }
}
updateExpireTime();
expireCountdown = setInterval(updateExpireTime,1000);
updateTimer();
countdown = setInterval(updateTimer, 1000);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
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
    const response = await fetch('/auth/verifyOTP', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    const result = await response.json();
    if(response.ok){
      window.location.href = `/user/dashboard?name=${result.name}`;
    }
    else{
      errormessage.textContent = result.error;
      errormessage.style.visibility = "visible";
    }
  }

})

input.addEventListener('input', ()=>{
  errormessage.style.visibility = "hidden";
})

continuebtn.addEventListener('click', ()=>{
  window.location.href = `/user/dashboard?email=${email}`;
})

resendBtn.addEventListener('click', async ()=>{
  console.log("clicked");
  console.log(email);
  try{
    const data = {email};
    console.log(data);
    const response = await fetch("/auth/resendotp", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    const result = await response.json();
    console.log(result);
    if(response.ok){

      errormessage.textContent = "otp sent !";
      errormessage.style.visibility = "visible";

      if (countdown) clearInterval(countdown);
      if (expireCountdown) clearInterval(expireCountdown);
      otpSentAt = result.otpSentAt;

      const url = new URL(window.location);
      url.searchParams.set("otpSentAt", otpSentAt);
      window.history.replaceState({}, "", url);

      resendBtn.disabled = true;
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
})