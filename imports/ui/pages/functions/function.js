import { FlowRouter } from 'meteor/kadira:flow-router';
import {Roles} from 'meteor/alanning:roles'; 
import { Functions } from '../../../api/functions/collections.js';
import {functionSchema} from '../../../api/functions/schemas.js';
import './function.html';
import '../../components/files/download.js';

Template.function.onCreated(function(){
  const template = this;
  template.isForking = new ReactiveVar(false);
  template.currentDoc = new ReactiveVar(false);
  template.autorun(() => {
    const data = Template.currentData();
    const id = data.id || '';

    this.subscribe('functions.one', id, function(){
      const functionDoc = Functions.findOne({_id: id});
      template.currentDoc.set(functionDoc);
    });
  });
});

const getFunctionDoc = function() {
  return Template.instance().currentDoc.get();
}

Template.function.helpers({
  isForking() {
    return Template.instance().isForking.get();
  },
  getSchema(){
    return functionSchema;
  },
  functionDoc (){
    return getFunctionDoc();
  }
});

Template.function.events({
  'click #fork'(events){
    const doc = Template.instance().currentDoc.get();
    const isForking = Template.instance().isForking;
    isForking.set(true);
     $('#form').attr("disabled", true);
    Meteor.call('function.fork', doc._id, function(error, data){
      console.log(error, data);
      isForking.set(false);
      $('#form').attr("disabled", false);
      console.log(FlowRouter.path('licensee.fork'));
      FlowRouter.go(FlowRouter.path('licensee.fork')+'/'+data);
    });
  },
  'click .review'(events){
    const doc = getFunctionDoc();
    const type = events.target.id;
    let data = {_id: doc._id, type};
    
    if(type === 'reject') {
      $('#rejectModal').modal();
    }else{
      Meteor.call('function.review', data, function(err, data){
        FlowRouter.go('/admin/dashboard/');
      });
    }
  },
  'click #submit'(events){
    Meteor.call('function.review', {type:'reject', reason: $('#reason').val()}, function(err, data){
        FlowRouter.go('/admin/dashboard/');
      });
  }
})