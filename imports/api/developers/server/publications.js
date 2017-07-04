// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Developers } from '../developers.js';

Meteor.publish('publishers.all', function () {
  //Only Admin users
  return Developers.find();
});
