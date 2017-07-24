// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import {Roles} from 'meteor/alanning:roles'; 
import { Licensees } from './licensees';
import Recurly from 'node-recurly';

let recurlyConfig = {};
 
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
   recurlyConfig = process.env.recurly;
}else{
  recurlyConfig = Meteor.settings.public.recurly;
}
const recurly = new Recurly(recurlyConfig);

Meteor.methods({
  'licensee.subscribe'(userInfo) {
    check(userInfo, Object);
    const userId = this.userId;
    const accountId = Random.id();

    let account = {
      account_code: accountId,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: Meteor.user().email(),
      billing_info: {
        token_id: userInfo.token.id
      }
    };

    console.log(account);

    recurly.subscriptions.create({
      plan_code: 'monthly',
      currency: 'USD',
      account: account
    }, function(err, response){
      if (err) {
        // var message = parseErrors(err.data);
        console.error(err);
      }else{
        console.log(response)
      }
    });

    profile = {
      recurlyAccountId: accountId,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    }
    return Licensees.insert(profile, function(error, id){
      if(!error){
          Meteor.users.update(userId, {$set: {'profile.onboardComplete': true}}, function(err, i){
            
          });
        }
    });
  },
  'licensees.insert'(profile) {
    check(profile, Object);
    const userId = this.userId;

    if(Roles.userIsInRole(this.userId, ['licensee'], Roles.GLOBAL_GROUP)){
      return Licensees.insert(profile, function(error, id){
        if(!error){
          Meteor.users.update(userId, {$set: {'profile.onboardComplete': true}}, function(err, i){
            
          });
        }
      });
    }else{
      throw new Meteor.Error('not-allowed', "Operation not allowed by this user");
    }
  }
});

function parseErrors (data) {
  return data.errors
    ? data.errors.error.map(parseValidationErrors).join(', ')
    : [data.error.symbol, data.error.description].join(': ');
}

/*
Handle Recurly
 */
