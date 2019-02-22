# Tweeter Project

Tweeter is a simple, single-page Twitter clone. It is a client-side app, communicating with a server via AJAX, and connected to a persistent data, MongoDB.


## Final Product

!["The landing page"](https://github.com/henryui/tinyApp/blob/master/docs/urls_home.png?raw=true)
*The landing page*



!["The register page"](https://github.com/henryui/tinyApp/blob/master/docs/urls_register.png?raw=true)
*The register page*



!["User specific home page"](https://github.com/henryui/tinyApp/blob/master/docs/urls_index.png?raw=true)
*User specific home page*



!["Short URL show page"](https://github.com/henryui/tinyApp/blob/master/docs/urls_show.png?raw=true)
*Short URL show page*


## Dependencies

- Express
- Node 5.10.x or above
- BodyParser
- Chance
- md5
- mongodb


## Getting Started

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


4. Run the development web server using the `node server/index.js` command.
- Go to `http://localhost:8080/`


## Features









#### By Yunsung Oh - Lighthouse Labs
