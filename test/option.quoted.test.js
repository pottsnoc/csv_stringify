/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `quoted`', () => {
  it('quoted all field when true', () => {
    stringify(
      [
        ['a', 3.4, 'A"1'],
        ['b', 6.8, 'B2']
      ],
      { quoted: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `"a","3.4","A""1"${eol}"b","6.8","B2"${eol}`);
      }
    );
  });
  it('does nothing when false', () => {
    stringify(
      [
        ['a', 3.4, 'A"1'],
        ['b', 6.8, 'B2']
      ],
      { quoted: false },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a,3.4,"A""1"${eol}b,6.8,B2${eol}`);
      }
    );
  });
});
