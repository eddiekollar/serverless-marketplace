import {invokeLambda} from './aws';

const sendFunctionReviewEmail = function(functionDoc, data){
  const sender = Meteor.user();
  const owner = Meteor.users.findOne({_id: functionDoc.ownerId});

  let params = {
    from: sender.email(),
    to: owner.email(),
    subject: '',
    text: ''
  }
  
  if(data.type === 'approve') {
    params.subject = "[Serverless Marketplace]Your function was approved";
    params.text = "Congratulations, your function has been published to the marketplace";
  }else{
    params.subject = "[Serverless Marketplace]Your function was rejected";
    params.text = "Your function was rejected for the following reason: " + data.reason;
  }

  return invokeLambda('market-services-dev-sendEmail', params).catch(function(err){
    console.error(err);
  });
}

export {sendFunctionReviewEmail};
