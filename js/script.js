// Função para calcular o hash SHA-256 de uma string
function sha256(message) {
  // Retorna uma Promise que resolve com o resultado do cálculo do hash
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(message)).then(buffer => {
    // Converte o buffer para uma representação hexadecimal
    return Array.prototype.map.call(new Uint8Array(buffer), byte => ('00' + byte.toString(16)).slice(-2)).join('');
  });
}


// Inicializa a variável loginAttempts se ainda não estiver definida
if (!localStorage.getItem('loginAttempts')) {
  localStorage.setItem('loginAttempts', 0);
}


// Obtendo os usuários do localStorage, se houver
var users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

// Modal de cadastro
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalButton");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById("signup-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  var username = document.getElementById('new-username').value;
  var password = document.getElementById('new-password').value;
  var password2 = document.getElementById('new-password2').value;
  var frase_apoio = document.getElementById('frase_apoio').value;
  var frase_resposta = document.getElementById('frase_resposta').value;
  var email = document.getElementById('email').value;

  // Função para verificar se a senha é forte
  function isPasswordStrong(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  }

  // Verificar se as senhas coincidem
  if (password !== password2) {
    alert("As senhas não coincidem. Por favor, digite a mesma senha nos dois campos.");
    return;
  }

  // Verificar se a senha é forte
  if (!isPasswordStrong(password)) {
    alert("A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.");
    return;
  }

  // Verificar se o usuário já existe
  var users = JSON.parse(localStorage.getItem('users')) || [];
  var userExists = users.some(function(user) {
    return user.username === username;
  });

  if (userExists) {
    alert("Erro: Usuário já existe!");
    return;
  }

  // Criptografar a senha usando SHA-256
  var hashedPassword = await sha256(password);
  var hashedfrase = await sha256(frase_apoio);
  var hashedfraseresposta = await sha256(frase_resposta);

  // Adicionar novo usuário ao array de usuários
  users.push({ username: username, password: hashedPassword, frase_apoio: frase_apoio, frase_resposta: frase_resposta, email: email });

  // Salvar os usuários no localStorage
  localStorage.setItem('users', JSON.stringify(users));

  console.log("Novo Usuário:");
  console.log("Username:", username);
  console.log("Password:", hashedPassword);
  console.log("Sentence:", hashedfrase);
  console.log("Answer:", hashedfraseresposta);
  console.log("Email:", email);

  // Limpar os campos de entrada
  document.getElementById("new-username").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("new-password2").value = "";
  document.getElementById("frase_apoio").value = "";
  document.getElementById("frase_resposta").value = "";
  document.getElementById("email").value = "";

  alert("Usuário cadastrado com sucesso!");

      // Fecha o modal após a mensagem de sucesso
      modal.style.display = "none";
});


document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Verificar se os campos de login estão preenchidos
  if (!username || !password) {
    console.error("Usuário ou senha não fornecidos.");
    alert("Por favor, preencha todos os campos.");
    return;
  }

  console.log("Tentativa de login com:");
  console.log("Username:", username);
  console.log("Password (sem hash):", password);

  // Criptografar a senha para comparação
  var hashedPassword = await sha256(password);
  console.log("Hashed Password:", hashedPassword);

  // Obter a lista de usuários do localStorage
  var users = JSON.parse(localStorage.getItem('users')) || [];

  console.log("Usuários armazenados:", users);

  // Encontrar o usuário pelo nome de usuário e pela senha criptografada
  var user = users.find(function(u) {
    return u.username === username && u.password === hashedPassword;
  });

  if (user) {
    console.log("Login bem-sucedido.");
    localStorage.setItem('loggedIn', true);
    window.location.href = 'welcome.html';
  } else {
    console.warn("Usuário ou senha incorretos.");
    incrementAttempts(); // Incrementar tentativas de login

    if (getAttempts() >= 3) {
      console.warn("Número máximo de tentativas excedido.");
      document.getElementById('message').innerHTML = '<div id="error-message">Você excedeu o número máximo de tentativas. Por favor, redefina sua senha.</div>';
    } else {
      document.getElementById('message').innerHTML = '<div id="error-message">Usuário ou senha incorretos.</div>';
    }
  }
});



// Função para obter o número de tentativas de login armazenadas no localStorage
function getAttempts() {
  var attempts = localStorage.getItem('loginAttempts');
  return attempts ? parseInt(attempts) : 0;
}

// Função para incrementar o número de tentativas de login e armazená-lo no localStorage
function incrementAttempts() {
  var attempts = getAttempts();
  attempts++;
  localStorage.setItem('loginAttempts', attempts);
}


document.addEventListener('DOMContentLoaded', function() {
  // Seleciona o botão "Esqueceu a senha?"
  var esqueceuSenhaBtn = document.querySelector('.esqueceu-button');

  // Seleciona o modal customizado
  var modal = document.getElementById("customModal");

  // Seleciona o botão de fechar do modal customizado
  var closeBtn = document.querySelector('.close2');

  // Seleciona a label da frase de apoio e a label de email mascarado
  var fraseLabel = document.getElementById("fraseLabel");
  var emailLabel = document.getElementById("emailLabel");

  // Seleciona o campo de entrada do nome de usuário
  var usernameField = document.getElementById("username");

  // Declara a variável user
  var user;

  // Função para mascarar o email
  function maskEmail(email) {
    var parts = email.split('@');
    var localPart = parts[0];
    var maskedLocal = localPart[0] + '*'.repeat(Math.max(0, localPart.length - 2)) + (localPart.length > 1 ? localPart[localPart.length - 1] : '');
    return maskedLocal + '@' + parts[1];
  }

  // Função para validar a senha forte
  function isPasswordStrong(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
  }

  // Quando o botão "Esqueceu a senha?" é clicado
  esqueceuSenhaBtn.addEventListener('click', function() {
    var username = usernameField.value;
    if (username.trim() === "") {
      alert("Por favor, digite seu nome de usuário antes de prosseguir.");
      return;
    }
    var users = JSON.parse(localStorage.getItem('users')) || [];
    user = users.find(user => user.username === username);
    if (!user) {
      alert("Usuário não encontrado. Por favor, verifique o nome de usuário e tente novamente.");
      return;
    }
    fraseLabel.textContent = "Frase de apoio: " + user.frase_apoio;
    emailLabel.textContent = "Email mascarado: " + maskEmail(user.email);
    modal.style.display = "block";
  });

  // Quando o botão de confirmação é clicado
  document.getElementById("confirmar").addEventListener('click', async function() {
    if (!user) {
      alert("Por favor, clique no botão 'Esqueceu a senha?' e forneça um nome de usuário válido.");
      return;
    }

    var respostaFornecida = document.getElementById("respostaFrase").value;
    var respostaEmail = document.getElementById("respostaEmail").value;

    if (respostaFornecida === user.frase_resposta || respostaEmail === user.email) {
      var novaSenha;
      do {
        novaSenha = prompt("Digite sua nova senha (deve ter pelo menos 8 caracteres, incluir letras maiúsculas, minúsculas e números):");
        if (novaSenha && isPasswordStrong(novaSenha)) {
          var senhaCriptografada = await sha256(novaSenha);
          var users = JSON.parse(localStorage.getItem('users'));
          var index = users.findIndex(u => u.username === user.username);

          if (index !== -1) {
            users[index].password = senhaCriptografada; // Corrigir para usar 'index'
            localStorage.setItem('users', JSON.stringify(users)); // Salvar alterações
            console.log("Nova senha criptografada:", senhaCriptografada);

            alert("Senha atualizada com sucesso!");
            modal.style.display = "none";
            break;
          }
        } else if (!novaSenha) {
          alert("Atualização de senha cancelada.");
          break;
        } else {
          alert("A senha não atende aos requisitos mínimos de segurança.");
        }
      } while (true);
    } else {
      alert("Resposta incorreta. Por favor, tente novamente.");
    }
  });

  // Quando o botão de fechar do modal customizado é clicado
  closeBtn.addEventListener('click', function() {
    modal.style.display = "none";
  });

  // Quando o usuário clica fora do modal customizado, fecha o modal
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });





});



















