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
  if ($(`.lock-button${boxNumber}`).text() === 'lock') {
    $(`.lock-button${boxNumber}`).text('unlock');
  } else {
    $(`.lock-button${boxNumber}`).text('lock');
  };
};

const handleSavePalette = async () => {
  let paletteName = $('.palette-name-input').val();
  let projectName = $('#project-name-dropdown').val();
  let project = await findProject(projectName);
  addPaletteToDB(paletteName, project);
  appendMiniPalette(projectName, paletteName);
  clearPaletteInputField();
};

const clearPaletteInputField = () => {
  $('.palette-name-input').val('');
};

const findProject = async (projectName) => {
  let results = await fetchSavedProjects();
  const foundProject = results.find(project => project.project_name === projectName);
  return foundProject;
};

const addPaletteToDB = async (paletteName, project) => {
  const url = '/api/v1/palettes/new';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      palette_name: paletteName,
      color1: colors[0],
      color2: colors[1],
      color3: colors[2],
      color4: colors[3],
      color5: colors[4],
      project_id: project.id

    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const results = await response.json();
  return await results; 
};

const appendMiniPalette = (projectName, paletteName) => {
  $(`.${projectName}`).append(`
  <div class="saved-palette-container">
    <h6 class="palette-name-header">${paletteName}</h6>
    <span class="palette-mini-color-container">
      <div class="mini-color-boxes mini-color-box1" style="background-color: ${colors[0]}" title="${colors[0]}"></div>
      <div class="mini-color-boxes mini-color-box2" style="background-color: ${colors[1]}" title="${colors[1]}"></div>
      <div class="mini-color-boxes mini-color-box3" style="background-color: ${colors[2]}" title="${colors[2]}"></div>
      <div class="mini-color-boxes mini-color-box4" style="background-color: ${colors[3]}" title="${colors[3]}"></div>
      <div class="mini-color-boxes mini-color-box5" style="background-color: ${colors[4]}" title="${colors[4]}"></div>
      <button class="delete-palette-button" id=${paletteName}>delete.</button>
    </span>
  </div>
  `);
};

const handleSaveProject = async () => {
  $('.duplicate-project').text('');
  let newProjectName = $('#create-project-input').val();
  let duplicate = await findProject(newProjectName);
  if (duplicate) {
    $('.duplicate-project').text('Please choose a unique project name.')
    return;
  } else {
    addProjectToDB(newProjectName);
    addProjectToDropDown(newProjectName);
    appendNewProject(newProjectName);
  };
};

const clearProjectInputField = () => {
  $('#create-project-input').val('');
};

const addProjectToDB = async (projectName) => {
  const url = '/api/v1/projects/new';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      project_name: projectName
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const results = await response.json();
  return await results; 
};

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
  const url = '/api/v1/projects/';
  const response = await fetch(url);
  const results = await response.json();
  return results;
};

const handlePageLoad = async () => {
  let results = await fetchSavedProjects();
  results.forEach(project => {
    addProjectToDropDown(project.project_name);
    appendNewProject(project.project_name);
    fetchProjectPalettes(project.id, project.project_name);
  });
};

const fetchProjectPalettes = async (projectID, projectName) => {
  const url = `/api/v1/palettes/${projectID}`;
  const response = await fetch(url);
  const results = await response.json();
  appendProjectPalettes(results, projectName);
  return await results;
};

const appendProjectPalettes = (palettes, projectName) => {
  palettes.forEach(palette => {
    updateColorsArray(palette);
    appendMiniPalette(projectName, palette.palette_name);
  });
};

const updateColorsArray = (palette) => {
  colors = [palette.color1, palette.color2, palette.color3, palette.color4, palette.color5];
};

const fetchSavedPalettes = async () => {
  const url = '/api/v1/palettes/';
  const response = await fetch(url);
  const results = await response.json();
  return await results;
};

const handleDelete = async (event) => {
  let paletteName = $(event.target).attr('id');
  let paletteInfo = await findPalette(paletteName);
  deletePaletteFromDatabase(paletteInfo.id);
  event.target.closest('div').remove();
};

const deletePaletteFromDatabase = async (paletteId) => {
  const url = `/api/v1/palettes/delete/${paletteId}`;
  const response = await fetch(url, {
    method: 'DELETE'
  });
  const results = await response.json();
};

const findPalette = async (paletteName) => {
  let results = await fetchSavedPalettes();
  const foundPalette = results.find(palette => palette.palette_name === paletteName);
  return foundPalette;
};

const displayInfo = async (event) => {
  const paletteName = $(event.target.closest('.saved-palette-container')).children('h6').text();
  const palette = await findPalette(paletteName);
  updateColorsArray(palette);
  colors.forEach((color, index) => {
    $(`.color-box${index + 1}`).css('background-color', color);
    $(`.color-code${index + 1}`).text(color);
    $(`.lock-button${index + 1}`).css('background-color', color);
    $(`.color-code${index + 1}`).css('background-color', color);
  });
};

randomPaletteGenerator();
handlePageLoad();
$('.lock-button1').click(() => lockColor(1));
$('.lock-button2').click(() => lockColor(2));
$('.lock-button3').click(() => lockColor(3));
$('.lock-button4').click(() => lockColor(4));
$('.lock-button5').click(() => lockColor(5));
$('.new-palette-button').click(randomPaletteGenerator);
$('.save-palette-button').click(handleSavePalette);
$('.save-project-button').click(handleSaveProject);
$('.saved-projects-section').on('click', 'article .delete-palette-button', handleDelete);
$('.saved-projects-section').on('click', 'article .saved-palette-container', displayInfo);