import { Functions } from '../../../api/functions/collections.js';
import '../../components/functions/functionDetails.js';
import './main.html';

Template.main.onCreated(function(){
  this.autorun(() => {
    this.subscribe('functions.active');
  });
});

Template.main.helpers({
  getFunctionList: function() {
    return Functions.find().fetch();
  }
});

Template.main.events({

});
