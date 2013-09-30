module.exports = function (doc) {
  var dateExp = /^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/,
      isValid = true,
      Y = /[0-9]{4}/,
      m = /-[0-1][0-9]-/,
      d = /-[0-3][0-9]T/,
      H = /T[0-2][0-9]:/,
      M = /:[0-6][0-9]:/,
      s = /:[0-6][0-9]$/,
      suggestion = {};
  
  ['temporal_start_date', 'temporal_end_date'].forEach(function (fieldName) {
    if (doc.hasOwnProperty(fieldName) && doc[fieldName] !== '' && !dateExp.exec(doc[fieldName])) {
      isValid = false;
      var year = Y.exec(doc[fieldName]) ? Y.exec(doc[fieldName])[0] : '1900';
      var month = m.exec(doc[fieldName]) ? m.exec(doc[fieldName])[0].replace(/-/g, '') : '01';
      var day = d.exec(doc[fieldName]) ? d.exec(doc[fieldName])[0].replace(/-|T/g, '') : '01';
      var hour = H.exec(doc[fieldName]) ? H.exec(doc[fieldName])[0].replace(/T|:/g, '') : '00';
      var minute = M.exec(doc[fieldName]) ? M.exec(doc[fieldName])[0].replace(/:/g, '') : '00';
      var second = s.exec(doc[fieldName]) ? s.exec(doc[fieldName])[0].replace(/:/g, '') : '00';
      suggestion[fieldName] = [year, month, day].join('-') + 'T' + [hour, minute, second].join(':');
    }
  });
  
  var result = {};
  if (Object.keys(suggestion).length > 0) { result.suggestion = suggestion; }
  
  emit(isValid, result);
};