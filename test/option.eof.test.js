/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `eof`', () => {
  it('print line break when true', () => {
    stringify(
      [[1, 2, 3], ['a', 'b', 'c']],
      { eof: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `1,2,3${eol}a,b,c${eol}`);
      }
    );
  });
  it('does not print line break when false', () => {
    stringify(
      [[1, 2, 3], ['a', 'b', 'c']],
      { eof: false },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `1,2,3${eol}a,b,c`);
      }
    );
  });
  it('return error when not boolean', () => {
    stringify([[1, 2], ['a', 'b']], { eof: 1 }, err => {
      assert.equal(err.message,
        'Invalid option `eof`. Value must be a boolean');
    });
  });
});
