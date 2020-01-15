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
  it('return error when data is not object and option `column` is not provided',
    () => {
      stringify([[1, 2], ['a', 'b']], { header: true }, err => {
        assert.equal(err.message, 'option `column` not provided');
      });
    }
  );
  it('output header when provided columns', () => {
    stringify(
      [['a', 'c', 'e'], [1, 3, 5]],
      { header: true, columns: ['c1', 'c2'] },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'c1,c2\na,c\n1,3\n');
      }
    );
  });
  it('should map the column property name to display name', () => {
    stringify(
      [
        { field1: 'val11', field2: 'val12', field3: 'val13' },
        { field1: 'val21', field2: 'val22', field3: 'val23' }
      ],
      { header: true, columns: { field1: 'column1', field3: 'column3' } },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'column1,column3\nval11,val13\nval21,val23\n');
      }
    );
  });
  it('and nested properties', () => {
    stringify(
      [
        { field1: { nested: 'val11' }, field2: 'val12', field3: 'val13' },
        { field1: {}, field2: 'val22', field3: 'val23' }
      ],
      {
        header: true,
        columns: { 'field1.nested': 'column1', field3: 'column3' }
      },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'column1,column3\nval11,val13\n,val23\n');
      }
    );
  });
});
