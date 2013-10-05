module.exports = function (head, req) {
  start({ 'headers': { 'Content-type': 'text/html' } });
  send('<!doctype html>');
  send('<html><head><title>Padded Metadata</title></head><body><ul>');
  
  while (row = getRow()) {
    send('<li><a href="../../_show/asXml/' + row.id + '">' + row.doc.title + '</a></li>');
  }
  
  send('</ul></body></html>');
};