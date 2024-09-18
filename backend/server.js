const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); //adiciona o middleware CORS
app.use(bodyParser.json());

const alunosFile = './alunos.json';

//aqui carrega os dados do arquivo JSON Alunos.json
const loadAlunos = () => {
  const data = fs.readFileSync(alunosFile);
  return JSON.parse(data);
};

//salvar os dados no arquivo JSON
const saveAlunos = (data) => {
  fs.writeFileSync(alunosFile, JSON.stringify(data, null, 2));
};

//rota para listar todos os alunos
app.get('/alunos', (req, res) => {
  const alunos = loadAlunos();
  res.json(alunos);
});

//rota para adicionar um novo aluno
app.post('/alunos', (req, res) => {
  const alunos = loadAlunos();
  const novoAluno = req.body;
  alunos.push(novoAluno);
  saveAlunos(alunos);
  res.status(201).json(novoAluno);
});

//rota para atualizar um aluno
app.put('/alunos/:nome', (req, res) => {
  const alunos = loadAlunos();
  const { nome } = req.params;
  const updatedAluno = req.body;
  const index = alunos.findIndex(aluno => aluno.nome === nome);

  if (index !== -1) {
    alunos[index] = updatedAluno;
    saveAlunos(alunos);
    res.json(updatedAluno);
  } else {
    res.status(404).send('Aluno não encontrado');
  }
});

//rota para deletar um aluno
app.delete('/alunos/:nome', (req, res) => {
  const alunos = loadAlunos();
  const { nome } = req.params;
  const updatedAlunos = alunos.filter(aluno => aluno.nome !== nome);

  if (updatedAlunos.length !== alunos.length) {
    saveAlunos(updatedAlunos);
    res.status(204).send();
  } else {
    res.status(404).send('Aluno não encontrado');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
