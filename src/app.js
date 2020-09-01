const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: uuidValidate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isValidUUID(request, response, next) {
  const { id } = request.params;

  if (!uuidValidate(id)) {
    return response.status(400).json({ error: 'Invalid ID.' });
  }

  return next();
}

function getIndexRepositoryById(id) {
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  return repositoryIndex;
}

app.use('/repositories/:id', isValidUUID);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = getIndexRepositoryById(id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found!' });

  const { title, url, techs } = request.body;
  const likes = repositories[repositoryIndex].likes;

  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = getIndexRepositoryById(id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found!' });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = getIndexRepositoryById(id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found!' });

  var repository = repositories[repositoryIndex];
  repository.likes = repository.likes + 1;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
