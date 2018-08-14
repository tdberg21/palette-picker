let colors = [];

const randomPaletteGenerator = () => {
  colors = [];

  for(let i = 1; i <= 5; i++) {
    colors.push('#' + Math.floor(Math.random()*16777215).toString(16))
  }

  colors.forEach((color, index) => {
    $(`.color-box${index + 1}`).css('background-color', color)
    $(`.lock-button${index + 1}`).css('background-color', color)
  })
}

const handleLock = (boxNumber) => {
  console.log(boxNumber)
  $(`.lock-button${boxNumber}`).toggleClass('locked');
}

const handleSavePalette = () => {
  let paletteName = $('.palette-name-input').val();
  console.log(paletteName, colors);
}

randomPaletteGenerator();
$('.lock-button1').click(() => handleLock(1))
$('.lock-button2').click(() => handleLock(2))
$('.lock-button3').click(() => handleLock(3))
$('.lock-button4').click(() => handleLock(4))
$('.lock-button5').click(() => handleLock(5))
$('.new-palette-button').click(randomPaletteGenerator);
$('.save-palette-button').click(handleSavePalette);