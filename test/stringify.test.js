/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('stringify', () => {
  it('should return string from array of arrays', () => {
    stringify([['1', '2'], ['3', '4']], (err, data) => {
      assert.equal(err, null);
      assert.equal(data, '1,2\n3,4\n');
    });
  });
  it('should return string from array of objects', () => {
    stringify([{ a: 10, c: true }, { b: 20, d: 'string' }], (err, data) => {
      assert.equal(err, null);
      assert.equal(data, '10,1\n20,string\n');
    });
  });
  it('should return error when record is not array', () => {
    stringify({ a: 10 }, err => {
      assert.equal(err.message, 'Invalid records: records must be array');
    });
  });
});
