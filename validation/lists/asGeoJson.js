module.exports = function (head, req) {
  start({ 'headers': { 'Content-type': 'application/json' } });
  send('{"type":"FeatureCollection","features":[');
  
  function geom(doc) {
    var n = isNaN(doc.north_bounding_latitude) ? 0 : Number(doc.north_bounding_latitude),
        s = isNaN(doc.south_bounding_latitude) ? 0 : Number(doc.south_bounding_latitude),
        e = isNaN(doc.east_bounding_longitude) ? 0 : Number(doc.east_bounding_longitude),
        w = isNaN(doc.west_bounding_longitude) ? 0 : Number(doc.west_bounding_longitude);
        
    return {
      type: "Polygon",
      coordinates: [ [ [e, s], [e, n], [w, n], [w, s], [e, s] ] ]
    };  
  }
  
  function toGeoJson(doc) {
    var result = { type: "Feature", properties: doc, geometry: geom(doc) };
    delete result.properties['_id'];
    delete result.properties['_rev'];
    result.properties.couchDbId = doc._id;
    return JSON.stringify(result);
  }
  
  var row = getRow();
  if (row && row.hasOwnProperty('doc')) {
    send(toGeoJson(row.doc));
         
    var aRow;
    while (row = getRow()) {
      send(',' + toGeoJson(row.doc));                
    }
  }
  
  send(']}');
};