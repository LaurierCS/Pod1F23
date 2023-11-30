/**
 *
 * @param {Array} jobs
 * @param {Object} newJob
 * @returns {boolean}
 */
const isDuplicate = function (jobs, newJob) {
    for (let job of jobs) {
        if (
            job.companyName === newJob.companyName &&
            job.positionName === newJob.positionName
        ) {
            return true;
        }
    }

    return false;
};

export { isDuplicate };
