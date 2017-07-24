// Tests for the links publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'meteor/practicalmeteor:chai';
import { Developers } from '../developers.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

// describe('profiles publications', function () {
//   beforeEach(function () {
//     Profiles.remove({});
//     Profiles.insert({

//     });
//   });

//   describe('profiles.all', function () {
//     it('sends all profiles', function (done) {
//       const collector = new PublicationCollector();
//       collector.collect('profiles.all', (collections) => {
//         assert.equal(collections.profiles.length, 1);
//         done();
//       });
//     });
//   });
// });
