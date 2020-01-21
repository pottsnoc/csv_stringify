/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `escape`', () => {
  it('escape quote character', () => {
    stringify(
      [
        ['a', '"'],
        [1, '1"3']
      ],
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a,""""${eol}1,"1""3"${eol}`);
      }
    );
  });
  it('escape escape character', () => {
    stringify(
      [
        ['a', '\\"'],
        ['\\b', '1\\3']
      ],
      { escape: '\\' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a,"\\\\\\""${eol}\\\\b,1\\\\3${eol}`);
      }
    );
  });
  it('escape escape character', () => {
    stringify(
      [
        ['a', '"'],
        ['"word"', 13]
      ],
      { quote: '' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a,""${eol}""word"",13${eol}`);
      }
    );
  });
});
