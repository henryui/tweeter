/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const composeLogout = `
  <button class="compose"><i class="fas fa-edit"></i>Compose</button>
  <button class="logout">Log Out</button>
`;

const loginRegister = `
  <button class="login">Log In</button>
  <button class="register">Register</button>
`;

const loginRegisForm = `
  <section class="login-form collapsed">
    <h2>Log in to Tweeter</h2>
    <form class="log-form">
      <label for="userid">User ID:</label>
      <input class="userid" type="text" name="userid" placeholder="Your ID" required>

      <label for="password">Password:</label>
      <input class="password" type="password" name="password" required>

      <input type="submit" name="signin" value="Log in">
    </form>
    <div class="error-message"></div>
  </section>

  <section class="regis-form collapsed">
    <h2>Register to Tweeter</h2>
    <form class="reg-form">
      <label for="username">Name:</label>
      <input class="username" type="text" name="username" placeholder="Your Name" maxlength="30" required>

      <label for="userid">User ID:</label>
      <input class="userid" type="text" name="userid" placeholder="ID for handle" maxlength="20" required>

      <label for="password">Password:</label>
      <input class="password" type="password" name="password" required>

      <input type="submit" name="signup" value="Register">
    </form>
    <div class="error-message"></div>
  </section>
`;

const composeForm = `
<section class="new-tweet collapsed">
  <h2>Compose Tweet</h2>
  <form class="tweet-form">
    <textarea name="text" placeholder="What are you humming about?" id="textinput"></textarea>
    <input type="submit" value="Tweet">
    <span class="counter"><em>140</em></span>
  </form>
  <div class="error-message"></div>
</section>
`;

const renderTweets = function (tweets) {
  // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
  $('#tweets-container').empty();
  for (var i = tweets.length - 1; i >= 0; i--) {
    $('#tweets-container').append(createTweetElement(tweets[i]));
  }
};

const createTweetElement = function (data) {
  var date = (Date.now() - data.created_at) / 86400000;
  var dateMessage;
  //
  if (date > 7) {
    dateMessage = new Date(data.created_at - new Date(data.created_at).getTimezoneOffset() * 60 * 1000).toDateString();
  } else if (date >= 1) {
    dateMessage = `${Math.floor(date)} Day(s) Ago`;
  } else if ((date * 24) >= 1) {
    dateMessage = `${Math.floor(date * 24)} Hour(s) Ago`;
  }  else if ((date * 1440) >= 1) {
    dateMessage = `${Math.floor(date * 1440)} Minute(s) Ago`;
  } else {
    dateMessage = `${Math.floor(date * 86400)} Second(s) Ago`;
  }


  // These codes below are to implement new lines since they don't appear in the html.
  // In order to prevent XSS, I am using 'document.createTextNode' to append the content
  // of the user input, which will ignore <br> if I explicitly add them together.

  const message = data.content.text.split("\n");
  const $userMessage = $("<div>").addClass("user-message").append(document.createTextNode(message[0]));
  for (let i = 1; i < message.length; i++) {
    $userMessage.append("<br>", document.createTextNode(message[i]));
  }

  // Note below that 'data._id' which is MongoDB ObjectId is used to identify each tweets,
  // and like count is only displayed if it is one or more
  const likeNum = Object.keys(data.like).length;

  const $tweet = $("<article>").addClass("tweet").append(`
    <header>
      <img src="${data.user.avatars.regular}">
      <span><strong>${data.user.name}</strong></span>
      <span class="handler">${data.user.handle}</span>
    </header>
  `, $userMessage, `
    <footer>
      <span>${dateMessage}</span>
      <span class="utils">
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart ${($("#nav-bar .header-name").text().slice(1) in data.like) ? "liked": ""}" data-id=${data._id}></i>
        <span class="like-count">${(likeNum ? likeNum.toString() : "")}</span>
      </span>
    </footer>
  `);

  return $tweet;
};

const handleSubmit = function (e) {
  e.preventDefault();

  if ($("#textinput").val().length > 140) {
    $(".new-tweet .error-message").text("Exceeded maximum character count").prepend("<hr>");
    $(".new-tweet .error-message").slideDown();
    return;
  } else if (!$("#textinput").val().replace(/\s/g, '').length) {
    $(".new-tweet .error-message").text("Attemped to submit an empty form").prepend("<hr>");
    $(".new-tweet .error-message").slideDown();
    return;
  }

  const query = $(".new-tweet form").serialize();

  $(".new-tweet form textarea").val("");
  $(".new-tweet .error-message").hide();

  // Has to reset the character count to 140 again
  $(".new-tweet form .counter").html("<em>140</em>");

  $.ajax("/tweets/", {method: "POST", data: query})
  .then(function (data) {
    // Another AJAX call to prepend the new tweet
    $.ajax("/tweets/", {method: "GET"})
    .then(function (data) {
      $('#tweets-container').prepend(createTweetElement(data.slice(-1)[0]));
    });
  });
};

const loadTweets = function () {
  $.ajax("/tweets/", {method: "GET"})
  .then(function (data) {
    renderTweets(data);
  });
};

const handleLogin = function (e) {
  e.preventDefault();

  const query = $(".log-form").serialize();

  $.ajax("/users/login", {method: "POST", data: query})
  .then(function (data) {
    if (data[0] === "false") {
      $(".login-form .error-message").text("Incorrect ID/Password").prepend("<hr>");
      $(".login-form .error-message").slideDown();
    } else {
      $("#nav-bar .login").remove();
      $("#nav-bar .register").remove();
      const $uname = $("<span>").addClass("header-name").append(document.createTextNode(`@${data[1]}`));
      $("#nav-bar").append(composeLogout, $uname);

      $(".container .login-form").remove();
      $(".container .regis-form").remove();
      $(".container").prepend(composeForm);

      // Minor reload to set up like color for the logged in user
      loadTweets();
    }
  });
};

const handleRegister = function (e) {
  e.preventDefault();

  const query = $(".reg-form").serialize();

  $.ajax("/users/register", {method: "POST", data: query})
  .then(function (data) {
    if (data[0] === "false") {
      $(".regis-form .error-message").text(data[1]).prepend("<hr>");
      $(".regis-form .error-message").slideDown();
    } else {
      $("#nav-bar .login").remove();
      $("#nav-bar .register").remove();
      const $uname = $("<span>").addClass("header-name").append(document.createTextNode(`@${data[1]}`));
      $("#nav-bar").append(composeLogout, $uname);

      $(".container .login-form").remove();
      $(".container .regis-form").remove();
      $(".container").prepend(composeForm);
    }
  });
};

const handleLike = function (e) {
  const tweetID = $(e.target).data().id;

  $.ajax(`/tweets/${tweetID}`, {method: "PUT"})
  .then(function (data) {
    if (data[0] === "true") {
      const count = (data[1]) ? data[1].toString() : "";
      $(e.target).siblings(".like-count").text(count);

      $(e.target).toggleClass("liked");
    }
  });
};

$(document).ready(function () {
  // On initial load or refresh of the page, deliver content according to cookies
  $.ajax("/users/")
  .then(function (data) {
    if (data.uid) {
      const $uname = $("<span>").addClass("header-name").append(document.createTextNode(`@${data.uid}`));
      $("#nav-bar").append(composeLogout, $uname);
      $(".container").prepend(composeForm);
    } else {
      $("#nav-bar").append(loginRegister);
      $(".container").prepend(loginRegisForm);
    }
    loadTweets();
  });

  // Handlers for form submission
  $(".new-tweet .error-message").hide();
  $(".container").on("submit", ".new-tweet form", handleSubmit);
  $(".container").on("submit", ".login-form form", handleLogin);
  $(".container").on("submit", ".regis-form form", handleRegister);

  $("#tweets-container").on("click", ".fa-heart", handleLike);

  // Could have also used jquery's slideToggle, but using css is gives more subtle animation
  $("#nav-bar").on("click", ".compose", function () {
    $(".container .new-tweet").toggleClass("collapsed");
    $(".new-tweet .error-message").hide();
    $("#textinput").focus();

    // Clear the form
    $(".new-tweet form .counter").html("<em>140</em>");
    $(".new-tweet form textarea").val("");
  });

  // Handler for the log-in button
  $("#nav-bar").on("click", ".login", function () {
    $(".container .login-form").toggleClass("collapsed");
    $(".login-form .error-message").hide();
    $(".container .regis-form").addClass("collapsed");
    $(".regis-form .error-message").hide();

    // Clear the form
    $(".login-form form .userid").val("");
    $(".login-form form .password").val("");
  });

  // Handler for the register button
  $("#nav-bar").on("click", ".register", function () {
    $(".container .regis-form").toggleClass("collapsed");
    $(".regis-form .error-message").hide();
    $(".container .login-form").addClass("collapsed");
    $(".login-form .error-message").hide();

    // Clear the form
    $(".regis-form .username").val("");
    $(".regis-form form .userid").val("");
    $(".regis-form form .password").val("");
  });

  // Handler for the logout button
  $("#nav-bar").on("click", ".logout", function () {
    $.ajax("/users/logout", {method: "POST"})
    .then(function (data) {
      $("#nav-bar .compose").remove();
      $("#nav-bar .logout").remove();
      $("#nav-bar .header-name").remove();
      $("#nav-bar").append(loginRegister);

      $(".container .new-tweet").remove();
      $(".container").prepend(loginRegisForm);

      $("i").removeClass("liked");
    });
  });
});