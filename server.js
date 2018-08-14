const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.projects = [
  { id: '1', project_name: 'Project1' },
  { id: '2', project_name: 'Project2' }
];

app.get('/', (request, response) => {
});

app.get('/api/v1/projects', (request, response) => {
  const projects = app.locals.projects;

  response.json(projects);
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const foundProject = app.locals.projects.find(project => project.id === id);
  if (foundProject) {
    return response.status(200).json(foundProject);
  } else {
    return response.sendStatus(404);
  }
});

app.post('/api/v1/projects/new', (request, response) => {
  console.log(request.body)
  const project = request.body;
  const id = Date.now();
  if (!project.project_name) {
    response.status(422).send({
      error: 'no project name provided'
    });
  } else {
    app.locals.projects.push({id, project_name: project.project_name});
    response.status(201).json({id, project_name: project.project_name});
  }
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});