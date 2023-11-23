import {
  getActiveTabURL
} from "./utils.js";


const addNewBookmark = (bookmarksElement, bookmark) => {
  let table = document.getElementById('jobBookmarkTable');

  // Set the bookmark job title
  const jobTitleElement = document.createElement("td");
  jobTitleElement.textContent = bookmark.jobTitle;
  jobTitleElement.className = "job-title";
  jobTitleElement.id = "bookmark-" + bookmark.jobTitle;

  // Set the bookmark company name
  const companyNameElement = document.createElement("td");
  companyNameElement.textContent = bookmark.companyName;
  companyNameElement.className = "job-companyName";
  companyNameElement.id = "bookmark-" + bookmark.companyName;

  // Set the bookmark location
  const locationElement = document.createElement("td");
  locationElement.textContent = bookmark.location;
  locationElement.className = "job-location";
  locationElement.id = "bookmark-" + bookmark.location;

  // Set the job status
  const statusElement = document.createElement("td");
  statusElement.textContent = bookmark.status;
  statusElement.className = "job-status";
  statusElement.id = "bookmark-" + bookmark.status;

  // Create control element
  const controlElement = document.createElement("td");
  controlElement.className = "bookmark-controls";
  setBookmarkAttributes("play", onPlay, controlElement);

  table.appendChild(jobTitleElement);
  table.appendChild(companyNameElement);
  table.appendChild(locationElement);
  table.appendChild(statusElement);
  // Display a message that there is a bookmark
  bookmarksElement.innerHTML = '<i class="row">Your bookmark in Linkedin</i>';
};

const viewBookmarks = (currentBookmarks = []) => {
  // Get the bookmarks container element by ID
  const bookmarksElement = document.getElementById("bookmarks");
  // Clear the existing content in the bookmarks container
  bookmarksElement.innerHTML = "";
  // Check if there are any bookmarks to display
  if (currentBookmarks.length > 0) {
    // Loop through the array of bookmarks and add each to the DOM
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    // If there are no bookmarks, display a message
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
  }

  return;
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");
  controlElement.src = "resources/images/badge_verified.png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

// ... (initializing the extension when the DOM is fully loaded)
document.addEventListener("DOMContentLoaded", async () => {
  //Retrieve the active tab 's URL
  const activeTab = await getActiveTabURL();
  //Extract query parameters from the URL
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);
  //Extract the video ID from the URL
  const currentJob = urlParameters.get("currentJobId");
  //Check if it's a YouTube video page:
  if (activeTab.url.includes("linkedin.com/jobs/collections/recommended/") && currentJob) {
    //Fetch and display bookmarks
    chrome.storage.sync.get([currentJob], (data) => {
      const currentJobBookmarks = data[currentJob] ? JSON.parse(data[currentJob]) : [];

      viewBookmarks(currentJobBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not a Linkedin Job Post page.</div>';
  }
});