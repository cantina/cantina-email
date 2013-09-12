describe('basic test', function () {
  var app
    , vars = {
      to: {
        name: 'Dude',
        email: 'dude@thedude.com'
      },
      from: {
        name: 'Brian',
        email: 'cpsubrian@gmail.com'
      },
      adjective: 'splendid'
    };

  before(function (done) {
    app = require('cantina');
    app.boot(function (err) {
      assert.ifError(err);

      app.silence();
      require('../');

      app.start(done);
    });
  });

  after(function (done) {
    app.destroy(done);
  });

  it('can load and parse templates', function () {
    var template = app.email.templates.test;
    assert.equal(template.to(vars), 'Dude <dude@thedude.com>');
    assert.equal(template.text(vars), '\n' +
      'Hey Dude,\n' +
      '\n' +
      'This is a test of cantina-emails. It is the most splendid email sending\n' +
      'module out there.\n' +
      '\n' +
      'Regards,\n' +
      'Brian\n' +
      '\n' +
      '--\n' +
      'Sent by Cantina');
  });

  it('can send', function (done) {
    app.email.send('test', vars, function (err) {
      var email;

      assert.ifError(err);
      assert.equal(app.email.sent.length, 1);

      email = app.email.sent.pop();
      assert.equal(email.envelope.stamp, 'Postage paid, Par Avion');

      done();
    });
  });

  it('can use the before and after hooks', function (done) {
    app.hook('email:send:before').add(function (name, vars, next) {
      vars.adjective = 'super';
      next();
    });
    app.hook('email:send:after').add(function (name, vars, email, resp, next) {
      assert.equal(vars.adjective, 'super');
      done();
    });
    app.email.send('test', vars, function (err) {
      assert.ifError(err);
    });
  });
});