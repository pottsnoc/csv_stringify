/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `quotedEmpty`', () => {
  it('should quotes empty fields', () => {
    stringify(
      [{ a: undefined, b: ' ', c: '' }, ['str', null, false, 0]],
      { quotedEmpty: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `"", ,""${eol}str,"",0,0${eol}`);
      }
    );
  });
  it('should not quotes empty fields', () => {
    stringify(
      [{ a: undefined, b: ' ', c: '' }, ['str', null, false]],
      { quotedEmpty: false, quotedString: true },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `," ",${eol}"str",,0${eol}`);
      }
    );
  });
});
