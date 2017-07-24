import {FunctionZIPs} from '../../../api/functions/filesCollection';
import './download.html';

Template.download.onCreated(function(){
  const template = this;
  template.currentDoc = new ReactiveVar(false);
  template.autorun(() => {
    const data = Template.currentData();
    const id = data._id || '';

    this.subscribe('files.one', id, function(){
      const file = FunctionZIPs.findOne({_id: data.fileId});
      template.currentDoc.set(file);
    });
  })
});

Template.download.helpers({
  file(){
    return Template.instance().currentDoc.get();
  }
})