/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `eof`', () => {
  it('print line break when true', () => {
    stringify(
      [[1, 2, 3], ['a', 'b', 'c']],
      { eof: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, '1,2,3\na,b,c\n');
      }
    );
  });
  it('does not print line break when false', () => {
    stringify(
      [[1, 2, 3], ['a', 'b', 'c']],
      { eof: false },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, '1,2,3\na,b,c');
      }
    );
  });
});
