'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateContributorsSchema extends Schema {
  up () {
    this.create('contributors', (table) => {
      table.integer("id").unsigned().unique().primary();
      table.string("login");
      table.string("avatar_url");
      table.string("html_url");
      table.timestamps();
    })
  }

  down () {
    this.drop('contributors')
  }
}

module.exports = CreateContributorsSchema
