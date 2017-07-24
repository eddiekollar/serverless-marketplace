import {Session} from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import {functionSchema} from '../../../api/functions/schemas'; 
import { FunctionZIPs} from '../../../api/functions/filesCollection';
import './upload.html';

let formTemplate = undefined;

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
  formTemplate = this;
});

Template.uploadForm.helpers({
  getSchema(){
    return functionSchema;
  },
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  getProgressStyle() {
    return `width: ${Template.instance().currentUpload.get()}%;`
  }
});

Template.uploadForm.events({
  'click #cancel'(e, template){
    FlowRouter.go('/publisher/dashboard');
  },
  'click #new-function'(e, template) {
    console.log('new function');
    let error = false;
    const functionName = $('#funcName')[0].value;
    const functionHandler = $('#handler')[0].value;
    const functionDescr = $('#description')[0].value;

    if(functionName === '') {
      error = true;
    }
    if(functionHandler === ''){
      error = true;
    }
    if(functionDescr === ''){
      error = true;
    }
    const fileUpload = $('#fileInput')[0];
    if (!error && fileUpload.files && fileUpload.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const file = fileUpload.files[0];
      console.log(file);
      const upload = FunctionZIPs.insert({
        file: fileUpload.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          functionName,
          functionHandler,
          functionDescr,
        },
        onProgress: function(progress) {
          $('.progress-bar-striped')[0].style.width = `${progress}%`;
        }
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        template.currentUpload.set(false);
        Session.set('alertMessage', {class: 'alert-success', message: 'Your function has been submitted for review'});
        FlowRouter.go('/publisher/dashboard');
      });

      upload.start();
    }else{
      error = true;
    }
  }
});

var hooksObject = {
  before: {
    method: function(doc) {
      $('[id$=-group]').removeClass('has-error');
      const fileUpload = $('#fileInput')[0];
      if (fileUpload.files && fileUpload.files[0]) {
        return doc;
      }else{
        console.log('no files');
        return false;
      }
    }
  },
  after: {
    method: function(error, result) {
      if(!error && result){
        //   We upload only one file, in case
        // multiple files were selected
        const fileUpload = $('#fileInput')[0];
        const file = fileUpload.files[0];
        console.log(file);
        const upload = FunctionZIPs.insert({
          file: fileUpload.files[0],
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            functionId: result
          },
          onProgress: function(progress) {
            $('.progress-bar-striped')[0].style.width = `${progress}%`;
          }
        }, false);

        upload.on('start', function () {
          formTemplate.currentUpload.set(this);
        });

        upload.on('end', function (error, fileObj) {
          formTemplate.currentUpload.set(false);
          Session.set('alertMessage', {class: 'alert-success', message: 'Your function has been submitted for review'});
          FlowRouter.go('/publisher/dashboard');
        });

        upload.start();
      }
    }
  },
  onError: function(formType, error) {
    console.error('error', error);
    if(error && error.validationErrors){
      error.validationErrors.forEach(function(error) {
        $(`#${error.name}-group`).addClass('has-error');
      }, this);
    }
  },
};

AutoForm.hooks({'newFunction':hooksObject});