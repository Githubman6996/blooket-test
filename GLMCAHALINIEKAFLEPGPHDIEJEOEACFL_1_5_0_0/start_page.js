chrome.runtime.onInstalled.addListener(function (object) {
  let internalUrl = chrome.runtime.getURL("help.html");

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: internalUrl }, tab => {});
  }
});