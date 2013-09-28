var csv = require('csv'),
    nano = require('nano')('http://localhost:5984'),
    prompt = require('prompt'),
    validation = require('./validation'),
    fs = require('fs'),

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
        
        fs.readFile('validation/index.html', function (err, data) {
          db.attachment.insert(
            '_design/validation', 
            'index.html', 
            data, 
            'text/html', 
            { rev: response.rev }, 
            function (err, response) {
              fs.readFile('validation/couch-fort.png', function (err, data) {
                db.attachment.insert(
                  '_design/validation', 
                  'couch-fort.png', 
                  data, 
                  'image/png', 
                  { rev: response.rev }, 
                  function (err, response) {
                    console.log('Validation criteria updated.');
                  }
                );
              });
            }
          );
        })
        /*
        fs.createReadStream('validation/index.html').pipe(
          db.attachment.insert('_design/validation', 'index.html', null, 'text/html', { rev: response.rev })
        );
        setTimeout(
          function () {
            db.get('_design/validation', function (err, design) {
              if (err) { console.log(err); return; }
              
              fs.createReadStream('validation/empty-sheet.csv').pipe(
                db.attachment.insert('_design/validation', 'empty-sheet.csv', null, 'text/csv', { rev: design._rev })
              );
              console.log('Validation criteria updated.');
            });
          }, 1000
        );
        */
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