/* eslint-disable no-undef */
'use strict';

const assert = require('assert'),
  stringify = require('../index');

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
        assert.equal(data, 'a|3.4|"A|1"\nb|6.8|"B|2"\n');
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
        assert.equal(data, 'a,3.4,""A6""\nb,""",B\n');
      }
    );
  });
  it('quoted when field contains line break', () => {
    stringify(
      [
        ['a', 3.4, 'A\na'],
        ['b', '\n', 'Bb']
      ],
      (err, data) => {
        assert.equal(err, null);
        assert.equal(data, 'a,3.4,"A\na"\nb,"\n",Bb\n');
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
        assert.equal(data, 'a,3.4,"Aa"\nb,",Bb\n');
      }
    );
  });
});
