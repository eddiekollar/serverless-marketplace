import S3 from 'aws-sdk/clients/s3'; // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
import Lambda from 'aws-sdk/clients/lambda';
import fs from 'fs';              

let AWSconfig = {};
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  AWSconfig = process.env.AWS;
  if((typeof AWSconfig) === 'string'){
    AWSconfig = JSON.parse(AWSconfig);
  }
}else if(process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
  AWSconfig = Meteor.settings.public.AWS;
}

const bound  = Meteor.bindEnvironment((callback) => {
  return callback();
});

let config = {
  secretAccessKey: AWSconfig.secret,
  accessKeyId: AWSconfig.key,
  region: AWSconfig.region,
  httpOptions: {
    timeout: 600000,
    agent: false
  }
};

const s3 = new S3(config);
const lambda = new Lambda(config);

const deployLambda = function(lambdaInfo) {
  const payload = {
    RunTime: lambdaInfo.RunTime,
    RoleName: AWSconfig.role_name,
    FunctionName: lambdaInfo.FunctionName,
    Handler: lambdaInfo.Handler,
    Bucket: AWSconfig.s3.bucket,
    S3Key: lambdaInfo.S3Key
  };

  const args = {
    FunctionName : 'market-services-dev-deployFunction',
    InvocationType: "RequestResponse", 
    Payload: JSON.stringify(payload)
  };

  return lambda.invoke(args).promise().then(function(lambdaData){
    const payload = JSON.parse(lambdaData.Payload);
    if(payload.success) {
      return payload.data.FunctionArn;
    }else{
      return '';
    }
  });
}

const invokeLambda = function(functionName, params) {
  const args = {
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(params)
  }

  return lambda.invoke(args).promise().then(function(lambdaData){
    const payload = JSON.parse(lambdaData.Payload);
    return payload;
  });
}

const callFunction = function(functionFork, params) {
  delete params.api_key;

  const args = {
    FunctionName: functionFork.name,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(params)
  }

  return lambda.invoke(args).promise().then(function(lambdaData){
    const payload = JSON.parse(lambdaData.Payload);
    return payload;
  });
}

export {AWSconfig, deployLambda, callFunction, invokeLambda};