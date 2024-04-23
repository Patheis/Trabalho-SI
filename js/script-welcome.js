// Seleciona o modal de solicitação de senha
var adminSenhaModal = document.getElementById("adminSenhaModal");

// Seleciona o botão que abre o modal
var adminModalButton = document.getElementById("adminModal");

// Seleciona o botão de fechar do modal
var closeAdminModalButton = document.getElementById("closeAdminModal");

// Adiciona um evento de clique ao botão que abre o modal
adminModalButton.addEventListener("click", function() {
  adminSenhaModal.style.display = "block"; // Exibe o modal quando o botão é clicado
});

// Adiciona um evento de clique ao botão de fechar do modal
closeAdminModalButton.addEventListener("click", function() {
  adminSenhaModal.style.display = "none"; // Fecha o modal quando o botão de fechar é clicado
});

// Adiciona um evento de envio ao formulário dentro do modal
var adminPasswordForm = document.getElementById("admin-password-form");
adminPasswordForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Impede o envio do formulário (comportamento padrão)

  // Obtém o valor da senha do administrador
  var adminPassword = document.getElementById("admin-password").value;

  // Verifica se a senha do administrador está correta
  if (adminPassword === "admin") {
    alert("Senha correta. Resetando usuários");
    console.log("Limpando o LocalStorage...");
    localStorage.clear(); // Limpa todos os itens do localStorage
    alert("LocalStorage limpo com sucesso!");
  } else {
    alert("Senha incorreta. Acesso negado."); // Exibe uma mensagem de erro se a senha estiver incorreta
  }

  // Limpa o campo de senha após a tentativa de envio
  document.getElementById("admin-password").value = "";
  
});

function logout() {
  localStorage.removeItem('loggedIn'); // Remove a marcação de login
  window.location.href = 'index.html'; // Redireciona para a página de login
}
