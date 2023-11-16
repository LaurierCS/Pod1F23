

const onNewElementLoaded = () => 
{
    jobContainers = document.getElementsByClassName("job-card-list__entity-lockup artdeco-entity-lockup artdeco-entity-lockup--size-4 ember-view");
    
    for (let i = 0; i < jobContainers.length; i++) 
    {
        const exists =  document.getElementsByClassName("checkmark")[i];
        if(!exists)
        {
            const checkmark = document.createElement("img");
            checkmark.src = chrome.runtime.getURL("resources/images/badge_verified.png");
            checkmark.className = "checkmark"
            checkmark.width = 70;
            checkmark.height = 70;

            jobContainers[i].appendChild(checkmark);
            console.log(jobContainers[i]);
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
  
  