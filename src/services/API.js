const API = {
    url: "/data/jobs.json",
    fetchItems: async function () {
        const result = await fetch(API.url);
        return await result.json();
    },
};

export { API };
