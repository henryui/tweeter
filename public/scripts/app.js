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
    $userMessage.append("<br>", document.createTextNode(message[i]));
    // $userMessage.append(document.createTextNode(message[i]));
  }

  // Note below that 'data._id' which is MongoDB ObjectId is used to identify each tweets
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
        <i class="fas fa-heart" data-id=${data._id}></i>
        <span class="like-count">${(data.like ? data.like.toString() : "")}</span>
      </span>
    </footer>
  `);

  return $tweet;
};

const handleSubmit = function (e) {
  e.preventDefault();

  if (parseInt(e.target.innerText, 10) < 0) {
    $(".new-tweet .error-message").text("Exceeded maximum character count").prepend("<hr>");
    $(".new-tweet .error-message").slideDown();
    return;
  } else if (parseInt(e.target.innerText, 10) === 140) {
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

const handleLike = function (e) {
  e.target.dataset.id;
};

$(document).ready(function () {
  loadTweets();
  $(".new-tweet .error-message").hide();
  $(".new-tweet form").submit(handleSubmit);

  $("#tweets-container").on("click", ".fa-heart", handleLike);

  // Could have also used jquery's slideToggle, but using css is gives more subtle animation
  $("#nav-bar .compose").on("click", function () {
    $(".container .new-tweet").toggleClass("collapsed");
    $(".new-tweet .error-message").hide();
    $("#textinput").focus();

    // Clear the form
    $(".new-tweet form .counter").html("<em>140</em>");
    $(".new-tweet form textarea").val("");
  });


});