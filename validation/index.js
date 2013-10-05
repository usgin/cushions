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
    'hasDistributor': '...has some distributor contact info:',
    'hasMetadataAttributes': '...has a metadata ID and date:',
    'validPhoneNumbers': '...contains valid phone numbers:',
    'validTemporalRange': '...contains a valid temporal range:',
    'validLanguageCodes': '...uses valid language codes:'
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
    hasDistributor: {
      map: require('./criteria/hasDistributor').toString()
    },
    hasMetadataAttributes: {
      map: require('./criteria/hasMetadataAttributes').toString()
    },
    validPhoneNumbers: {
      map: require('./criteria/validPhoneNumbers').toString()
    },
    validTemporalRange: {
      map: require('./criteria/validTemporalRange').toString()  
    },
    validLanguageCodes: {
      map: require('./criteria/validLanguageCodes').toString()
    }
  },
  lists: {
    asXml: require('./lists/asXml').toString(),
    asCsv: require('./lists/asCsv').toString(),
    asGeoJson: require('./lists/asGeoJson.js').toString(),
    asWaf: require('./lists/asWaf').toString()
  },
  shows: {
    asXml: require('./shows/asXml').toString()  
  }
};