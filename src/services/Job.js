import { API } from "./API";
import { JobService } from "./Job.service";

async function loadData() {
    const newJobs = await API.fetchItems();
    return JobService.setJobs(newJobs);
}

async function getDataFromStorage() {
    return JobService.getJobs();
}

export { loadData, getDataFromStorage };
