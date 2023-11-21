
const onNewElementLoaded = () => 
{
    jobContainers = document.getElementsByClassName("job-card-list__entity-lockup artdeco-entity-lockup artdeco-entity-lockup--size-4 ember-view");
    //company name, title
    for (let i = 0; i < jobContainers.length; i++) 
    {
        const cardContainer = jobContainers[i];
        //Job title
        const jobTitleContainer = cardContainer.querySelector("a.job-card-container__link");
        if (jobTitleContainer) 
        {
            const textContent = jobTitleContainer.textContent.trim();
            console.log(textContent);
        }


        const exists =  document.getElementsByClassName("checkmark")[i];
        if(!exists)
        {
            const checkmark = document.createElement("img");
            checkmark.src = chrome.runtime.getURL("resources/images/badge_verified.png");
            checkmark.className = "checkmark"
            checkmark.width = 70;
            checkmark.height = 70;

            jobContainers[i].appendChild(checkmark);
        }
    }
  };
  
const observeDOM = () => 
{
  // MutationObserver is a function that looks for changes in the DOM
  const observer = new MutationObserver((mutations) => 
  {
    mutations.forEach((mutation) => 
    {
      if (mutation.type === "childList") 
      {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList.contains('job-card-list__entity-lockup')) 
          {
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
  
  