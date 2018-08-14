let colors = [];

const randomPaletteGenerator = () => {
  colors = [];

  for(let i = 1; i <= 5; i++) {
    if (!$(`.lock-button${i}`).hasClass('locked')) {
      colors.push('#' + Math.floor(Math.random()*16777215).toString(16))
    } else {
      colors.push(colors[i]);
    }
  }

  colors.forEach((color, index) => {
    $(`.color-box${index + 1}`).css('background-color', color);
    $(`.color-code${index + 1}`).text(color);
    $(`.lock-button${index + 1}`).css('background-color', color);
  })
}

const lockColor = (boxNumber) => {
  $(`.lock-button${boxNumber}`).toggleClass('locked');
}

const handleSavePalette = () => {
  let paletteName = $('.palette-name-input').val();
  let project_name = $('#project-name-dropdown').val();
  console.log(paletteName, colors);
  console.log('project name:', project_name);
}

randomPaletteGenerator();
$('.lock-button1').click(() => lockColor(1));
$('.lock-button2').click(() => lockColor(2));
$('.lock-button3').click(() => lockColor(3));
$('.lock-button4').click(() => lockColor(4));
$('.lock-button5').click(() => lockColor(5));
$('.new-palette-button').click(randomPaletteGenerator);
$('.save-palette-button').click(handleSavePalette);