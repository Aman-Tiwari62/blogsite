const loginbtn = document.querySelectorAll('.login-btn');
const registerbtn = document.querySelectorAll('.register-btn');
const blurrbg = document.querySelector('.blurr-bg');
const logindiv = document.querySelector('.login-div');
const registerdiv = document.querySelector('.register-div');
const close = document.querySelector('.close');

loginbtn.forEach(val=>{
    val.addEventListener('click', ()=>{
        blurrbg.classList.remove('hidden');
        logindiv.classList.remove('hidden');
        logindiv.classList.add('flex');
        registerdiv.classList.remove('flex');
        registerdiv.classList.add('hidden');
    });
})

registerbtn.forEach(val=>{
    val.addEventListener('click', ()=>{
        blurrbg.classList.remove('hidden');
        registerdiv.classList.remove('hidden');
        registerdiv.classList.add('flex');
        logindiv.classList.remove('flex');
        logindiv.classList.add('hidden');
    })
})

close.addEventListener('click', ()=>{
    console.log('clicked');
    blurrbg.classList.add('hidden');
})