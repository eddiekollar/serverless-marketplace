// All links-related publications

import { Meteor } from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles'; 
import { Publishers } from '../publishers.js';

Meteor.publish('publishers.all', function () {
  if(Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)){
    return Publishers.find();
  }else{
    return [];
  }
});

Meteor.publish('publishers.me', function () {
  return Publishers.find({ownerId: this.userId});
})
