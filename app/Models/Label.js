'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Label extends Model {
  issue() {
    return this.belongsTo("App/Models/Issue");
  }
}

module.exports = Label
