import { Template } from 'meteor/templating';
import bootstrap from 'bootstrap';
import './menu-bar.html';

function setupMenu(isLoggedIn) {
  if(isLoggedIn) {
    $('.dropdown-toggle').dropdown();
    $('.dropdown').show();
  }else{
    $('.dropdown').hide();
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
  'click #logout': function(events){
    $('.dropdown').hide();
    Meteor.logout();
  }
});
