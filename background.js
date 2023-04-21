// 监听浏览器操作按钮点击事件
chrome.action.onClicked.addListener(async function (tab) {
  // 获取活动选项卡的URL
  var activeTabUrl = tab.url;

  chrome.action.disable();
  chrome.action.setIcon({ path: "images/waiting/waiting48.png" });
  chrome.action.setTitle({ title: "downloading" });
  // 发送POST请求到本地服务器
  fetch("http://localhost:3000/yt/ytdl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: activeTabUrl }),
  })
    .then((response) => response.json())
    .then((data) => {
      // 从服务器响应中获取音频URL
      const audioUrl = data.audioUrl;
      const filename = data.filename;

      // 使用chrome.downloads API下载音频文件
      if (audioUrl) {
        chrome.downloads.download({
          url: audioUrl,
          filename: filename,
          conflictAction: "uniquify",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching audio URL:", error);
    })
    .finally(() => {
      chrome.action.enable();
      chrome.action.setIcon({ path: "images/icon-48.png" });
      chrome.action.setTitle({
        title: "click to download audio",
      });
    });
});
