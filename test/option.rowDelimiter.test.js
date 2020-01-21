/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `rowDelimiter`', () => {
  it('works with custom element', () => {
    stringify(
      [['a', 'b', 'c'], { a: 1, b: 2, c: 3 }],
      { rowDelimiter: '||' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'a,b,c||1,2,3||');
      }
    );
  });
  it('works with predefined element', () => {
    stringify(
      [['a', 1.8, 'c'], { a: true, b: 2, c: 3 }],
      { rowDelimiter: 'unicode' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'a,1.8,c\u20281,2,3\u2028');
      }
    );
  });
});
