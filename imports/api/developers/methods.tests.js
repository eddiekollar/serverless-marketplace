// Tests for links methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Developers } from './developers';
import './methods.js';

if (Meteor.isServer) {
  // describe('developers methods', function () {
  //   beforeEach(function () {
  //     Developers.remove({});
  //   });

  //   it('can add a new developer profiles', function () {
  //     const addDev = Meteor.server.method_handlers['developers.insert'];

  //     addDev.apply({}, []);

  //     assert.equal(Developers.find().count(), 1);
  //   });
  // });
}
