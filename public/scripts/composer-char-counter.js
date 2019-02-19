$(document).ready(function () {
  // --- our code goes here ---
  // $(this).siblings('.counter').text()
  const textArea = document.querySelector('.new-tweet form textarea');

  textArea.addEventListener('keyup', function (e) {
    const counter = Math.min(140, 140 - $(this).val().length).toString();

    if (counter < 0) {
      $(this).siblings('.counter').addClass('negativeRed');
    } else {
      $(this).siblings('.counter').removeClass('negativeRed');
    }

    $(this).siblings('.counter').html(`<em>${counter}</em>`);
  });
});