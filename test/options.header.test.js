/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `header`', () => {
  it('output header when data is array of objects', () => {
    stringify(
      [{ a: 1, b: 2, c: 3 }, { a: 'val_a', b: 'val_b', c: 'val_c' }],
      { header: true }, (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'a,b,c\n1,2,3\nval_a,val_b,val_c\n');
      }
    );
  });
});
