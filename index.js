'use strict';

const defaultFormat = {
  boolean: value => (value ? '1' : '0'),
  number: value => value.toString(),
  date: value => value.getTime(),
  object: value => JSON.stringify(value)
};

const getField = (path, obj) => {
  if (!obj) {
    return null;
  }
  if (!Array.isArray(path)) {
    return obj[path];
  }
  const [key, ...remainPath] = path;
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return remainPath.length > 0 ? getField(remainPath, obj[key]) : obj[key];
  }
};

class Stringifier {
  constructor({ delimiter = ',', format = {}, header, columns }) {
    this.delimiter = delimiter;
    this.format = { ...defaultFormat, ...format };
    this.header = header;
    this.columns = this._normalizeColumns(columns);
  }

  read(data) {
    return data.reduce((acc, cur, i) => {
      const needHeader = i === 0 && this.header;
      let str;
      if (Array.isArray(cur)) {
        str = this._getStringFromArray(cur, i);
      } else if (typeof cur === 'object') {
        if (needHeader && !this.columns) {
          this.columns = this._normalizeColumns(cur);
        }
        str = this._getStringFromObject(cur, i);
      }
      return needHeader ? `${this._printHeader()}${str}` : `${acc}${str}`;
    }, '');
  }

  _getStringFromObject(obj, index) {
    let row = [];
    if (this.columns) {
      for (const column of this.columns) {
        const res = getField(column.path, obj);
        row.push([column, res]);
      }
    } else {
      row = Object.entries(obj);
    }
    const str = row
      .map(([key, value]) =>
        this._format(value, { column: key, row: index, isHeader: false }))
      .join(this.delimiter);
    return `${str}\n`;
  }

  _getStringFromArray(arr, index) {
    const str = arr
      .map((value, i) =>
        this._format(value, { column: i, row: index, isHeader: false }))
      .join(this.delimiter);
    return `${str}\n`;
  }

  _format(value, context) {
    if (value === null) {
      return null;
    }
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
    return this.columns.map(column => column.name).join(this.delimiter) + '\n';
  }

  _normalizeColumns(columns) {
    if (!columns) return null;
    if (typeof columns !== 'object') {
      throw new Error('Option `columns` must be an array or an object');
    }
    if (Array.isArray(columns)) {
      return columns.map(column => {
        if (typeof column !== 'string') {
          throw new Error('Invalid column. Column must be a string');
        }
        return { name: column, path: column.match(/\w+/g) };
      });
    }
    return Object.keys(columns).map(column => ({ name: column, path: column }));
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
