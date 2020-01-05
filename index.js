'use strict';

const defaultFormat = {
  boolean: value => (value ? '1' : '0'),
  number: value => value.toString(),
  date: value => value.getTime(),
  object: value => JSON.stringify(value)
};

class Stringifier {
  constructor({ delimiter = ',', format = {} }) {
    this.delimiter = delimiter;
    this.format = { ...defaultFormat, ...format };
  }
  read(data) {
    return data.reduce((acc, cur, i) => acc + this._readRow(cur, i), '');
  }
  _readRow(row, index) {
    if (typeof row === 'object' && !Array.isArray(row)) {
      row = Object.values(row);
    }
    if (Array.isArray(row)) {
      const str = row
        .map((value, i) => this._format(value, { column: i, row: index }))
        .join(this.delimiter);
      return str + '\n';
    }
  }
  _format(value, context) {
    let type = typeof value;
    if (value instanceof Date) {
      type = 'date';
    }
    const handler = this.format[type];
    if (handler && !(typeof handler === 'function')) {
      throw new Error(`format[${type}] must be a function`);
    }
    return handler ? handler(value, context) : value;
  }
}

const stringify = (records, options, cb) => {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  if (!Array.isArray(records)) {
    return cb(new Error('Invalid records: records must be array'));
  }
  const stringifier = new Stringifier(options);
  try {
    const str = stringifier.read(records);
    cb(null, str);
  } catch (e) {
    cb(e);
  }
};

module.exports = stringify;
