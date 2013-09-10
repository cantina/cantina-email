cantina-emails
==============

Email sending and templating for Cantina applications.


Provides
--------

- **app.emails.send (name, vars, cb)** - Send an email using a named template.

Hooks
-----

- **emails:send:before (name, vars, cb)** - An email is about to be sent. you can
  modify the variables by reference.
- **emails:send:after (name, vars, email, response, cb)** - An email was just
  sent.

Configuration
-------------

**Defaults**

```js
emails: {
  transport: 'Stub',
  templates: {
    root: './emails/templates'
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
subject: 'Cantina Emails: Example'
---
Hey {{to.name}},

This is an example of cantina-emails. It is the most {{adjective}} email sending
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