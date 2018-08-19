const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', done => {
    chai.request(app)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });
});


describe('API Routes', () => {

describe('GET /api/v1/projects', () => {
  it('should return the all the projects', done => {
    chai.request(app)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.length(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('project_name');
        response.body[0].project_name.should.equal('apple');
        done();
      })
  });
});

describe('GET /api/v1/palettes', () => {
  it('should return the all the palettes', done => {
    chai.request(app)
      .get('/api/v1/palettes')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        done();
      })
  });
})
});
