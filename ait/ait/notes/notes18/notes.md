## MILESTONE 2
AFTER this milestone can't change project idea

u can still change the scope
* change research topic
* cut/add features
* try to keep README somewhat up-to-date

# requirements

1. u must have one working form
    * this form can be AJAX
    * it has to demonstrate that data is saved in some sort of server side data store
    * preference is something other than login/registration
    * if u have login, add note about login that should be used or tell us to create our own
2. _any_ progress on research topic
    * even if it's not working ... this is ok!
3. deployment - thru courant's web servers
    * non-trivial

courant's servers:
* access.cims.nyu.edu --> access via ssh
* linserv1.cims.nyu.edu --> access via ssh (from access.cims)

1. node version eol (16.x.x)
2. there are some modules missing
    * u won't be able to compile argon2id
3. u will have ur own port (starting at 20xxx)
4. if u want two separate servers, u can increment ur port by 1
5. ur access to this server is only valid as long as u have class that uses it
    * not a long term home for deployment
    * other places for deployment after-the-fact
        * railway, vercel \*, azure, ec2, digital ocean, linode

deployment
1. prepare your app
2. create a database
3. remote access to server/prepare server directories
4. get code onto server
5. install dependencies
6. configure
7. test running app
8. make app long running process (daemon)

### environments
* production environment - where ur users are actually using ur app
    * u don't want to break this
    * u don't want to direcrly develop against ur production environment
    * consists of working code
    * also a production database
* local dev environment - where u dev new features
    * ur local working copy of repo
    * database is just a local instance of mongodb
* other environments (informational):
    * testing/qa environments - where QA team will actually test ur new features
    * staging environment - as close to production as possible

### dependencies
1. package.json is present in repo
    * it has all your deps
2. `node_modules` is git ignored
    * check your repo site to ensure that it's not in repo

### make sure app configurable

any part of application that would change based on environment that you're in OR sensitive information that you don't want to hardcode in source code
* dsn (this may contain pass)
* port number
* api keys

create a .env for each environment
* make sure that .env is in ur .gitignore
    * .env.example
* locally
    * dsn=mongodb://localhost/foo
* production
    * dsn=mongodb://mongodb.atlas.url/bar

in separate config module (config.mjs maybe)
* use `dotenv`
* rememebr to call `config`()

import config before everything else

change all of your hardcoded values to process.env.*

remember to create your development (local) .env

Make sure app sitll works after the fact

### make ur database
we'll use mongodb atlas - cloud mongodb service
* there's a free tier
* u have to make an account
* minimally 2 sets of credentials required
    * username/password for site itself (typically ur email)
    * u/p to connect to database (this is what ur app will use)
* define what ip addresses can connect to db

### prep our server
* make a directory to store our application (opt directory)
* ssh'ing into remote server(s)

### get code onto server
* git clone
* if ur using https url
    * make sure u use classic token with repo perms, and extend the expiry appropriately
    * generate ssh keys on linserv1, copy public key to github settings

### install dependencies
* cd into project dir
* npm install

### configure
* in your .env file at root of project
* click on connect --> drivers --> copy db connection string
* repace password w/ actual password
* add database name

### run

* node name_of_app.mjs
* stopping server or logging out or closing laptop will halt app

### convert app to long running process (daemon)

* we want to run process in background
* we would like app to restart on crash

use module called pm2 (npm install pm2)

* allows u to background a process
* manage running processes

### u want to make changes / deploy again
(nano for terminal)

* stop ur server w/ pm2
* verify that it's not running by going to site
* git pull
* if u've added new deps
    * npm install again
* u shouldn't need to create/modify .env unless ur password changed for sb
* pm2 start myapp
* verify changes in place!

⚠️⚠️⚠️⚠️⚠️ - don't use nano and modify ur code on server

