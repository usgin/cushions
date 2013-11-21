module.exports = function(doc) {
  if(doc.Title.toLowerCase() === doc.Description.toLowerCase()) {
      emit(doc.Title, doc.Description);
    };
}