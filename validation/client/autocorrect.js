function runCorrections(corrections) {
  var criteria, bar, caption, recordsToFix,
      dbName = window.location.pathname.split('/')[1],
      at = 0;
  
  io.connect('http://localhost:3000')
  
    .emit('autocorrect', dbName, corrections)
  
    .on('gatheringSuggestions', function (count) {
      criteria = count;
      
      caption = d3.select('#progress-container').append('p')
        .classed('muted', true)
        .text('Building a fort...');
      
      bar = d3.select('#progress-container').append('div')
        .classed('progress', true)
        .classed('progress-striped', true)
        .classed('active', true)
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
      caption.text('Fort complete, waiting for woozles...');
    })
  
    .on('fixingRecords', function (recordCount) {
      recordsToFix = recordCount;
    })
  
    .on('fixedRecord', function (numberFinished) {
      caption.text('Here they come! Cushions are keeping you safe...');
      bar
        .style('width', 100 * (numberFinished / recordsToFix) + '%')
        .classed('progress-bar-danger', true)
        .classed('progress-bar-warning', false);
    })
  
    .on('allFixed', function () {
      caption.text('Victory!')
        .append('a')
          .attr('href', 'index.html')
          .text('How did it go?')
          .classed('btn', true)
          .classed('btn-primary', true)
          .classed('btn-sm', true);
      bar
        .style('width', '100%')
        .classed('progress-bar-success', true)
        .classed('progress-bar-danger', false);
      this.disconnect();
    });
    
}