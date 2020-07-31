'use strict'

const Task = use('Task');
const GithubUtil = use("App/Util/GithubUtil");
const Project = use("App/Models/Project");
const Issue = use("App/Models/Issue");
const Label = use("App/Models/Label");

const moment = require("moment");
const util = new GithubUtil();

class CollectDataGitHub extends Task {
  static get schedule () {
    return '0 */10 * * * *' // 10 minutes
  }

  async handle () {
    console.log('Task CollectDataGitHub handle');
    const data = await Project.all();
    const projects = data.toJSON();
    projects.forEach(async project => {
      console.log("full_name", project.full_name);

      const arr = project.full_name.split("/");
      const issues = await util.findIssuesSinceByProject(arr[0], arr[1], moment().subtract(600000, "ms").format("YYYY-MM-DDTHH:MM"));

      console.log("length", issues.length);
      issues.forEach(async (issueGit, index) => {
        const issueDto = await Issue.find(issueGit.id);
        if (issueDto) {

          // Merge issue
          await issueDto.merge({
            id: issueGit.id,
            title: issueGit.title,
            body: issueGit.body,
            number: issueGit.number,
            project_id: project.id,
            creator_id: issueGit.user.id,
            state: issueGit.state,
            created_at: issueGit.created_at,
            updated_at: issueGit.updated_at
          });
          await issueDto.save();
          console.log(`MERGE -- ${index} issue.id: ${issueDto.id} - issue.state: ${issueDto.state}`);
        } else {

          // Insert new issue
          await Issue.create({
            id: issueGit.id,
            title: issueGit.title,
            body: issueGit.body,
            number: issueGit.number,
            project_id: project.id,
            creator_id: issueGit.user.id,
            state: issueGit.state,
            created_at: issueGit.created_at,
            updated_at: issueGit.updated_at
          });

          issueGit.labels.forEach(async label => {
            await Label.create({
              external_id: label.id,
              name: label.name,
              issue_id: issueGit.id
            });
          });
          console.log(`INSERT -- ${index} issue.id: ${issueGit.id} - issue.state: ${issueGit.state}`);
        }
      });
    });
  }
}

module.exports = CollectDataGitHub
