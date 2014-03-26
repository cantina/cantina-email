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
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT
Copyright (C) 2013 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.