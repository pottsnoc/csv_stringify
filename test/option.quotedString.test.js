/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `quotedString`', () => {
  it('escape quote character', () => {
    stringify(
      [['', 1, null, 'str'], [false, ' ', undefined, 'str']],
      { quotedString: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, '"",1,,"str"\n0," ",,"str"\n');
      });
  });
});
