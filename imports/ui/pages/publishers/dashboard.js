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
  getStats: function() {
    const stats = Functions.find().map(function(func){
      const data = {
        timesCalledAll: func.timesCalled(),
        earningsAll: parseFloat(func.earnings()),
        timesCalledToday: func.timesCalled('today'),
        earningsToday: parseFloat(func.earnings('today'))
      };

      return data;
    }).reduce(function(sum, value){
      return {
        timesCalledAll: sum.timesCalledAll + value.timesCalledAll,
        earningsAll: parseFloat(sum.earningsAll + value.earningsAll),
        timesCalledToday: sum.timesCalledToday + value.timesCalledToday,
        earningsToday: parseFloat(sum.earningsToday + sum.earningsToday)
      }
    }, {timesCalledAll: 0, earningsAll: 0, timesCalledToday: 0.00, earningsToday: 0.00});

    return stats;
  },
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