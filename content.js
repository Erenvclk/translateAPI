// Sayfadaki seçili metni döndür
function getSelectedText() {
    return window.getSelection().toString();
  }
  
  // Popup'tan gelen mesajları dinle
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_SELECTED_TEXT") {
      const selectedText = getSelectedText();
      sendResponse({ text: selectedText });
    }
  });
  