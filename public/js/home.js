"use strict";
const session = localStorage.getItem("session");
let logged = sessionStorage.getItem("logged");
let usuarios = undefined;
let isEdit = false;
let IdEdit = undefined;
function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }
    if (!logged) {
        window.location.href = "./index.html";
        return;
    }
    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        usuarios = JSON.parse(dataUser);
    }
}
function printMessages() {
    let messagesHTML = "";
    const messages = usuarios.messages;
    if (messages.length) {
        messages.forEach((message, index) => {
            messagesHTML += `
        <tr class="line">
          <td class="table-id">${index}</td>
          <td class="table-description">${message.description}</td>
          <td class="table-details">${message.details}</td>
          <td class="table-buttons">
            <button class="btn btn-delete" onClick="deleteMessage(${index})">Apagar</button>
            <button class="btn btn-edit" onClick="editMessage(${index})">Editar</button>
          </td>
        </tr>
      `;
        });
    }
    /* document.getElementById("#table-body").innerHTML = messagesHTML; */
}
function saveMessage() {
    const formMessage = document.getElementById("form-message");
    const message = {
        description: formMessage.message.value,
        details: formMessage.details.value,
    };
    if (isEdit) {
        usuarios.messages[IdEdit] = message;
        isEdit = false;
        IdEdit = null;
    }
    else {
        usuarios.messages.push(message);
    }
    localStorage.setItem(usuarios.username, JSON.stringify(usuarios));
    printMessages();
    formMessage.reset();
}
function deleteMessage(index) {
    usuarios.messages.splice(index, 1);
    localStorage.setItem(usuarios.username, JSON.stringify(usuarios));
    printMessages();
}
/* function editMessage(index: any) {
  const formMessage = document.getElementById("form-message");
  formMessage.message.value = usuarios.messages[index]
    .description as HTMLElement;
  formMessage.details.value = usuarios.messages[index].details as HTMLElement;
  isEdit = true;
  IdEdit = index;
} */
checkLogged();
printMessages();
function sair() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}
