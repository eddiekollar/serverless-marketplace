import {Restivus} from 'meteor/lepozepo:restivus';
import {FunctionForks, UsageStats} from '../functions/collections';
import {AWSconfig, deployLambda, callFunction} from '../utils/aws';

const Api = new Restivus({
    prettyJson: true
  });


Api.addRoute('functions/:name', {
  get: function () {

    const name = this.urlParams.name;
    const api_key = this.queryParams.api_key;

    const functionFork = FunctionForks.findOne({name: name});

    if(functionFork){
      if(functionFork.apiKey === api_key){
        console.log('calling ', functionFork.name);
        return callFunction(functionFork, this.queryParams).then(function(data){
          UsageStats.insert({
            UsageType: "Request",
            Operation: "Invoke",
            UsageQuantity: 1,
            ResourceId: functionFork.ARN,
            source: 'APP',
            forkId: functionFork._id
          });
          return {
            statusCode: 200,
            body: data
          }
        }).catch(function(error){
          return {
            statusCode: 500,
            body: error
          }
        });
      }else{
        return {
          status: 401,
          body: {
            status: 'fail',
            message: 'invalid api key'
          }
        }
      }
    }else{
      return {
        statusCode: 404,
        body: {
          status: 'fail',
          message: 'function not found!'
        }
      };
    }

    
  }
});

export {Api};