# A2SV Companion backend

### authenticate route

Github redirects to this page for the A2SV companion app, the route is responsible for generating access token for the new user and returning it inside html page to the client.

A2SV companion extension parses the page and extracts `access token`

### api route

Responsible for updating main sheet, and mongodb database

- Currently uses the mongodb charts demo database

### backup

Currently, storing secondary backup on google spreadsheet (updated through google form)
