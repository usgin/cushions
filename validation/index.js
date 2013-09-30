module.exports = {
  id: '_design/validation',
  language: 'javascript',
  criteria: {
    'probablyNotTruncated': '...doesn\'t look truncated:',
    'hasTitle': '...has a title:',
    'hasDescription': '...has a description:',
    'validPubDate': '...publication date is valid:',
    'hasBounds': '...bounding box is valid:',
    'hasMetadataContact': '...has some metadata contact info:',
    'hasOriginator': '...has some originator contact info:',
    'hasMetadataAttributes': '...has a metadata ID and date:',
    'validPhoneNumbers': '...contains valid phone numbers:'
  },
  views: {
    lookupByTitle: {
      map: require('./lookups/byTitle').toString()
    },
    probablyNotTruncated: {
      map: require('./criteria/probablyNotTruncated').toString()  
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
    },
    validPhoneNumbers: {
      map: require('./criteria/validPhoneNumbers').toString()
    }
  },
  lists: {
    asXml: require('./lists/asXml').toString(),
    asCsv: require('./lists/asCsv').toString(),
    asGeoJson: require('./lists/asGeoJson.js').toString()
  }
};