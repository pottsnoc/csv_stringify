/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `columns`', () => {
  it('return error when option `columns` is not object', () => {
    stringify([[1, 2], [3, 4]], { columns: true }, err => {
      assert.equal(
        err.message, 'Option `columns` must be an array or an object'
      );
    });
  });
  it('return error when column is not string', () => {
    stringify([[1, 2, 3], [4, 5, 6]], { columns: ['a', 1, 'b'] }, err => {
      assert.equal(
        err.message, 'Invalid column. Column must be a string'
      );
    });
  });
  describe('input is array of objects', () => {
    it('return only specified columns', () => {
      stringify(
        [{ a: 10, b: 20, c: 30 }, { a: 'ten', b: 'twenty', c: 'thirty' }],
        { columns: ['a', 'c'] },
        (err, data) => {
          assert.equal(err, null);
          assert.equal(data, '10,30\nten,thirty\n');
        }
      );
    });
  });
  // describe('input is array', () => {});
});
