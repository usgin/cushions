module.exports = function (doc) {
  var hasFields = 
    doc.hasOwnProperty('metadata_contact_org_name') &&
    doc.hasOwnProperty('metadata_contact_email');
  
  var hasContent = hasFields ?
    doc.metadata_contact_org_name.length > 0 &&
    doc.metadata_contact_email.length > 0 : false;
  
  var validEmail = hasContent ?
    /^.+@.+\..+$/.exec(doc.metadata_contact_email) !== null : false;
  
  var problem = !hasFields ? 'Missing metadata_contact fields' :
    !hasContent ? 'Blank metadata_contact fields' :
    !validEmail ? 'Invalid email': null;
  
  var result = {};
  if (problem) { result.problem = problem; }
  
  emit(hasFields && hasContent && validEmail, result);
};