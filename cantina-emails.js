var app = require('cantina')
  , nodemailer = require('nodemailer')
  , handlebars = require('handlebars')
  , path = require('path')
  , fs = require('fs')
  , loadTemplate = require('yaml-front-matter').loadFront
  , marked = require('marked')
  , glob = require('glob');

// Default conf.
app.conf.add({
  emails: {
    transport: 'Stub',
    templates: {
      root: './emails/templates'
    }
  }
});

// Get conf.
var conf = app.conf.get('emails');

// Create mailer if one doesn't exist.
if (!app.mailer) {
  app.mailer = nodemailer.createTransport(conf.transport, conf);
}

// Setup API.
app.emails = app.emails || {};
app.emails.templates = {};
app.emails.sent = [];

// Send an email.
app.emails.send = function (name, vars, cb) {
  if (typeof vars === 'function') {
    cb = vars;
    vars = {};
  }

  app.hook('emails:send:before').run(name, vars, function (err) {

    // Get template.
    var template = app.emails.templates[name];
    if (!template) return cb(new Error('email template not found: ' + name));

    // Prepare email.
    var email = {};
    Object.keys(template).forEach(function (k) {
      if (typeof template[k] === 'function') {
        email[k] = template[k].call(template, vars);
      }
      else {
        email[k] = template[k];
      }
    });
    email.html = marked(email.text);

    // Send email.
    app.mailer.sendMail(email, function (err, resp) {
      if (err) return cb(err);

      if (resp && process.env.NODE_ENV !== 'production') {
        app.emails.sent.push(resp);
      }

      app.log('email', {
        to: email.to,
        from: email.from,
        subject: email.subject,
        date: new Date(),
        template: name,
        variables: vars
      });

      app.hook('emails:send:after').run(name, vars, email, resp, cb);
    });
  });
};

// Load templates.
var root = path.resolve(app.root, conf.templates.root);
if (fs.existsSync(root)) {
  glob.sync('**/*.md', {cwd: root}).forEach(function (file) {
    var template = loadTemplate(path.resolve(root, file), 'text');
    Object.keys(template).forEach(function (k) {
      if (typeof template[k] === 'string') {
        template[k] = handlebars.compile(template[k]);
      }
    });
    app.emails.templates[file.replace(/\.md$/, '')] = template;
  });
}
