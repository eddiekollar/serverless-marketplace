import {Functions, FunctionForks} from './collections';
import {FunctionZIPs} from './filesCollection';
import {AWSconfig, deployLambda} from '../utils/aws';

let ROOT_URL = '';

if(process.env && process.env.ROOT_URL){
  ROOT_URL = process.env.ROOT_URL;
}else{
  ROOT_URL = 'http://localhost:3000/'
}

FunctionForks.before.insert(function(userId, doc){
  // const user = Meteor.users.findOne({_id: userId});
  // const parent = Function.findOne({_id: doc.functionId});
  // doc.name = parent.name;
});

FunctionForks.after.insert(function(userId, doc){
  
});

const completeFunctionForking = function(forkId, functionId){
  const functionDoc = Functions.findOne({_id: functionId});
  const file = FunctionZIPs.findOne({_id: functionDoc.fileId});
  const s3Key = file.versions.original.meta.pipePath;

  const functionName = `${functionDoc.name}-${forkId}`;
  const url = `${ROOT_URL}api/functions/${functionName}`;

  let runTime = "nodejs6.10";
  if(functionDoc.language === 'javascript'){
    runtTime = "nodejs6.10";
  }else{ //add Python
    runtTime = "nodejs6.10";
  }

  const info = {
    FunctionName: functionName,
    Handler: functionDoc.handler,
    Bucket: AWSconfig.s3.bucket,
    S3Key: s3Key,
    RunTime: runTime
  };

  return deployLambda(info).then(function(arn){
    return FunctionForks.update({_id: forkId}, 
    {
      $set: {
        name: functionName,
        ARN: arn,
        url: url
      }
    });
  }).then(function(result){
    return forkId;
  });
};

export {completeFunctionForking};