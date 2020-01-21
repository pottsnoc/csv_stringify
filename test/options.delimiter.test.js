/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `delimiter`', () => {
  it('with default value', () => {
    stringify([['a', 'b'], ['c', 'd']], {}, (err, data) => {
      assert.equal(err, null);
      assert.equal(data, `a,b${eol}c,d${eol}`);
    });
  });
  it('with one character value', () => {
    stringify([['a', 'b'], ['c', 'd']], { delimiter: ';' }, (err, data) => {
      assert.equal(err, null);
      assert.equal(data, `a;b${eol}c;d${eol}`);
    });
  });
  it('with control character value', () => {
    stringify(
      [['a', 'b', 'c'], ['c', 'd', 'e'], ['e', 'f', 'g']],
      { delimiter: '\t' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a\tb\tc${eol}c\td\te${eol}e\tf\tg${eol}`);
      }
    );
  });
  it('with multiple character value', () => {
    stringify(
      [['a', 'b'], ['c', 'd'], ['e', 'f']],
      { delimiter: ':|:' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a:|:b${eol}c:|:d${eol}e:|:f${eol}`);
      }
    );
  });
  it('with empty value', () => {
    stringify(
      [[1, 2, 3, 4], [3, 4, 5, 6], ['e', 'f', 'g', 'h']],
      { delimiter: '' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `1234${eol}3456${eol}efgh${eol}`);
      }
    );
  });
  it('return error when not string', () => {
    stringify(
      [[1, 2, 3, 4], [3, 4, 5, 6], ['e', 'f', 'g', 'h']],
      { delimiter: 1 },
      err => {
        assert.equal(err.message,
          'Invalid option `delimiter`. Value must be a string');
      }
    );
  });
});
