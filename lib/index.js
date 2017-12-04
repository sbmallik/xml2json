function convertFiles(xmlReportsBaseDir, jsonReportsBaseDir, callback) {
  var fs = require('fs');
  var path = require('path');
  var xmlReportsDir = path.resolve(xmlReportsBaseDir);
  var jsonReportsDir = path.resolve(jsonReportsBaseDir);

  if (!fs.existsSync(jsonReportsDir)){
    fs.mkdirSync(jsonReportsDir);
  }

  fs.readdir(xmlReportsDir, function(err, filelist) {

    filelist.forEach(function(file) {
      var filePath = path.join(xmlReportsDir, file);
      var stat = fs.statSync(filePath);

      if (stat.isFile()) {
        if (path.extname(filePath) === '.xml') {
          callback(filePath, path.join(jsonReportsDir, file.replace(/xml$/, 'json')));
        }
      } else if (stat.isDirectory()) {
        convertFiles(filePath, jsonReportsDir, callback);
      }

    });

  });
}

if (process.argv.length <= 3) {
  console.log("Usage: node " + __filename + " <src-reports-dir> <dest-reports-dir>");
  process.exit(-1);
}

convertFiles(process.argv[2], process.argv[3], function(xmlfile, jsonfile) {
  var xml2json = require('xml-to-json');

  xml2json({
    input: xmlfile,
    output: jsonfile
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });

});
