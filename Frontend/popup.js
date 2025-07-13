document.getElementById("addMe").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:5173"});
})