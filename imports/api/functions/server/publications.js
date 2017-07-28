import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {Roles} from 'meteor/alanning:roles'; 
import { Functions, FunctionForks, UsageStats } from '../collections';
import {FunctionZIPs} from '../filesCollection';

Meteor.publish('functions.all', function () {
  if(Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)){
    const functionCursor = Functions.find({status: 'ACTIVE'});
    const functionIds = functionCursor.map(function(func){
      return func._id;
    });
    const forkCursor = FunctionForks.find({functionId: {$in: functionIds}});
    const arns = forkCursor.map(function(fork){
      return fork.ARN;
    });

    return [Functions.find(), forkCursor, UsageStats.find({ResourceId: {$in: arns}})];
  }else{
    return [];
  }
});

Meteor.publish('files.one', function(fileId){
  check(fileId, String);

  return FunctionZIPs.find({_id: fileId}).cursor;
})

Meteor.publish('functions.one', function(functionId){
  check(functionId, String);
  
  const functionDoc = Functions.findOne({_id: functionId});

  let pubs = [Functions.find({_id: functionId}),
              FunctionForks.find({functionId: functionId})];

  if(functionDoc.isOwner || Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP) ){
    let arns = [];
    FunctionForks.find({functionId: functionId}).forEach(function(fork){
      arns.push(fork.ARN);
    });
    pubs.push(UsageStats.find({ResourceId: {$in: arns}}));
    return pubs;
  }else{
    return pubs;
  }
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
  return [Functions.find({status: 'ACTIVE'}),
  FunctionForks.find({},{fields: {_id: 1}})];
})

Meteor.publish('functions.mine', function () {
  const functionCursor = Functions.find({ownerId: this.userId});
  const functionIds = functionCursor.map(function(func){
    return func._id;
  });
  const forkCursor = FunctionForks.find({functionId: {$in: functionIds}});
  const arns = forkCursor.map(function(fork){
    return fork.ARN;
  });

  return [functionCursor, forkCursor, UsageStats.find({ResourceId: {$in: arns}})];
});

Meteor.publish('forks.mine', function () {
  const forkCursor = FunctionForks.find({ownerId: this.userId});
  const functionIds = forkCursor.map(function(fork){
    return fork.functionId;
  });
  const arns = forkCursor.map(function(fork){
    return fork.ARN;
  });
  return [forkCursor, Functions.find({_id: {$in: functionIds}}), UsageStats.find({ResourceId: {$in: arns}})];
});
