document.addEventListener("DOMContentLoaded", () => {
  const cadastroForm = document.getElementById("cadastro-form");
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const telefoneInput = document.getElementById("telefone");
  const cpfInput = document.getElementById("cpf");
  const passwordInput = document.getElementById("password");
  const messageDiv = document.getElementById("message");
  const submitBtn = document.getElementById("btn-submit");

  cadastroForm.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    messageDiv.textContent = "";
    messageDiv.className = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Cadastrando...";

    const nome = nomeInput.value;
    const email = emailInput.value;
    const telefone = telefoneInput.value;
    const cpf = cpfInput.value;
    const password = passwordInput.value;

    const { data, error } = await db.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      messageDiv.textContent = "Erro ao cadastrar: " + error.message;
      messageDiv.className = "error";
      submitBtn.disabled = false;
      submitBtn.textContent = "Cadastrar";
      return;
    }

    const authId = data.user.id;

    const { error: erroInsert } = await db.from("cliente").insert({
      auth_id: authId,
      nome_cliente: nome,
      email_cliente: email,
      telefone_cliente: telefone,
      cpf_cliente: cpf,
    });

    if (erroInsert) {
      messageDiv.textContent = "Erro ao salvar perfil: " + erroInsert.message;
      messageDiv.className = "error";
      submitBtn.disabled = false;
      submitBtn.textContent = "Cadastrar";
      return;
    }

    messageDiv.textContent =
      "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.";
    messageDiv.className = "success";
    submitBtn.disabled = false;
    submitBtn.textContent = "Cadastrar";

    cadastroForm.reset();
  })
});