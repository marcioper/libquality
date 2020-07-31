'use strict'

const GithubUtil = use("App/Util/GithubUtil");
const Project = use("App/Models/Project");
const Issue = use("App/Models/Issue");
const Label = use("App/Models/Label");
const Contributor = use("App/Models/Contributor");
const Database = use("Database");

const moment = require("moment");
const util = new GithubUtil();
const perPage = 100;
const state = 'open';

class ProjectController {

  /**
  * @swagger
  * /api/v1/projects/sync:
  *   get:
  *     tags:
  *       - Project
  *     summary: Sync Github Route
  *     parameters:
  *       - name: owner
  *         description: Owner name of repositorie project
  *         in: query
  *         required: true
  *         type: string
  *       - name: repo
  *         description: Name of repositorie project
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Collect data from github
  *         example:
  *           message: "The repository facebook/react was successfully synchronized"
  */
  async indexSyncGitHub({ request, response }) {
    const { owner, repo } = request.only(["owner", "repo"]);
    const projectDto = await Project.findBy('full_name', `${owner}/${repo}`);

    if (projectDto) {
      return response.status(403).send({ message: `The repository ${owner}/${repo} is already synchronized previously` });
    }

    const trx = await Database.beginTransaction();

    try {
      const dataProject = await util.findByProject(owner, repo);
      const {
        id,
        name,
        full_name,
        description,
        url,
        stargazers_count,
        watchers_count,
        language,
        forks_count,
        open_issues_count,
        network_count,
        subscribers_count,
        created_at,
        updated_at
      } = dataProject;
      // average_age_count
      // standard_deviation_count
      console.log("open_issues_count", open_issues_count);

      const project = await Project.create({
        id,
        name,
        full_name,
        description,
        url,
        stargazers_count,
        watchers_count,
        language,
        forks_count,
        open_issues_count,
        network_count,
        subscribers_count,
        created_at,
        updated_at
      }, trx);

      // Get Contributors by Project (Repo)
      const contributors = [];
      const dataContributors = await util.findContributorsByProject(owner, repo);
      dataContributors.forEach(data => {
        contributors.push({
          id: data.id,
          login: data.login,
          avatar_url: data.avatar_url,
          html_url: data.html_url
        });
      });
      await Contributor.createMany(contributors, trx);

      // Get issues
      const totalPages = parseInt((open_issues_count/perPage) + 1)
      const issues = [];
      const labels = [];
      for (let page = 1; page <= totalPages; page++) {
        const data = await util.findIssuesByProject(owner, repo, state, perPage, page);
        data.forEach(issue => {
          issues.push({
            id: issue.id,
            title: issue.title,
            body: issue.body,
            number: issue.number,
            project_id: project.id,
            creator_id: issue.user.id,
            state: issue.state,
            created_at: issue.created_at,
            updated_at: issue.updated_at
          });

          issue.labels.forEach(label => {
            labels.push({
              external_id: label.id,
              name: label.name,
              issue_id: issue.id
            });
          });
        });
      }
      if (issues) {
        console.log("project", project.id);
        await Issue.createMany(issues, trx);
        if (labels) {
          await Label.createMany(labels, trx);
        }
      }

      trx.commit();

      return response.status(200).send({ message: `The repository ${owner}/${repo} was successfully synchronized` });
    } catch (error) {
      console.log("error", error);
      trx.rollback();
      return response.status(500).send({ message: `Synchronized repository error ${owner}/${repo}` });
    }
  }

  /**
  * @swagger
  * /api/v1/projects/average:
  *   get:
  *     tags:
  *       - Project
  *     summary: Average statistics issues
  *     responses:
  *       200:
  *         description: Send summary data
  *         example:
  *           [
  *             {
  *               "full_name": "facebook/react",
  *               "qnt": 567,
  *               "avgage": 522,
  *               "stdage": 515
  *             },
  *             {
  *               "full_name": "vuejs/vue",
  *               "qnt": 532,
  *               "avgage": 478,
  *               "stdage": 307
  *             }
  *           ]
  */
  async averages({ request, response }) {
    // -- REST API 01
    try {
      const results = await Database.raw(
        "SELECT proj.full_name, " +
        "     COUNT(*) as qnt, " +
        "     ROUND(AVG(DATEDIFF(NOW(), issu.created_at))) as avgage, " +
        "     ROUND(STD(DATEDIFF(NOW(), issu.created_at))) as stdage " +
        "  FROM issues issu " +
        " INNER JOIN projects proj ON proj.id = issu.project_id " +
        " WHERE state = 'open' " +
        " GROUP BY proj.full_name "
      );

      return results[0];
    } catch (error) {
      return response.status(404).send({
        message: "Error extracting information about libraries"
      });
    }
  }

  /**
  * @swagger
  * /api/v1/projects/statistics:
  *   get:
  *     tags:
  *       - Project
  *     summary: Daily statistics issues
  *     parameters:
  *       - name: dateParam
  *         description: Optional start date to query YYYY-MM-DD
  *         in: query
  *         required: false
  *         type: string
  *       - name: intervalDays
  *         description: Optional quantity about interval days
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: Result
  *         example:
  *               [
  *                 {
  *                   "full_name": "facebook/react",
  *                   "QTN": 8,
  *                   "data_create": "2020-07-30"
  *                 },
  *                 {
  *                   "full_name": "vuejs/vue",
  *                   "QTN": 1,
  *                   "data_create": "2020-07-30"
  *                 },
  *                 {
  *                   "full_name": "facebook/react",
  *                   "QTN": 1,
  *                   "data_create": "2020-07-29"
  *                 },
  *                 {
  *                   "full_name": "facebook/react",
  *                   "QTN": 4,
  *                   "data_create": "2020-07-28"
  *                 }
  *               ]
  */
  async statistics({ request, response }) {
    // -- REST API 02
    try {
      const { dateParam, intervalDays } = request.only(["dateParam", "intervalDays"]);
      const dt = dateParam ? dateParam : moment().format("YYYY-MM-DD");
      const interval = intervalDays ? intervalDays : 7;
      console.log("dt", dt);
      const results = await Database.raw(
        "SELECT proj.full_name,  " +
        "       COUNT(issu.id) AS QTN,  " +
        "       DATE_FORMAT(issu.created_at,\"%Y-%m-%d\") as data_create " +
        "  FROM issues issu " +
        " INNER JOIN projects proj ON proj.id = issu.project_id " +
        " WHERE state = 'open' " +
        "   AND issu.created_at >= DATE(?) - INTERVAL ? DAY " +
        " GROUP BY proj.full_name, data_create  " +
        " ORDER BY data_create DESC ",
        [dt, interval]
      );

      return results[0];
    } catch (error) {
      return response.status(404).send({
        error,
        message: "Error extracting daily statistics about libraries issues"
      });
    }
  }

}

module.exports = ProjectController
