let welcomeTemplate = document.querySelector('#welcomeTemplate');
let createAccount = document.querySelector('.create-account');
// let forgotPassword = document.querySelector('.forgot-password');

createAccount.href = server + '/register';
// forgotPassword.href = server + '/forgot-password';

btnGotoLogin.addEventListener('click', async () => {
    resetTemplates();
    loginTemplate.style = 'display: block;';
});

function resetTemplates() {
    console.log('reset temaplates');
    welcomeTemplate.style.display = 'none';
    loginTemplate.style.display = 'none';
    menuTemplate.style.display = 'none';
    attendanceTemplate.style.display = 'none;';
}