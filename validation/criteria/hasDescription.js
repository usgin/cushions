module.exports = function (doc) {
  emit(
    doc.hasOwnProperty('description') && doc.description.length > 0,
    {}
  );
};