import { Functions } from '../../../api/functions/collections.js';
import './dashboard.html';
import '../../components/functions/functionDetails.js';

Template.adminDashboard.onCreated(function(){
  this.autorun(() => {
    this.subscribe('functions.all');
  });
});


Template.adminDashboard.helpers({
  getStats: function(){
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
  }
});