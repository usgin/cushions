var io = require('socket.io').listen(3000),
    nano = require('nano')('http://localhost:5984'),
    _ = require('underscore');

io.sockets.on('connection', function (socket) {

  socket.on('autocorrect', function (dbName, corrections) {
    autoCorrect(socket, dbName, corrections);
  });
});

function autoCorrect(socket, dbName, corrections) {
  var db = nano.use(dbName),
      suggestions = corrections || {};
  
  function doCorrections() {
    var ids = _.keys(suggestions),
        i = 0;
    
    socket.emit('fixingRecords', ids.length);
    
    _.each(ids, function (id) {
      db.get(id, function (err, doc) {
        db.insert(_.extend(doc, suggestions[id]), id, function (err, response) {
          if (!err && i % 100 === 0) { socket.emit('fixedRecord', i); }
          else if (err) { socket.emit('error', err); }
          
          i++;
          if (i === ids.length) { socket.emit('allFixed'); }
        });
      });
    }); 
  }
  
  if (_.keys(suggestions).length === 0) {
    // If no suggestions were passed in, assume we should correct all
    db.get('_design/validation', function (err, design) {
      if (err) { socket.emit('error', err); return; }
      
      var getSuggestions = function () {
        if (criteria.length > 0) {
          getSuggestionSet(criteria.pop(), function (err) {
            if (err) { socket.emit('error', err); return; }
            socket.emit('finishedCriteria');
            getSuggestions();
          });
        } else {
          socket.emit('gatheredSuggestions');
          doCorrections();
        } 
      };
      
      var getSuggestionSet = function (viewName, callback) {
        db.view('validation', viewName, function (err, response) {
          if (err) { callback(err); return; }
          
          if (_.some(response.rows, function (row) { return row.value.hasOwnProperty('suggestion'); })) {
            _.each(response.rows, function (row) {
              if (_.contains(_.keys(suggestions), row.id)) {
                _.extend(suggestions[row.id], row.value.suggestion);  
              } else {
                suggestions[row.id] = row.value.suggestion;
              } 
            });
          }
          
          callback(null, null);
        });
      };
      
      var criteria = _.keys(design.criteria);
      socket.emit('gatheringSuggestions', criteria.length);
      getSuggestions();
      
    });
  }
  else {
    // We recieved some suggestions
    doCorrections();
  }
  
}