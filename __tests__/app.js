"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-presento:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ presentationTitle: "foo" });
  });

  it("creates files", () => {
    assert.file(["package.json"]);
  });
});
