cantina-email
==============

Email sending and templating for Cantina applications.


Provides
--------

- **app.email.send (name, vars, cb)** - Send an email using a named template.
- **app.email.loadTemplates (templateDir, weight)** - Add a loader to the hook
  `email:load:templates` which will load email templates from an
  additional directory, with an optional weight.

Hooks
-----

- **email:load:templates (cb)** - The templates are being loaded onto
  `app.email.templates`. Plugins can hook in here to add their own
  directory in addition to the app root dir.
- **email:send:before (name, vars, cb)** - An email is about to be sent. you can
  modify the variables by reference.
- **email:send:after (name, vars, email, response, cb)** - An email was just
  sent.

Configuration
-------------

**Defaults**

```js
email: {
  transport: 'Stub',
  templates: {
    root: './email/templates'
  }
}
```

Templates
---------

Templates are markdown files with yaml front-matter.

**Example:**

```md
---
to: '{{{to.name}}} <{{{to.email}}}>'
from: '{{{from.name}}} <{{{from.email}}}>'
subject: 'Cantina Email: Example'
---
Hey {{to.name}},

This is an example of cantina-email. It is the most {{adjective}} email sending
module out there.

Regards,
{{from.name}}

--
Sent by Cantina
```

**Note:** The variables can be whatever you want. In the example above we've
used `vars.to` and `vars.from` to store the sender and recipient info, but it
could have just as easily been fetched from `vars.user.username` etc.

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Santa Cruz, CA and Washington, D.C.
