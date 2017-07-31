import { Mongo } from 'meteor/mongo';
import s from 'underscore.string';
import momment from 'moment';

const Functions = new Mongo.Collection('functions');
const FunctionForks = new Mongo.Collection('functionforks');
const UsageStats = new Mongo.Collection('usagestats');

Functions.helpers({
  formattedStatus: function() {
    return s.capitalize(this.status.replace('-', ' '), true);
  },
  timesForked: function() {
    return FunctionForks.find({functionId: this._id}).count();
  },
  isOwner: function() {
    return this.ownerId === Meteor.userId();
  },
  timesCalled: function(durationType) {
    let timesCalled = 0;
    let arns = [];

    FunctionForks.find({functionId: this._id}).forEach(function(fork){
      arns.push(fork.ARN);
    });

    if(durationType === 'today'){
      const today = momment(Date.now()).startOf('day');
      UsageStats.find({$and: [{source: 'APP'}, {ResourceId: {$in: arns}}, {UsageStartDate: {$gte: today.toDate()}}]}).forEach(function(stat){
        timesCalled += parseInt(stat.UsageQuantity);
      });
    }else{ //all time
      UsageStats.find({$and: [{ResourceId: {$in: arns}}, {source: 'APP'}]}).forEach(function(stat){
        timesCalled += parseInt(stat.UsageQuantity);
      });
    }
    return timesCalled;
  },
  earnings: function(durationType) {
    let earnings = 0;
    let arns = [];

    FunctionForks.find({functionId: this._id}).forEach(function(fork){
      arns.push(fork.ARN);
    });
    
    if(durationType === 'today'){
      const today = momment(Date.now()).startOf('day');
      const cond = {$and: [{source: 'AWS'}, {ResourceId: {$in: arns}}, {UsageStartDate: {$gte: today.toDate()}}]};
      UsageStats.find(cond).forEach(function(stat){
        earnings += parseFloat(stat.Cost);
      });
    }else{ //all time
      UsageStats.find({$and: [{ResourceId: this.ARN}, {source: 'AWS'}]}).forEach(function(stat){
        earnings += parseFloat(stat.Cost);
      });
    }

    return earnings.toFixed(2);
  }
});

FunctionForks.helpers({
  description: function() {
    const functionDoc = Functions.findOne({_id: this.functionId});

    return functionDoc.description;
  },
  urlUsage: function(){
    const functionDoc = Functions.findOne({_id: this.functionId});
    const apiKeyParam = `api_key=${this.apiKey}`;
    let params = '';

    if(functionDoc.params){
      const paramArray = functionDoc.params.map(function(param){
        return `${param.key}=value&`;
      });

      params = paramArray.join('');
    }

    return `${this.url}/?${params}${apiKeyParam}`;
  },
  isOwner: function() {
    return this.ownerId === Meteor.userId();
  },
  timesCalled: function(durationType) {
    let timesCalled = 0;
    if(durationType === 'today'){
      const today = momment(Date.now()).startOf('day');
      UsageStats.find({$and: [{source: 'APP'}, {ResourceId: this.ARN}, {UsageStartDate: {$gte: today.toDate()}}]}).forEach(function(stat){
        timesCalled += parseInt(stat.UsageQuantity);
      });
    }else{ //all time
      UsageStats.find({$and: [{ResourceId: this.ARN}, {source: 'APP'}]}).forEach(function(stat){
        timesCalled += parseInt(stat.UsageQuantity);
      })
    }
    return timesCalled;
  },
  cost: function(durationType) {
    let cost = 0;

    if(durationType === 'today'){
      const today = momment(Date.now()).startOf('day');
      UsageStats.find({$and: [{source: 'AWS'}, {ResourceId: this.ARN}, {UsageStartDate: {$gte: today.toDate()}}]}).forEach(function(stat){
        cost += parseFloat(stat.Cost);
      });
    }else{ //all time
      UsageStats.find({$and: [{ResourceId: this.ARN}, {source: 'AWS'}]}).forEach(function(stat){
        cost += parseFloat(stat.Cost);
      })
    }

    return cost.toFixed(2);
  }
});

export {Functions, FunctionForks, UsageStats};