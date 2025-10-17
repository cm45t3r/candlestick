/*
 * Copyright (C) 2016-present cm45t3r.
 * MIT License.
 */

module.exports = {
  ...require("./hammer.js"),
  ...require("./invertedHammer.js"),
  ...require("./engulfing.js"),
  ...require("./harami.js"),
  ...require("./kicker.js"),
  ...require("./reversal.js"),
  ...require("./doji.js"),
  ...require("./morningStar.js"),
  ...require("./eveningStar.js"),
  ...require("./threeWhiteSoldiers.js"),
  ...require("./threeBlackCrows.js"),
  ...require("./piercingLine.js"),
  ...require("./darkCloudCover.js"),
  ...require("./patternChain.js"),
  utils: require("./utils.js"),
  plugins: require("./pluginManager.js"),
  metadata: require("./patternMetadata.js"),
};
