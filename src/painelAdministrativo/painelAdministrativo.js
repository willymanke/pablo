import { navigate } from "../common/modules/navigate.js";
import { verificarAtraso, fecharDevolucao } from "./modules/devolucao.js";
import { handleCadastroLivro } from "./modules/cadastroLivro.js";
import { estaLogado } from "../auth/checarSessao.js";
import { exigirPapel } from "../auth/exigirPapel.js";
import { sair } from "../auth/sair.js";

// Proteção: sem sessão ou sem papel, volta para o login
if (!(await estaLogado())) {
  window.location.href = "login.html";
  throw new Error("Usuário não logado");
}

if (!(await exigirPapel(["admin", "bibliotecario"]))) {
  window.location.href = "login.html";
  throw new Error("Papel não permitido");
}


// Navegação e logout (delegação de eventos)
document.addEventListener("click", (e) => {
    
  const nav = e.target.closest("[data-navigate]");
  if (nav) {
    e.preventDefault();
    navigate(nav.dataset.navigate);
    return;
  }


  const acao = e.target.closest("[data-action]");
  if (!acao) return;
  e.preventDefault();

  if (acao.dataset.action === "logout") sair();
  if (acao.dataset.action === "verificar-atraso") verificarAtraso();
  if (acao.dataset.action === "fechar-devolucao") fecharDevolucao();
});

// Formulários
document
  .getElementById("form-cadastrar")
  .addEventListener("submit", handleCadastroLivro);
