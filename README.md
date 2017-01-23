# B.E.A.K.E.R.

B.E.A.K.E.R. is a voice-activated, networked laboratory information management system that runs in Google Chrome as a single-page application. B.E.A.K.E.R. accepts voice commands for recording lab notebook entries, searching for information from past notebook logs, and performing simple scientific calculations. The app can record instructions from a phone browser, and then display results on a different device (e.g., a lab-mounted, networked tablet). Using B.E.A.K.E.R., scientists can record and analyze data electronically, in the lab, without having to remove their safety gloves to use computer keyboards or mice.

## Technologies used:
* HTML5/CSS3
* JavaScript
* MongoDB
* Express
* AngularJS
* Node.js
* Socket.io
* HTML5/Google Speech Recognition API

## Use Notes:
Currently, new users can be added via Postman by issuing a POST call to the /admin route. The request passed to the route will need to be a JSON object, with structure {username: username, password: password}.
