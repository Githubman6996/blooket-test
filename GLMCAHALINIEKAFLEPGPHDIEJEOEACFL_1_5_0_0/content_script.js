"use strict"

// Question: .styles__questionText___2MlSZ-camelCase > *
// Answer Container: .styles__answerContainer___3WS-k-camelCase
// Answer Text: .styles__answerText___2eIBw-camelCase > *

// Choice: .styles__choice___1aMOz-camelCase

// Hacker Name: .styles__introHeader___Dzfym-camelCase > span
// Password Button: .styles__button___2OOoS-camelCase

const selectors = {
  question: '[class*="questionText_"] > *',
  answer_container: '[class*="answerContainer_"]',
  anwer_text: '[class*="answerText_"] > *',
  choice: '[class*="_choice"]',
  username: '.styles__introHeader___Dzfym-camelCase > span',
  password: '.styles__button___2OOoS-camelCase',
  feedbackText: '[class*="_feedbackText_"]',
  correct: '.styles__header___2daxi-camelCase',
  passCorrect: '.styles__introHeader___Dzfym-camelCase',
  click: '[class*="_feedbackContainer_"], [class*="_fishModal_"]',
  click2: '[class*="pageButton"]',
  feedback: '#feedbackButton',
  factory: '[class*="_blookChoiceInfo_"]',
  finalStat: '[class*="_finalStatText_"]'
}

var debugMode = false;

var answers = {};

function addQuestion(question, answer) {
  if (question in answers) return;
  answers[question] = answer;
}

function removeAnswer(question, answer) {
  if (typeof answers[question] === 'undefined') return;
  answers[question] = answers[question].filter(item => item !== answer);
}

function setAnswer(question, answer) {
  answers[question] = [answer];
}

function confidence(question) {
  if (typeof answers[question] === 'undefined') return 0;
  return answers[question].length;
}

function chooseAnswer(question) {
  return answers[question][Math.floor(Math.random() * answers[question].length)];
}

var passwords = {};

function addPasswordData(name, options) {
  if (typeof passwords[name] === 'undefined')
    addFirstOccurence(name, options);
  else filterOptions(name, options);
}

function addFirstOccurence(name, options) {
  if (name in passwords) return;
  passwords[name] = options;
}

function filterOptions(name, options) {
  passwords[name] = passwords[name].filter(item => options.includes(item));
}

function filterOut(name, pass) {
  if (typeof passwords[name] !== 'undefined') passwords[name] = passwords[name].filter(item => item !== pass);
}

function choosePassword(name) {
  return passwords[name][Math.floor(Math.random() * passwords[name].length)];
}

var passbuf = false;

var state = 0;
// 0: N/A, 1: questions, 2: correct, 3: prize/click, 4: choice, 5: pwd, 6: factory, 7: end screen

var firstScreen = false;

function tick() {
  // Updated Current State
  state = getScreen();

  if (state !== 5) passbuf = false;

  // Corresponding Action
  switch (state) {
    case 1:
      firstScreen = true;
      runQuestion();
      break;
    case 2:
      runWatch();
      break;
    case 3:
      runClick();
      break;
    case 4:
      runChoice();
      break;
    case 5:
      runPassword();
      break;
    case 6:
      factory();
      break;
    case 7:
      endScreen();
      break;
  
    default:
      break;
  }
}

function getScreen() {
  let query = document.querySelector(selectors.question);
  if (query !== null) return 1;
  query = (document.querySelector(selectors.feedbackText) || document.querySelector(selectors.correct));
  if (query !== null) return 2;
  query = document.querySelector(selectors.factory);
  if (query !== null) return 6;
  query = document.querySelector(selectors.choice);
  if (query !== null) return 4;
  query = document.querySelector(selectors.click);
  if (query !== null) return 3;
  query = document.querySelector(selectors.click2);
  if (query !== null) return 3;
  query = document.querySelector(selectors.finalStat);
  if (query !== null) return 7;
  if (!firstScreen) return 0;
  query = document.querySelector(selectors.password);
  if (query !== null) return 5;
  return 0;
};

function runQuestion() {
  const question = document.querySelector(selectors.question);
  const options = [...document.querySelectorAll(selectors.answer_container)];
  const optionsText = [...document.querySelectorAll(selectors.anwer_text)];

  addQuestion(question.innerText, optionsText.map(i => i.innerText));

  if (confidence(question.innerText) === 1) {
    const index = optionsText.map(i => i.innerText).indexOf(chooseAnswer(question.innerText));
    options[index].click();
  } else {
    const A = answers[question.innerText];
    options.forEach((item, index) => {
      if (A.includes(optionsText[index].innerText)) {
        // item.style.border = '10px solid green';
        // item.style.boxSizing = 'border-box';
      } else {
        item.style.backgroundColor = '#696';
        if (A.length > 0) item.style.pointerEvents = 'none';
      }
    });
  }

  options.forEach((item, index) => {
    item.addEventListener('click', () => {
      watchFor(question.innerText, optionsText[index].innerText);
    });
  });
}

let watch = {};

function watchFor(question, answer) {
  if (debugMode) console.log('Watching for:', question, answer);
  watch.question = question;
  watch.answer = answer;
}

function runWatch() {
  const header = (document.querySelector(selectors.feedbackText) || document.querySelector(selectors.correct));
  if (header !== null) {
    if (debugMode) console.log('Found watch!', header, watch);

    if (header.innerText === 'CORRECT') {
      setAnswer(watch.question, watch.answer);
      setHeader('Correct!');
    } else {
      removeAnswer(watch.question, watch.answer);
      setHeader('Incorrect!');
    }
    (document.querySelector(selectors.feedback) || document.querySelector(selectors.click)).click();
    watch = {};
  }
}

var autoChoice = true;
var autoClick = true;

function runChoice() {
  if (autoChoice) {
    const choices = [...document.querySelectorAll(selectors.choice)];
    if (choices === null) {
      console.log('Error! Choices not found!');
      return;
    }
    choices[Math.floor(Math.random() * choices.length)].click();
  }
}

function runClick() {
  let click = document.querySelector(selectors.click);
  if (click === null) click = document.querySelector(selectors.click2);
  if (autoClick) {
    click.click();
  }
}

function setHeader(text) {
  const header = document.querySelector('[class*="_headerTextCenter_"]');
  if (header !== null) header.innerText = text;
}

function runPassword() {
  if (!passbuf) {
    passbuf = true;
    
    const user = document.querySelector(selectors.username);
    const btns = [...document.querySelectorAll(selectors.password)];
    addPasswordData(user.innerText, btns.map(item => item.innerText));
    
    if (typeof passwords[user.innerText] !== 'undefined') {
      if (passwords[user.innerText].length === 1) {
        btns.forEach(item => {
          if (item.innerText === passwords[user.innerText][0]) {
            setTimeout(() => {
              item.click();
            }, 2000);
          }
        });
      }
      btns.forEach(item => {
        if (!passwords[user.innerText].includes(item.innerText) && passwords[user.innerText].length > 0) {
          item.style.backgroundColor = '#696';
          item.style.pointerEvents = 'none';
        }
        item.addEventListener('click', () => {
          watchPass(user.innerText, item.innerText);
        });
      });
    }
  } else {
    runWatchPass();
  }
}

var watchpass = {};

function watchPass(user, pass) {
  watchpass.user = user;
  watchpass.pass = pass;
}

function runWatchPass() {
  let correct = [...document.querySelectorAll(selectors.passCorrect)];
  if (correct !== null && correct.length > 1) {
    correct = correct[1];
    if (correct.innerText === 'CORRECT') {
      addFirstOccurence(watchpass.user, [watchpass.pass]);
    } else if (correct.innerText === 'INCORRECT') {
      filterOut(watchpass.user, [watchpass.pass]);
    }
  }
}

function factory() {
  const rates = document.querySelectorAll(selectors.factory + ':not(.percent-finished)');

  let max = -1, maxValue = 0;

  let n = 0;
  if (rates !== null) rates.forEach(i => {
    const percent = factoryParse(i.innerText);
    if (!isNaN(percent)) i.innerHTML = `${Math.floor(percent*10)/10} $/s`;
    i.classList.add('percent-finished');
    if (percent > maxValue) {
      console.log('New Max:', max, maxValue);
      maxValue = percent;
      max = n;
    }
    n++;
  });

  console.log(rates, max, rates[max]);
  rates[max].style.color = '#090';
}

function credit() {
  return '© Llama Dev';
}

function factoryParse(str) {
  let sw = true;
  let left = '', right = '';

  for (let i = 0; i < str.length; i++) {
    if (typeof str[i] == 'string' && !isNaN(parseInt(str[i]))) {
      if (sw) left += str[i];
      else right += str[i];
    } else if (str[i] == '/') sw = false;
  }

  return parseInt(left) / parseInt(right);
}

function addData(data) {
  if (data.questions) {
    data.questions.forEach(i => {
      addQuestion(i.question, i.answer);
    });
  }
  if (data.passwords) {
    data.passwords.forEach(i => {
      addFirstOccurence(data.passwords.name, data.passwords.options);
    });
  }
}

function saveData() {
  const DATA = {
    questions: Object.entries(answers).map(i => { return {
      question: i[0],
      answer: i[1]
    };}),
    // passwords: Object.entries(passwords).map(i => { return {
    //   name: i[0],
    //   options: i[1]
    // };})
  };
  console.log('Saving data object:', DATA);
  chrome.runtime.sendMessage({greeting: "saveData", data: JSON.stringify(DATA)});
}

function endScreen() {
  // do something
  saveData();
}

var I;

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.greeting === 'tick') {
      tick();
    }
    else if (request.greeting === 'data') {
      console.log('State:', state);
      console.log('Answers:', answers);
      console.log('Passwords:', passwords);
    }
    else if (request.greeting === 'setAutoChoice') {
      autoChoice = request.autoChoice === true;
    }
    else if (request.greeting === 'toggleDebugMode') {
      debugMode = !debugMode;
    }
    else if (request.greeting === 'printState') {
      console.log(getScreen());
    }
    else if (request.greeting === 'addData') {
      if (request.data) {
        console.log('Loading saved data...');
        addData(JSON.parse(request.data));
      }
    }
    else if (request.greeting === 'saveData') {
      console.log('Sending saved data...');
      saveData();
    }
    else if (request.greeting === 'startTick') {
      I = setInterval(() => {
        tick();
      }, request.tickDelay);
    }
    else if (request.greeting === 'stopTick') {
      clearInterval(I);
    }
  }
);

var style = document.createElement('style');
style.innerHTML = `
.styles__lockedBlook___3oGaX-camelCase, .styles__lockedBlook___3Ii_E-camelCase {
  filter: brightness(0.5) !important;
  transition: filter 300ms;
}
.styles__lockedBlook___3Ii_E-camelCase {
  filter: brightness(0.2) !important;
}
.styles__blookContainer___3JrKb-camelCase:hover .styles__lockedBlook___3oGaX-camelCase, .styles__blookContainer___1kaDB-camelCase:hover .styles__lockedBlook___3Ii_E-camelCase {
  filter: brightness(1) !important;
}
.styles__lockedBlook___3oGaX-camelCase + .fa-lock, .styles__lockedBlook___3Ii_E-camelCase + .fa-lock {
  transition: opacity 100ms;
}
.styles__blookContainer___3JrKb-camelCase:hover .fa-lock, .styles__blookContainer___1kaDB-camelCase:hover .fa-lock {
  opacity: 0;
}
[class*="_wrapper_"] > [class*="_blookContainer_"], [class*="_starwars_"] {
  display: none;
  visibility: hidden;
  pointer-events: none;
}
[class*="_headerBg_"] {
  filter: brightness(0.5);
}
[class*=["_modal_"]] {
  pointer-events: none;
}
[class*=["_modal_"]] > * {
  pointer-events: all;
}
`;
document.head.appendChild(style);