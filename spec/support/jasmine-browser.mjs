export default {
  srcDir: "dist",
  srcFiles: [
    "synonym.js"
  ],
  specDir: "spec",
  specFiles: [
    "**/*[sS]pec.mjs"
  ],
  helpers: [
    "helpers/**/*.js"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    stopOnSpecFailure: false,
    random: true
  },
  browser: {
    name: "chrome",
    "useRemoteSeleniumGrid": true,
    "remoteSeleniumGrid": {
      "url": "http://localhost:4444"
    }
  },
  defaultSpecFileExtension: "mjs"
};
