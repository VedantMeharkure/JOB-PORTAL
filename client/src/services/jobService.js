import api from "./api";
export const getJobs = async (params = {}) => {
    const response = await api.get("/jobs", {
        params
    });
    return response.data;
};