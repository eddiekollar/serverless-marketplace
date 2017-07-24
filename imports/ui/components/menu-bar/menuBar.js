import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {Roles} from 'meteor/alanning:roles'; 
import bootstrap from 'bootstrap';
import './menu-bar.html';

function setupMenu(isLoggedIn) {
  if(isLoggedIn) {
    $('.dropdown-toggle').dropdown();
    $('.dropdown').show();
    $('#dashboard').show()
  }else{
    $('.dropdown').hide();
    $('#dashboard').hide()
  }
}

function displayName (user) {
  var name;

  if (!user) {
    user = Meteor.user();
  }

  if (!user) return "";

  if (user.profile) {
    name = user.profile.name;
  }

  if ('string' === typeof name) {
    name = name.trim();
  } else {
    name = null;
  }

  if (!name && user.emails && user.emails.length > 0) {
    name = user.emails[0].address;
  }

  return name || "";
}

Template.menuBar.onCreated(() => {
  
});

Template.menuBar.onRendered(function() {
  const isLoggedIn = !!Meteor.user();
  setupMenu(isLoggedIn);
});

Template.menuBar.helpers({
  hideDropDown: function() {
    const isLoggedIn = !!Meteor.user();
    setupMenu(isLoggedIn);
    return isLoggedIn;
  },
  displayName: function () {
    return displayName();
  }
});

Template.menuBar.events({
  'click #dashboard': function(events){
    const user = Meteor.user();
    const roles = Roles.getRolesForUser(Meteor.userId(), Roles.GLOBAL_GROUP);

    if (roles.includes('admin')) {
      FlowRouter.go('/admin/dashboard');
    }else if(roles.includes('publisher')) {
      FlowRouter.go('/publisher/dashboard');
    }else if(roles.includes('licensee')) {
      FlowRouter.go('/licensee/dashboard');
    }
  },
  'click #logout': function(events){
    $('.dropdown').hide();
    FlowRouter.go('/logout');
  }
});
