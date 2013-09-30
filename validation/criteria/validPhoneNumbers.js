module.exports = function (doc) {
  var isValid = true,
      result = {},
      phoneRegEx = /^\+?[0-9]?-?\(?[0-9]{3}\)?[-\ ]?[0-9]{3}-?[0-9]{4}$/;  
  
  [
    'originator_contact_fax', 'originator_contact_phone',
    'distributor_contact_fax', 'distributor_contact_phone',
    'metadata_contact_fax', 'metadata_contact_phone'
  ].forEach(function (fieldName) {
    if (doc.hasOwnProperty(fieldName) && doc[fieldName] !== '' && !phoneRegEx.exec(doc[fieldName])) {
      var message = fieldName + ' contains an invalid phone number.';
      isValid = false;
      if (result.problem) { result.problem += ' ' + message; } 
      else { result.problem = message; }
    }
  });
  
  emit(isValid, result);
};