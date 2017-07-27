import { FlowRouter } from 'meteor/kadira:flow-router';
import {Roles} from 'meteor/alanning:roles'; 
import { FunctionForks } from '../../../api/functions/collections.js';
import './dashboard.html';
import '../../components/functions/forkDetails.js';

Template.licenseeDashboard.onCreated(function(){
  this.autorun(() => {
    this.subscribe('forks.mine');
  });
})

Template.licenseeDashboard.helpers({
  getStats: function() {
    const stats = FunctionForks.find().map(function(fork){
      const data = {
        timesCalledAll: fork.timesCalled(),
        costAll: parseFloat(fork.cost()),
        timesCalledToday: fork.timesCalled('today'),
        costToday: parseFloat(fork.cost('today'))
      };

      return data;
    }).reduce(function(sum, value){
      return {
        timesCalledAll: sum.timesCalledAll + value.timesCalledAll,
        costAll: parseFloat(sum.costAll + value.costAll),
        timesCalledToday: sum.timesCalledToday + value.timesCalledToday,
        costToday: parseFloat(sum.costToday + sum.costToday)
      }
    }, {timesCalledAll: 0, costAll: 0, timesCalledToday: 0.00, costToday: 0.00});

    return stats;
  },
  getForkList: function() {
    return FunctionForks.find().fetch();
  },
});