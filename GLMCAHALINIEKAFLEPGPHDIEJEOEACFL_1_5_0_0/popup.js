const tickDelay = document.getElementById('tick-delay');
const tickSpan = document.getElementById('tick-delay-span');

tickDelay.addEventListener('input', () => {
  tickSpan.innerText = tickDelay.value;
});

const resetData = document.getElementById('reset-data');
const resetDataTEXT = resetData.value;
const resetDataCONFIRM = "Are you sure?";

resetData.addEventListener('click', () => {
  if (resetData.value === resetDataTEXT) {
    resetData.value = resetDataCONFIRM;
    setTimeout(() => {
      if (resetData.value === resetDataCONFIRM) {
        resetData.value = resetDataTEXT;
      }
    }, 2000);
  } else if (resetData.value === resetDataCONFIRM) {
    saveData({});
    resetData.value = "Reset!";
    setTimeout(() => {
      resetData.value = resetDataTEXT;
    }, 1000);
  }
});

const start = document.getElementById('start');
const stop = document.getElementById('stop');

var I;

start.addEventListener('click', () => {
  chrome.storage.sync.get(["data"], (result) => {
    console.log('Found synced data...', result.data);
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "addData", data: JSON.stringify(result.data)});
    });
  });
  
  // I = setInterval(() => {
  //   chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "tick"});
  //   });
  // }, tickDelay.value);

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "startTick", tickDelay: tickDelay.value});
  });
});

stop.addEventListener('click', () => {
  // clearInterval(I);
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "stopTick"});
  });

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "saveData"});
  });
});

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "setAutoChoice", autoChoice: true});
});

function debug() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "toggleDebugMode"});
  });
}

function debugState() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "printState"});
  });
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.greeting === "saveData") {
      saveData(JSON.parse(request.data));
    }
  }
);

function saveData(data) {
  chrome.storage.sync.set({data: data}, () => {
    console.log("Saving Blooket data in synced storage...", data);
  });
}

/*
const scanBtn = document.querySelector(".scan-btn");
const scanTxt = document.querySelector(".scan-txt");

var data = {terms: [], defs: []};

function setUp() {
  chrome.storage.sync.get(["terms"], (result) => {
    data.terms = result.terms;
    console.log("Terms loaded! (" + data.terms.length + ")");
    scanTxt.textContent = "Data loaded! (" + data.terms.length + " terms)";
  });
  chrome.storage.sync.get(["defs"], (result) => {
    data.defs = result.defs;
    console.log("Definitions loaded! (" + data.defs.length + ")");
  });
}

setUp();

scanBtn.onclick = () => {
  scanTxt.textContent = "Scanning...";

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "fetchTerms"}, (response) => {
      setTerms(response);
      console.log("TERMS: " + response);
      if (data.terms) {
        scanTxt.textContent = "Scan complete! (" + data.terms.length + " terms)";
      } else scanTxt.textContent = "Error! Scan Failed";
    });
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "fetchDefs"}, (response) => {
      setDefs(response);
      console.log("DEFINITIONS: " + response);
    });
  });
}

function setTerms(terms) {
  data.terms = terms;
  chrome.storage.sync.set({terms: terms}, () => {
    console.log("Terms saved in sync storage!");
  });
}

function setDefs(defs) {
  data.defs = defs;
  chrome.storage.sync.set({defs: defs}, () => {
    console.log("Definitions saved in sync storage!");
  });
}

function getTerm(search) {
  for (let i = 0; i < data.defs.length; i++) {
    if (data.defs[i] == search) {
      return data.terms[i];
    }
  }
  return null;
}

function getDef(search) {
  for (let i = 0; i < data.terms.length; i++) {
    if (data.terms[i] == search) {
      return data.defs[i];
    }
  }
  return null;
}

/* QUIZLET ACTIVITIES
const btnStop = document.getElementById("btn-stop");
const btnStart = document.getElementById("btn-start");

const btnMatch = document.getElementById("btn-match");

function sendMessage(message) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: message});
  });
}

btnStop.onclick = () => { sendMessage("stopAll") };
btnStart.onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "start", query: document.getElementById("querySelector").value, mcQuery: document.getElementById("mcQuery").value, mcQuery2: document.getElementById("mcQuery2").value});
  });
};

btnMatch.onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "match", query: document.getElementById("querySelector").value});
  });
};

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.greeting === "getTerm") {
      sendResponse(getTerm(request.term));
    }
    if (request.greeting === "getData") {
      sendResponse(data);
    }
    if (request.greeting === "copyDelay") {
      sendResponse(document.getElementById("slider-copy-time").value);
    }
  }
);
*/