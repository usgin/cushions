module.exports = function (head, req) {
  start({ 'headers': { 'Content-type': 'text/csv' } });
  
  var row = getRow();
  if (row.hasOwnProperty('doc')) {
    var headers = Object.keys(row.doc);
    send(headers.join(',') + '\n');
         
    var aRow;
    while (row = getRow()) {
      aRow = headers.map(function (column) {
        return '"' + row.doc[column].replace('\"', "'").replace('"', "'") + '"' || '""';
      });
      send(aRow.join(',') + '\n');                
    }
  } else { send(''); }
};