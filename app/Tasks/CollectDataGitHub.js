'use strict'

const Task = use('Task');
const GithubUtil = use("App/Util/GithubUtil");
const Database = use('Database');

const util = new GithubUtil();

class CollectDataGitHub extends Task {
  static get schedule () {
    return '0 */1 * * * *'
  }

  async handle () {
    console.log('Task CollectDataGitHub handle');
    const projects = await Database.select('full_name').from('projects');
    projects.forEach(project => {
      console.log("full_name", project.full_name);
    });
    // const data = await util.findIssuesSinceByProject(owner, repo, '2020-07-28');
  }
}

module.exports = CollectDataGitHub
