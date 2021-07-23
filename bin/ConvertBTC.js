'use strict';

var _require = require('./config'),
    apiURL = _require.apiURL,
    apiPublicKey = _require.apiPublicKey;

var request = require('request');
var chalk = require('chalk');
var ora = require('ora');

var spinner = ora({
  text: 'Retrieving Bitcoin data...',
  color: 'yellow'
});

function convertBTC() {
  var currency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'USD';
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var fields = 'only_results,bitcoin';
  var url = apiURL + '/finance?array_limit=1&fields=' + fields + '&key=' + apiPublicKey;

  spinner.start();
  // eslint-disable-next-line consistent-return
  request(url, function (error, response, body) {
    var apiResponse = void 0;
    spinner.stop();
    try {
      apiResponse = JSON.parse(body);
    } catch (parseError) {
      console.log(chalk.red('Something with error.'));
      return parseError;
    }

    var _apiResponse = apiResponse,
        bitcoin = _apiResponse.bitcoin;

    var quoates = [];
    var keys = Object.keys(bitcoin);

    keys.forEach(function (key) {
      var source = bitcoin[key];
      var format = source.format;

      if (format.includes(currency)) {
        quoates.push(source);
      }
    });

    var quoate = quoates[0];

    var value = quoate.last;
    var price = value * amount;
    console.log(chalk.red(amount) + ' BTC to ' + chalk.cyan(currency) + ' = ' + chalk.yellow(price.toFixed(2)));
  });
}

module.exports = convertBTC;