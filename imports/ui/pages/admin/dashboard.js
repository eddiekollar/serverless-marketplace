import { Functions } from '../../../api/functions/collections.js';
import './dashboard.html';
import '../../components/functions/functionDetails.js';

Template.adminDashboard.onCreated(function(){
  this.autorun(() => {
    this.subscribe('functions.all');
  });
});


Template.adminDashboard.helpers({
  getFunctionList: function() {
    return Functions.find().fetch();
  }
});