const API = {
  url: "/src/data/jobs.json",
  fetchJobs: async function () {
    const result = await fetch(API.url);
    return await result.json();
  },
};

export { API };
