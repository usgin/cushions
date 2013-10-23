module.exports = function (head, req) {
  start({ 'headers': { 'Content-type': 'text/xml' } });
  send('<?xml version="1.0" encoding="UTF-8"?>');
  //send('<?xml-stylesheet type="text/xsl" href="toIso.xslt"?>');
  send('<metadata>\n');
  
  while (row = getRow()) {
    if (row.hasOwnProperty('doc')) {
      send('<record>\n');
      Object.keys(row.doc).forEach(function (key) {
        var value = row.doc[key].toString(),
            values;
        
        // Deal with CouchDB ID
        if (key === '_id') {
          send('<couchDbId>' + value + '</couchDbId>');
        }
        
        // Ignore any other CouchDB fields
        if (key.indexOf('_') !== 0 && key !== '') {
          // String cleanup
          value = decodeURIComponent(value)
            // XML replacements
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/&(?!amp;)|&(?!#37)/g, '&amp;')
            .replace(/%/g, '&#37;')
          
            // [a tab](http://www.fileformat.info/info/unicode/char/000b/index.htm)
            .replace('\u000b', ' ');
          
          // UTF-8-ify?
          value = unescape(encodeURIComponent(value));
          values = value.split('|');

          values.forEach(function (v) {
            send('<' + key + '>');
            send(v.trim());
            send('</' + key + '>\n');
          });
        }
      });
      send('</record>\n');
    }
  }
  
  send('</metadata>');
};