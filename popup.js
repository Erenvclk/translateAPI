document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("translateBtn");
    const resultDiv = document.getElementById("result");
  
    button.addEventListener("click", async function () {
      // 1. Aktif sekmeyi al
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      // 2. Seçilen metni content.js üzerinden al
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: getSelectedText,
        },
        async (injectionResults) => {
          if (!injectionResults || injectionResults.length === 0) {
            resultDiv.innerText = "Metin seçilemedi.";
            return;
          }
  
          const selectedText = injectionResults[0].result;
  
          if (!selectedText || selectedText.trim() === "") {
            resultDiv.innerText = "Lütfen metin seçin.";
            return;
          }
  
          resultDiv.innerText = "Çevriliyor...";
  
          // todo: add api key here

  
          const data = await response.json();
          const translated = data.choices?.[0]?.message?.content;
          resultDiv.innerText = translated || "Çeviri alınamadı.";
        }
      );
    });
  });
  
  // Bu fonksiyon, aktif sekmedeki seçilen metni alır (content.js içeriği gibi çalışır)
  function getSelectedText() {
    return window.getSelection().toString();
  }
 
