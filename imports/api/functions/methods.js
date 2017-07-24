import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {Roles} from 'meteor/alanning:roles'; 
import { Functions, FunctionForks } from './collections.js';
import { completeFunctionForking} from './collectionHooks';
//import {Email} from '../utils/email';

Meteor.methods({
  'function.fork'(functionId) {
    check(functionId, String);

    if(Roles.userIsInRole(this.userId, ['licensee'], Roles.GLOBAL_GROUP)){
       const forkId = FunctionForks.insert({functionId});
       return completeFunctionForking(forkId, functionId);
    }else{
       throw new Meteor.Error('not-allowed', "Operation not allowed by this user");
    }
  },
  'function.review'(updateObj){
    check(updateObj, Object);
    console.log(updateObj)
    if(Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)){
      if(updateObj.type === 'approve') {
        return Functions.update({_id: updateObj._id}, {$set: {status: 'ACTIVE'}});
      }else{
        return Functions.update({_id: updateObj._id}, {$set: {status: 'REJECTED'}});
      }
    }else{
      throw new Meteor.Error('not-allowed', "Operation not allowed by this user");
    }
  },
  'function.update'(updateObj) {
    check(updateObj, Object);
    
    if(Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)){
      return Functions.update({_id: updateObj._id}, {$set: {status: updateObj.status}});
    }else{
      throw new Meteor.Error('not-allowed', "Operation not allowed by this user");
    }
  },
  'function.new'(doc) {
    check(doc, Object);

    if(Roles.userIsInRole(this.userId, ['publisher'], Roles.GLOBAL_GROUP)){
      return Functions.insert(doc);
    }else{
      throw new Meteor.Error('not-allowed', "Operation not allowed by this user");
    }
  }
});
