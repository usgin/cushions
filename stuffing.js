#!/usr/bin/env node

var csv = require('csv'),
    nano = require('nano')('http://localhost:5984'),
    prompt = require('prompt'),
    validation = require('./validation'),
    fs = require('fs'),
    path = require('path'),

    argv = require('optimist')
      .alias('f', 'csvPath')
      .describe('f', 'The path to a CSV file to import')
      .alias('d', 'dbName')
      .demand('d')
      .describe('d', 'The name of a database to build in CouchDB')
      .argv,
      
    overwrite = false,
    
    db = nano.use(argv.dbName);

// Setup the database
function setupDb() {
  nano.db.create(argv.dbName, function (err, response) {
    if (err && err.status_code === 412) { 
      console.log('The database "' + argv.dbName + '" already exists.');
      if (argv.csvPath) {
        prompt.start();
        prompt.get({
          properties: {
            'Overwrite? (y/n)': {
              pattern: /^y|n|Y|N$/
            }
          }
        }, function (err, result) {
          if (result['Overwrite? (y/n)'].toLowerCase() === 'y') {
            nano.db.destroy(argv.dbName, function (err, response) {
              if (err) { console.log(err); return; }
              overwrite = true;
              setupDb();
            });
          } else { updateValidation(); }
        });
      } else { updateValidation(); }
    } else {
      // DB created, continue
      if (argv.csvPath) { loadCsv(); }
      updateValidation();
    }
  });
}

function updateValidation() {
  function doUpdate() {
    db.get('_design/validation', function (err, doc) {
      if (err && err.status_code !== 404) { console.log(err); return; }
      
      if (doc) { validation._rev = doc._rev; }
      
      db.insert(validation, '_design/validation', function (err, response) {
        if (err) { console.log(err); return; }
        
        var filesToAdd = [
          ['index.html', 'text/html'], 
          [path.join('client','couch-fort.png'), 'image/png'],
          [path.join('client','empty-sheet.csv'), 'text/csv'],
          [path.join('client','autocorrect.js'), 'text/javascript'],
          [path.join('client','underscore.min.js'), 'text/javascript'],
          [path.join('client','underscore-min.map'), 'application/json']
        ];
        
        function addFile(rev, filename, filetype, callback) {
          filename = path.join(__dirname, 'validation', filename);
          
          fs.readFile(filename, function (err, data) {
            if (err) { callback(err); return; }
            db.attachment.insert(
              '_design/validation', 
              filename.replace('client/', ''), 
              data, filetype, { rev: rev }, callback
            );
          });
        }
        
        function addFiles(rev) {
          if (filesToAdd.length > 0) {
            var item = filesToAdd.pop();
            addFile(rev, item[0], item[1], function (err, body) {
              if (err) { console.log(err); return; }
              addFiles(body.rev);
            });
          } else {
            console.log('Validation criteria updated.');
          }
        }
        
        addFiles(response.rev);
        
      });
    });
  }
  
  if (overwrite) { doUpdate(); return; }
  
  prompt.start();
  prompt.get({
    properties: {
      'Update validation? (y/n)': {
        pattern: /^y|n|Y|N$/
      }
    }
  }, function (err, result) {
    if (result['Update validation? (y/n)'].toLowerCase() === 'y') {
      doUpdate(); 
    }
  });
}

// Load the CSV
function loadCsv() {
  console.time('Loading took')
  csv()
    .from.path(argv.csvPath, {columns:true})
    .transform(function (row, index, callback) {
      db.insert(row, function (err, response) {
        if (err) { console.log(err); return; }
        callback(null, []);
      });
    })
    .to(function (data) { 
      console.log('Loaded ' + data.length + ' records.'); 
      console.timeEnd('Loading took'); 
    });
}

setupDb();