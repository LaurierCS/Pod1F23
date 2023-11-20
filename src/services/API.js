const API = {
    url: "/data/jobs.json",
    fetchItems: async function () {
        const result = await fetch(API.url);
        return await result.json();
    },
    printItems: async function () {
        const result = await fetch(API.url);
        const json = await result.json();
        console.log(json);
    },
};

export { API };
