const yaml      = require('js-yaml');
const fs        = require('fs');
const commander = require('commander');
const inquirer  = require('inquirer');
const path      = require('path');
const colors    = require('colors');

let defaultParameters = {
  cardspath : '.'
};

commander
  .usage('[options] <command> <command param>')
  .option('-d, --develop [json settings file]', 'use a json file for settings')
  .option('-p, --cardspath [PATH]', 'cards path')
  .parse(process.argv);

if (
  !commander.args.includes('tags')
  && !commander.args.includes('random')
) {
  console.log('invalid command. Use : tags, random');
  process.exit(1);
}

if (commander.develop) {
  defaultParameters = require(commander.develop);
}

let questions = [];
if (!commander.cardspath) {
  questions.push({
    type: 'input',
    name: `cardspath`,
    message: `cards path`,
    default: defaultParameters.cardspath
  });
}

const readFile = (file) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({name : file, content : data});
      }
    });
  });
};

const readDir = (dir,filter) => {
  return new Promise ((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        if (filter) {
          resolve(files.filter(filter));
        } else {
          resolve(files);
        }
      }
    });
  });
};

const readYamlFiles = (yamlPath) => {
  return readDir(yamlPath, f => path.extname(f) === '.yaml').then(files => {
    const yamlFiles = [];
    files.forEach( f => {
      yamlFiles.push(readFile(path.format({
        root: __dirname,
        dir: yamlPath,
        base: f
      })));
    });
    return Promise.all(yamlFiles).then(readdenYamlFiles => {
      const result = [];
      readdenYamlFiles.forEach(yamlFile => {
        try {
          const d = {};
          d.fileName = yamlFile.name;
          d.doc = yaml.safeLoad(yamlFile.content);
          result.push(Promise.resolve(d));
        } catch (err) {
          console.error(err.red);
        }
      });
      return Promise.all(result);
    }).catch(err => console.error(err.red));
  });
};

const exec = {
  tags : (options) => {
    readYamlFiles(options.cardspath).then(readdenYamlFiles => {
      console.log(readdenYamlFiles.reduce((result, yamlFile) => {
        const element = yamlFile.doc.tags || '';
        element.split(',').forEach(t => {
          t = t.trim();
          if (!result[t.toLowerCase()]) result[t.toLowerCase()] = 0;
          result[t.toLowerCase()] += 1;
        });
        return result;
      },{}));
    });
  },
  random : (options) => {
    readYamlFiles(options.cardspath).then(readdenYamlFiles => {
      const candidates = readdenYamlFiles.reduce((result, yamlFile) => {
        const element = yamlFile.doc.tags || '';
        element.split(',').forEach(t => {
          t = t.trim();
          if (t === options.commandArgument[0]) result.push(yamlFile.fileName);
        });
        return result;
      },[]);
      if (candidates.length > 0) {
         const candidate = path.basename(candidates[Math.floor(Math.random()*candidates.length)],'.yaml');
         readDir(options.cardspath, f => path.basename(f,'.md') === candidate || path.basename(f,'.body') === candidate).then(files => {
           readFile(path.format({
             root: __dirname,
             dir: options.cardspath,
             base: files[0]
           })).then(file => {
              console.log(file.content);
           });

         });
      }
    });
  }
};


inquirer.prompt(questions).then((answers) => {

  const cardspath = answers.cardspath || commander.cardspath;
  const command = commander.args[0];
  const commandArgument = commander.args.splice(1);

  const option = {
    cardspath,
    commandArgument
  };

  exec[command](option);
});
