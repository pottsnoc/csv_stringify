'use strict';

const defaultFormat = {
  boolean: value => (value ? '1' : '0'),
  number: value => value.toString(),
  date: value => value.getTime(),
  object: value => JSON.stringify(value)
};

class Stringifier {
  constructor({ delimiter = ',', format = {}, header, columns }) {
    this.delimiter = delimiter;
    this.format = { ...defaultFormat, ...format };
    this.header = header;
    this.columns = this._normalizeColumns(columns);
  }

  read(data) {
    return data.reduce((acc, cur, i) => acc + this._readRow(cur, i), '');
  }

  _readRow(row, index) {
    const isHeader = index === 0 && this.header;
    if (typeof row === 'object' && !Array.isArray(row)) {
      if (isHeader && !this.columns) {
        this.columns = this._normalizeColumns(row);
      }
      if (this.columns) {
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

  _normalizeColumns(columns) {
    if (!columns) return null;
    if (typeof columns !== 'object') {
      throw new Error('Option `columns` must be an array or an object');
    }
    if (Array.isArray(columns)) {
      columns.forEach(column => {
        if (typeof column !== 'string') {
          throw new Error('Invalid column. Column must be a string');
        }
      });
      return columns;
    }
    return Object.keys(columns);
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
  try {
    const stringifier = new Stringifier(options);
    const str = stringifier.read(records);
    cb(null, str);
  } catch (e) {
    cb(e);
  }
};

module.exports = stringify;
