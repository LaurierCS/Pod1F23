import { isDuplicate } from "../utils/isDuplicate";

/** @private */
const JOBS_KEY = "jobs";

/** Shared Logic */
class JobService {
    /**
     *
     * @returns {Promise<Array>}
     */
    static getJobs = function () {
        const promise = toPromise(function (resolve, reject) {
            chrome.storage.local.get([JOBS_KEY], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }

                let jobs = result.jobs ?? [];
                resolve(jobs);
            });
        });

        return promise;
    };

    /**
     *
     * @param {Array} jobArray
     * @returns {Promise<Array>}
     */
    static setJobs = async function (jobArray) {
        let jobs = await this.getJobs();
        console.log("job in storage before: ", jobs);
        console.log("job in upcoming array: ", jobArray);
        console.log("jobs length: ", jobs.length);
        if (jobs.length !== 0) {
            for (let newJob of jobArray) {
                let duplicate = isDuplicate(jobs, newJob);

                if (!duplicate) {
                    jobs = [...jobs, newJob];
                }
            }
        } else {
            jobs = [...jobArray];
        }

        console.log("job in storage after: ", jobs);

        const promise = toPromise(function (resolve, reject) {
            chrome.storage.local.set({ [JOBS_KEY]: jobs }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }

                resolve(jobs);
            });
        });

        return promise;
    };

    /**
     *
     * @param {String} positionName
     * @param {String} companyName
     * @param {String} appliedDate
     * @returns {Promise<Array>}
     */
    static setJob = async function (positionName, companyName, appliedDate) {
        const newJob = {
            positionName,
            companyName,
            appliedDate,
        };

        let jobs = await this.getJobs();
        let duplicate = isDuplicate(jobs, newJob);

        if (!duplicate) {
            jobs = [...jobs, newJob];
        }

        const promise = toPromise(function (resolve, reject) {
            chrome.storage.local.set({ [JOBS_KEY]: jobs }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }

                resolve(jobs);
            });
        });

        return promise;
    };

    /**
     *
     * @returns {Promise}
     */
    static removeJobs = function () {
        const promise = toPromise(function (resolve, reject) {
            chrome.storage.local.remove([JOBS_KEY], () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }

                resolve();
            });
        });

        return promise;
    };
}

/**
 * Promisify a callback.
 * @param {Function} callback
 * @returns {Promise}
 */
const toPromise = function (callback) {
    const promise = new Promise(function (resolve, reject) {
        try {
            callback(resolve, reject);
        } catch (error) {
            reject(error);
        }
    });
    return promise;
};

export { JobService };
