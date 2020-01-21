/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `format`', () => {
  it('with default value', () => {
    const date = new Date();
    stringify(
      [['string', 1, { a: 1, b: '2', c: true }, date, true, false]],
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data,
          `string,1,"{""a"":1,""b"":""2"",""c"":true}",${date.getTime()},1,0${eol}`
        );
      }
    );
  });
  it('with custom value', () => {
    const date = new Date();
    stringify(
      [['string', 3, { a: 1, b: '2', c: true }, date, true, false]],
      {
        format: {
          string: value => value.toUpperCase(),
          number: (value, context) => (value * (context.column + 1)).toString(),
          boolean: value => value.toString(),
          date: value => `${value.getTime() + 100}`,
          object: value => JSON.stringify(Object.entries(value))
        }
      },
      (err, data) => {
        const dateStr = date.getTime() + 100;
        assert.equal(err, null);
        assert.equal(data,
          `STRING,6,"[[""a"",1],[""b"",""2""],[""c"",true]]",${dateStr},true,false${eol}`
        );
      }
    );
  });
  it('return error when formatter is not a function', () => {
    stringify(
      [['a', 'b'], [1, 3]],
      { format: { number: 10 } },
      err => {
        assert.equal(err.message, 'format[number] must be a function');
      }
    );
  });
  it('return error when formatter returns value is not string', () => {
    stringify(
      [['a', true], [1, 3]],
      { format: { boolean: () => 1 } },
      err => {
        assert.equal(err.message, 'format function must return string');
      }
    );
  });
});
