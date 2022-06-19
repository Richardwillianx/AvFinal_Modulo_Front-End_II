"use strict";
/* Recuperando ID dos input da aplicação */
let inputTitulo = document.getElementById("titulo-recado");
let inputDescricao = document.getElementById("descricao-recado");
let inputTituloEditar = document.getElementById("titulo-recado-editar");
let inputDescricaoEditar = document.getElementById("descricao-recado-editar");
let tabela = document.getElementById("tabela");
/* Recpurando as modais*/
let modalSalvar = new bootstrap.Modal("#modal-recado");
let modalEditar = new bootstrap.Modal("#modal-editar");
let modalApagar = new bootstrap.Modal("#modal-apagar");
//Recuperando button
let btnSalvar = document.getElementById("btn-salvar");
let btnEditar = document.getElementById("btn-editar");
let btnApagar = document.getElementById("btn-apagar");
const btnSair = document.querySelector("#button-logout");
//Eventos
btnSalvar.addEventListener("click", salvarMensagem);
document.addEventListener("DOMContentLoaded", carregarRecados);
btnSair.addEventListener("click", sair);
//Recuperando usuarios
let usuarioLogado = sessionStorage.getItem("usuarioLogado");
document.addEventListener("DOMContentLoaded", () => {
    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar essa página!");
        window.location.href = "login.html";
        return;
    }
    carregarRecadosUsuario();
});
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
    let listaRecados = buscarRecados();
    let maiorNum = 1;
    if (listaRecados.length > 0) {
        let maiorCodigo = listaRecados.reduce((valorAtual, proximo) => {
            if (valorAtual.codigo > proximo.codigo) {
                return valorAtual;
            }
            return proximo;
        });
        maiorNum = Number(maiorCodigo.codigo) + 1;
    }
    let novoRecado = {
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
function salvarRecadoStorage(recados) {
    localStorage.setItem("recados", JSON.stringify(recados));
}
function salvarNoStorage(listaRecados) {
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));
    let indiceUsuarioLogado = listaUsuarios.findIndex((usuario) => {
        return usuario.login === usuarioLogado;
    });
    listaUsuarios[indiceUsuarioLogado].recados = listaRecados;
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
}
function buscarRecados() {
    let recados = JSON.parse(localStorage.getItem("recados") || "[]");
    return recados;
}
function mostrarNaTela(recado) {
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
    let listaStorage = buscarRecadosNoStorage();
    if (listaStorage) {
        for (const recado of listaStorage) {
            mostrarNaTela(recado);
        }
    }
    return;
}
function editRecado(recado) {
    inputTituloEditar.value = recado.titulo;
    inputDescricaoEditar.value = recado.descricao;
    btnEditar.addEventListener("click", () => {
        let recadoAtual = {
            codigo: recado.codigo,
            titulo: inputTituloEditar.value,
            descricao: inputDescricaoEditar.value,
        };
        recadoAtualizado(recadoAtual);
    });
}
function apagarRecado(codigo) {
    btnApagar.addEventListener("click", () => {
        let listaRecados = buscarRecados();
        let indiceRecado = listaRecados.findIndex((registro) => registro.codigo == codigo);
        listaRecados.splice(indiceRecado, 1);
        salvarRecadoStorage(listaRecados);
        modalApagar.hide();
        let linhas = document.querySelectorAll("tbody > tr");
        window.location.reload();
    });
}
function recadoAtualizado(recado) {
    let recados = buscarRecados();
    let indiceRecado = recados.findIndex((registro) => registro.codigo === recado.codigo);
    recados[indiceRecado] = recado;
    salvarRecadoStorage(recados);
    modalEditar.hide;
    window.location.reload();
}
function buscarRecadosNoStorage() {
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));
    let dadosUsuarioLogado = listaUsuarios.find((usuario) => {
        return usuario.login === usuarioLogado;
    });
    return dadosUsuarioLogado.recados;
}
function sair() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}
