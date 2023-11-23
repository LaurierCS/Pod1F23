(() => {
  let currentJob = "";

  let jobContainers;
  // store current job bookmarks in an array
  let currentJobBookmarks = [];
  let jobTitle, companyDescription;
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    // These properties are expected to be included in the messages sent from the background script
    const {
      type,
      value,
      currentJobId
    } = obj;
    if (type === "NEW") {
      currentJob = currentJobId;
      newJobLoaded();
    }
  });

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentJob], (obj) => {
        resolve(obj[currentJob] ? JSON.parse(obj[currentJob]) : []);
      });
    });
  }

  const newJobLoaded = async () => {
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
    currentJobBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {

      // Set properties of Bookmark button
      const bookmarkBtn = document.createElement("img");
      bookmarkBtn.src = chrome.runtime.getURL("resources/images/badge_verified.png");
      bookmarkBtn.className = "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark this job";
      bookmarkBtn.width = 50;
      bookmarkBtn.height = 50;


      jobTitle = document.getElementsByClassName("job-details-jobs-unified-top-card__job-title")[0];
      companyDescription = document.getElementsByClassName('job-details-jobs-unified-top-card__primary-description')[0]

      console.log(jobTitle.innerText);
      console.log(companyDescription.innerText);

      // Set location of bookmark and add event listener
      jobContainers = document.getElementsByClassName("job-details-jobs-unified-top-card__primary-description")[0];
      jobContainers.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewJobBookmarkEventHandler() = {

      }, {
        once: true
      });
    }

  }
  const addNewJobBookmarkEventHandler = async () => {

    const job = jobTitle.innerText;
    const company = companyDescription.innerText.split('·').map(part => part.trim());

    // Create a dropdown menu
    const dropdown = document.createElement("select");
    dropdown.className = "bookmark-dropdown";

    // Create options for the dropdown
    const option1 = document.createElement("option");
    option1.value = "wishlist";
    option1.text = "💕Wishlist";

    const option2 = document.createElement("option");
    option2.value = "applied";
    option2.text = "☑️Applied";

    const option3 = document.createElement("option");
    option3.value = "interview";
    option3.text = "✔️Interview";

    const option4 = document.createElement("option");
    option4.value = "offer";
    option4.text = "💲Offer";

    const option5 = document.createElement("option");
    option5.value = "rejected";
    option5.text = "❌Rejected";

    // Add options to the dropdown
    dropdown.add(option1);
    dropdown.add(option2);
    dropdown.add(option3);
    dropdown.add(option4);
    dropdown.add(option5);

    // Append the dropdown to the document
    jobContainers.appendChild(dropdown);
    // Event listener for dropdown change
    dropdown.addEventListener("change", function () {
      const selectedOption = dropdown.options[dropdown.selectedIndex].value;
      console.log("Selected option: ", selectedOption);
      // Add your logic for the selected option here
    });

    let locationMatch = company[1].match(/^(.*?)(\d+)/);
    let location = locationMatch ? locationMatch[1].trim() : null;
    let description = job + "-" + company[0] + "-" + location;
    let extractedDescription = description.replace(/[^a-zA-Z0-9]/g, '');
    let status = dropdown.options[dropdown.selectedIndex].value;
    console.log(status);

    const newBookmark = {
      jobTitle: job,
      companyName: company[0],
      location: location,
      description: job + " - " + company[0] + " - " + location,
      extractedDescription: extractedDescription,
      status: status
    };

    currentJobBookmarks = await fetchBookmarks();

    console.log(newBookmark);

    chrome.storage.sync.set({
      [currentJob]: JSON.stringify([...currentJobBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    });
  }
})();