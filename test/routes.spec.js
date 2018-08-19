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

  it('should not return the homepage if the wrong url is entered', done => {
    chai.request(app)
      .get('/chickens')
      .end((error, response) => {
        response.should.have.status(404);
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

describe('GET /api/v1/projects/:id', () => {
  it('should return a single project', done => {
    chai.request(app)
      .get('/api/v1/projects/1')
      .end((error, response) => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.length(1);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('project_name');
        response.body[0].id.should.equal(1);
        response.body[0].project_name.should.equal('apple');
        done();
      })
  });

  it('should not return a project if it doesnt exist', done => {
    chai.request(app)
      .get('/api/v1/projects/7')
      .end((error, response) => {
        response.should.have.status(404)
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        done();
      })
  });
});

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a single palette', done => {
      chai.request(app)
        .get('/api/v1/palettes/1')
        .end((error, response) => {
          response.should.have.status(200)
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length(1);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('palette_name');
          response.body[0].should.have.property('color1');
          response.body[0].should.have.property('color2');
          response.body[0].should.have.property('color3');
          response.body[0].should.have.property('color4');
          response.body[0].should.have.property('color5');
          response.body[0].id.should.equal(1);
          response.body[0].palette_name.should.equal('green');
          response.body[0].color1.should.equal('#1f646d');
          response.body[0].color2.should.equal('#2dd066');
          response.body[0].color3.should.equal('#a3e25b');
          response.body[0].color4.should.equal('#1d5e6d');
          response.body[0].color5.should.equal('#79e926');
          done();
        })
    });

    it('should not return a palette if it doesnt exist', done => {
      chai.request(app)
        .get('/api/v1/palettes/79')
        .end((error, response) => {
          response.should.have.status(200)
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length(0);
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

  describe('POST /api/v1/palettes/new', () => {
    it('should create a new palette', done => {
      chai.request(app)
        .post('/api/v1/palettes/new')
        .send({
          palette_name: 'New Palette',
          color1: 'green',
          color2: 'blue',
          color3: 'red',
          color4: 'magenta',
          color5: 'yellow',
          project_id: 1
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

    it('should not create a palette with missing data', done => {
      chai.request(app)
        .post('/api/v1/palettes/new')
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          response.body.error.should.equal(`You\'re missing a "palette_name" property.`);
          done();
        })
    })
  });

  describe('DELETE /api/v1/palettes/delete/:id', () => {
    it('should delete a palette', done => {
      chai.request(app)
        .delete('/api/v1/palettes/delete/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('status');
          response.body.status.should.equal(`Succesfully deleted 1`);
          done();
        })
    })
  })

});
