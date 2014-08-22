var exec = require('child_process').exec;
var _ = require('underscore');
var fields = {
    hash: '%H',
    abbrevHash: '%h',
    treeHash: '%T',
    abbrevTreeHash: '%t',
    parentHashes: '%P',
    abbrevParentHashes: '%P',
    authorName: '%an',
    authorEmail: '%ae',
    authorDate: '%ai',
    authorDateRel: '%ar',
    committerName: '%cn',
    committerEmail: '%ce',
    committerDate: '%cd',
    committerDateRel: '%cr',
    subject: '%s',
  };

module.exports = function(grunt) {
  grunt.registerMultiTask('gitlog', 'Log Git info to a file.', function() {
    var done = this.async();
    var data = this.data;

    if (!data.dest) {
      grunt.log.error('\'dest\' field is required.');
      done(false);

      return;
    }

    getLog(data.options, function (err, result) {
      if (err) {
        grunt.log.error('An error has occurred.');
        grunt.log.error(err);
        done(false);

        return;
      }

      grunt.file.write(data.dest, JSON.stringify(result, null, '\t'));
      grunt.log.writeln('Log saved to file: ' + data.dest);

      done();
    });
  });
}

function getLog(options, cb) {
  var command;
  var err;

  options = _.extend({ 
    fields: ['abbrevHash', 'hash', 'subject', 'authorName']
  }, options);

  err = validate(options);

  if (!cb) { throw new Error('Callback required!'); }

  if (err) {
    cb(err);
    return;
  }

  command = getCommand(options);

  exec(command, function(err, stdout, stderr) {
    if (stderr || err) {
      cb(stderr || err);
      return;
    }

    var commits = stdout.split('\n');
    var output;

    commits.pop(); // blank element
    output = parse(commits, options.fields);

    cb(null, output);
  });

  function validate(options) {
    options.fields.forEach(function(field) {
      if (!fields[field]) { return 'Unknown field: ' + field; }
    });
  }

  function getCommand(options) {
    var commands = [];

    commands.push({
      key: 'pretty',
      value: options.fields.map(function (f) {
        return '\t' + fields[f];
      }).join('')
    });

    if (options.author) {
      commands.push({
        key: 'author',
        value: options.author
      });
    }

    if (options.parameters) {
      for (var p in options.parameters) {
        commands.push({
          key: p,
          value: options.parameters[p]
        });
      }
    }

    return 'git log ' + commands.map(function (c) {
      return '--' + c.key + '="' + c.value + '"';
    }).join(' ') + (options.query ? ' ' + options.query : '');
  }

  function parse(commits, fields) {
    return commits.map(function(c) {
      var commit = c.split('\t');
      var result = {};

      commit.shift();
      commit.forEach(function(f, ix) {
        result[fields[ix]] = f;
      });

      return result;
    })
  }
};