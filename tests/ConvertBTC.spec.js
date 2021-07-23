/* eslint-disable */
const nock = require('nock');
const chalk = require('chalk');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);

const convertBTC = require('../src/ConvertBTC');
const { apiURL, apiPublicKey } = require('../src/config');

describe('ConvertBTC', () => {
  let consoleStub;

  let responseMock = {
    "bitcoin": {
      "blockchain_info": {
        "name":"Blockchain.info",
        "format":["USD","en_US"],
        "last":32544.17,
        "buy":32544.17,
        "sell":32544.17,
        "variation":0.843
      },
      "coinbase": {
        "name":"Coinbase",
        "format":["USD","en_US"],
        "last":32526.11,
        "variation":0.813
      },
      "bitstamp": {
        "name":"BitStamp",
        "format":["USD","en_US"],
        "last":32532.46,
        "buy":32531.47,
        "sell":32518.54,
        "variation":0.734
      },
      "foxbit": {
        "name":"FoxBit",
        "format":["BRL","pt_BR"],
        "last":170083.05,
        "variation":-0.312
      },
      "mercadobitcoin": {
        "name":"Mercado Bitcoin",
        "format":["BRL","pt_BR"],
        "last":169988.03999,
        "buy":169988.03999,
        "sell":169988.04,
        "variation":0.787
      }
    }
  };

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  })

  afterEach(() => {
    console.log.restore();
  })

  it('should use currenct USD and 1 as amount default', (done) => {
    nock(apiURL)
      .get('/finance')
      .query({
        array_limit: 1,
        fields: 'only_results,bitcoin',
        key: apiPublicKey
      })
      .reply(200, responseMock);

    convertBTC();

    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow('32544.17')}`);
      done();
    }, 300);
  });

  it('should use currenct BRL and 10 as amount default', (done) => {
    nock(apiURL)
      .get('/finance')
      .query({
        array_limit: 1,
        fields: 'only_results,bitcoin',
        key: apiPublicKey
      })
      .reply(200, responseMock);

    convertBTC('BRL', 10);

    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWith(`${chalk.red(10)} BTC to ${chalk.cyan('BRL')} = ${chalk.yellow('1700830.50')}`);
      done();
    }, 300);
  });

  it('should return Something with error when some params has error.', (done) => {
    nock(apiURL)
      .get('/finance')
      .query({
        array_limit: 1,
        fields: 'only_results, bitcoin',
        key: apiPublicKey
      })
      .reply(200, responseMock);

    convertBTC('ccc');

    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWith(chalk.red('Something with error.'));
      done();
    }, 300);
  });
});
