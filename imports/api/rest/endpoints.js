import {Restivus} from 'meteor/nimble:restivus';
import {FunctionForks} from '../functions/collections';
import {AWSconfig, deployLambda} from '../utils/aws';

const Api = new Restivus({
    prettyJson: true
  });


Api.addRoute('functions/:name', {
  get: function () {

    const name = this.urlParams.name;
    const api_key = this.queryParams.api_key;

    const functionCall = FunctionForks.findOne({name: name});

    if(functionCall){
      if(functionCall.apiKey === api_key){

        return {
          statusCode: 200,
          body: {
            status: 'success',
            message: 'awesome!'
          }
        };
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