'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Issue extends Model {
  static get primaryKey () {
    return 'id'
  }
  static get incrementing () {
    return false
  }
  project() {
    return this.belongsTo("App/Models/Project");
  }
  labels() {
    return this.hasMany("App/Models/Label");
  }
}

module.exports = Issue
