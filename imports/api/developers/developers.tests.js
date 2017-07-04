// Tests for the behavior of the links collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Developers } from './developers';

if (Meteor.isServer) {
  // describe('developers collection', function () {
  //   it('insert correctly', function () {
  //     const profileId = Developers.insert({
  //     });
  //     const added = Developers.find({ _id: profileId });
  //     const collectionName = added._getCollectionName();
  //     const count = added.count();

  //     assert.equal(collectionName, 'developers');
  //     assert.equal(count, 1);
  //   });
  // });
}
