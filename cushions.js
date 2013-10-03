#!/usr/bin/env node

var io = require('socket.io').listen(3000),
    nano = require('nano')('http://localhost:5984'),
    _ = require('lodash'),
    async = require('async');

io.sockets.on('connection', function (socket) {

  socket.on('autocorrect', function (dbName, corrections) {
    autoCorrect(socket, dbName, corrections);
  });
  
});

function doCorrections(socket, db, corrections) {
  corrections = corrections || {};
  var ids = _.keys(corrections);
  
  socket.emit('fixingRecords', ids.length);
  
  
  
  async.each(ids, iterator, finished)
  
  
  function iterator(id, callback) {
    db.get(id, gotDoc);
    
    function gotDoc(err, doc) {
      if (err) { 
        socket.emit('error', err); 
        callback(err); 
      } else {
        _.extend(doc, corrections[id]);
        db.insert(doc, doc._id, updatedDoc);
      }
    }
    
    function updatedDoc(err, response) {
      if (!err && i % 100 === 0) { socket.emit('fixedRecord', i); }
      else if (err) { socket.emit('error', err); }
      callback(err);
    }
  }
  
  _.forOwn(corrections, function (id) { db.get(id, gotDoc); });
  
  
  
  function updatedDoc(err, response) {
    if (!err && i % 100 === 0) { socket.emit('fixedRecord', i); }
    else if (err) { socket.emit('error', err); }
    isFinished();
  }
}

function gatherCorrections(socket, db) {
  var corrections = {};
  
  db.get('_design/validation', gotDesignDoc);
  
  function gotDesignDoc(err, design) {
    if (err) { socket.emit('error', err); return; }
    
    var criteria = _.keys(design.criteria),
        i = 0, finished = criteria.length;
    
    socket.emit('gatheringSuggestions', finished);
    
    isFinished(false);
    
    function isFinished(step) {
      step = step || true;
      if (step) { i++; }
      if (i === finished  || finished === 0) { 
        socket.emit('gatheredSuggestions', corrections); 
      }
    }
    
    
    
    
    
  }
}

function autoCorrect(socket, dbName, corrections) {
  var db = nano.use(dbName);
  corrections = corrections || {};
  
  if (_.isEmpty(corrections)) {
    // If no suggestions were passed in, assume we should correct all
    
  }
  
  else {
    // Was given some corrections, so just run those
    doCorrections(socket, db, corrections);
  }
}
/*
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