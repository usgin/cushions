module.exports = function (doc) {
  var hasFields = 
    (doc.hasOwnProperty('originator_contact_org_name') || 
     doc.hasOwnProperty('originator_contact_person_name') ||
     doc.hasOwnProperty('originator_contact_position_name')) &&
    (doc.hasOwnProperty('originator_contact_phone') ||
     doc.hasOwnProperty('originator_contact_email'));
  
  var contact = hasFields ?
    doc.originator_contact_org_name ? doc.originator_contact_org_name :
    doc.originator_contact_person_name ? doc.originator_contact_person_name :
    doc.originator_contact_position_name ? doc.originator_contact_position_name : ""
    : "";
  
  var method = hasFields ?
    doc.originator_contact_email ? doc.originator_contact_email :
    doc.originator_contact_phone ? doc.originator_contact_phone : ""
    : "";
  
  var hasContent = method.length > 0 && contact.length > 0;
  
  var validEmail = doc.hasOwnProperty('originator_contact_email') ?
    /^.+@.+\..+$/.exec(doc.originator_contact_email) !== null : false;
  
  var problem = 
    !hasFields ? 'Missing originator_contact fields' :
    !contact || contact.length === 0 ? 'No originator_contact name' :
    !method || method.length === 0 ? 'No originator_contact method (email or phone)' :
    !validEmail ? 'Invalid email': 
    null;
  
  var result = {};
  if (problem) { result.problem = problem; }
  
  emit(hasFields && hasContent && validEmail, result);
};