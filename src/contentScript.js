import { getDataFromStorage } from "./services/Job";
import { isDuplicate } from "./utils/isDuplicate";

// checkmark component
const CheckMark = () => {
    const checkmark = document.createElement("img");
    checkmark.src = chrome.runtime.getURL("/assets/badge_verified.png");
    checkmark.className = "checkmark";
    checkmark.width = 60;
    checkmark.height = 60;
    return checkmark;
};

// getting jobs list from storage
const jobs = await getDataFromStorage();

const onNewElementLoaded = (isLinkedin) => {
  if(isLinkedin)
  {
    const jobContainers = document.getElementsByClassName("job-card-list__entity-lockup artdeco-entity-lockup artdeco-entity-lockup--size-4 ember-view");
    const getValue = (jobContainer, className) => {
        const item = jobContainer.querySelector(className);
        return item ? item.textContent.trim() : "";
    };

    for (let i = 0; i < jobContainers.length; i++) {
        const cardContainer = jobContainers[i];
        const positionName = getValue(
            cardContainer,
            "a.job-card-container__link"
        );
        const companyName = getValue(
            cardContainer,
            "span.job-card-container__primary-description"
        );
        const newJob = {
            positionName,
            companyName,
        };
        const hasAppliedToTheJob = isDuplicate(jobs, newJob);

        if (hasAppliedToTheJob) {
            const hasTag =
                cardContainer.hasAttribute("applied") &&
                cardContainer.hasAttribute("addTag");

            if (!hasTag) {
                cardContainer.setAttribute("applied", "true");
                cardContainer.setAttribute("addTag", "false");
            }
        }

        if (
            cardContainer.getAttribute("applied") === "true" &&
            cardContainer.getAttribute("addTag") === "false"
        ) {
            cardContainer.appendChild(CheckMark());
            cardContainer.setAttribute("addTag", "true");
        }
    }
  }
  else if (!isLinkedin)
  {
    const jobContainers = document.getElementsByClassName("css-5lfssm eu4oa1w0");
    const getValue = (jobContainer, className) => {
      const item = jobContainer.querySelector(className);
      return item ? item.textContent.trim() : "";
  };

  for (let i = 0; i < jobContainers.length; i++) {
      const cardContainer = jobContainers[i];
      const positionName = getValue(cardContainer, '.jobTitle span');

      const companyName = getValue(
          cardContainer,
          '.company_location span'
      );
      console.log(companyName);

      const newJob = {
          positionName,
          companyName,
      };
      const hasAppliedToTheJob = isDuplicate(jobs, newJob);

      if (hasAppliedToTheJob) {
          const hasTag =
              cardContainer.hasAttribute("applied") &&
              cardContainer.hasAttribute("addTag");

          if (!hasTag) {
              cardContainer.setAttribute("applied", "true");
              cardContainer.setAttribute("addTag", "false");
          }
      }

      if (
          cardContainer.getAttribute("applied") === "true" &&
          cardContainer.getAttribute("addTag") === "false"
      ) {
          cardContainer.querySelector('.company_location span').appendChild(CheckMark());
          cardContainer.setAttribute("addTag", "true");

      }
  }
  }
    
};

const observeDOMLinkedin = () => {
    // MutationObserver is a function that looks for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          console.log("Checking Linkedin...")
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains("job-card-list__entity-lockup")) 
                    {
                      onNewElementLoaded(true);
                    }
                });
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
};
const observeDOMIndeed = () => {
  // MutationObserver is a function that looks for changes in the DOM
  const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log("Checking Indeed...")
          if (mutation.type === "childList") {
              mutation.addedNodes.forEach((node) => {
                  if(node.nodeType === 1 && node.classList.contains("e37uo190"))
                  {
                    onNewElementLoaded(false);
                  }
                  else if(node.nodeType === 1 && node.classList.contains("eu4oa1w0"))
                  {
                    onNewElementLoaded(false);
                  }
              });
          }
      });
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
};

if (document.location.href.startsWith("https://ca.indeed.com/"))
{
  observeDOMIndeed();
}
else if (document.location.href.startsWith("https://www.linkedin.com/"))
{
  observeDOMLinkedin();

}






