"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-presento:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ presentationTitle: "foo" })
      .withPrompts({ presentationDescription: "bar" })
      .withPrompts({ dockerize: true });
  });

  it("creates files", () => {
    assert.file([
      "package.json",
      "templates/_index.html",
      "templates/_section.html",
      "slides/slides.json",
      "slides/intro.md",
      "gruntfile.js",
      ".gitignore",
      "nginx/default.conf",
      "Dockerfile",
      ".dockerignore",
      ".editorconfig",
      "LICENSE"
    ]);
  });
});
