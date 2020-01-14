/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

describe('Option `columns`', () => {
  it('return error when option `columns` is not object', () => {
    stringify([[1, 2], [3, 4]], { columns: true }, err => {
      assert.equal(
        err.message, 'Option `columns` must be an array or an object'
      );
    });
  });
  it('return error when column is not string', () => {
    stringify([[1, 2, 3], [4, 5, 6]], { columns: ['a', 1, 'b'] }, err => {
      assert.equal(
        err.message, 'Invalid column. Column must be a string'
      );
    });
  });
  describe('input is array of objects', () => {
    it('return only specified columns', () => {
      stringify(
        [{ a: 10, b: 20, c: 30 }, { a: 'ten', b: 'twenty', c: 'thirty' }],
        { columns: ['a', 'c'] },
        (err, data) => {
          assert.equal(err, null);
          assert.equal(data, '10,30\nten,thirty\n');
        }
      );
    });
    it('keep column order', () => {
      stringify(
        [{ a: 10, b: 20, c: 30 }, { a: 'ten', b: 'twenty', c: 'thirty' }],
        { columns: ['c', 'a', 'b'] },
        (err, data) => {
          assert.equal(err, null);
          assert.equal(data, '30,10,20\nthirty,ten,twenty\n');
        }
      );
    });
    it('with nested object', () => {
      stringify(
        [
          { a: { a1: '1a1', a2: '1a2' }, b: '1b' },
          { a: { a1: '2a1', a2: '2a2', a3: '2a3' }, b: '2b' }
        ],
        { columns: ['b', 'a.a3', 'a.a2'] },
        (err, data) => {
          assert.equal(err, null);
          assert.equal(data, '1b,,1a2\n2b,2a3,2a2\n');
        }
      );
    });
    it('with nested array', () => {
      stringify(
        [
          { a: [{}, { a1: '1a1', a2: '1a2' }], b: '1b' },
          { a: [{}, { a1: '2a1', a2: '2a2' }], b: '2b' }
        ],
        { columns: ['b', 'a[1].a2'] },
        (err, data) => {
          assert.equal(err, null);
          assert.equal(data, '1b,1a2\n2b,2a2\n');
        }
      );
    });
    it('with wrong nested column',
      () => {
        stringify(
          [
            { a: undefined, b: '1b' },
            { a: null, b: '2b' },
            { a: false, b: '3b' }
          ],
          { columns: ['b', 'a[1].a2'] },
          (err, data) => {
            assert.equal(err, null);
            assert.equal(data, '1b,\n2b,\n3b,\n');
          }
        );
      }
    );
    it('correct works when field contains dot', () => {
      stringify([
        { 'foo.bar': '1' },
        { 'foo.bar': '2' }
      ], { header: true }, (err, data) => {
        assert.equal(data, 'foo.bar\n1\n2\n');
      });
    });
  });
  describe('input is array of arrays', () => {
    it('return first `n` elements from each row, where `n` is amount columns',
      () => {
        stringify(
          [
            [1, 2, 3, 4],
            ['a', 'b', 'c', 'd', 'e'],
            [{ a: 2 }, true, false]
          ],
          { columns: ['a', 'b'] },
          (err, data) => {
            assert.equal(err, null);
            assert.equal(data, '1,2\na,b\n{"a":2},1\n');
          }
        );
      }
    );
  });
});
