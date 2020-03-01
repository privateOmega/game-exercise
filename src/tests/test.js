const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../server');

chai.use(chaiHttp);
chai.should();

describe('App', () => {
  describe('/status GET', () => {
    it('should give 200status', done => {
      chai
        .request(server)
        .get('/status')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
