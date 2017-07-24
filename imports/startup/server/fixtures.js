// Fill the DB with example data on startup
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {Roles} from 'meteor/alanning:roles'; 

Meteor.startup(() => {
  let adminUsers = [
    {email: 'eddie.kollar@gmail.com', password: 'HelloAdmin123'},
    {email: 'zack@zackburt.com', password: 'HelloAdmin123'}
  ];

  //Only create admins once
  const adminCount = Meteor.roles.find({name: 'admin'}).count();
  console.log('Admin count: ', adminCount);
  if(!admin || admin === 0){
    console.log('creating admins');
    _.each(adminUsers, function(user){
      let id = Accounts.createUser(user);
      Roles.addUsersToRoles(id, ['admin'], Roles.GLOBAL_GROUP);
    })
  }
});
