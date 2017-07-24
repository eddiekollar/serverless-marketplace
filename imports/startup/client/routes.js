import {Session} from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import {Roles} from 'meteor/alanning:roles'; 

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/login/login.js';
import '../../ui/pages/signup/signup.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/terms/terms.js';
import '../../ui/pages/admin/dashboard.js';
import '../../ui/pages/publishers/onboard.js';
import '../../ui/pages/publishers/dashboard.js';
import '../../ui/pages/publishers/submission.js';
import '../../ui/pages/licensees/onboard.js';
import '../../ui/pages/licensees/dashboard.js';
import '../../ui/pages/functions/function.js';
import '../../ui/pages/functions/fork.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [function(context, redirect) {
    const path = Session.get('redirectAfterLogin');
    if(path) {
      Session.set('redirectAfterLogin', null);
      redirect(path);
    }
  }],
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/terms-of-use', {
  name: 'terms',
  action() {
    BlazeLayout.render('App_body', { main: 'terms' });
  },
});

FlowRouter.route('/signin', {
  name: 'login',
  action() {
    BlazeLayout.render('App_body', { main: 'login' });
  }
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};


const loggedIn = FlowRouter.group({
  triggersEnter: [
    function() {
      var route;
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        route = FlowRouter.current();
        if(route.route.name === 'publisher.signup' || route.route.name === 'licensee.signup'){

        }else{
          if (route.route.name !== 'login') {
            console.log(route);
            Session.set('redirectAfterLogin', route.path);
          }else{
            console.log(route);
          }
          return FlowRouter.go('login');
        }
      }
    }
  ]
});

const admin = loggedIn.group({
  prefix: '/admin',
  triggersEnter: [
    function() {
      //check 
      // if (!Roles.userIsInRole(Meteor.user(), ['admin'], Roles.GLOBAL_GROUP)) {
      //   return FlowRouter.go(FlowRouter.path('home'));;
      // }
    }
  ]
});

admin.route('/dashboard',{
  name: 'admin.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'adminDashboard' });
  }
});

const licensees = loggedIn.group({
  prefix: '/licensee',
  triggersEnter: [
    function() {
      //check 
      // if (!Roles.userIsInRole(Meteor.user(), ['licensees'], Roles.GLOBAL_GROUP)) {
      //   return FlowRouter.go(FlowRouter.path('home'));;
      // }
    }
  ]
});

licensees.route('/dashboard',{
  name: 'licensee.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'licenseeDashboard' });
  }
});

licensees.route('/signup',{
  name: 'licensee.signup',
  action() {
    Session.set('signupType', 'licensee');
    BlazeLayout.render('App_body', { main: 'signup' });
  }
});

FlowRouter.route('/functions/:id', {
  name: 'function',
  action(params) {
    BlazeLayout.render('App_body', { main: 'function', params: params });
  },
  triggersEnter: [
    function() {
    }
  ]
});

licensees.route('/functions/:id',{
  name: 'licensee.fork',
  action(params) {
    BlazeLayout.render('App_body', { main: 'fork', params });
  }
});

licensees.route('/onboard', {
  name: 'licensee.onboard',
  action() {
    BlazeLayout.render('App_body', { main: 'licenseeOnboard' });
  },
  triggersEnter: [
    function() {
      const user = Meteor.user();
      console.log(user);
    }
  ]
});

const publishers = loggedIn.group({
  prefix: "/publisher",
  triggersEnter: [
    function() {
      
    }
  ]
});

publishers.route('/signup',{
  name: 'publisher.signup',
  action() {
    Session.set('signupType', 'publisher');
    BlazeLayout.render('App_body', { main: 'signup' });
  }
});

publishers.route('/dashboard',{
  name: 'publisher.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'publisherDashboard' });
  }
});

publishers.route('/onboard', {
  name: 'publisher.onboard',
  action() {
    BlazeLayout.render('App_body', { main: 'publisherOnboard' });
  },
});

publishers.route('/function/new',{
  name: 'publisher.submission',
  action() {
    BlazeLayout.render('App_body', { main: 'submission' });
  }
});

loggedIn.route('/logout', {
  name: 'logout',
  action() {
    return Meteor.logout(function() {
      return FlowRouter.go(FlowRouter.path('login'));
    });
  }
});