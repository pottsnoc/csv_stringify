/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `quotedEmpty`', () => {
  it('should quotes empty fields', () => {
    stringify(
      [{ a: undefined, b: ' ', c: '' }, ['str', null, false, 0]],
      { quotedEmpty: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, '"", ,""\nstr,"",0,0\n');
      }
    );
  });
  it('should not quotes empty fields', () => {
    stringify(
      [{ a: undefined, b: ' ', c: '' }, ['str', null, false]],
      { quotedEmpty: false, quotedString: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, '," ",\n"str",,0\n');
      }
    );
  });
});
