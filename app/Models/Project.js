'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Project extends Model {
  static get primaryKey () {
    return 'id'
  }
  static get incrementing () {
    return false
  }
  issues() {
    return this.hasMany("App/Models/Issue", "project_id", "id");
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Project
