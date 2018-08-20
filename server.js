// define a variable express and require the Express module installed using NPM
const express = require('express');
// define a variable app that invokes express and sets up our express application
const app = express();
// define a variable bodyParser that requires the body-parser package
const bodyParser = require('body-parser');
// Define a variable environment and assign it the value of whatever NODE_ENV has been defined as or if that is not defined than give it the default value of 'development'
const environment = process.env.NODE_ENV || 'development';
// define the configuration variable and dynamically access our configuration object using the value of the environment variable as the key
const configuration = require('./knexfile')[environment];

const database = require('knex')(configuration);

// use body parser for the app and and we expect the body to be json so we need to use .json()
app.use(bodyParser.json());
// Configures which path the app should use for getting the static assets
app.use(express.static('public'));

// 
app.set('port', process.env.PORT || 3000);
// give the locals object a key of title with a value of Palette Picker
app.locals.title = 'Palette Picker';


app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      response.status(200).json(palettes);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(projects => {
      if (projects.length) {
        response.status(200).json(projects);
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', async (request, response) => {
  const id = parseInt(request.params.id)
  try {
    const palettes = await database('palettes').select()
    const projectPalettes = palettes.filter(palette => palette.project_id === id)
    response.status(200).json(projectPalettes)
  } catch (error) {
    response.status(500).json(error)
  }
});

app.post('/api/v1/projects/new', (request, response) => {
  const project = request.body;
  for (let requiredParameter of ['project_name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { project_name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes/new', (request, response) => {
  const palette = request.body;
  for (let requiredParameter of ['palette_name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/delete/:id', (request, response) => {
  const id = request.params.id;
  database('palettes').where({ id }).del()
    .then(palette => {
      response.status(200).json({status: `Succesfully deleted ${palette}`})
    })
    .catch(error => {
      response.status(500).json({error})
    })
})

// tells the app to listen for connections on 'port'
app.listen(app.get('port'), () => {
  // if a connection is made, console.log the title and what port it is running on
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// export the app so that we can test it
module.exports = app;