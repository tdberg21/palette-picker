let colors = [];

const randomPaletteGenerator = () => {
  colors = [];

  for(let i = 1; i <= 5; i++) {
    if (!$(`.lock-button${i}`).hasClass('locked')) {
      colors.push('#' + Math.floor(Math.random()*16777215).toString(16))
    } else {
      colors.push($(`.color-code${i}`).text());
    }
  }

  colors.forEach((color, index) => {
    $(`.color-box${index + 1}`).css('background-color', color);
    $(`.color-code${index + 1}`).text(color);
    $(`.lock-button${index + 1}`).css('background-color', color);
    $(`.color-code${index + 1}`).css('background-color', color);
  })
}

const lockColor = (boxNumber) => {
  $(`.lock-button${boxNumber}`).toggleClass('locked');
  if ($(`.lock-button${boxNumber}`).text() === 'Lock') {
    $(`.lock-button${boxNumber}`).text('Unlock');
  } else {
    $(`.lock-button${boxNumber}`).text('Lock');
  }
}

const handleSavePalette = () => {
  let paletteName = $('.palette-name-input').val();
  let projectName = $('#project-name-dropdown').val();
  // make api call to save palette to database
  appendMiniPalette(projectName, paletteName)
}

const appendMiniPalette = (projectName, paletteName) => {
  $('.project-palette-append').append(`
  <div class="saved-palette-container ${paletteName}">
    <h6 class="palette-name-header">${paletteName}</h6>
    <span class="palette-mini-color-container">
      <div class="mini-color-boxes mini-color-box1"></div>
      <div class="mini-color-boxes mini-color-box2"></div>
      <div class="mini-color-boxes mini-color-box3"></div>
      <div class="mini-color-boxes mini-color-box4"></div>
      <div class="mini-color-boxes mini-color-box5"></div>
    </span>
  </div>
  `)
  colors.forEach((color, index) => {
    $(`.mini-color-box${index + 1}`).css('background-color', color);
  })
}

const handleSaveProject = () => {
  let newProjectName = $('#create-project-input').val();
  // make fetch call to add to database
  console.log(newProjectName)
  addProjectToDropDown(newProjectName);
  appendNewProject(newProjectName);
}

const addProjectToDropDown = (name) => {
  let dropdown = $('#project-name-dropdown');
  dropdown.append($('<option></option>').val(name).html(name))
}

const appendNewProject = (projectName) => {
  $('.saved-projects-section').append(`
    <article class="project-article ${projectName}">
      <h5 class="project-name-header">${projectName}</h5>
      <div class="project-palette-append">
        <div class="saved-palette-container">
          <h6 class="palette-name-header">Palette 1</h6>
          <span class="palette-mini-color-container">
            <div class="mini-color-boxes mini-color-box1"></div>
            <div class="mini-color-boxes mini-color-box2"></div>
            <div class="mini-color-boxes mini-color-box3"></div>
            <div class="mini-color-boxes mini-color-box4"></div>
            <div class="mini-color-boxes mini-color-box5"></div>
          </span>
        </div>
      </div>
    </article>
    `)
}


randomPaletteGenerator();
$('.lock-button1').click(() => lockColor(1));
$('.lock-button2').click(() => lockColor(2));
$('.lock-button3').click(() => lockColor(3));
$('.lock-button4').click(() => lockColor(4));
$('.lock-button5').click(() => lockColor(5));
$('.new-palette-button').click(randomPaletteGenerator);
$('.save-palette-button').click(handleSavePalette);
$('.save-project-button').click(handleSaveProject);
