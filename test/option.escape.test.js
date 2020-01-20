/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `escape`', () => {
  it('escape quote character', () => {
    stringify(
      [
        ['a', '"'],
        [1, '1"3']
      ],
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'a,""""\n1,"1""3"\n');
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
        assert.equal(data, 'a,"\\\\\\""\n\\\\b,1\\\\3\n');
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
        assert.equal(data, 'a,""\n""word"",13\n');
      }
    );
  });
});
