"use strict";
const path = require("path");
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const semver = require("semver");
const slugify = require("slugify");

module.exports = class extends Generator {
  initializing() {
    this.pkg = this.fs.readJSON(path.join(__dirname, "../package.json"));
    this.config.defaults({
      packageVersion: "0.0.0",
      deployToGithubPages: false
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the best ${chalk.red("generator-presento")} generator!`)
    );

    const prompts = [
      {
        name: "presentationTitle",
        message: "What are you going to talk about?",
        validate: function(input) {
          if (input === "") return "Please enter presentation title.";
          return true;
        }
      },
      {
        name: "packageVersion",
        message: "What version should we put in the package.json file?",
        default: this.config.get("packageVersion"),
        validate: function(input) {
          if (!semver.valid(input)) {
            return "Please enter a correct version, i.e. MAJOR.MINOR.PATCH";
          }
          return true;
        }
      },
      {
        name: 'deployToGithubPages',
        message: 'Do you want to deploy you presentation to Github Pages? This requires an empty Github repository.',
        type: 'confirm',
        default: this.config.get('deployToGithubPages')
      },
      {
        name: 'githubUsername',
        message: 'What is your Github username?',
        default: this.config.get('githubUsername'),
        when: function(props) {
          if(props.deployToGithubPages) return true;
        }
      },
      {
        name: 'githubRepository',
        message: 'What is the Github repository name?',
        default: this.config.get('githubRepository'),
        when: function(props) {
          if(props.deployToGithubPages) return true;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      this.config.set("presentationTitle", props.presentationTitle);
      this.config.set("packageVersion", props.packageVersion);
      this.config.set("deployToGithubPages", props.deployToGithubPages);
      this.config.set("githubUsername", props.githubUsername);
      this.config.set("githubRepository", props.githubRepository);
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"),
      { slugify: slugify, config: this.config }
    );
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false
    });
  }
};
