'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateProjectsSchema extends Schema {
  up () {
    this.create('projects', (table) => {
      table.integer("id").unsigned().unique().primary();
      table.string("name");
      table.string("full_name");
      table.text("description");
      table.string("url");
      table.integer("stargazers_count");
      table.integer("watchers_count");
      table.string("language");
      table.integer("forks_count");
      table.integer("open_issues_count");
      table.integer("network_count");
      table.integer("subscribers_count");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users");
      table.timestamps();
    })
  }

  down () {
    this.drop('projects')
  }
}

module.exports = CreateProjectsSchema
