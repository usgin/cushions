module.exports = function (doc) {
  emit(
    doc.hasOwnProperty('title') && doc.title.length > 0,
    {}
  );
};