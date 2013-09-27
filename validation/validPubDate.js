module.exports = function (doc) {
  var dateExp = /^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/,
      isValid = doc.hasOwnProperty('publication_date') && doc.publication_date.search(dateExp) !== -1,
      Y = /[0-9]{4}/,
      m = /-[0-1][0-9]-/,
      d = /-[0-3][0-9]T/,
      H = /T[0-2][0-9]:/,
      M = /:[0-6][0-9]:/,
      s = /:[0-6][0-9]$/,
      suggestion = {};
  
  if (!isValid) {
    var year = Y.exec(doc.publication_date) ? Y.exec(doc.publication_date)[0] : '1900';
    var month = m.exec(doc.publication_date) ? m.exec(doc.publication_date)[0].replace(/-/g, '') : '01';
    var day = d.exec(doc.publication_date) ? d.exec(doc.publication_date)[0].replace(/-|T/g, '') : '01';
    var hour = H.exec(doc.publication_date) ? H.exec(doc.publication_date)[0].replace(/T|:/g, '') : '00';
    var minute = M.exec(doc.publication_date) ? M.exec(doc.publication_date)[0].replace(/:/g, '') : '00';
    var second = s.exec(doc.publication_date) ? s.exec(doc.publication_date)[0].replace(/:/g, '') : '00';
    suggestion.publication_date = [year, month, day].join('-') + 'T' + [hour, minute, second].join(':');
  }
  
  var result = {};
  if (Object.keys(suggestion).length > 0) { result.suggestion = suggestion; }
  
  emit(isValid, result);
};