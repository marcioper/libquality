'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateIssuesSchema extends Schema {
  up () {
    this.create('issues', (table) => {
      table.integer("id").unsigned().unique().primary();
      table.string("title");
      table.integer("number");
      table.enu("state", ["open", "closed"]).defaultTo("open");
      table.text("body");
      table.integer("creator_id");
      table
        .integer("project_id")
        .unsigned()
        .references("id")
        .inTable("projects")
        .onDelete("cascade");
      table.timestamp("created_at").nullable();
      table.timestamp("updated_at").nullable();
      table.timestamp("closed_at").nullable();
    })
  }

  down () {
    this.drop('issues')
  }
}

module.exports = CreateIssuesSchema
