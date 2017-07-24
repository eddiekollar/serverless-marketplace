import { FlowRouter } from 'meteor/kadira:flow-router';
import {wrapper as recurlyWrapper} from '../../../api/vendors/recurly-wrapper';
import './onboard.html';

Template.licenseeOnboard.onCreated(function(){
  
});

Template.licenseeOnboard.onRendered(function(){
  const self = this;
  recurlyWrapper(recurly => {
    recurly.configure({
      publicKey: 'ewr1-nbn0WVwxEBVHj5tL8AM9V1',
      fields: {
        all: {
          style: {
            fontFamily: 'Droid Sans',
            fontSize: '14px',
            fontColor: 'green',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            fontStyle: 'italic',
            lineHeight: '1em',
            placeholder: {
              color: 'gray !important',
              fontWeight: 'bold'
            }
          }
        },
        number: {
          selector: '#recurly-number',
          style: {
            height: '20px',
            fontColor: '#000000',
            placeholder: {
              content: 'Credit Card Number'
            }
          }
        },
        month: {
          selector: '#recurly-month',
          style: {
            height: '20px',
            fontColor: 'rgba(20, 200, 10, 0.5)',
            placeholder: {
              content: 'Month (mm)'
            }
          }
        },
        year: {
          selector: '#recurly-year',
          style: {
            height: '20px',
            placeholder: {
              content: 'Year (yy)'
            }
          }
        },
        cvv: {
          selector: '#recurly-cvv',
          style: {
            fontSize: '12px',
            height: '20px',
            placeholder: {
              content: 'Security Code',
              color: 'red !important'
            }
          }
        }
      }
    });
    self.recurly = recurly;
  });

  $('form').on('submit', function (event) {
    var form = this;
    event.preventDefault();
    
    let error = false;
    let userInfo = {};
    const fieldNames = ['firstName', 'lastName'];

    _.each(fieldNames, function(name){
      const fieldValue = $(`#${name}`).val();
      if(fieldValue !== '') {
        userInfo[name] = fieldValue;
      }else{
        error = true;
      }
    })

    if(!error){
      self.recurly.token(form, function (err, token) {
        if (err) {
          // handle error using err.code and err.fields
              console.log(err);
        } else {
          // recurly.js has filled in the 'token' field, so now we can submit the
          // form to your server; alternatively, you can access token.id and do
          // any processing you wish
          userInfo.token = token;
          console.log(userInfo);
          Meteor.call('licensee.subscribe', userInfo, function(err, result){
            console.log(err, result);
            if(!err){
              FlowRouter.go('/licensee/dashboard');
            }
          })
        }
      });
    }
  });

  // _.each($('.recurly-hosted-field'), function(field) { field.style.height = '20px';})
})

Template.licenseeOnboard.events({

});