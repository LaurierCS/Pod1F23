// (async () => {
//   const src = chrome.runtime.getURL("src/content_main.js");
//   const contentScirpt = await import(src);
//   contentScirpt.main();
// })();

// let url = chrome.runtime.getURL(
//   "src/data/jobs.json"
// );

// async function getData(url) {
//   let result = await fetch(url);
//   return await result.json();
// }

// let jobs = getData(url);

// console.log("do something");



// const jobs = [
//   {
//     positionName: "Software Engineer Intern, Backend - Toronto (2024)",
//     companyName: "Lyft",
//   },
//   {
//     positionName: "Software Engineer Intern, Mobile iOS - Toronto (2024)",
//     companyName: "Lyft",
//   },
//   {
//     positionName: "Data Engineer Intern",
//     companyName: "Xylem",
//   },
//   {
//     positionName: "Software Developer Intern - May 2024 (4 months)",
//     companyName: "Konrad Group",
//   },
// ];

const onNewElementLoaded = () => {
  jobContainers = document.getElementsByClassName(
    "job-card-list__entity-lockup artdeco-entity-lockup artdeco-entity-lockup--size-4 ember-view"
  );
  //company name, title
  for (let i = 0; i < jobContainers.length; i++) {
    const cardContainer = jobContainers[i];
    // Job title
    const jobTitleContainer = cardContainer.querySelector(
      "a.job-card-container__link"
    );
    const jobCompanyNameContainer = cardContainer.querySelector(
      "span.job-card-container__primary-description"
    );

    if (jobTitleContainer && jobCompanyNameContainer) {
      const positionNameFromCard = jobTitleContainer.textContent.trim();
      const companyNameFromCard = jobCompanyNameContainer.textContent.trim();

      // const applied = jobs.some(({ positionName, companyName }) => {
      //   return (
      //     positionName === positionNameFromCard &&
      //     companyName === companyNameFromCard
      //   );
      // });

      // if (applied) {
      //   console.log(
      //     `you have applied for ${positionNameFromCard} in ${companyNameFromCard}`
      //   );
      // }
    }

    const exists = document.getElementsByClassName("checkmark")[i];
    if (!exists) {
      const checkmark = document.createElement("img");
      checkmark.src = chrome.runtime.getURL(
        "/assets/badge_verified.png"
      );
      checkmark.className = "checkmark";
      checkmark.width = 70;
      checkmark.height = 70;

      jobContainers[i].appendChild(checkmark);
    }
  }
};

const observeDOM = () => {
  // MutationObserver is a function that looks for changes in the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            node.classList.contains("job-card-list__entity-lockup")
          ) {
            onNewElementLoaded();
          }
        });
      }
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
};

observeDOM();
