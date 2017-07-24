import { Functions, FunctionForks } from '../../../api/functions/collections.js';
import {functionSchema, functionForkSchema} from '../../../api/functions/schemas.js';
import './fork.html';

Template.fork.onCreated(function(){
  const template = this;
  template.functionDoc = new ReactiveVar(false);
  template.forkDoc = new ReactiveVar(false);
  template.autorun(() => {
    const data = Template.currentData();
    const id = data.id || '';
    const self = this;

    self.subscribe('forks.one', id, function(){
      const forkDoc = FunctionForks.findOne({_id: id});
      const functionDoc = Functions.findOne({_id: forkDoc.functionId});
      
      template.functionDoc.set(functionDoc);
      template.forkDoc.set(forkDoc);
    });
  });
});

Template.fork.helpers({
  getForkSchema(){
    return functionForkSchema;
  },
  getFunctionSchema(){
    return functionSchema;
  },
  getFunctionDoc(){
    return Template.instance().functionDoc.get();
  },
  getForkDoc(){
    return Template.instance().forkDoc.get();
  }
});