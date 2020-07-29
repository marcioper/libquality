"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const GithubUtil = use("App/Util/GithubUtil");
const Project = use("App/Models/Project");
const Issue = use("App/Models/Issue");
const Label = use("App/Models/Label");
const Contributor = use("App/Models/Contributor");
const Database = use("Database");

const util = new GithubUtil();
const perPage = 100;
const state = 'open';

class GithubSync {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    request.errorMiddleware = false;
    const trx = await Database.beginTransaction();
    const { owner, repo } = request.only(["owner", "repo"]);

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
    } catch (error) {
      console.log("error", error);
      trx.rollback();
      request.errorMiddleware = true;
    }

    await next();
  }
}

module.exports = GithubSync
