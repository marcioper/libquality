'use strict'

const GithubUtil = use("App/Util/GithubUtil");
const Project = use("App/Models/Project");
const Issue = use("App/Models/Issue");
const Label = use("App/Models/Label");
const Contributor = use("App/Models/Contributor");
const Database = use("Database");

class ProjectController {
  async indexSync({ request, response }) {
    console.log("request.errorMiddleware", request.errorMiddleware);
    if (request.errorMiddleware) {
      return response.status(200).send({ message: "Sync data github error. Please, try again later"});
    }
    return response.status(200).send({ message: "Success" });
  }
}

module.exports = ProjectController
