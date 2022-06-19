"use strict";
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
let inputNome = document.getElementById("input-cadastro-nome");
let inputEmail = document.getElementById("input-cadastro-email");
let inputSenha = document.getElementById("input-cadastro-senha");
let formularioCadastro = document.getElementById("formulario-cadastro");
let inputLoginEmail = document.getElementById("input-login-email");
let inputLoginSenha = document.getElementById("input-login-senha");
let formularioLogin = document.getElementById("formulario-login");
signUpButton.addEventListener("click", () => {
    container.classList.add("painel-direito-ativo");
});
signInButton.addEventListener("click", () => {
    container.classList.remove("painel-direito-ativo");
});
formularioCadastro.addEventListener("submit", (event) => {
    event.preventDefault();
    verificarCampos();
});
function verificarCampos() {
    if (inputNome.value === "" || inputNome.value.length < 3) {
        inputNome.focus();
        inputNome.value = "";
        inputNome.setAttribute("style", "outline: thin solid red;");
    }
    else if (inputEmail.value === "" || inputEmail.value.length < 10) {
        inputEmail.focus();
        inputEmail.value = "";
        inputEmail.setAttribute("style", "outline: thin solid red;");
    }
    else if (inputSenha.value === "" || inputSenha.value.length < 8) {
        inputSenha.focus();
        inputSenha.value = "";
        inputSenha.setAttribute("style", "outline: thin solid red;");
    }
    else {
        inputNome.removeAttribute("style");
        inputEmail.removeAttribute("style");
        inputSenha.removeAttribute("style");
        const novoUsuario = {
            nome: inputNome.value,
            login: inputEmail.value,
            senha: inputSenha.value,
            recados: [],
        };
        formularioCadastro.reset();
        cadastrarUsuario(novoUsuario);
    }
}
function cadastrarUsuario(novoUsuario) {
    let usuarios = buscarUsuariosStorage();
    let existe = usuarios.some((usuario) => {
        return usuario.login === novoUsuario.login;
    });
    if (existe) {
        let confirma = confirm("Esse e-mail já está sendo utilizado em outra conta cadastrada. Deseja ir para página de login?");
        if (confirma) {
            container.classList.remove("painel-direito-ativo");
        }
        return;
    }
    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarAlertaBS(`Conta de ${inputNome.value} cadastrada com sucesso!`, "success");
    setTimeout(() => {
        container.classList.remove("painel-direito-ativo");
    }, 1000);
}
function mostrarAlertaBS(mensagem, tipo) {
    const alerta = document.getElementById("local-alerta-bs");
    alerta.classList.remove("d-none");
    alerta.classList.add(`alert-${tipo}`);
    alerta.innerText = mensagem;
    const wrapper = document.getElementById("wrapper");
    wrapper.classList.remove("d-none");
    wrapper.classList.add("wrapper");
    setTimeout(() => {
        alerta.innerText = "";
        alerta.classList.add("d-none");
        alerta.classList.remove(`alert-${tipo}`);
    }, 2000);
}
function buscarUsuariosStorage() {
    return JSON.parse(localStorage.getItem("usuarios") || "[]");
}
formularioLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    logarNoSistema();
});
function logarNoSistema() {
    let usuarios = buscarUsuariosStorage();
    let existe = usuarios.some((usuario) => {
        return (usuario.login === inputLoginEmail.value &&
            usuario.senha === inputLoginSenha.value);
    });
    if (!existe) {
        alert("E-mail ou senha inválidos.");
        return;
    }
    sessionStorage.setItem("usuarioLogado", inputLoginEmail.value);
    window.location.href = "./home.html";
}
