const form = document.querySelector('form');
const errormessage = document.querySelector('.error-msg');
const email = document.querySelector('#useremail');
const password = document.querySelector('#chk-password');
console.log("connected");
let errorin; // 0 means error in email, 1 means in password
form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
        // make fetch request
        const response = await fetch("/auth/login", {
          method: "POST",  // or "GET" if backend expects query params
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // send JSON
        });
    
        const result = await response.json(); // parse JSON response
        console.log(result);
    
        if (response.status === 200) {
          console.log("successfull login !");
          window.location.href = `/user/dashboard?name=${result.name}`;
        }else if(response.status === 403){
            window.location.href = `/auth/verifyPage?email=${result.email}&otpSentAt=${result.otpSentAt}`;
        }else if(response.status==400) { // error in email
          errormessage.textContent = result.error;
          errormessage.style.visibility = "visible";
          email.classList.add('border-red');
          errorin =0;
        }
        else if(response.status==401){
            errormessage.textContent = result.error;
            errormessage.style.visibility = "visible";
            password.classList.add('border-red');
            errorin = 1;
        }
        else{
            errormessage.textContent = result.error;
            errormessage.style.visibility = "visible";
            errorin = 2;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        errormessage.textContent = error;
        errormessage.style.visibility = "visible";
    }
})

email.addEventListener('input', ()=>{
    if(errorin===0 || errorin === 2){
        errormessage.style.visibility = "hidden";
        email.classList.remove('border-red');
    }
});

password.addEventListener('input', ()=>{
    if(errorin === 1 || errorin === 2){
        errormessage.style.visibility = "hidden";
        password.classList.remove('border-red');
    }
})

