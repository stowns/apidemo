var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:8080'),
    _ = require('lodash'),
    async = require('async')
    http = require('http');

describe('Tests parters', function() {
  this.timeout(15000);

  it('Gets parter_1', function(done) {

    // calls = _.times(100, function(n) {
    //   // return  function() { 
    //   //           api.get('/api/v1/partner_1')
    //   //             .expect('Content-Type', /json/)
    //   //             .expect(200)
    //   //         }

    //   return function() { 
    //     http.get("http://localhost:8080/api/v1/partner_3", function(res) {
    //     console.log("Got response: " + n + ' ' + res.statusCode);
    //     }).on('error', function(e) {
    //       console.log("Got error: " + n + ' '  + e.message);
    //     });
    //   }
    // });

    // async.parallel(calls, function(err, results) {
    //   if (err) return console.log('error');
    //   done();
    // });
    var count = 0;
    var complete = 0;
    var goal = 100

    var timer = setInterval(function(){ 
      if ( count < goal ) { 
        http.get("http://localhost:8080/api/v1/partner_3/" + count, function(res) {
          complete++
          console.log("Got response: " + complete + ' ' + res.statusCode);
          if (complete === goal) {
            done();
          }
        }).on('error', function(e) {
          console.log("Got error: " + count + ' ' + e.message);
        });
        count++; 
      } else { 
        clearInterval( timer ); 
      } 
    }, 10);
  });

});