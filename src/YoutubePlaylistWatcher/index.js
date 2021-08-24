const Axios = require('axios');
const Youtube = require('youtube-search-api');
const SETTINGS = require('../settings.js');

module.exports = async function (context, request) {


  const entries = await Youtube.GetPlaylistData('PLLH5azr5WTPdSsOMZaB9gq0Q2X0W80Ess');

  console.log(entries);

  if (!entries || entries.items.length < 1) {
    return;
  }

  entries.items.forEach(video => {
    console.log(video.shortBylineText.runs[0].text);
  });



};
