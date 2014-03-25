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
  email: {
    transport: 'Stub',
    templates: {
      root: './email/templates'
    }
  }
});

// Get conf.
var conf = app.conf.get('email');

// Create mailer if one doesn't exist.
if (!app.mailer) {
  app.mailer = nodemailer.createTransport(conf.transport, conf);
}

// Setup API.
app.email = app.email || {};
app.email.templates = {};
app.email.sent = [];

// Send an email.
app.email.send = function (name, vars, cb) {
  if (typeof vars === 'function') {
    cb = vars;
    vars = {};
  }

  app.hook('email:send:before').run(name, vars, function (err) {

    // Get template.
    var template = app.email.templates[name];
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
        app.email.sent.push(resp);
      }

      app.log('email', {
        to: email.to,
        from: email.from,
        subject: email.subject,
        date: new Date(),
        template: name,
        variables: vars
      });

      app.hook('email:send:after').run(name, vars, email, resp, cb);
    });
  });
};

// Allow other plugins to register additional template directories.
app.email.registerTemplateDir = function (namespace, templateDir) {
  if (fs.existsSync(templateDir)) {
    glob.sync('**/*.md', {cwd: templateDir}).forEach(function (file) {

      //Don't override root templates if there is a namespace collision
      var namespaced_name = namespace + '/' + file.replace(/\.md$/, '');
      if (app.email.templates[namespaced_name]) return;

      var template = loadTemplate(path.resolve(root, file), 'text');
      Object.keys(template).forEach(function (k) {
        if (typeof template[k] === 'string') {
          template[k] = handlebars.compile(template[k]);
        }
      });
      app.email.templates[namespaced_name] = template;
    });
  }
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
    app.email.templates[file.replace(/\.md$/, '')] = template;
  });
}
