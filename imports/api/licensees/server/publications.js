// All links-related publications

import { Meteor } from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles'; 
import { Licensees } from '../licensees.js';

Meteor.publish('licensees.all', function () {
  if(Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)){
    return Licensees.find();
  }else{
    return [];
  }
});

Meteor.publish('licensees.me', function () {
  return Licensees.find({ownerId: this.userId});
})
