chrome.tabs.onUpdated.addListener((tabId, tab) => {
  // This event listener is triggered whenever a tab is updated.
  if (tab.url && tab.url.includes("linkedin.com/jobs/collections/recommended/")) {
    // Check if the updated tab has a URL and if the URL contains "linkedin.com/jobs/collections/recommended/".
    const queryParameters = tab.url.split("?")[1];
    // Extract the query parameters from the URL.
    const urlParameters = new URLSearchParams(queryParameters);
    console.log(urlParameters);
    // Create a new URLSearchParams object to easily work with the query parameters.
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      currentJobId: urlParameters.get("currentJobId"),
      // Send a message to the content script with the type "NEW" and the videoId extracted from the "currentJobId" query parameter.
    });
  }
});