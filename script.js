
// ===================================
// QUIZ - SORTEADOR DE PERGUNTAS
// ===================================

// Banco compartilhado com a administração
const CHAVE_BANCO = "quizPerguntas";

// ===================================
// PERGUNTAS INICIAIS
// ===================================

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

// ===================================
// CARREGAR BANCO
// ===================================

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
        const banco = JSON.parse(dados);

        if (!Array.isArray(banco)) {
            throw new Error("O banco não é uma lista válida.");
        }

        return banco.filter(item =>
            item &&
            Number.isFinite(item.id) &&
            typeof item.pergunta === "string" &&
            typeof item.resposta === "string"
        );

    } catch (erro) {
        console.error("Erro ao ler banco:", erro);
        return [];
    }
}

// ===================================
// ESTADO DO JOGO
// ===================================

let todasPerguntas = carregarBanco();

let perguntasDisponiveis = [...todasPerguntas];

let perguntaAtual = null;

let pontuacao = 0;

let perguntaPontuada = false;

// ===================================
// ELEMENTOS DA TELA
// ===================================

const questionElement = document.getElementById("question");
const questionNumber = document.getElementById("question-number");
const remainingElement = document.getElementById("remaining");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

const answerElement = document.getElementById("answer");
const answerArea = document.getElementById("answer-area");

const drawButton = document.getElementById("draw-button");
const revealButton = document.getElementById("reveal-button");
const resetButton = document.getElementById("reset-button");

const endScreen = document.getElementById("end-screen");
const finalMessage = document.getElementById("final-message");
const playAgainButton = document.getElementById("play-again-button");
const scoreElement = document.getElementById("score");
const correctButton = document.getElementById("correct-button");
const wrongButton = document.getElementById("wrong-button");

const scoreActions = document.getElementById("score-actions");

// Verificar se os elementos existem
if (
    !questionElement ||
    !questionNumber ||
    !remainingElement ||
    !answerElement ||
    !answerArea ||
    !drawButton ||
    !revealButton ||
    !resetButton
) {
    console.error(
        "Erro: confira os IDs dos elementos no index.html."
    );
}

// ===================================
// ATUALIZAR CONTADOR
// ===================================


function atualizarContador() {

    const total = todasPerguntas.length;
    const disponiveis = perguntasDisponiveis.length;
    const sorteadas = total - disponiveis;

    remainingElement.textContent =
        `${disponiveis} PERGUNTAS DISPONÍVEIS`;

    progressText.textContent =
        `${sorteadas}/${total}`;

    const progresso = total > 0
        ? (sorteadas / total) * 100
        : 0;

    progressFill.style.width = `${progresso}%`;
}


// ===================================
// ATUALIZAR BOTÕES
// ===================================

function atualizarBotoes() {

    drawButton.disabled =
        perguntasDisponiveis.length === 0;

    revealButton.disabled =
        perguntaAtual === null;
}

// ===================================
// ESCONDER RESPOSTA
// ===================================

function esconderResposta() {

    answerElement.textContent = "";

    answerArea.style.display = "none";

    scoreActions.style.display = "none";
}

// ===================================
// SORTEAR PERGUNTA
// ===================================


function sortearPergunta() {

    if (perguntasDisponiveis.length === 0) {
        finalizarPartida();
        return;
    }

    const indiceAleatorio = Math.floor(
        Math.random() * perguntasDisponiveis.length
    );

    perguntaAtual = perguntasDisponiveis.splice(
        indiceAleatorio,
        1
    )[0];

    perguntaPontuada = false;

    questionElement.textContent =
        perguntaAtual.pergunta;

    questionNumber.textContent =
        `Pergunta nº ${perguntaAtual.id}`;

    esconderResposta();

    endScreen.style.display = "none";

    atualizarContador();
    atualizarBotoes();

    // Verificar se esta foi a última pergunta
    if (perguntasDisponiveis.length === 0) {

        drawButton.disabled = true;

        questionNumber.textContent =
            "Última pergunta da partida!";
    }
}


 // ===================================
 // FINALIZAR PARTIDA
 // ===================================


function finalizarPartida() {

    perguntaAtual = null;

    questionElement.textContent =
        "Partida concluída!";

    questionNumber.textContent =
        "Você respondeu todas as perguntas.";

    finalMessage.textContent =
        `Você acertou ${pontuacao} de ${todasPerguntas.length} perguntas!`;

    esconderResposta();

    endScreen.style.display = "block";

    atualizarContador();
    atualizarBotoes();

    drawButton.disabled = true;

}



// ===================================
// REVELAR RESPOSTA
// ===================================


function revelarResposta() {
    if (!perguntaAtual) return;

    answerElement.textContent = perguntaAtual.resposta;
    answerArea.style.display = "block";
    scoreActions.style.display = "flex";
    revealButton.disabled = true;
}


// ===================================
// NOVA PARTIDA
// ===================================

function novaPartida() {

    const confirmar = confirm(
        "Deseja iniciar uma nova partida? " +
        "Todas as perguntas cadastradas ficarão disponíveis novamente."
    );

    if (!confirmar) return;
    endScreen.style.display = "none";

    // Buscar novamente o banco atualizado
    // Isso inclui perguntas adicionadas na administração.

    todasPerguntas = carregarBanco();

    // Restaurar todas as perguntas disponíveis
    perguntasDisponiveis = [...todasPerguntas];

    // Limpar pergunta atual
    perguntaAtual = null;
    pontuacao = 0;
    perguntaPontuada = false; 
    scoreElement.textContent = "0";

    // Restaurar textos
    questionElement.textContent =
        "Pronto para começar?";

    questionNumber.textContent =
        "Clique no botão abaixo para sortear.";

    // Esconder resposta
    esconderResposta();

    // Atualizar contador e botões
    atualizarContador();
    atualizarBotoes();

    // Avisar se o banco estiver vazio
    if (todasPerguntas.length === 0) {

        questionElement.textContent =
            "Nenhuma pergunta cadastrada.";

        questionNumber.textContent =
            "Acesse a administração para adicionar perguntas.";
    }

    console.log(
        "Nova partida iniciada. Perguntas disponíveis:",
        perguntasDisponiveis.length
    );
}

// ===================================
// REGISTRAR PONTUAÇÃO
// ===================================

function registrarResultado(acertou) {
    if (!perguntaAtual || perguntaPontuada) return;

    perguntaPontuada = true;

    if (acertou) {
        pontuacao++;
    }

    scoreElement.textContent = pontuacao;

    scoreActions.style.display = "none";

    questionNumber.textContent = acertou
        ? "Resposta registrada: você acertou!"
        : "Resposta registrada: você errou!";

    if (perguntasDisponiveis.length === 0) {
        setTimeout(() => {
            finalizarPartida();
        }, 1500);
    }
}


// ===================================
// EVENTOS DOS BOTÕES
// ===================================

drawButton.addEventListener(
    "click",
    sortearPergunta
);

revealButton.addEventListener(
    "click",
    revelarResposta
);

resetButton.addEventListener(
    "click",
    novaPartida
);

playAgainButton.addEventListener(
    "click",
    novaPartida
);

correctButton.addEventListener("click", () => {
    registrarResultado(true);
});

wrongButton.addEventListener("click", () => {
    registrarResultado(false);
});

// ===================================
// INICIAR APLICAÇÃO
// ===================================

function iniciarJogo() {

    atualizarContador();

    atualizarBotoes();

    esconderResposta();

    if (todasPerguntas.length === 0) {

        questionElement.textContent =
            "Nenhuma pergunta cadastrada.";

        questionNumber.textContent =
            "Acesse a administração para adicionar perguntas.";

    } else {

        questionElement.textContent =
            "Pronto para começar?";

        questionNumber.textContent =
            "Clique no botão abaixo para sortear.";
    }
}

iniciarJogo();
