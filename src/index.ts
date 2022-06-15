const signUpButton = document.getElementById("signUp") as HTMLButtonElement;
const signInButton = document.getElementById("signIn") as HTMLButtonElement;
const container = document.getElementById("container") as HTMLDivElement;

let inputNome = document.getElementById(
  "input-cadastro-nome"
) as HTMLInputElement;
let inputEmail = document.getElementById(
  "input-cadastro-email"
) as HTMLInputElement;
let inputSenha = document.getElementById(
  "input-cadastro-senha"
) as HTMLInputElement;
let formularioCadastro = document.getElementById(
  "formulario-cadastro"
) as HTMLFormElement;

interface iUsuario {
  nome: string;
  login: string;
  senha: string;
  recados: Array<any>;
}

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

function verificarCampos(): void {
  if (inputNome.value === "" || inputNome.value.length < 3) {
    inputNome.focus();
    inputNome.value = "";
    inputNome.setAttribute("style", "outline: thin solid red;");
  } else if (inputEmail.value === "" || inputEmail.value.length < 10) {
    inputEmail.focus();
    inputEmail.value = "";
    inputEmail.setAttribute("style", "outline: thin solid red;");
  } else if (inputSenha.value === "" || inputSenha.value.length < 8) {
    inputSenha.focus();
    inputSenha.value = "";
    inputSenha.setAttribute("style", "outline: thin solid red;");
  } else {
    inputNome.removeAttribute("style");
    inputEmail.removeAttribute("style");
    inputSenha.removeAttribute("style");

    const novoUsuario: iUsuario = {
      nome: inputNome.value,
      login: inputEmail.value,
      senha: inputSenha.value,
      recados: [],
    };

    formularioCadastro.reset();
    cadastrarUsuario(novoUsuario);
  }
}

function cadastrarUsuario(novoUsuario: iUsuario): void {
  let usuarios: Array<iUsuario> = buscarUsuariosStorage();

  let existe: boolean = usuarios.some((usuario) => {
    return usuario.login === novoUsuario.login;
  });

  if (existe) {
    let confirma = confirm(
      "Esse e-mail já está sendo utilizado em outra conta cadastrada. Deseja ir para página de login?"
    );
    if (confirma) {
      container.classList.remove("painel-direito-ativo");
    }

    return;
  }

  usuarios.push(novoUsuario);

  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  mostrarAlertaBS(
    `Conta de ${inputNome.value} cadastrada com sucesso!`,
    "success"
  );

  setTimeout(() => {
    container.classList.remove("painel-direito-ativo");
  }, 1000);
}

function mostrarAlertaBS(mensagem: string, tipo: string): void {
  const alerta = document.getElementById("local-alerta-bs") as HTMLDivElement;
  alerta.classList.remove("d-none");
  alerta.classList.add(`alert-${tipo}`);
  alerta.innerText = mensagem;

  const wrapper: HTMLDivElement = document.getElementById(
    "wrapper"
  ) as HTMLDivElement;
  wrapper.classList.remove("d-none");
  wrapper.classList.add("wrapper");

  setTimeout(() => {
    alerta.innerText = "";
    alerta.classList.add("d-none");
    alerta.classList.remove(`alert-${tipo}`);
  }, 2000);
}

function buscarUsuariosStorage(): Array<iUsuario> {
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}

let inputLoginEmail = document.getElementById(
  "input-login-email"
) as HTMLInputElement;
let inputLoginSenha = document.getElementById(
  "input-login-senha"
) as HTMLInputElement;
let formularioLogin = document.getElementById(
  "formulario-login"
) as HTMLFormElement;

formularioLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  logarNoSistema();
});

function logarNoSistema(): void {
  let usuarios: Array<iUsuario> = buscarUsuariosStorage();

  let existe: boolean = usuarios.some((usuario) => {
    return (
      usuario.login === inputLoginEmail.value &&
      usuario.senha === inputLoginSenha.value
    );
  });

  if (!existe) {
    alert("E-mail ou senha inválidos.");
    return;
  }

  sessionStorage.setItem("usuarioLogado", inputLoginEmail.value);
  window.location.href = "home.html";
}
