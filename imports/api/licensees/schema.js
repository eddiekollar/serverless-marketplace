import SimpleSchema from 'simpl-schema';
import {Licensees} from './licensees'; 

SimpleSchema.extendOptions(['autoform']);

const licenseeSchema = new SimpleSchema({
    firstName: {
      type: String,
      optional: true
    },
    lastName: {
      type: String,
      optional: true
    },
    recurlyAccountId: {
      type: String,
      optional: true
    },
    userId: {
      type: String,
      autoValue: function() {
        if (this.isInsert) {
          this.userId;
        }
      }
    },
   createdAt: {
    autoform: {
      omit: true
    },
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  updatedAt: {
    type: Date,
    autoform: {
      omit: true
    },
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
});

Licensees.attachSchema(licenseeSchema);

export default licenseeSchema;