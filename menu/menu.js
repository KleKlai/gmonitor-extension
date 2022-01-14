let menuTemplate = document.querySelector('#menuTemplate');
let searchBox = document.querySelector('#searchBox');
let searchIcon = document.querySelector('#searchIcon');
let addClassroomIcon = document.querySelector('#addClassroomIcon');
let txtSearch = document.querySelector('#txtSearch');
let classListContainer = document.querySelector('#classListContainer');
let addClassroomContainer = document.querySelector('#addClassroomContainer');
let userName = document.querySelector('.username');
let userName2 = document.querySelector('.username2');
let txtAddClassroom = document.querySelector('#txtAddClassroom');
let btnAddClassroom = document.querySelector('#btnAddClassroom');
let addClassroomError = document.querySelector('#addClassroomError');
// let btnPresent = document.querySelector('#btnPresent');
let accessToken_ = null;
let classCode_ = null;
let className_ = null;
let classId_ = null;

let classItems = [
    {id: 1, name: 'Mathematics'},
    {id: 2, name: 'Quality Assurance'},
    {id: 3, name: 'Capstone Project 1'},
    {id: 4, name: 'Technopreneurship'},
];

if (!fromLogin) {
    chrome.storage.sync.get('loginSuccess', data => {
        if (data.loginSuccess) {
            chrome.storage.sync.get('loggedUser', data => {
                if (!data.loggedUser) {
                    chrome.storage.sync.set({loginSuccess: false});
                    resetTemplates();
                    welcomeTemplate.style = 'display: block;';
                }
                else {
                    chrome.storage.sync.get('accessToken', at => {
                        accessToken_ = at.accessToken;

                        loginSuccess(
                            data.loggedUser,
                            accessToken_
                        );
                    });
                }
            });
        }
        else {
            chrome.action.setPopup({popup: "/welcome/welcome.html"});
        }
    });
}

searchIcon.addEventListener('click', () => {
    resetClassroomError();
    addClassroomContainer.style.display = 'none';
    searchBox.style = '';
    txtSearch.style.display = 'block';
});

addClassroomIcon.addEventListener('click', () => {
    searchBox.style.border = 'none';
    txtSearch.style.display = 'none';
    addClassroomContainer.style = '';
    displayClassItems(accessToken_);
});

txtSearch.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        e.preventDefault();

        axios.get(server + '/api/search', {
            params: {name: e.target.value},
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken_,
            }
        })
        .then(res => {
            displayClassItemsBySearch(res.data.data.classrooms);
        })
        .catch(error => console.log('classroom list error: ', error));
    }
});

userName.addEventListener('click', () => {
    chrome.storage.sync.set({loginSuccess: false});
    chrome.storage.sync.set({loggedUser: null});
    chrome.storage.sync.set({accessToken: null});
    chrome.action.setPopup({popup: "/welcome/welcome.html"});
    resetTemplates();
    welcomeTemplate.style.display = 'block';
});

userName2.addEventListener('click', () => {
    attendanceTemplate = document.querySelector('#attendanceTemplate');
    
    chrome.storage.sync.set({loginSuccess: false});
    chrome.storage.sync.set({loggedUser: null});
    chrome.storage.sync.set({accessToken: null});
    chrome.action.setPopup({popup: "/welcome/welcome.html"});
    resetTemplates();
    welcomeTemplate.style.display = 'block';
    attendanceTemplate.style.display = 'none';
    console.log('welcomeTemplate: ', welcomeTemplate);
    console.log('attendanceTemplate: ', attendanceTemplate);

});

btnAddClassroom.addEventListener('click', () => {
    axios.post(server + '/api/join', {code: txtAddClassroom.value}, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken_,
        }
    })
    .then(res => {
        if (typeof res.data.data.classroom.id === 'undefined') {
            addClassroomError.style.display = 'block';
            addClassroomError.textContent = res.data.message;
        }
        else {
            addClassroomContainer.style.display = 'none';
            txtAddClassroom.value = '';
            resetClassroomError();
            displayClassItems(accessToken_);
        }
    })
    .catch(error => {
        console.log('classroom list error: ', error)

        alert('Classroom doesn\'t exist');
    });
});

txtAddClassroom.addEventListener('keyup' , e => {
    if (e.key === 'Enter') btnAddClassroom.click();
});

/*btnPresent.addEventListener('click', () => {
    axios.post(server + '/api/attendance', {code: txtAddClassroom.value}, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken_,
        }
    })
    .then(res => {
        if (typeof res.data.Classroom.id === 'undefined') {
            addClassroomError.style.display = 'block';
            addClassroomError.textContent = res.data;
        }
        else {
            addClassroomContainer.style.display = 'none';
            txtAddClassroom.value = '';
            resetClassroomError();
            displayClassItems(accessToken_);
        }
    })
    .catch(error => console.log('classroom list error: ', error));
});*/

function displayClassItems(accessToken) {
    let item, i, temp, val;

    if (fromLogin && (accessToken_ === null)) accessToken_ = accessToken;
    
    axios.get(server + '/api/classroom-list', {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }
    })
    .then(res => {
        classListContainer.innerHTML = null;
        classItems = res.data.data.classrooms;

        for (i = 0; i < classItems.length; i++) {
            temp = '<div id="className" class="text-lg class-name">' + classItems[i].name + '</div>';
            temp += '<div class="flex-grow"></div>';
            temp += '<img src="/images/arrow-left-thick.png" alt="arrow-left-thick.png" class="arrow-left">';
    
            item = document.createElement('div');
            item.className = 'flex w-full py-3 px-5 rounded-md items-center cursor-pointer class-item';
            item.dataset.name = classItems[i].name;
            item.dataset.code = classItems[i].code;
            item.dataset.id = classItems[i].id;
            item.innerHTML = temp;
            item.onclick = function(e) {
                if (e.target.hasAttribute('data-name')) {
                    className_ = e.target.dataset.name;
                    classCode_ = e.target.dataset.code;
                    classId_ = e.target.dataset.id;
                }
                else {
                    className_ = e.target.parentNode.dataset.name;
                    classCode_ = e.target.parentNode.dataset.code;
                    classId_ = e.target.parentNode.dataset.id;
                }

                resetTemplates();
                attendanceTemplate.style.display = 'block';
                attendanceClassName.textContent = className_;
                validateAttendance();
            };
    
            classListContainer.appendChild(item);
        }
    })
    .catch(error => console.log('classroom list error: ', error));
}

function displayClassItemsBySearch(classrooms) {
    let item, i, temp, val;

    classListContainer.innerHTML = null;
    classItems = classrooms;

    for (i = 0; i < classItems.length; i++) {
        temp = '<div id="className" class="text-lg class-name">' + classItems[i].name + '</div>';
        temp += '<div class="flex-grow"></div>';
        temp += '<img src="/images/arrow-left-thick.png" alt="arrow-left-thick.png" class="arrow-left">';

        item = document.createElement('div');
        item.className =  'flex w-full py-3 px-5 rounded-md items-center cursor-pointer class-item';
        item.dataset.name = classItems[i].name;
        item.dataset.code = classItems[i].code;
        item.dataset.id = classItems[i].id;
        item.innerHTML = temp;
        item.onclick = function(e) {
            if (e.target.hasAttribute('data-name')) {
                className_ = e.target.dataset.name;
                classCode_ = e.target.dataset.code;
                classId_ = e.target.dataset.id;
            }
            else {
                className_ = e.target.parentNode.dataset.name;
                classCode_ = e.target.parentNode.dataset.code;
                classId_ = e.target.parentNode.dataset.id;
            }

            resetTemplates();
            attendanceTemplate.style.display = 'block';
            attendanceClassName.textContent = className_;
            validateAttendance();
        };

        classListContainer.appendChild(item);
    }
}

function resetClassroomError() {
    addClassroomError.style.display = 'none';
    addClassroomError.textContent = '';
}