/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `quotedString`', () => {
  it('escape quote character', () => {
    stringify(
      [['', 1, null, 'str'], [false, ' ', undefined, 'str']],
      { quotedString: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `"",1,,"str"${eol}0," ",,"str"${eol}`);
      });
  });
  it('return error when not boolean', () => {
    stringify([[1, 2], ['a', 'b']], { quotedString: 1 }, err => {
      assert.equal(err.message,
        'Invalid option `quotedString`. Value must be a boolean');
    });
  });
});
