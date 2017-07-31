import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';
import {Functions, FunctionForks, UsageStats} from './collections'; 

SimpleSchema.extendOptions(['autoform']);

const functionSchema = new SimpleSchema({
  ownerId: {
    type: String,
    autoform: {
      omit: true
    },
    autoValue: function() {
      if (this.isInsert) {
        return this.userId;
      } else {
        this.unset(); 
      }
    },
    denyUpdate: true,
  },
  name: {
    label: 'Function Name',
    type: String
  },
  handler: {
    label: 'Function Handler',
    type: String
  },
  description: {
    label: 'Short Description',
    type: String
  },
  fileId: {
    type:String,
    autoform: {
      omit: true
    },
    optional: true
  },
  status: {
    type: String,
    allowedValues: ['IN-REVIEW', 'REJECTED', 'ACTIVE', 'INACTIVE'],
    autoValue: function() {
      if(this.isInsert) {
        return 'IN-REVIEW';
      }
    }
  },
  params: {
    label: 'Parameters',
    type: Array,
    optional: true
  },
  'params.$': { 
    label: 'Parameter',
    type: Object,
    optional: true
  },
  'params.$.key': { 
    type: String,
    optional: true
  },
  'params.$.description': { 
    type: String,
    optional: true
  },
  // review: {
  //   type: Object,
  //   blackbox: true,
  //   autoform: {
  //     omit: true
  //   }

  // },
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

const functionForkSchema = new SimpleSchema({
  name: {
    label: 'Function Name',
    type: String,
    optional: true
  },
  ownerId: {
    type: String,
    autoform: {
      omit: true
    },
    autoValue: function() {
      if (this.isInsert) {
        return this.userId;
      } else {
        this.unset(); 
      }
    },
    denyUpdate: true
  },
  ARN: {
    type: String,
    optional: true
  },
  apiKey: {
    type: String,
    autoValue: function() {
      if(this.isInsert) {
        return Random.secret();
      }
    }
  },
  url: {
    type: String,
    optional: true
  },
  functionId: {
    type: String
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
  }
});

const statsSchema = new SimpleSchema({
  UsageType:{
    type: String
  },
  Operation: {
    type: String
  },
  UsageStartDate:{
    type: Date,
    autoValue: function() {
      if(!this.isSet && this.isInsert){
        return new Date();
      }else if(this.isInsert){
        return this.value;
      }else{
        this.unset();
      }
    }
  },
  UsageEndDate: {
    type: Date,
    autoValue: function() {
      if(!this.isSet && this.isInsert){
        return new Date();
      }else if(this.isInsert){
        return this.value;
      }else{
        this.unset();
      }
    }
  },
  UsageQuantity: {
    type: String,
    autoValue: function() {
      if(!this.isSet && this.isInsert) {
        return "1";
      }
    }
  },
  Cost:{
    type: String,
    optional: true
  },
  ResourceId: {
    type: String
  },
  source: {
    type: String
  },
  forkId: {
    type: String,
    optional: true
  }
})

Functions.attachSchema(functionSchema);
FunctionForks.attachSchema(functionForkSchema);
UsageStats.attachSchema(statsSchema);

export {functionSchema, functionForkSchema, statsSchema};