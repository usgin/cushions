module.exports = function (doc) {
  var hasFields = 
    (doc.hasOwnProperty('distributor_contact_org_name') || 
     doc.hasOwnProperty('distributor_contact_person_name') ||
     doc.hasOwnProperty('distributor_contact_position_name')) &&
    (doc.hasOwnProperty('distributor_contact_phone') ||
     doc.hasOwnProperty('distributor_contact_email'));
  
  var contact = hasFields ?
    doc.distributor_contact_org_name ? doc.distributor_contact_org_name :
    doc.distributor_contact_person_name ? doc.distributor_contact_person_name :
    doc.distributor_contact_position_name ? doc.distributor_contact_position_name : ""
    : "";
  
  var method = hasFields ?
    doc.distributor_contact_email ? doc.distributor_contact_email :
    doc.distributor_contact_phone ? doc.distributor_contact_phone : ""
    : "";
  
  var hasContent = method.length > 0 && contact.length > 0;
  
  var validEmail = doc.hasOwnProperty('distributor_contact_email') ?
    /^.+@.+\..+$/.exec(doc.distributor_contact_email) !== null : false;
  
  var problem = 
    !hasFields ? 'Missing distributor_contact fields' :
    !contact || contact.length === 0 ? 'No distributor_contact name' :
    !method || method.length === 0 ? 'No distributor_contact method (email or phone)' :
    !validEmail ? 'Invalid email': 
    null;
  
  var result = {};
  if (problem) { result.problem = problem; }
  
  emit(hasFields && hasContent && validEmail, result);
};