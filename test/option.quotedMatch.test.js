/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `quotedMatch`', () => {
  it('works with string', () => {
    stringify(
      [['ebcf', 'cdef', 'cefd'], ['', undefined, ' ']],
      { quotedMatch: 'ef' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `ebcf,"cdef","cefd"${eol},, ${eol}`);
      });
  });
  it('works with regexp', () => {
    stringify(
      [['ebcf', 'cdef', 'cefd'], ['', undefined, ' ']],
      { quotedMatch: /^e|d$/ },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `"ebcf",cdef,"cefd"${eol},, ${eol}`);
      });
  });
  it('works with array', () => {
    stringify(
      [['123', '1', 'string'], [100, 1, 'input']],
      { quotedMatch: [/^\d$/, 'in'] },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `123,"1","string"${eol}100,1,"input"${eol}`);
      });
  });
});
