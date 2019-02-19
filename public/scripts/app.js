/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const renderTweets = function (tweets) {
  // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
  for (var i = tweets.length - 1; i >= 0; i--) {
    $('#tweets-container').append(createTweetElement(tweets[i]));
  }
};

const createTweetElement = function (data) {
  var date = (Date.now() - data.created_at) / 86400000;
  var dateMessage;
  if (date >= 1) {
    dateMessage = `${Math.floor(date)} Days Ago`;
  } else if ((date * 24) >= 1) {
    dateMessage = `${Math.floor(date * 24)} Hours Ago`;
  } else if ((date * 1440) >= 1) {
    dateMessage = `${Math.floor(date * 1440)} Minutes Ago`;
  } else {
    dateMessage = `${Math.floor(date * 86400)} Seconds Ago`;
  }


  // These codes below are to implement new lines since they don't appear in the html.
  // In order to prevent XSS, I am using 'document.createTextNode' to append the content
  // of the user input, which will ignore <br> if I explicitly add them together.

  const message = data.content.text.split("\n");
  const $userMessage = $("<div>").addClass("user-message").append(document.createTextNode(message[0]));
  for (let i = 1; i < message.length; i++) {
    $userMessage.append("<br>");
    $userMessage.append(document.createTextNode(message[i]));
  }

  const $tweet = $("<article>").addClass("tweet").append(`
    <header>
      <img src="${data.user.avatars.regular}">
      <span><strong>${data.user.name}</strong></span>
      <span class="handler">${data.user.handle}</span>
    </header>
  `);

  $tweet.append($userMessage).append(`
    <footer>
      <span>${dateMessage}</span>
      <span class="utils">
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </span>
    </footer>
  `);

  return $tweet;
};

const handleSubmit = function (e) {
  e.preventDefault();

  if (parseInt(e.target.innerText, 10) < 0) {
    alert("Exceeded maximum character count");
    return;
  } else if (parseInt(e.target.innerText, 10) === 140) {
    alert("Attemped to submit an empty form");
    return;
  }

  const query = $(".new-tweet form").serialize();
  $(".new-tweet form textarea").val("");

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

$(document).ready(function () {
  loadTweets();
  $(".new-tweet form").submit(handleSubmit);
  $("#nav-bar .compose").on("click", function () {
    $(".container .new-tweet").toggleClass("collapsed");
  });
});