/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `delimiter`', () => {
  it('with default value', () => {
    stringify([['a', 'b'], ['c', 'd']], {}, (err, data) => {
      assert.equal(err, null);
      assert.equal(data, 'a,b\nc,d\n');
    });
  });
  it('with one character value', () => {
    stringify([['a', 'b'], ['c', 'd']], { delimiter: ';' }, (err, data) => {
      assert.equal(err, null);
      assert.equal(data, 'a;b\nc;d\n');
    });
  });
  it('with control character value', () => {
    stringify(
      [['a', 'b', 'c'], ['c', 'd', 'e'], ['e', 'f', 'g']],
      { delimiter: '\t' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'a\tb\tc\nc\td\te\ne\tf\tg\n');
      }
    );
  });
  it('with multiple character value', () => {
    stringify(
      [['a', 'b'], ['c', 'd'], ['e', 'f']],
      { delimiter: ':|:' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'a:|:b\nc:|:d\ne:|:f\n');
      }
    );
  });
  it('with empty value', () => {
    stringify(
      [[1, 2, 3, 4], [3, 4, 5, 6], ['e', 'f', 'g', 'h']],
      { delimiter: '' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, '1234\n3456\nefgh\n');
      }
    );
  });
});
