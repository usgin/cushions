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
    db.view('validation', viewName, {key: false}, function (err, response) {
      if (err) { callback(err); return; }
      
      var fixes = [];
      _.each(response.rows, function (row) {
        if (row.value.suggestion) {
          fixes.push({id: row.id, suggestion: row.value.suggestion});
        }
      });
      
      socket.emit('finishedCriteria');
      callback(null, fixes);
    });
  }
  
  function fixOne(id, callback) {
    var fixes = corrections[id] || {};
    
    db.get(id, function (err, doc) {
      if (err) { callback(err); return; }
      
      _.extend(doc, fixes);
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
      this.gatherCorrections(function (err, fixes) {
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
          _.each(results, function (result) {
            _.each(result, function (correction) {
              var id = correction.id, suggestion = correction.suggestion;
              corrections[id] = _.extend(suggestion, corrections[id] || {});
            });
          });
          
          socket.emit('gatheredSuggestions');
          callback(err, corrections);
        });
      });
    },
    
    fix: function () {
      var ids = _.keys(corrections);
      
      socket.emit('fixingRecords', ids.length);
      async.eachLimit(ids, 100, fixOne, function () {
        socket.emit('allFixed');
        recordsFixed = 0;
        corrections = {};
      });
    }
  };
  
  return corrector; 
}