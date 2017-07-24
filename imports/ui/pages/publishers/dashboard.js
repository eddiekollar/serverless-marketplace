import {Session} from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {Roles} from 'meteor/alanning:roles'; 
import { Functions } from '../../../api/functions/collections.js';
import './dashboard.html';
import '../../components/functions/functionDetails.js';

Template.publisherDashboard.onCreated(function(){
  const alert = Session.get('alertMessage');
  Session.set('alertMessage', null);
  this.alertMessage = new ReactiveVar(alert);

  this.autorun(() => {
    this.subscribe('functions.mine');
  });
})

Template.publisherDashboard.helpers({
  getFunctionList: function() {
    return Functions.find().fetch();
  },
  alertMessage: function() {
    return Template.instance().alertMessage.get();
  }
});

Template.publisherDashboard.events({
  'click #new-submission': function(event, template){
    FlowRouter.go('/publisher/function/new');
  }
})