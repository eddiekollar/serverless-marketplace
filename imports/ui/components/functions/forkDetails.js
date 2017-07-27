import { FlowRouter } from 'meteor/kadira:flow-router';
import './forkDetails.html';

Template.forkDetails.onCreated(function(){

});


Template.forkDetails.events({
 'click #view'(events){
    const _id = Template.instance().data._id;
    FlowRouter.go('/licensee/functions/'+_id);
 }
});