# Tweeter Project

Tweeter is a simple, single-page Twitter clone. It is a client-side app, communicating with a server via AJAX, and connected to a persistent data, MongoDB.


## Final Product - Heroku

!["The main page"](https://github.com/henryui/tweeter/blob/master/docs/Tweeter1.png?raw=true)
*The main page*


* --


!["Like button pressed"](https://github.com/henryui/tweeter/blob/master/docs/Tweeter2.png?raw=true)
*Like button pressed*


* --


!["Like count persist for other users"](https://github.com/henryui/tweeter/blob/master/docs/Tweeter3.png?raw=true)
*Like count persist for other users*


* --


!["Basic Log in form"](https://github.com/henryui/tweeter/blob/master/docs/Tweeter4.png?raw=true)
*Basic Log in form*

* --

!["Compose form and exceeding character limit"](https://github.com/henryui/tweeter/blob/master/docs/Tweeter5.png?raw=true)
*Compose form and exceeding character limit*


## Dependencies

- express
- node 5.10.x or above
- bodyParser
- chance
- md5
- mongodb
- bcrypt
- cookie-session
- dotenv
- save


## Getting Started

### Local Deployment

1. Install all dependencies (using `npm install` command).

2. Install MongoDB driver suited to your OS.

3. Run the mongo local server using `mongod` or `sudo mongod`

4. Create `.env` file with variables:

```
MONGODB_URI=mongodb://localhost:27017/
COOKIE_KEY1=someCookie1
COOKIE_KEY2=someCookie2
PORT=8080
```

MONGODB_URI should be the URI of your local DB, cookie keys can be any (relatively-short) string, and port should be any available port from your local machine

5. If this is your initial deployment, it is recommended that from `server/index.js` file, uncomment `seedDB();` which is on line 28. This function will seed the initial data into your database.

*It was not tested without initializing the data using seedDB*

After the first deployment, comment out the `seedDB();` from the file.

6. Run the development web server using the `node server/index.js` command.

7. Go to `http://localhost:8080/`


### Access the website using heroku

The link to the Tweeter:

[https://whispering-fjord-29538.herokuapp.com/](https://whispering-fjord-29538.herokuapp.com/)


## Features

- Navbar that has 'compose' and 'logout' button and display user handle when signed in
  - It will have 'log in' and 'register' button when logged out

- Compose tweet box is hidden on load, it is dislayed on top of the list of tweets
  - Compose button is clicked to show or hide the form
  - Character counter is implemented to show remaining/exceeding character limit
  - Only accessible when signed in
  - Displays error message when no text input is being submitted, or text is over 140 characters
  - Upon page refresh or clicking compose button, form text and error message is cleared

- LogIn and Register forms can be shown/hidden using respective buttons
  - Only one form can be shown at a time
  - Name of the user is limited to 30 characters, and handle/ID is limited to 20
  - Registering randomly assigns an avatar for every user
  - LogIn: Displays error message when non-existing userID or incorrect password is submitted
    - Purposely displaying single message for both cases to protect privacy
  - Register: Displays error message when userID is already taken
    - Same Names are allowed
  - Upon page refresh or clicking buttons, input text and error message is cleared

- Tweets are displayed in order of newest to oldest
  - In the header, avatar image, full name, and user handle/ID is displayed
  - Content is displayed in the body
  - Footer contains when the tweet has been created, showing in seconds/minutes/hours/days respectively
  - Footer also has flag, retweet, like buttons, which is shown when the tweet is hovered
    - Like button can only be clicked when logged in, and it will turn red, showing like count
    - User's own tweet cannot be liked

- The three forms are animated when shown/hidden

- The page is (almost fully) responsive depending on screen size


## Server-side

- Every request is called from front-end javascript using AJAX
- `/tweets/` and `/users/` routes are handled separately in their files
- User Password and sessions are encrypted


#### By Yunsung Oh - Lighthouse Labs
