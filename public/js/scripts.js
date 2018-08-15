let colors = [];

const randomPaletteGenerator = () => {
  colors = [];
  for(let i = 1; i <= 5; i++) {
    if (!$(`.lock-button${i}`).hasClass('locked')) {
      colors.push('#' + Math.floor(Math.random()*16777215).toString(16));
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
};

const handleSavePalette = () => {
  let paletteName = $('.palette-name-input').val();
  let projectName = $('#project-name-dropdown').val();
  // make api call to save palette to database
  appendMiniPalette(projectName, paletteName);
};

const appendMiniPalette = (projectName, paletteName) => {
  $(`.${projectName}`).append(`
  <div class="saved-palette-container">
    <h6 class="palette-name-header">${paletteName}</h6>
    <span class="palette-mini-color-container">
      <div class="mini-color-boxes mini-color-box1" style="background-color: ${colors[0]}"></div>
      <div class="mini-color-boxes mini-color-box2" style="background-color: ${colors[1]}"></div>
      <div class="mini-color-boxes mini-color-box3" style="background-color: ${colors[2]}"></div>
      <div class="mini-color-boxes mini-color-box4" style="background-color: ${colors[3]}"></div>
      <div class="mini-color-boxes mini-color-box5" style="background-color: ${colors[4]}"></div>
    </span>
  </div>
  `);
};

const handleSaveProject = () => {
  let newProjectName = $('#create-project-input').val();
  // make fetch call to add to database
  addProjectToDropDown(newProjectName);
  appendNewProject(newProjectName);
}

const addProjectToDropDown = (name) => {
  let dropdown = $('#project-name-dropdown');
  dropdown.append($('<option></option>').val(name).html(name));
};

const appendNewProject = (projectName) => {
  $('.saved-projects-section').append(`
    <article class="project-article ${projectName}">
      <h5 class="project-name-header">${projectName}</h5>
      <div class="project-palette-append">
      </div>
    </article>
    `);
};

const fetchSavedProjects = async () => {
  const url = 'http://localhost:3000/api/v1/projects/';
  const response = await fetch(url);
  const results = await response.json();
  results.forEach(project => {
    addProjectToDropDown(project.project_name)
    appendNewProject(project.project_name)
    fetchProjectPalettes(project.id, project.project_name)
  })
  return await results;
}

const fetchProjectPalettes = async (projectID, projectName) => {
  const url = `http://localhost:3000/api/v1/palettes/${projectID}`;
  const response = await fetch(url);
  const results = await response.json();
  appendProjectPalettes(results, projectName)
  return await results;
}

const appendProjectPalettes = (palettes, projectName) => {
  palettes.forEach(palette => {
    updateColorsArray(palette)
    appendMiniPalette(projectName, palette.palette_name)
  })
}

const updateColorsArray = (palette) => {
  colors = [palette.color1, palette.color2, palette.color3, palette.color4, palette.color5];
}

const fetchSavedPalettes = async () => {
  const url = 'http://localhost:3000/api/v1/palettes/';
  const response = await fetch(url);
  const results = await response.json();
  console.log(results);
  return await results;
}

fetchSavedProjects();
randomPaletteGenerator();
$('.lock-button1').click(() => lockColor(1));
$('.lock-button2').click(() => lockColor(2));
$('.lock-button3').click(() => lockColor(3));
$('.lock-button4').click(() => lockColor(4));
$('.lock-button5').click(() => lockColor(5));
$('.new-palette-button').click(randomPaletteGenerator);
$('.save-palette-button').click(handleSavePalette);
$('.save-project-button').click(handleSaveProject);
