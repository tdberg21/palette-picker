
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(function () {
      return Promise.all ([      
      knex('projects').insert({
        project_name: 'apple'
      }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { palette_name: 'green', color1: '#1f646d', color2: '#2dd066', color3: '#a3e25b', color4: '#1d5e6d', color5: '#79e926', project_id: project[0]}
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
