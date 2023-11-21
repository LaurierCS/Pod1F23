chrome.tabs.onUpdated.addListener((tabId, tab) => 
{

  if(tab.url && tab.url.includes("linkedin.com"))
  {
    chrome.tabs.sendMessage(tabId,{
      type: "New",

    })
  }
})

