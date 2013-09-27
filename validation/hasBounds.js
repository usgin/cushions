module.exports = function (doc) {
  var hasFields = 
    doc.hasOwnProperty('north_bounding_latitude') &&
    doc.hasOwnProperty('south_bounding_latitude') &&
    doc.hasOwnProperty('east_bounding_longitude') &&
    doc.hasOwnProperty('west_bounding_longitude');
  
  var valuesAreNumeric = hasFields ?
    !isNaN(doc.north_bounding_latitude) &&
    !isNaN(doc.south_bounding_latitude) &&
    !isNaN(doc.east_bounding_longitude) &&
    !isNaN(doc.west_bounding_longitude) : false;
  
  var valuesAreAppropriate = hasFields ?
    doc.north_bounding_latitude <= 90 && doc.north_bounding_latitude >= -90 &&
    doc.south_bounding_latitude <= 90 && doc.south_bounding_latitude >= -90 &&
    doc.east_bounding_longitude <= 180 && doc.east_bounding_longitude >= -180 &&
    doc.west_bounding_longitude <= 180 && doc.west_bounding_longitude >= -180 : false;
  
  var problem = 
    !hasFields ? 'Missing fields' :
    !valuesAreNumeric ? 'Non-numeric values' :
    !valuesAreAppropriate ? 'Coordinates are out-of-bounds' :
    null;
  
  var suggestedBounds;
  if (!valuesAreAppropriate && valuesAreNumeric) {
    suggestedBounds = {
      east_bounding_longitude: Number(doc.east_bounding_longitude),
      west_bounding_longitude: Number(doc.west_bounding_longitude),
      north_bounding_latitude: Number(doc.north_bounding_latitude),
      south_bounding_latitude: Number(doc.south_bounding_latitude)
    };
    
    if (suggestedBounds.east_bounding_longitude < -180) {
      suggestedBounds.east_bounding_longitude = suggestedBounds.east_bounding_longitude + 360;
    }
    if (suggestedBounds.east_bounding_longitude > 180) {
      suggestedBounds.east_bounding_longitude = suggestedBounds.east_bounding_longitude - 360;  
    }
    if (suggestedBounds.west_bounding_longitude < -180) {
      suggestedBounds.west_bounding_longitude = suggestedBounds.west_bounding_longitude + 360;
    }
    if (suggestedBounds.west_bounding_longitude > 180) {
      suggestedBounds.west_bounding_longitude = suggestedBounds.west_bounding_longitude - 360;
    }
    if (suggestedBounds.north_bounding_latitude < -90) {
      suggestedBounds.north_bounding_longitude = suggestedBounds.north_bounding_latitude + 180;
    }
    if (suggestedBounds.north_bounding_latitude > 90) {
      suggestedBounds.north_bounding_longitude = suggestedBounds.north_bounding_latitude - 180;  
    }
    if (doc.south_bounding_latitude < -90) {
      suggestedBounds.south_bounding_latitude = doc.south_bounding_latitude + 180;
    }
    if (suggestedBounds.south_bounding_latitude > 90) {
      suggestedBounds.south_bounding_latitude = suggestedBounds.south_bounding_latitude - 180;  
    }
  }
    
  var bbox, geojson;
  if (valuesAreNumeric) {
    var b = suggestedBounds ? suggestedBounds : doc;
    bbox = [
      b.east_bounding_longitude,
      b.south_bounding_latitude,
      b.west_bounding_longitude,
      b.north_bounding_latitude
    ].join(',');
    
    geojson = {
      type: "Polygon",
      coordinates: [ [
        [b.east_bounding_longitude, b.south_bounding_latitude],
        [b.east_bounding_longitude, b.north_bounding_latitude],
        [b.west_bounding_longitude, b.north_bounding_latitude],
        [b.west_bounding_longitude, b.south_bounding_latitude],
        [b.east_bounding_longitude, b.south_bounding_latitude]
      ] ]
    };
  }
  
  
  
  var result = {};
  if (problem) { result.problem = problem; }
  if (bbox) { result.asBbox = bbox; result.geojson = geojson; }
  if (suggestedBounds) { result.suggestion = suggestedBounds; }
  
  emit(
    hasFields && valuesAreNumeric && valuesAreAppropriate,
    result
  );
};