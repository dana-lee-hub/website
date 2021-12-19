// @ts-check

const title = require("title");

// Heads up! this **overrides** data set anywhere else, including in the front matter of a page.
module.exports = {
  teams: ({ teams }) =>
    teams?.home
      ? teams.home.name === "Brown"
        ? {
            opponent: teams.away.name,
            isHome: true,
          }
        : {
            opponent: teams.home.name,
            isHome: false,
          }
      : null,

  title(data) {
    if (data.title) return data.title;

    if (data.opponent) {
      return (
        data.opponent +
        (data.page.filePathStem.endsWith("-censored") ? " (Censored)" : "") +
        (data.iceShowTheme ? ` (${data.iceShowTheme} Ice Show)` : "")
      );
    }

    return title(data.page.fileSlug.replaceAll("-", " "), {
      special: ["NBC", "ADOCH"],
    });
  },
};
