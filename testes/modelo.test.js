const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntas = modelo.listar_perguntas();
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, '2');
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, '3');
  const respostas = modelo.get_respostas(perguntas[0].id_pergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('2');
  expect(respostas[1].texto).toBe('3');
  expect(respostas[0].id_resposta).toBe(respostas[1].id_resposta-1);
});

test('Testando votação de respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntas = modelo.listar_perguntas();
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, '2');
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, '3');
  let respostas = modelo.listar_respostas(perguntas[0].id_pergunta);
  modelo.votar_resposta(respostas[0].id_resposta);
  modelo.votar_resposta(respostas[0].id_resposta);
  modelo.votar_resposta(respostas[1].id_resposta);
  respostas = modelo.listar_respostas(perguntas[0].id_pergunta);
  expect(respostas[0].votos).toBe(2);
  expect(respostas[1].votos).toBe(1);
});

test('Testando get de Perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntas = modelo.listar_perguntas();
  const pergunta = modelo.get_pergunta(perguntas[0].id_pergunta);
  expect(pergunta.texto).toBe('1 + 1 = ?');
});
