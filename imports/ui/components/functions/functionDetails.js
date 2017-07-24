import { FlowRouter } from 'meteor/kadira:flow-router';
import {Roles} from 'meteor/alanning:roles'; 
import './functionDetails.html';

Template.functionDetails.onCreated(function(){
  // this.autorun(() => {
    
  // });
});


Template.functionDetails.events({
 'click #view'(events){
    const functionId = Template.instance().data._id;
    FlowRouter.go('/functions/'+functionId);
 }
});