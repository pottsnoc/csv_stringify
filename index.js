'use strict';

class Stringifier {
  constructor({ delimiter = ',' }) {
    this.delimiter = delimiter;
  }
  read(data) {
    return data.reduce((acc, cur) => acc + this._readRow(cur), '');
  }
  _readRow(row) {
    if (Array.isArray(row)) {
      const str = row.join(this.delimiter);
      return str + '\n';
    }
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
  const str = stringifier.read(records);
  cb(null, str);
};

module.exports = stringify;
