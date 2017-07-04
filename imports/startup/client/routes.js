import {Session} from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/login/login.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/terms/terms.js';
import '../../ui/pages/publishers/onboard.js'
import '../../ui/pages/publishers/dashboard.js'
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

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('App_body', { main: 'login' });
  },
  triggersExit:[function(context, redirect) {
    
  }]
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
        if (route.route.name !== 'login') {
          Session.set('redirectAfterLogin', route.path);
        }
        return FlowRouter.go('login');
      }
    }
  ]
});

const publishers = loggedIn.group({
  prefix: "/publisher",
  triggersEnter: [
    function() {
      //check 
      if (!Roles.userIsInRole(Meteor.user(), ['publisher'])) {
        return FlowRouter.go(FlowRouter.path('home'));;
      }
    }
  ]
});

publishers.route('/dashboard',{
  name: 'publisher.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'publisherDashboard' });
  }
})

publishers.route('/onboard', {
  name: 'publisher.onboard',
  action() {
    BlazeLayout.render('App_body', { main: 'developerOnboard' });
  },
})

loggedIn.route('/logout', {
  name: 'logout',
  action() {
    return Meteor.logout(function() {
      return FlowRouter.go(FlowRouter.path('login'));
    });
  }
});