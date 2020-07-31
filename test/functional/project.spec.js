'use strict'

const { test, trait, afterEach, beforeEach } = use('Test/Suite')('Project');

const Project = use("App/Models/Project");
const Issue = use("App/Models/Issue");

const moment = require("moment");

trait("Auth/Client");
trait("Test/ApiClient");

const dateNow = moment().format("YYYY-MM-DD");

beforeEach(async () => {

  const project = await Project.create({
    id: 1,
    name: "react",
    full_name: "facebook/react",
  });

  const issue = await Issue.createMany([
    {
      id: 1,
      project_id: 1,
      created_at: dateNow,
    },
    {
      id: 2,
      project_id: 1,
      created_at: dateNow,
    }
  ]);
});

afterEach(async () => {
  await Issue.query().delete();
  await Project.query().delete();
});

test('list projects with avg and std of issues', async ({ client }) => {
  const response = await client.get("/api/v1/projects/average").end();

  response.assertStatus(200);
  response.assertJSONSubset([
    {
      full_name: "facebook/react",
      qnt: 2,
      avgage: 1,
      stdage: 0
    }
  ]);
});

test('list projects daily statistics about issues', async ({ client }) => {
  const response = await client.get("/api/v1/projects/statistics").end();

  response.assertStatus(200);
  response.assertJSONSubset([
    {
      full_name: "facebook/react",
      QTN: 2,
      data_create: dateNow,
    }
  ]);
});
