'use strict';

class Stringifier {
  read(data) {
    return data.reduce((acc, cur) => acc + this._readRow(cur), '');
  }
  _readRow(row) {
    if (Array.isArray(row)) {
      const str = row.join();
      return str + '\n';
    }
  }
}

const stringify = (records, cb) => {
  if (!Array.isArray(records)) {
    return cb(new Error('Invalid records: records must be array'));
  }
  const stringifier = new Stringifier();
  const str = stringifier.read(records);
  cb(null, str);
};



module.exports = stringify;
