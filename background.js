chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateText",
    title: "Seçilen Metni Çevir",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateText") {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      },
      async (injectionResults) => {
        const selectedText = injectionResults[0]?.result;

        if (!selectedText || selectedText.trim() === "") {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Uyarı",
            message: "Lütfen önce bir metin seçin."
          });
          return;
        }

        // 👇 Buraya kendi API anahtarını yaz
        const apiKey = "sk-...";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "Sen profesyonel bir çevirmen ve dil uzmanısın." },
              { role: "user", content: `Lütfen bu metni Türkçeye çevir: "${selectedText}"` }
            ]
          })
        });

        const data = await response.json();
        const translated = data.choices?.[0]?.message?.content;

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => alert("Çeviri:\n" + text),
          args: [translated || "Çeviri alınamadı."]
        });
      }
    );
  }
});
