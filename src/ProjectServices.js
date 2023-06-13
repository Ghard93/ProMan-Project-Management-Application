import httpCommon from "./http-common";

class ProjectDataServices {
    getUserProjects() {
        return httpCommon.get("/Projects")
    }

    getProjectData(id) {
        return httpCommon.get(`/Project?id=${id}`)
    }

    createProject(data) {
        return httpCommon.post("/Projects", data)
    }

    updateProject(id, data) {
        return httpCommon.put(`/Projects?id=${id}`, data)
    }

    deleteProject(id) {
        return httpCommon.delete(`/Projects?id=${id}`)
    }
}

export default new ProjectDataServices()