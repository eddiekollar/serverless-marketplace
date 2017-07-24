import SimpleSchema from 'simpl-schema';
import {Publishers} from './publishers'; 
SimpleSchema.extendOptions(['autoform']);

const profileSchema = new SimpleSchema({
  userId: {
    type: String,
    autoform: {
      omit: true
    },
    autoValue: function() {
      return this.userId;
    }
  },
  firstName: {
      type: String,
      optional: true
  },
  lastName: {
      type: String,
      optional: true
  },
  address: Object,
  'address.street1': String,
  'address.street2': { type: String, optional: true },
  'address.city': String,
  'address.state': String,
  'address.postalCode': {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode
  },
  bank: Object,
  'bank.routing': String,
  'bank.account': String,
  payPalEmail: {
    label: 'PayPal Email',
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
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

Publishers.attachSchema(profileSchema);

module.exports = profileSchema;