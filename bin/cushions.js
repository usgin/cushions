#!/usr/bin/env node
var io = require('socket.io').listen(3000),
    nano = require('nano')('http://localhost:5984'),
    _ = require('lodash'),
    async = require('async');

io.sockets.on('connection', function (socket) {
  socket.on('autocorrect', function (dbName) {
    Corrector(socket, dbName).autoFix();
  });
});

function Corrector(socket, dbName) {
  var db = nano.use(dbName),
      corrections = {},
      recordsFixed = 0;
  
  function eachView(viewName, callback) {
    db.view('validation', viewName, function (err, response) {
      if (err) { callback(err); return; }
      
      var corrections = _.map(response.rows, function (row) {
        return {id: row.id, suggestion: row.value.suggestion};
      });
      
      corrections = _.filter(corrections, function (correction) {
        return correction.suggestion;  
      });
      
      callback(null, corrections);
      socket.emit('finishedCriteria');
    });
  }
  
  function fixOne(id, callback) {
    var corrections = corrections[id] || {};
    
    db.get(id, function (err, doc) {
      if (err) { callback(err); return; }
      
      _.extend(doc, corrections);
      db.insert(doc, id, function (err, response) {
        recordsFixed++;
        if (!err && recordsFixed % 100 === 0) { socket.emit('fixedRecord', recordsFixed); }
        else if (err) { socket.emit('error', err); }
        callback(err);
      });
    });
  }
  
  var corrector = {
    autoFix: function () {
      this.gatherCorrections(function (err, corrections) {
        if (err) { socket.emit('error', err); return; }
        corrector.fix();
      });
    },
    
    gatherCorrections: function (callback) {
      db.get('_design/validation', function (err, design) {
        if (err) { callback(err); return; }  
        
        var viewNames = _.keys(design.criteria);
        socket.emit('gatheringSuggestions', viewNames.length);
        async.map(viewNames, eachView, function (err, results) {
          _.each(results, function (criteriaResult) {
            _.each(criteriaResult, function (result) {
              if (_.has(corrections, result.id)) {
                _.extend(corrections[result.id], result.suggestion);
              } else {
                corrections[result.id] = result.suggestion;
              }
            });
          });
          
          callback(err, corrections);
          socket.emit('gatheredSuggestions');
        });
      });
    },
    
    fix: function () {
      var ids = _.keys(corrections);
      
      socket.emit('fixingRecords', ids.length);
      async.each(ids, fixOne, function () {
        socket.emit('allFixed');
        recordsFixed = 0;
      });
    }
  };
  
  return corrector; 
}