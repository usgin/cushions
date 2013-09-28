function runCorrections() {
  var criteria, bar, caption, recordsToFix
      at = 0;
  
  AutoCorrect()
    .on('gatheringSuggestions', function (count) {
      criteria = count;
      
      caption = d3.select('#progress-container').append('p')
        .classed('muted', true)
        .text('Building a fort...');
      
      bar = d3.select('#progress-container').append('div')
        .classed('progress', true)
        .classed('progress-striped', true)
        //.classed('active', true)
      .append('div')
        .classed('progress-bar', true)
        .classed('progress-bar-warning', true)
        .attr('role', 'progressbar')
        .style('width', '0%');
    })
  
    .on('finishedCriteria', function () {
      at++;
      bar.style('width', 100 * (at / criteria) + '%');
    })
  
    .on('gatheredSuggestions', function () {
      bar.style('width', '100%');
      caption.text('Fort complete!');
    })
  
    .on('fixingRecords', function (recordCount) {
      recordsToFix = recordCount;
      at = 0;
    })
  
    .on('recordFixed', function () {
      caption.text('Keeping you safe...');
      bar.style('width', 100 * (at / recordsToFix) + '%');
    })
  
    .on('allFixed', function () {
      caption.text('Victory!');
    });
    
}

function AutoCorrect() {
  
  var fixer = _.extend({}, Backbone.Events),
      suggestions = {};
  
  d3.json(window.location.pathname.replace('index.html', ''), function (err, design) {
    if (err) { console.log(err); return; }
    
    var criteria = _.keys(design.criteria);
    
    function getSuggestionSet(viewName, callback) {
      d3.json('_view/' + viewName + '?key=false', function (err, response) {
        if (err) { callback(err); return; }
        
        if (response.rows.length > 0 && response.rows[0].value.hasOwnProperty('suggestion')) {
          response.rows.forEach(function (row) {
            if (_.contains(_.keys(suggestions), row.id)) {
              _.extend(suggestions[row.id], row.value.suggestion);  
            } else {
              suggestions[row.id] = row.value.suggestion;
            }
          });
        }
        
        callback(null, null);
      });
    }
    
    function getSuggestions() {
      if (criteria.length > 0) {
        getSuggestionSet(criteria.pop(), function (err) {
          if (err) { fixer.trigger('error', err); return; }
          fixer.trigger('finishedCriteria');
          getSuggestions();
        });
      } else {
        fixer.trigger('gatheredSuggestions');
        doCorrections();
      }
    }
    
    fixer.trigger('gatheringSuggestions', criteria.length);
    getSuggestions();
    
  });
  
  function doCorrections() {
    var ids = _.keys(suggestions),
        i = 0;
    
    fixer.trigger('fixingRecords', ids.length);
    
    _.each(ids, function (id) {
      var url = window.location.pathname.replace('_design/validation/index.html', id);
      d3.json(url, function (err, doc) {
        if (err) { fixer.trigger('error', err); return; }
        d3.xhr(url, 'application/json')
          .send('PUT', _.extend(doc, suggestions[id]), function (err, response) {
            if (!err) {
              fixer.trigger('fixedRecord');
            } else {
              fixer.trigger('error', err);
            }
            i++;
            if (i === ids.length) {
              fixer.trigger('allFixed');
            }
          });
      });
    });
  }
  
  return fixer;
}