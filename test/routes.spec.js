const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', done => {
    chai.request(app)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        done();
      })
  });
});

describe('API Routes', () => {

});