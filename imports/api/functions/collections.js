import { Mongo } from 'meteor/mongo';
import s from 'underscore.string';

const Functions = new Mongo.Collection('functions');
const FunctionForks = new Mongo.Collection('functionforks');

Functions.helpers({
  formattedStatus: function() {
    return s.capitalize(this.status.replace('-', ' '), true);
  },
  timesForked: function() {
    return FunctionForks.find({functionId: this._id}).count();
  },
  isOwner: function() {
    return this.ownerId === Meteor.userId();
  }
});

FunctionForks.helpers({
  urlUsage: function(){
    const functionDoc = Functions.findOne({_id: this.functionId});
    const apiKeyParam = `api_key=${this.apiKey}`;
    let params = '';

    if(functionDoc.params){
      const paramArray = functionDoc.params.map(function(param){
        return `${param.key}=value&`;
      });

      params = paramArray.join();
    }

    return `${this.url}/?${params}${apiKeyParam}`;
  },
  isOwner: function() {
    return this.ownerId === Meteor.userId();
  }
});

export {Functions, FunctionForks};