import { Mongo } from 'meteor/mongo';

const Licensees = new Mongo.Collection('licensees');

Licensees.helpers({

});

export {Licensees};