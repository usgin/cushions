module.exports = function (doc, req) {
  body = '<?xml version="1.0" encoding="UTF-8"?>';
  body += '<?xml-stylesheet type="text/xsl" href="../../toIso.xslt"?>';
  
  body += '<record>';
  
  Object.keys(doc).forEach(function (key) {
    var value = doc[key].toString(),
        values;
    
    // Deal with CouchDB ID
    if (key === '_id') {
      body += '<couchDbId>' + value + '</couchDbId>';
    }
    
    // Ignore any other CouchDB fields
    if (key.indexOf('_') !== 0 && key !== '') {
      // String cleanup
      value = decodeURIComponent(value)
        // XML replacements
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&(?!amp;)|&(?!#37)/g, '&amp;')
        .replace(/%/g, '&#37')
      
        // [a tab](http://www.fileformat.info/info/unicode/char/000b/index.htm)
        .replace('\u000b', ' ');
      
      // UTF-8-ify?
      value = unescape(encodeURIComponent(value));
      
      values = value.split('|');

      values.forEach(function (v) {
        body += '<' + key + '>';
        body += v.trim();
        body += '</' + key + '>';
      });
    }
  });
  
  body += '</record>\n';

  return {
    body: body,
    headers: { 'Content-type': 'text/xml' }
  };
};