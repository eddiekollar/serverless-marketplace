import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {Roles} from 'meteor/alanning:roles'; 
import { Functions, FunctionForks } from '../collections';
import {FunctionZIPs} from '../filesCollection';

Meteor.publish('functions.all', function () {
  if(Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)){
    return Functions.find();
  }else{
    return [];
  }
});

Meteor.publish('files.one', function(functionId){
  check(functionId, String);

  const functionDoc = Functions.findOne({_id: functionId});
  const fileId = functionDoc.fileId || '';

  return FunctionZIPs.find({_id: fileId}).cursor;
})

Meteor.publish('functions.one', function(functionId){
  check(functionId, String);

  return Functions.find({_id: functionId});
});

Meteor.publish('forks.one', function(forkId){
  check(forkId, String);
  const fork = FunctionForks.findOne({_id: forkId, ownerId: this.userId});
  return [
    FunctionForks.find({_id: forkId, ownerId: this.userId}),
    Functions.find({_id: fork.functionId})
  ];
});

Meteor.publish('functions.active', function(){
  return Functions.find({status: 'ACTIVE'});
})

Meteor.publish('functions.mine', function () {
  return Functions.find({ownerId: this.userId});
});

Meteor.publish('functionforks.mine', function () {
  return FunctionForks.find({ownerId: this.userId});
});
