const { Model } = require('objection');




class Notes extends Model {
  static get tableName() {
    return 'notes';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        id: { type: 'integer' },
        text: { type: 'string' },
        user_id: { type: 'integer' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./users')
    return {
      notes: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'notes.user_id',
          to: 'users.id'
        }
      },
    }
  }

  checkAuth(userId) {
    const { UnauthorizedError } = require('../utils/custom-erors');

    if (this.user_id !== userId) {
      throw new UnauthorizedError();
    }


  }

}
module.exports = Notes;
