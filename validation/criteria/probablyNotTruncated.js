module.exports = function (doc) {
  var worrisome = [];
  Object.keys(doc).forEach(function (key) {
    var content = doc[key];
    if (content.length === 255 || content.length === 254) {
      worrisome.push(key);
    }
  });
  
  var result = {};
  if (worrisome.length > 0) {
    result.problem = 'The fields ' + worrisome.join(', ') + ' are likely to have been truncated at 254 or 255 characters.';
  }
  emit(
    worrisome.length === 0,
    result
  );
};