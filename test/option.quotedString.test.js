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
});
