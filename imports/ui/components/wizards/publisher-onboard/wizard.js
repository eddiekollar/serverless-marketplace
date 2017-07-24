import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import  schema from '../../../../api/publishers/schema';
import './wizard.html';

Template.publisherInfo.helpers({
  getSchema: function() {
    return schema;
  }
})

// Template.onBoardWizard.helpers({
//   steps: function() {
//     return [{
//       id: 'information',
//       title: 'Information',
//       template: 'developer-info',
//       formId: 'developer-info-form',
//       schema: devSchema,
//       onSubmit: function(data, wizard) {
//         // submit logic
//       }
//     }]
//   }
// });

var hooksObject = {
  before: {
    method: function(doc) {
      console.log(doc);
      return doc;
    }
  },
  after: {
    method: function(error, result) {
      if(!error){
        FlowRouter.go('/publishers/dashboard');
      }
      console.log(error, result);
    }
  }
};

AutoForm.hooks({'publisher-info-form':hooksObject});