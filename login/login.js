const server = 'http://159.223.52.171';
// const server = 'http://gmonitor-breeze-inertia.test';

let loginTemplate = document.querySelector('#loginTemplate');
let btnGotoLogin = document.querySelector('#btnGotoLogin');
let btnLogin = document.querySelector('#btnLogin');
let txtEmail = document.querySelector('#txtEmail');
let txtPassword = document.querySelector('#txtPassword');
let loginErrorMessage = document.querySelector('#loginErrorMessage');
let loader = document.querySelector('#loader');
let fromLogin = false;
let accessToken = null;
let userId = null;

btnLogin.addEventListener('click', async () => {
    loginErrorMessage.style.display = 'none';
    loader.style.display = 'block';

    axios.post(server + '/api/user/login', {
        email: txtEmail.value,
        password: txtPassword.value,
    })
    .then(res => {
        fromLogin = true;
        accessToken = res.data.data.token;
        
        loginSuccess(res.data.data.user, accessToken);

        chrome.storage.sync.set({loginSuccess: true});
        chrome.storage.sync.set({loggedUser: res.data.data.user});
        chrome.storage.sync.set({accessToken: accessToken});
        chrome.action.setPopup({popup: "/menu/menu.html"});
        loader.style.display = 'none';
        resetTemplates();
        menuTemplate.style.display = 'block';
    })
    .catch((error) => {
        console.log('error: ', error);

        chrome.storage.sync.set({loginSuccess: false});
        chrome.storage.sync.set({loggedUser: null});
        chrome.storage.sync.set({accessToken: null});
        loader.style.display = 'none';
        loginErrorMessage.style.display = 'block';
    });
});

txtPassword.addEventListener('keyup', e => {
    if (e.key === 'Enter') btnLogin.click();
});

function loginSuccess(user, pAccessToken) {
    userId = user.id;
    // userName.textContent = '(' + user.name + ')';
    // userName.textContent = '( Logout )';
    displayClassItems(pAccessToken);
}