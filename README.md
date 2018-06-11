# Health Check Documentation

## __Rss Feed check__ - JS FILE:- rssPoll.js
>This file contains the function which crawls the rss
> feeds of amazon and google cloud services concerned 
>by us, and sends mail when a certain alert is triggered.

## __Ping Health Check__ - JS File:- ping_health.js
>Pings our websites,apis or instances continuously…if
> unable to get ping packets back for over a duration
> of time (decided by us),alert will be triggered.

## __Mailer__:- JS FILE:-mail.js
>An exported function which is used to send emails<br>
var email = (type, defectedService, error, cause)<br>
>it has 4 parameters used by handlebars to make the templates of the mail. 
>the "type" parameter defines what template will be used thus what type of mail is being sent ,making the
> flexible enough to be function to be used anywhere in our codebase.

## __Common Config File__:- mappedConfig.json
>It contains all the initial config for the whole codebase ,all other json files are generated this file using loader.js 
>This makes it also maps the services with our sites to know the cause of site being down.

### Fields in mappedConfig:-
>Mailinglist:- It contains the list of people to be alerted when alarm is triggered.<br>
>Checkers:- It contains list of health checkers up right now<br>
>Map:- It contains the maping between sites and cloud services.<br>

## __LOADER.JS , pingConfig.json , rssConfig.json:-__
>The 2 json files contain the state for rssPoll and ping_health functions. The Loader.js generates or updates these 2 files on initial setup or changes in main config file.



