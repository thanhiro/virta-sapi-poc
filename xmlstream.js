import Transform from 'readable-stream/transform';
import util from 'util';
import data2xml from 'data2xml';

const xmlConvert  = data2xml({xmlDecl: false});

export default class XMLStream extends Transform {
    started = false;

    constructor() {
        super();
        this._writableState.objectMode = true;
    }

    _transform(chunk, encoding, callback) {
        if (!this.started) {
            this.push('<?xml version="1.0" encoding="utf-8"?>\n<items>');
            this.started = true;
        }
        this.push(xmlConvert('item', chunk));
        callback();
    }

    _flush(cb) {
        this.push("</items>");
        this.push(null);
        cb();
    }
}
