// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Publishers } from './publishers';

Meteor.methods({
  'publishers.insert'(profile) {
    check(profile, Object);
    const userId = this.userId;
    return Publishers.insert(profile, function(error, id){
      if(!error){
        Meteor.users.update(userId, {$set: {'profile.onboardComplete': true}}, function(err, i){
          
        });
      }
    });
  }
});
