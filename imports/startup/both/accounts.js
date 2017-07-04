import {Roles} from 'meteor/alanning:roles'; 
import {Session} from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';


const onLogoutHook = () =>{
    console.log('onLogoutHook');
}

const onSubmitHook = (error, state) =>{
    if (!error) {
        const user = Meteor.user();
        if (state === "signIn") {
            if(user && Roles.userIsInRole(user,['publisher']) && !user.profile.onboardComplete){
                Session.set('redirectAfterLogin','publisher.onboard');
            }
        }
        if (state === "signUp") {
            if(user && !user.profile.onboardComplete){
                Session.set('redirectAfterLogin','publisher.onboard');
            }
        }
    }
}

const preSignUpHook = (password, info) => {
    console.log('preSignUpHook');
}

const postSignUpHook = (userId, info) => {
    console.log('postSignUpHook');    
    if(Meteor.isServer) {
        Roles.addUsersToRoles(userId, 'publisher', Roles.GLOBAL_GROUP);
    }
}

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Hooks
    onLogoutHook: onLogoutHook,
    onSubmitHook: onSubmitHook,
    preSignUpHook: preSignUpHook,
    postSignUpHook: postSignUpHook,

});