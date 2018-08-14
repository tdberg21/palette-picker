const express = require('express');
const app = express();

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
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});