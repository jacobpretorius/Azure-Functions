const Axios = require('axios');
const Moment = require('moment');
const SETTINGS = require('../settings.js');

module.exports = async function (context, request) {
  if (request.query.activity.length < 1 
      || request.query.count.length < 1
      || request.query.timestamp.length < 1) {
    context.log.error('Request error');
    context.done();
  }

  const codaApiUrl = `https://coda.io/apis/v1/docs/${SETTINGS.CODA.DOC_ID}/tables/${SETTINGS.CODA.TABLE_ID}/rows`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SETTINGS.CODA.API_TOKEN}`
    }
  };

  const body = {
    "rows": [
      {
        "cells": [
          {
            "column": "c-o_db0Cl8Qj",
            "value": `${Moment(request.query.timestamp).format()}`
          },
          {
            "column": "c-PIjNEmwpcQ",
            "value": `${request.query.activity}`
          },
          {
            "column": "c-zaQVx4iX2q",
            "value": `${request.query.count}`
          }
        ]
      }
    ]
  }

  Axios
    .post(
      codaApiUrl,
      JSON.stringify(body),
      config)
    .then(response => {
      context.done()
    })
    .catch(error => {
      context.log.error(error);
      context.done(error);
    });
};
