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
            
            // if(user && Roles.userIsInRole(user,['admin'], Roles.GLOBAL_GROUP)){
            //     Session.set('redirectAfterLogin','admin.dashboard');
            // }
            // else if(user && Roles.userIsInRole(user,['publisher'], Roles.GLOBAL_GROUP)){
            //     if(!user.profile.onboardComplete){
            //         Session.set('redirectAfterLogin','publisher.onboard');
            //     }else{
            //         Session.set('redirectAfterLogin', 'publisher.dashboard');
            //     }
            // }
            // else if(user && Roles.userIsInRole(user,['licensee'], Roles.GLOBAL_GROUP)){
            //     if(!user.profile.onboardComplete){
            //         Session.set('redirectAfterLogin','licensee.onboard');
            //     }else{
            //         Session.set('redirectAfterLogin', 'licensee.dashboard');
            //     }
            // }
        }
        if (state === "signUp") {
            // if(user && !user.profile.onboardComplete){
            //     if(Roles.userIsInRole(user,['publisher'], Roles.GLOBAL_GROUP)){
            //         Session.set('redirectAfterLogin','publisher.onboard');
            //     }else if(Roles.userIsInRole(user,['licensee'], Roles.GLOBAL_GROUP)){
            //         Session.set('redirectAfterLogin','licensee.onboard');
            //     }
            // }
        }
    }
}

const preSignUpHook = (password, info) => {
    console.log('preSignUpHook');
    info.signupType = Session.get('signupType');
}

const postSignUpHook = (userId, info) => {
    console.log('postSignUpHook');    
    if(Meteor.isServer) {
        Roles.addUsersToRoles(userId, info.signupType, Roles.GLOBAL_GROUP);
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
    
    hideSignUpLink: true,

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