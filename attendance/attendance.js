const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let attendanceTemplate = document.querySelector('#attendanceTemplate');
let attendanceClassName = document.querySelector('#attendanceClassName');
let attendanceCurrentDate = document.querySelector('#attendanceCurrentDate');
let btnPresent = document.querySelector('#btnPresent');
let attendanceRecorded = document.querySelector('#attendanceRecorded');
let btnAttendanceSend = document.querySelector('#btnAttendanceSend');
let attendanceNotice1 = document.querySelector('#attendanceNotice1');
let attendanceNotice2 = document.querySelector('#attendanceNotice2');
let txtQuestion = document.querySelector('#txtQuestion');
// let dropdownIcon = document.querySelector('#dropdownIcon');
let messageOptions = document.querySelector('#messageOptions');
// let messageOption = document.querySelectorAll('.message-option');
let selectedMessageOptionIcon = document.querySelector('#selectedMessageOptionIcon');
let askQuestionContainer = document.querySelector('.ask-question-container');
let questionContainer = document.querySelector('.question-container');
let questionItem = document.querySelector('.question-item');
let answerYesNo = document.querySelector('.answer-yesno');
let answerEnum = document.querySelector('.answer-enum');
let enumAns = document.querySelector('#enum_ans');
let btnYes = document.querySelector('.btn-yes');
let btnNo = document.querySelector('.btn-no');
let sendAnswer = document.querySelector('.send-answer');
let arrowBack = document.querySelector('#arrowBack');
let date = new Date();
let isAttendanceRecorded = false;
let classroomId = null;
let questionId = null;
let answer = null;
let question = null;
let visibility = 'anonymous';
let isSendAnswer = false;

attendanceCurrentDate.textContent = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

btnPresent.addEventListener('click', () => {
    axios.post(server + '/api/attendance', {code: classCode_}, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken_,
        }
    })
    .then(res => {
        console.log('res: ', res);

        if (res.data.Message === 'Attendance has been record.') processAttendance();
        else alert(res.data.Message);
    })
    .catch(error => console.log('classroom list error: ', error));
});

// dropdownIcon.addEventListener('click', () => {
//     if (isAttendanceRecorded) {
//         if (messageOptions.style.display === 'none') messageOptions.style.display = 'block';
//         else messageOptions.style.display = 'none';
//     }
// });

btnYes.addEventListener('click', () => {
    question = null;
    resetAnswerButton();
    answer = 'yes';
    btnYes.style.backgroundColor = '#1F3BB3';
    btnYes.style.color = '#fff';
});

btnNo.addEventListener('click', () => {
    question = null;
    resetAnswerButton();
    answer = 'no';
    btnNo.style.backgroundColor = '#1F3BB3';
    btnNo.style.color = '#fff';
});

enumAns.addEventListener('keyup', e => {
    question = null;
    answer = e.target.value;
});

txtQuestion.addEventListener('keyup', e => {
    answer = null;
    question = e.target.value;
});

// messageOption.forEach(item => {
//     item.addEventListener('click', (e) => {
//         selectedMessageOptionIcon.style.display = 'block';
//         messageOptions.style.display = 'none';

//         switch (e.target.parentNode.dataset.messageOption) {
//             case 'public':
//                 selectedMessageOptionIcon.src = '/images/account-group.png';
//                 visibility = 'public';
//                 break;

//             case 'anonymous':
//                 selectedMessageOptionIcon.src = '/images/incognito.png';
//                 visibility = 'anonymous';
//                 break;

//             // case 'private':
//             //     selectedMessageOptionIcon.src = '/images/account-multiple.png';
//             //     visibility = 'private';
//             //     break;
//         }
//     })
// });
messageOptions.addEventListener('change', e => {
    visibility = e.target.value;
    console.log('visibility: ', visibility);
});

sendAnswer.addEventListener('click', () => {
    if (!isSendAnswer) {
        isSendAnswer = true;

        if (visibility) {
            console.log('answer: ', answer);
            console.log('question: ', question);

            if (answer) {
                axios.post(server + '/api/answer',
                    {
                        classroom_id: classroomId,
                        question_id: questionId,
                        user_id: userId,
                        visibility: visibility,
                        answer: answer
                    },
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + accessToken_,
                        }
                    }
                )
                .then(res => {
                    console.log('answer: ', res);

                    alert('Your answer has been sent');

                    answer = null;
                    question = null;

                    askQuestionContainer.style.display = 'block';
                    questionContainer.style.display = 'none';

                    isSendAnswer = false;
                })
                .catch(error => console.log('classroom list error: ', error));
            }
            else {
                if (question) {
                    axios.post(server + '/api/ask',
                        {
                            classroom_id: parseInt(classId_),
                            question: question,
                            user_id: userId,
                            visibility: visibility,
                            answer_by: null,
                        },
                        {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': 'Bearer ' + accessToken_,
                            }
                        }
                    )
                    .then(res => {
                        console.log('ask: ', res);

                        alert('Sent Successfully');

                        txtQuestion.value = '';
                        answer = null;
                        question = null;
                        isSendAnswer = false;
                    })
                    .catch(error => console.log('ask question error: ', error));
                }
                else isSendAnswer = false;
            }
        }
        else alert('Choose visibility option before sending your answer');
    }
});

arrowBack.addEventListener('click', () => {
    resetTemplates();
    attendanceTemplate.style.display = 'none';
    menuTemplate.style.display = 'block';
});

function resetAnswerButton() {
    btnYes.style.backgroundColor = '#fff';
    btnYes.style.color = '#000';
    btnNo.style.backgroundColor = '#fff';
    btnNo.style.color = '#000';
}

function validateAttendance() {
    axios.post(server + '/api/attendance-validate',
        {
            code: classCode_
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken_,
            }
        }
    )
    .then(res => {
        console.log('answer: ', res);
        console.log('visibility: ', visibility);

        if (res.data.Attendance) processAttendance();
    })
    .catch(error => console.log('classroom list error: ', error));
}

function processAttendance() {
    btnPresent.style.display = 'none';
    attendanceRecorded.style.display = 'flex';
    attendanceRecorded.style.backgroundColor = '#010F4D';
    // btnAttendanceSend.style.backgroundColor = '#1F3BB3';
    attendanceNotice1.style.display = 'none';
    attendanceNotice2.style.display = 'block';
    txtQuestion.removeAttribute('disabled');
    isAttendanceRecorded = true;

    checkLatestQuestion();

    // pusher
    Pusher.logToConsole = true;

    let pusher = new Pusher('0134b0df47cadbe2fef4', {
        cluster: 'mt1',
    });

    let channel = pusher.subscribe('question.' + classId_);

    channel.bind('question.new', function(data) {
        // alert(JSON.stringify(data));
        console.log('new question: ', data);

        chrome.notifications.create('newquestion', {
            type: 'basic',
            iconUrl: '/images/send-white.png',
            title: 'New question',
            message: 'Your teacher asking a question.',
            priority: 2
        });

        chrome.notifications.clear('newquestion');

        classroomId = data.question.classroom_id;
        questionId = data.question.id;

        askQuestionContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        questionItem.textContent = data.question.question;

        switch (data.question.answer_by) {
            case 'yes/no':
                answerYesNo.style.display = 'flex';
                answerEnum.style.display = 'none';
                break;

            case 'enum':
                answerYesNo.style.display = 'none';
                answerEnum.style.display = 'block';
                break;

            default:
                answerYesNo.style.display = 'none';
                answerEnum.style.display = 'none';
        }
    });
    // pusher
}

function checkLatestQuestion() {
    axios.get(server + '/api/question/latest', {
        params: {code: classCode_},
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken_,
        }
    })
    .then(res => {
        console.log('latest question: ', res);

        chrome.notifications.create('newquestion', {
            type: 'basic',
            iconUrl: '/images/send-white.png',
            title: 'New question',
            message: 'Your teacher asking a question.',
            priority: 2
        });

        chrome.notifications.clear('newquestion');

        if (!res.data.is_answer) {
            classroomId = res.data.Question.classroom_id;
            questionId = res.data.Question.id;

            askQuestionContainer.style.display = 'none';
            questionContainer.style.display = 'block';
            questionItem.textContent = res.data.Question.question;

            switch (res.data.Question.answer_by) {
                case 'yes/no':
                    answerYesNo.style.display = 'flex';
                    answerEnum.style.display = 'none';
                    break;

                case 'enum':
                    answerYesNo.style.display = 'none';
                    answerEnum.style.display = 'block';
                    break;

                default:
                    answerYesNo.style.display = 'none';
                    answerEnum.style.display = 'none';
            }
        }
    })
    .catch(error => console.log('classroom list error: ', error));
}