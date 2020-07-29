'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Contributor extends Model {
  static get primaryKey () {
    return 'id'
  }
  static get incrementing () {
    return false
  }
}

module.exports = Contributor
