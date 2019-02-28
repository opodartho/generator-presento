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
      revealTheme: "black",
      deployToGithubPages: true,
      githubRepository: slugify(this.appname),
      dockerize: false
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the best ${chalk.red("Reveal.js")} generator!`));

    const prompts = [
      {
        name: "presentationTitle",
        message: "What are you going to talk about?",
        default: this.appname,
        validate: function(input) {
          if (input === "") return "Please enter presentation title.";
          return true;
        }
      },
      {
        name: "presentationDescription",
        message: "A breif description of this presentation"
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
        name: "revealTheme",
        type: "list",
        message: "What Reveal.js theme would you like to use?",
        choices: this.fs.readJSON(path.join(__dirname, "./themes.json")),
        default: this.config.get("revealTheme")
      },
      {
        name: "deployToGithubPages",
        message: "Will you be deploying to GitHub?",
        type: "confirm",
        default: this.config.get("deployToGithubPages")
      },
      {
        name: "githubUsername",
        message: "What is your Github username?",
        default: this.config.get("githubUsername"),
        store: true,
        when: props => {
          return props.deployToGithubPages;
        }
      },
      {
        name: "githubRepository",
        message: "What is the Github repository name?",
        default: this.config.get("githubRepository"),
        when: props => {
          return props.deployToGithubPages;
        }
      },
      {
        name: "author",
        message: "What is your name?",
        default: this.config.get("author"),
        store: true
      },
      {
        name: "email",
        message: "What is your email address?",
        default: this.config.get("email"),
        store: true
      },
      {
        type: "confirm",
        name: "dockerize",
        message: "Do you want to create docker image?",
        default: this.config.get("dockerize")
      }
    ];

    return this.prompt(prompts).then(props => {
      this.config.set("presentationTitle", props.presentationTitle);
      this.config.set("presentationDescription", props.presentationDescription);
      this.config.set("packageVersion", props.packageVersion);
      this.config.set("deployToGithubPages", props.deployToGithubPages);
      this.config.set("githubUsername", props.githubUsername);
      this.config.set("githubRepository", props.githubRepository);
      this.config.set("revealTheme", props.revealTheme);
      this.config.set("author", props.author);
      this.config.set("email", props.email);
      this.config.set("dockerize", props.dockerize);
    });
  }

  default() {
    let website = "";
    if (this.config.deployToGithubPages) {
      website = "https://github.com/" + this.get("githubUsername");
    }
    this.composeWith(require.resolve("generator-license"), {
      name: this.config.get("author"),
      email: this.config.get("email"),
      website: website,
      licensePrompt: "Which license do you want to use?",
      defaultLicense: "MIT",
      publish: true
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath("templates/_section.html"),
      this.destinationPath("templates/_section.html")
    );
    this.fs.copyTpl(
      this.templatePath("templates/_index.html"),
      this.destinationPath("templates/_index.html"),
      { config: this.config }
    );
    this.fs.copy(
      this.templatePath("slides/_slides.json"),
      this.destinationPath("slides/slides.json")
    );
    this.fs.copyTpl(
      this.templatePath("slides/_intro.md"),
      this.destinationPath("slides/intro.md"),
      { config: this.config }
    );
    this.fs.copyTpl(
      this.templatePath("_gruntfile.js"),
      this.destinationPath("gruntfile.js"),
      { config: this.config }
    );
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"),
      { slugify: slugify, config: this.config }
    );
    this.fs.copy(
      this.templatePath("_gitignore"),
      this.destinationPath(".gitignore")
    );
    this.fs.copy(
      this.templatePath("../../../.editorconfig"),
      this.destinationPath(".editorconfig")
    );

    if (this.config.get("dockerize")) {
      this.fs.copy(
        this.templatePath("nginx/_default.conf"),
        this.destinationPath("nginx/default.conf")
      );
      this.fs.copy(
        this.templatePath("_dockerfile"),
        this.destinationPath("Dockerfile")
      );
      this.fs.copy(
        this.templatePath("_dockerignore"),
        this.destinationPath(".dockerignore")
      );
    }
  }

  install() {
    // TODO: Need to find a way to create readme after license generator execute.
    const pkg = this.fs.readJSON(this.destinationPath("package.json"), {});
    this.fs.copyTpl(
      this.templatePath("_README.md"),
      this.destinationPath("README.md"),
      { config: this.config, license: pkg.license }
    );

    if (this.config.get("deployToGithubPages")) {
      this.spawnCommandSync("git", ["init"]);
      this.spawnCommandSync("git", [
        "remote",
        "add",
        "origin",
        "git@github.com:" +
          this.config.get("githubUsername") +
          "/" +
          this.config.get("githubRepository") +
          ".git"
      ]);
    }
    this.installDependencies({
      npm: true,
      bower: false
    });
  }
};
