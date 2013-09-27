module.exports = function (doc) {
  var hasFields = 
    doc.hasOwnProperty('metadata_uuid') &&
    doc.hasOwnProperty('metadata_date');
  
  var hasContent = hasFields ?
    doc.metadata_uuid.length > 0 &&
    doc.metadata_date > 0 : false;
  
  var dateExp = /^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/,
      isValidDate = doc.hasOwnProperty('metadata_date') && doc.metadata_date.search(dateExp) !== -1,
      Y = /[0-9]{4}/,
      m = /-[0-1][0-9]-/,
      d = /-[0-3][0-9]T/,
      H = /T[0-2][0-9]:/,
      M = /:[0-6][0-9]:/,
      s = /:[0-6][0-9]$/,
      suggestion = {};
  
  if (!isValidDate) {
    var year = Y.exec(doc.metadata_date) ? Y.exec(doc.metadata_date)[0] : '1900';
    var month = m.exec(doc.metadata_date) ? m.exec(doc.metadata_date)[0].replace(/-/g, '') : '01';
    var day = d.exec(doc.metadata_date) ? d.exec(doc.metadata_date)[0].replace(/-|T/g, '') : '01';
    var hour = H.exec(doc.metadata_date) ? H.exec(doc.metadata_date)[0].replace(/T|:/g, '') : '00';
    var minute = M.exec(doc.metadata_date) ? M.exec(doc.metadata_date)[0].replace(/:/g, '') : '00';
    var second = s.exec(doc.metadata_date) ? s.exec(doc.metadata_date)[0].replace(/:/g, '') : '00';
    suggestion.metadata_date = [year, month, day].join('-') + 'T' + [hour, minute, second].join(':');
  }
  
  if (!doc.hasOwnProperty('metadata_uuid')) {
    suggestion.metadata_uuid = doc._id;
  }
  
  emit(
    hasFields && hasContent && isValidDate,
    Object.keys(suggestion).length > 0 ? { suggestion: suggestion } : {}
  );
};