
// ===================================
// CONFIGURAÇÃO DO BANCO
// ===================================

const CHAVE_BANCO = "quizPerguntas";

// Perguntas iniciais para teste
const perguntasIniciais = [
    {
        id: 1,
        pergunta: "Qual é a capital da França?",
        resposta: "Paris."
    },
    {
        id: 2,
        pergunta: "Quantos livros existem na Bíblia católica?",
        resposta: "73 livros."
    },
    {
        id: 3,
        pergunta: "Quem construiu a arca?",
        resposta: "Noé."
    },
    {
        id: 4,
        pergunta: "Qual é o maior planeta do Sistema Solar?",
        resposta: "Júpiter."
    },
    {
        id: 5,
        pergunta: "Qual foi o primeiro milagre de Jesus?",
        resposta: "A transformação da água em vinho, nas bodas de Caná."
    }
];

// Carregar banco ou iniciar com as perguntas de teste
function carregarBanco() {
    const dados = localStorage.getItem(CHAVE_BANCO);

    if (dados === null) {
        localStorage.setItem(
            CHAVE_BANCO,
            JSON.stringify(perguntasIniciais)
        );

        return [...perguntasIniciais];
    }

    try {
        const perguntas = JSON.parse(dados);

        return Array.isArray(perguntas) ? perguntas : [];
    } catch (erro) {
        console.error("Erro ao carregar banco:", erro);
        return [];
    }
}

let perguntas = carregarBanco();
let perguntaEmEdicao = null;

// ===================================
// ELEMENTOS DA INTERFACE
// ===================================

const form = document.getElementById("question-form");
const questionInput = document.getElementById("question-input");
const answerInput = document.getElementById("answer-input");

const questionsList = document.getElementById("questions-list");
const totalQuestions = document.getElementById("total-questions");

const searchInput = document.getElementById("search-input");
const emptyMessage = document.getElementById("empty-message");

const formTitle = document.getElementById("form-title");
const cancelEditButton = document.getElementById("cancel-edit");

// ===================================
// SALVAR BANCO
// ===================================

function salvarBanco() {
    localStorage.setItem(
        CHAVE_BANCO,
        JSON.stringify(perguntas)
    );
}

// ===================================
// ATUALIZAR CONTADOR
// ===================================

function atualizarContador() {
    totalQuestions.textContent = perguntas.length;
}

// ===================================
// LISTAR PERGUNTAS
// ===================================

function renderizarPerguntas() {

    questionsList.replaceChildren();

    const busca = searchInput.value
        .trim()
        .toLowerCase();

    const filtradas = perguntas.filter(item =>
        item.pergunta.toLowerCase().includes(busca)
    );

    emptyMessage.hidden = filtradas.length > 0;

    filtradas.forEach(item => {

        const card = document.createElement("article");
        card.className = "question-item";

        const content = document.createElement("div");
        content.className = "question-item-content";

        const title = document.createElement("strong");
        title.textContent = item.pergunta;

        const answer = document.createElement("p");
        answer.textContent = "Resposta: " + item.resposta;

        const number = document.createElement("span");
        number.className = "question-id";
        number.textContent = "ID: " + item.id;

        content.append(number, title, answer);

        const actions = document.createElement("div");
        actions.className = "question-item-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-button";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", () => {
            editarPergunta(item.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", () => {
            excluirPergunta(item.id);
        });

        actions.append(editButton, deleteButton);
        card.append(content, actions);

        questionsList.appendChild(card);
    });

    atualizarContador();
}

// ===================================
// CADASTRAR OU ATUALIZAR
// ===================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const pergunta = questionInput.value.trim();
    const resposta = answerInput.value.trim();

    if (!pergunta || !resposta) {
        alert("Preencha a pergunta e a resposta.");
        return;
    }

    if (perguntaEmEdicao !== null) {

        const indice = perguntas.findIndex(
            item => item.id === perguntaEmEdicao
        );

        if (indice !== -1) {
            perguntas[indice].pergunta = pergunta;
            perguntas[indice].resposta = resposta;
        }

        alert("Pergunta atualizada com sucesso!");

    } else {

        const novoId = perguntas.length > 0
            ? Math.max(...perguntas.map(item => item.id)) + 1
            : 1;

        perguntas.push({
            id: novoId,
            pergunta: pergunta,
            resposta: resposta
        });

        alert("Pergunta cadastrada com sucesso!");
    }

    salvarBanco();
    limparFormulario();
    renderizarPerguntas();
});

// ===================================
// EDITAR PERGUNTA
// ===================================

function editarPergunta(id) {

    const item = perguntas.find(
        pergunta => pergunta.id === id
    );

    if (!item) return;

    perguntaEmEdicao = id;

    questionInput.value = item.pergunta;
    answerInput.value = item.resposta;

    formTitle.textContent = "Editar pergunta";

    form.querySelector('button[type="submit"]').textContent =
        "Atualizar pergunta";

    cancelEditButton.hidden = false;

    questionInput.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ===================================
// EXCLUIR PERGUNTA
// ===================================

function excluirPergunta(id) {

    const confirmar = confirm(
        "Tem certeza de que deseja excluir esta pergunta?"
    );

    if (!confirmar) return;

    perguntas = perguntas.filter(
        item => item.id !== id
    );

    if (perguntaEmEdicao === id) {
        limparFormulario();
    }

    salvarBanco();
    renderizarPerguntas();
}

// ===================================
// LIMPAR FORMULÁRIO
// ===================================

function limparFormulario() {

    form.reset();

    perguntaEmEdicao = null;

    formTitle.textContent = "Cadastrar pergunta";

    form.querySelector('button[type="submit"]').textContent =
        "Salvar pergunta";

    cancelEditButton.hidden = true;
}

// ===================================
// CANCELAR EDIÇÃO
// ===================================

cancelEditButton.addEventListener("click", limparFormulario);

// ===================================
// PESQUISAR PERGUNTAS
// ===================================

searchInput.addEventListener("input", renderizarPerguntas);

// ===================================
// INICIALIZAÇÃO
// ===================================

renderizarPerguntas();
