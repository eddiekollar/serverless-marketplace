import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  let profile = options.profile || {};
  profile.onboardComplete = false;
  if(options.profile) {
    user.profile = profile;
  }
  return user;
});