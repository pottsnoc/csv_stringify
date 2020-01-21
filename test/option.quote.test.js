/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index'),
  eol = require('os').EOL;

describe('Option `quote`', () => {
  it('quoted when field contains delimiter', () => {
    stringify(
      [
        ['a', 3.4, 'A|1'],
        ['b', 6.8, 'B|2']
      ],
      { delimiter: '|' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a|3.4|"A|1"${eol}b|6.8|"B|2"${eol}`);
      }
    );
  });
  it('quoted when field contains quote, quote should be escaped', () => {
    stringify(
      [
        ['a', 3.4, '"A6"'],
        ['b', '"', 'B']
      ],
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a,3.4,"""A6"""${eol}b,"""",B${eol}`);
      }
    );
  });
  it('quoted when field contains line break', () => {
    stringify(
      [
        ['a', 3.4, `A${eol}a`],
        ['b', `${eol}`, 'Bb']
      ],
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a,3.4,"A${eol}a"${eol}b,"${eol}",Bb${eol}`);
      }
    );
  });
  it('does nothing when option is empty', () => {
    stringify(
      [
        ['a', 3.4, '"Aa"'],
        ['b', '"', 'Bb']
      ],
      { quote: '' },
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, `a,3.4,""Aa""${eol}b,"",Bb${eol}`);
      }
    );
  });
});
