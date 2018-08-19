process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../server');
var knex = require('../db/knex');

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

  beforeEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        knex.migrate.latest()
          .then(function () {
            return knex.seed.run()
              .then(function () {
                done();
              });
          });
      });
  });

describe('GET /api/v1/projects', () => {
  it('should return the all the projects', done => {
    chai.request(app)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.length(1);
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
});

describe('POST /api/v1/projects/new', () => {
  it('should create a new project', done => {
    chai.request(app)
    .post('/api/v1/projects/new')
    .send({
      project_name: 'New Project'
    })
    .end((error, response) => {
      response.should.have.status(201);
      response.should.be.json;
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(2);
      done();
    })
  });

  it('should not create a project with missing data', done => {
    chai.request(app)
    .post('/api/v1/projects/new')
    .end((error, response) => {
      response.should.have.status(422);
      response.body.should.have.property('error');
      response.body.error.should.equal(`Expected format: { project_name: <String> }. You're missing a "project_name" property.`);
      done();
    })
  })
});


});
