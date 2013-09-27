var sumReduce = (function (keys, values) {
  return sum(values);
}).toString();

module.exports = {
  id: '_design/validation',
  language: 'javascript',
  views: {
    hasTitle: {
      map: require('./hasTitle').toString()
    },
    hasDescription: {
      map: require('./hasDescription').toString()
    },
    validPubDate: {
      map: require('./validPubDate').toString()
    },
    hasBounds: {
      map: require('./hasBounds').toString()
    },
    hasMetadataContact: {
      map: require('./hasMetadataContact').toString()
    },
    hasOriginator: {
      map: require('./hasOriginator').toString()
    },
    hasMetadataAttributes: {
      map: require('./hasMetadataAttributes').toString()
    }
  }
};