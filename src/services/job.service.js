/** @private */
const JOBS_KEY = "jobs";

/** Shared Logic */
export class JobService {
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
    const updatedJobs = [
      ...jobs,
      {
        positionName,
        companyName,
        appliedDate
      },
    ];

    // set the jobs array back to chrome storage
    const promise = toPromise(function (resolve, reject) {
      chrome.storage.local.set({
        [JOBS_KEY]: updatedJobs
      }, () => {
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
  }
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