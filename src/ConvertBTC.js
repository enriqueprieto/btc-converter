const { apiURL, apiPublicKey } = require('./config');
const request = require('request');
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora({
  text: 'Retrieving Bitcoin data...',
  color: 'yellow',
});

function convertBTC(currency = 'USD', amount = 1) {
  const fields = 'only_results,bitcoin';
  const url = `${apiURL}/finance?array_limit=1&fields=${fields}&key=${apiPublicKey}`;

  spinner.start();
  // eslint-disable-next-line consistent-return
  request(url, (error, response, body) => {
    let apiResponse;
    spinner.stop();
    try {
      apiResponse = JSON.parse(body);
    } catch (parseError) {
      console.log(chalk.red('Something with error.'));
      return parseError;
    }

    const { bitcoin } = apiResponse;
    const quoates = [];
    const keys = Object.keys(bitcoin);

    keys.forEach((key) => {
      const source = bitcoin[key];
      const { format } = source;
      if (format.includes(currency)) {
        quoates.push(source);
      }
    });

    const quoate = quoates[0];

    const value = quoate.last;
    const price = value * amount;
    console.log(`${chalk.red(amount)} BTC to ${chalk.cyan(currency)} = ${chalk.yellow(price.toFixed(2))}`);
  });
}

module.exports = convertBTC;
