// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Developers } from './developers';

Meteor.methods({
  'developers.insert'(profile) {
    check(profile, Object);
    const userId = this.userId;
    return Developers.insert(profile, function(error, id){
      if(!error){
        Meteor.users.update(userId, {$set: {'profile.onboardComplete': true}}, function(err, i){
          
        });
      }
    });
  }
});
