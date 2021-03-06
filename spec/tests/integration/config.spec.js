const { HTTP_METHODS } = require('../../../src/js/config/consts');
const { sims } = require('../../helpers/simulatorHelpers');
const runApp = require('../../support/runApp');

describe('Configured Simulator', () => {
  let server, request;

  beforeAll(done => {
    server = runApp(done);
  });

  describe('/simulators/test', () => {
    beforeEach(() => {
      request = sims.get('/simulators/test');
    });

    it('returns configured body', done => {
      request
        .then(({ data }) => expect(data).toEqual({ some: 'response' }))
        .then(done);
    });

    it('returns the default status', done => {
      request
        .then(({ status }) => expect(status).toEqual(200))
        .then(done);
    });
  });

  describe('/simulators/some-path', () => {
    beforeEach(() => {
      request = sims.post('/simulators/some-path');
    });

    it('returns configured body', done => {
      request
        .then(({ data }) => expect(data).toEqual({ data: 'some-path' }))
        .then(done);
    });

    it('returns the configured status', done => {
      request
        .then(({ status }) => expect(status).toEqual(201))
        .then(done);
    });
  });

  describe('/simulators/headers', () => {
    beforeEach(() => {
      request = sims.delete('/simulators/headers');
    });

    it('returns configured headers', done => {
      request
        .then(({ headers }) => {
          expect(headers['x-custom-header']).toEqual('some header');
          expect(headers['proxy-authenticate']).toEqual('Monkey');
        }).then(done);
    });

    it('returns the configured status', done => {
      request
        .then(({ status }) => expect(status).toEqual(203))
        .then(done);
    });
  });

  describe('/simulators/delay', () => {
    let before;

    beforeEach(() => {
      before = new Date;
      request = sims.get('/simulators/delay');
    });

    it('waits 0.5 second before responding', done => {
      request
        .then(() => {
          const after = new Date;
          expect(after - before).not.toBeLessThan(500);
        }).then(done);
    });
  });

  describe('/simulators/smart/path', () => {
    let randomBody;

    beforeEach(() => {
      randomBody = { random: String(Math.random() * 1000) };
      request = sims.put('/simulators/smart/path', randomBody);
    });

    it('returns the supplied body', done => {
      request
        .then(({ data }) => expect(data).toEqual(randomBody))
        .then(done);
    });

    it('returns the defined status', done => {
      request
        .then(({ status }) => expect(status).toEqual(418))
        .then(done);
    });
  });

  describe('/simulators/path/:with-param', () => {
    it('accepts request with a value', done => {
      sims.get('/simulators/path/param-value')
        .then(({ data }) => expect(data).toEqual({ a: 'ok' }))
        .then(done);
    });

    it('accepts request without a value', done => {
      sims.get('/simulators/path/:withParam')
        .then(({ data }) => expect(data).toEqual({ a: 'ok' }))
        .then(done);
    });
  });

  describe('/simulators/multi-method', () => {
    HTTP_METHODS.forEach(method => {
      describe(`with method: ${method.toUpperCase()}`, () => {
        beforeEach(() => {
          request = sims[method]('/simulators/multi-method', {});
        });

        it('responds with the configured status', done => {
          request
            .then(({ status }) => expect(status).toEqual(207))
            .then(done);
        });

        it('responds with the method used', done => {
          request
            .then(({ data }) => expect(data.method).toEqual(method))
            .then(done);
        });
      });
    });
  });

  afterAll(() => {
    server.close();
  });
});