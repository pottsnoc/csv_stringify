'use strict';

const defaultFormat = {
  boolean: value => (value ? '1' : '0'),
  number: value => value.toString(),
  date: value => value.getTime(),
  object: value => JSON.stringify(value)
};

class Stringifier {
  constructor({ delimiter = ',', format = {}, header }) {
    this.delimiter = delimiter;
    this.format = { ...defaultFormat, ...format };
    this.header = header;
  }
  read(data) {
    return data.reduce((acc, cur, i) => acc + this._readRow(cur, i), '');
  }
  _readRow(row, index) {
    const isHeader = index === 0 && this.header;
    if (typeof row === 'object' && !Array.isArray(row)) {
      if (isHeader) {
        this.columns = Object.keys(row);
      }
      if (this.columns && this.header) {
        row = this.columns.reduce((acc, key) => {
          acc.push(row[key]);
          return acc;
        }, []);
      }
      row = Object.values(row);
    }
    if (Array.isArray(row)) {
      const str = row
        .map((value, i) =>
          this._format(value, { column: i, row: index, isHeader }))
        .join(this.delimiter);
      return isHeader ? `${this._printHeader()}${str}\n` : `${str}\n`;
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

  _printHeader() {
    if (!this.columns) {
      throw new Error('option `column` not provided');
    }
    return this.columns.join(this.delimiter) + '\n';
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
