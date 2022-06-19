/* Recuperando ID dos input da aplicação */
let inputTitulo = document.getElementById("titulo-recado") as HTMLInputElement;

let inputDescricao = document.getElementById(
  "descricao-recado"
) as HTMLTextAreaElement;

let inputTituloEditar = document.getElementById(
  "titulo-recado-editar"
) as HTMLInputElement;
let inputDescricaoEditar = document.getElementById(
  "descricao-recado-editar"
) as HTMLTextAreaElement;
let tabela = document.getElementById("tabela") as HTMLTableElement;

/* Recpurando as modais*/
let modalSalvar = new bootstrap.Modal("#modal-recado");
let modalEditar = new bootstrap.Modal("#modal-editar");
let modalApagar = new bootstrap.Modal("#modal-apagar");

//Recuperando button
let btnSalvar = document.getElementById("btn-salvar") as HTMLButtonElement;
let btnEditar = document.getElementById("btn-editar") as HTMLButtonElement;
let btnApagar = document.getElementById("btn-apagar") as HTMLButtonElement;
const btnSair = document.querySelector("#button-logout") as HTMLButtonElement;

//Eventos
btnSalvar.addEventListener("click", salvarMensagem);
document.addEventListener("DOMContentLoaded", carregarRecados);
btnSair.addEventListener("click", sair);

//Recuperando usuarios
let usuarioLogado: string | null = sessionStorage.getItem("usuarioLogado");

document.addEventListener("DOMContentLoaded", () => {
  if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar essa página!");
    window.location.href = "login.html";
    return;
  }

  carregarRecadosUsuario();
});

/* Interface para recado */
interface Recado {
  codigo: string;
  titulo: string;
  descricao: string;
}

function salvarMensagem() {
  if (inputTitulo.value === "") {
    inputTitulo.style.borderColor = "red";
    inputTitulo.style.boxShadow = "none";
    inputTitulo.focus();
    return;
  }

  if (inputDescricao.value === "") {
    inputTitulo.removeAttribute("style");
    inputDescricao.style.borderColor = "red";
    inputDescricao.style.boxShadow = "none";
    inputDescricao.focus();
    return;
  }

  inputDescricao.removeAttribute("style");

  let listaRecados: Recado[] = buscarRecados();
  let maiorNum = 1;

  if (listaRecados.length > 0) {
    let maiorCodigo = listaRecados.reduce(
      (valorAtual: Recado, proximo: Recado) => {
        if (valorAtual.codigo > proximo.codigo) {
          return valorAtual;
        }
        return proximo;
      }
    );

    maiorNum = Number(maiorCodigo.codigo) + 1;
  }

  let novoRecado: Recado = {
    codigo: `${maiorNum}`,
    titulo: inputTitulo.value,
    descricao: inputDescricao.value,
  };

  listaRecados.push(novoRecado);
  salvarRecadoStorage(listaRecados);

  inputTitulo.value = "";
  inputDescricao.value = "";

  modalSalvar.hide();

  mostrarNaTela(novoRecado);
}

function salvarRecadoStorage(recados: Recado[]) {
  localStorage.setItem("recados", JSON.stringify(recados));
}
function salvarNoStorage(listaRecados: Recado[]) {
  let listaUsuarios: iUsuario[] = JSON.parse(localStorage.getItem("usuarios")!);
  let indiceUsuarioLogado: number = listaUsuarios.findIndex((usuario) => {
    return usuario.login === usuarioLogado;
  })!;

  listaUsuarios[indiceUsuarioLogado].recados = listaRecados;

  localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
}

function buscarRecados() {
  let recados = JSON.parse(localStorage.getItem("recados") || "[]");

  return recados;
}

function mostrarNaTela(recado: Recado) {
  let novaLinha = document.createElement("tr");
  novaLinha.setAttribute("id", recado.codigo);

  let colunaCodigo = document.createElement("td");
  colunaCodigo.innerText = recado.codigo;

  let colunaTitulo = document.createElement("td");
  colunaTitulo.setAttribute("scope", "row");
  colunaTitulo.innerText = recado.titulo;

  let colunaDescricao = document.createElement("td");
  colunaDescricao.innerText = recado.descricao;

  let colunaAcoes = document.createElement("td");

  let botaoEditar = document.createElement("button");
  botaoEditar.setAttribute("class", "btn btn-success me-1");
  botaoEditar.setAttribute("data-bs-toggle", "modal");
  botaoEditar.setAttribute("data-bs-target", "#modal-editar");
  botaoEditar.addEventListener("click", () => {
    editRecado(recado);
  });
  botaoEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';

  let botaoApagar = document.createElement("button");
  botaoApagar.setAttribute("class", "btn btn-danger");
  botaoApagar.setAttribute("data-bs-toggle", "modal");
  botaoApagar.setAttribute("data-bs-target", "#modal-apagar");
  botaoApagar.addEventListener("click", () => {
    apagarRecado(recado.codigo);
  });
  botaoApagar.innerHTML = `<i class="bi bi-trash"></i>`;

  colunaAcoes.appendChild(botaoEditar);
  colunaAcoes.appendChild(botaoApagar);
  novaLinha.appendChild(colunaCodigo);
  novaLinha.appendChild(colunaTitulo);
  novaLinha.appendChild(colunaDescricao);
  novaLinha.appendChild(colunaAcoes);
  tabela.appendChild(novaLinha);
}

function carregarRecados() {
  let listaRecados = buscarRecados();

  for (let recado of listaRecados) {
    mostrarNaTela(recado);
  }
}

function carregarRecadosUsuario() {
  let listaStorage: Recado[] = buscarRecadosNoStorage();

  if (listaStorage) {
    for (const recado of listaStorage) {
      mostrarNaTela(recado);
    }
  }

  return;
}

function editRecado(recado: Recado) {
  inputTituloEditar.value = recado.titulo;
  inputDescricaoEditar.value = recado.descricao;

  btnEditar.addEventListener("click", () => {
    let recadoAtual: Recado = {
      codigo: recado.codigo,
      titulo: inputTituloEditar.value,
      descricao: inputDescricaoEditar.value,
    };
    recadoAtualizado(recadoAtual);
  });
}
function apagarRecado(codigo: string) {
  btnApagar.addEventListener("click", () => {
    let listaRecados = buscarRecados();
    let indiceRecado = listaRecados.findIndex(
      (registro: Recado) => registro.codigo == codigo
    );

    listaRecados.splice(indiceRecado, 1);
    salvarRecadoStorage(listaRecados);
    modalApagar.hide();

    let linhas = document.querySelectorAll(
      "tbody > tr"
    ) as NodeListOf<HTMLTableRowElement>;

    window.location.reload();
  });
}

function recadoAtualizado(recado: Recado) {
  let recados = buscarRecados();

  let indiceRecado = recados.findIndex(
    (registro: Recado) => registro.codigo === recado.codigo
  );

  recados[indiceRecado] = recado;
  salvarRecadoStorage(recados);
  modalEditar.hide;
  window.location.reload();
}

function buscarRecadosNoStorage(): Recado[] {
  let listaUsuarios: iUsuario[] = JSON.parse(localStorage.getItem("usuarios")!);
  let dadosUsuarioLogado: iUsuario = listaUsuarios.find((usuario) => {
    return usuario.login === usuarioLogado;
  })!;

  return dadosUsuarioLogado.recados;
}

function sair() {
  sessionStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}
