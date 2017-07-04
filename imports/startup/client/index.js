// Import client startup through a single index entry point

import './routes.js';


AccountsTemplates.addField({
  _id: 'terms',
  type: 'checkbox',
  template: "termsCheckbox",
  errStr: "You must agree to the Terms and Conditions",
  func: function(value) {
    return !value;
  },
  negativeValidation: false
});