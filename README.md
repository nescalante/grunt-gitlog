# grunt-gitlog

[![Greenkeeper badge](https://badges.greenkeeper.io/nescalante/grunt-gitlog.svg)](https://greenkeeper.io/)

> Git log to json

## Getting Started

If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```sh
$ npm install --save-dev grunt-gitlog
```

[grunt]: http://gruntjs.com
[Getting Started]: http://gruntjs.com/getting-started

### Example

```js
grunt.initConfig({
  gitlog: {
      build: {
        dest: 'test.json',
        options: {
          parameters: {
            
          },
          query: 'HEAD'
        },
      }
    }
  }
});
```