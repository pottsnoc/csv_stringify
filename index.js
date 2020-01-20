'use strict';

const defaultFormat = {
  boolean: value => (value ? '1' : '0'),
  number: value => value.toString(),
  date: value => value.getTime().toString(),
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

const compose = (...funcs) => (...args) =>
  funcs.reduce((acc, cur) => [cur(...acc)], args);

class Stringifier {
  constructor({
    delimiter = ',', format = {}, header, columns, eof = true, quote = '"',
    escape = '"', quoted = false, quotedString = false, quotedMatch = []
  }) {
    this.delimiter = delimiter;
    this.format = { ...defaultFormat, ...format };
    this.header = header;
    this.columns = this._normalizeColumns(columns);
    this.eof = eof;
    this.quote = quote ? quote : '';
    if (quote === true) {
      this.quote = '"';
    }
    this.escape = escape;
    this.quoted = quoted;
    this.quotedString = quotedString;
    this.quotedMatch = Array.isArray(quotedMatch) ? quotedMatch : [quotedMatch];
  }

  read(data) {
    return data.reduce((acc, cur, i) => {
      const needHeader = i === 0 && this.header;
      let str;
      if (Array.isArray(cur)) {
        str = this._getStringFromArray(cur, i);
      } else if (typeof cur === 'object') {
        if (needHeader && !this.columns) {
          this.columns = Object.keys(cur)
            .map(column => ({ name: column, path: column }));
        }
        str = this._getStringFromObject(cur, i);
      }
      if (i !== (data.length - 1) || this.eof) {
        str += '\n';
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
    return row
      .map(([key, value]) =>
        compose(
          this._format.bind(this),
          this._escapeHandler.bind(this),
          this._quoteHandler.bind(this)
        )(value, { column: key, row: index, isHeader: false })
      )
      .join(this.delimiter);
  }

  _getStringFromArray(arr, index) {
    if (this.columns) {
      arr = arr.slice(0, this.columns.length);
    }
    return arr
      .map((value, i) =>
        compose(
          this._format.bind(this),
          this._escapeHandler.bind(this),
          this._quoteHandler.bind(this)
        )(value, { column: i, row: index, isHeader: false })
      )
      .join(this.delimiter);
  }

  _quoteHandler({ type, value }) {
    if (!value && type !== 'string') return value;
    const { delimiter, quote, quoted, quotedMatch, quotedString } = this;
    const conds = [quote, '\n'];
    if (delimiter) {
      conds.push(delimiter);
    }
    const containsElement = conds.some(el => value.includes(el));
    const isQuotedMatch = quotedMatch.some(el =>
      (el instanceof RegExp ? el.test(value) : value.includes(el))
    );
    const isQuotedString = type === 'string' && (quotedString || isQuotedMatch);
    const needQuote = containsElement || quoted || isQuotedString;
    return needQuote ? `${quote}${value}${quote}` : value;
  }

  _escapeHandler({ type, value }) {
    const { quote, escape } = this;
    if (!value || !escape) return { type, value };
    let expStr = escape === '\\' ? escape + escape : escape;
    if (quote) {
      expStr += `|${quote}`;
    }
    const exp = new RegExp(expStr, 'g');
    return { type, value: value.replace(exp, `${escape}$&`) };
  }

  _format(value, context) {
    if (value === null) {
      return { type: null, value };
    }
    let type = typeof value;
    if (value instanceof Date) {
      type = 'date';
    }
    const handler = this.format[type];
    let handledValue;
    if (handler) {
      if (!(typeof handler === 'function')) {
        throw new Error(`format[${type}] must be a function`);
      }
      handledValue = handler(value, context);
      if (typeof handledValue !== 'string') {
        throw new Error('format function must return string');
      }
    }
    return { type, value: handledValue ? handledValue : value };
  }

  _printHeader() {
    if (!this.columns) {
      throw new Error('option `column` not provided');
    }
    return this.columns.map(column =>
      compose(
        this._format.bind(this),
        this._escapeHandler.bind(this),
        this._quoteHandler.bind(this)
      )(column.name, { column: column.name, row: 0, isHeader: true })
    ).join(this.delimiter) + '\n';
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
    return Object.entries(columns)
      .map(column => ({ name: column[1], path: column[0].match(/\w+/g) }));
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
