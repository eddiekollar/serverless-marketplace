import './login.html';
import '../../components/terms/terms.html';

Template.auth.onCreated(function(){
  const data = Template.currentData();
  const state = data.state || 'signup'
  this.state = new ReactiveVar(state);
});

Template.auth.helpers({
  getState(){
    return Template.instance().state.get();
  }
})