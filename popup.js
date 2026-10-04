'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('opt');
  button.addEventListener('click', async () => {
    try {
      await chrome.runtime.openOptionsPage();
      window.close();
    } catch (error) {
      console.error('Unable to open extension options:', error);
    }
  });
});
