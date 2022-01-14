chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('loginSuccess', data => {
        if (data.loginSuccess) chrome.action.setPopup({popup: "/menu/menu.html"});
        else chrome.action.setPopup({popup: "/welcome/welcome.html"});
    });
});