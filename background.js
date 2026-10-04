'use strict';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'OPEN_OPTIONS_PAGE') return false;

  chrome.runtime.openOptionsPage()
    .then(() => sendResponse({ ok: true }))
    .catch((error) => {
      console.error('Unable to open options page:', error);
      sendResponse({ ok: false, error: String(error) });
    });

  return true;
});
