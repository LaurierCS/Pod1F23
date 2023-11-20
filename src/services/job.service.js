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

                const jobs = result.jobs ?? [];
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
        const jobs = await this.getJobs();
        
        // make sure that there is no repetition
        // if there is no duplicate, update the job
        let noDuplicate = true;
        for (let job of jobs) {
            let jobPositionName = job.positionName;
            let jobCompanyName = job.companyName;
            let jobAppliedDate = job.appliedDate; // compare the job applied date

            if (jobPositionName === positionName && jobCompanyName === companyName) {
                noDuplicate = false;
            }
        }

        let updatedJobs = null;

        if (noDuplicate) {
            updatedJobs = [
                ...jobs,
                {
                    positionName,
                    companyName,
                    appliedDate,
                },
            ];
        } else {
            updatedJobs = [
                ...jobs,
            ];
        }
        

        const promise = toPromise(function (resolve, reject) {
            chrome.storage.local.set({ [JOBS_KEY]: updatedJobs }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }

                resolve(updatedJobs);
            });
        });

        return promise;
    };

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
