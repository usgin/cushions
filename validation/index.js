var sumReduce = (function (keys, values) {
  return sum(values);
}).toString();

module.exports = {
  id: '_design/validation',
  language: 'javascript',
  views: {
    lookupByTitle: {
      map: require('./lookups/byTitle').toString()
    },
    hasTitle: {
      map: require('./criteria/hasTitle').toString()
    },
    hasDescription: {
      map: require('./criteria/hasDescription').toString()
    },
    validPubDate: {
      map: require('./criteria/validPubDate').toString()
    },
    hasBounds: {
      map: require('./criteria/hasBounds').toString()
    },
    hasMetadataContact: {
      map: require('./criteria/hasMetadataContact').toString()
    },
    hasOriginator: {
      map: require('./criteria/hasOriginator').toString()
    },
    hasMetadataAttributes: {
      map: require('./criteria/hasMetadataAttributes').toString()
    }
  },
  lists: {
    asXml: require('./lists/asXml').toString(),
    asCsv: require('./lists/asCsv').toString()
  }
};