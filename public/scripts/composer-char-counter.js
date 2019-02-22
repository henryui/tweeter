$(document).ready(function () {
  $('.container').on('keyup', '#textinput', function (e) {
    const counter = Math.min(140, 140 - $('#textinput').val().length).toString();

    if (counter < 0) {
      $('#textinput').siblings('.counter').addClass('negativeRed');
    } else {
      $('#textinput').siblings('.counter').removeClass('negativeRed');
    }

    $('#textinput').siblings('.counter').html(`<em>${counter}</em>`);
  });
});