'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateLabelsSchema extends Schema {
  up () {
    this.create('labels', (table) => {
      table.increments().unsigned();
      table.integer("external_id").unsigned();
      table.string("name");
      table
        .integer("issue_id")
        .unsigned()
        .references("id")
        .inTable("issues")
        .onDelete("cascade");
      table.timestamps();
    })
  }

  down () {
    this.drop('labels')
  }
}

module.exports = CreateLabelsSchema
