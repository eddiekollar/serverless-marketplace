// Import client startup through a single index entry point
import {Roles} from 'meteor/alanning:roles'; 
import {Session} from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './routes.js';

AccountsTemplates.addField({
  _id: 'terms',
  type: 'checkbox',
  template: "termsCheckbox",
  errStr: "You must agree to the Terms and Conditions",
  func: function(value) {
    return !value;
  },
  negativeValidation: false
});

Tracker.autorun(function() {
  if (!Meteor.userId()) {
    if (Session.get('loggedIn')) {
      return FlowRouter.go(FlowRouter.path('login'));
    }
  }else{
    const user = Meteor.user();
    if(user && Roles.userIsInRole(user,['admin'], Roles.GLOBAL_GROUP)){
        return FlowRouter.go(FlowRouter.path('admin.dashboard'));
    }
    else if(user && Roles.userIsInRole(user,['publisher'], Roles.GLOBAL_GROUP)){
        if(!user.profile.onboardComplete){
            return FlowRouter.go(FlowRouter.path('publisher.onboard'));
        }else{
            return FlowRouter.go(FlowRouter.path('publisher.dashboard'));
        }
    }
    else if(user && Roles.userIsInRole(user,['licensee'], Roles.GLOBAL_GROUP)){
        if(!user.profile.onboardComplete){
            return FlowRouter.go(FlowRouter.path('licensee.onboard'));
        }else{
            return FlowRouter.go(FlowRouter.path('licensee.dashboard'));
        }
    }
  }
});