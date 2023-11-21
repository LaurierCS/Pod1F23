import { getDataFromStorage } from "./services/Job";
import { isDuplicate } from "./utils/isDuplicate";

// checkmark component
const CheckMark = () => {
    const checkmark = document.createElement("img");
    checkmark.src = chrome.runtime.getURL("/assets/badge_verified.png");
    checkmark.className = "checkmark";
    checkmark.width = 70;
    checkmark.height = 70;

    return checkmark;
};

// getting jobs list from storage
const jobs = await getDataFromStorage();

const onNewElementLoaded = () => {
    const jobContainers = document.getElementsByClassName(
        "job-card-list__entity-lockup artdeco-entity-lockup artdeco-entity-lockup--size-4 ember-view"
    );

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
