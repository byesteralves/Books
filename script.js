const campoBusca =
    document.getElementById("campoBusca");

const botaoBuscar =
    document.getElementById("botaoBuscar");

const resultados =
    document.getElementById("resultados");

const mensagem =
    document.getElementById("mensagem");

botaoBuscar.addEventListener(
    "click",
    buscarLivros
);


campoBusca.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            buscarLivros();

        }

    }
);



window.addEventListener(
    "load",
    carregarLivrosIniciais
);


async function carregarLivrosIniciais() {

    mensagem.textContent =
        "📚 Carregando livros...";

    resultados.innerHTML = "";


    const livrosIniciais = [
        "Dom Casmurro",
        "O Pequeno Príncipe",
        "Harry Potter",
        "1984",
        "O Senhor dos Anéis",
        "Memórias Póstumas de Brás Cubas"
    ];


    try {

        const pesquisas =
            livrosIniciais.map(function(livro) {

                const url =
                    `https://openlibrary.org/search.json?q=${encodeURIComponent(livro)}&limit=1&lang=pt`;

                return fetch(url)
                    .then(resposta => resposta.json());

            });


        const resultadosAPI =
            await Promise.all(pesquisas);


        resultadosAPI.forEach(function(dados) {

            if (
                dados.docs &&
                dados.docs.length > 0
            ) {

                criarCardLivro(
                    dados.docs[0]
                );

            }

        });


        mensagem.textContent =
            "📚 Sugestões de livros para você";


    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "❌ Não foi possível carregar os livros.";

    }

}



async function buscarLivros() {

    const pesquisa =
        campoBusca.value.trim();

    if (pesquisa === "") {

        mensagem.textContent =
            "⚠️ Digite o nome de um livro ou autor.";

        return;

    }


    mensagem.textContent =
        "🔎 Procurando livros...";


    resultados.innerHTML = "";


    botaoBuscar.disabled = true;


    try {

        const url =
            `https://openlibrary.org/search.json?q=${encodeURIComponent(pesquisa)}&limit=20&lang=pt`;


        const resposta =
            await fetch(url);


        
        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


     
        if (
            !dados.docs ||
            dados.docs.length === 0
        ) {

            mensagem.textContent =
                "❌ Nenhum livro encontrado.";


            resultados.innerHTML = `

                <div class="sem-resultados">

                    <div class="icone">
                        📚
                    </div>

                    <h2>
                        Nenhum resultado
                    </h2>

                    <p>
                        Tente pesquisar outro livro ou autor.
                    </p>

                </div>

            `;


            return;

        }


        mensagem.textContent =
            `✅ Encontramos ${dados.docs.length} livro(s).`;


        

        dados.docs.forEach(function(livro) {

            criarCardLivro(livro);

        });


    } catch (erro) {

        console.error(erro);


        mensagem.textContent =
            "❌ Erro ao consultar a API.";


        resultados.innerHTML = `

            <div class="sem-resultados">

                <div class="icone">
                    ⚠️
                </div>

                <h2>
                    Erro na consulta
                </h2>

                <p>
                    Verifique sua conexão com a internet
                    e tente novamente.
                </p>

            </div>

        `;


    } finally {

        botaoBuscar.disabled = false;

    }

}


function criarCardLivro(livro) {



    const titulo =
        livro.title ||
        "Título não informado";



    const autores =
        livro.author_name
            ? livro.author_name.join(", ")
            : "Autor não informado";



    const ano =
        livro.first_publish_year ||
        "Ano não informado";



    const edicoes =
        livro.edition_count
            ? `${livro.edition_count} edição(ões)`
            : "Edições não informadas";



    const isbn =
        livro.isbn &&
        livro.isbn.length > 0
            ? livro.isbn[0]
            : "Não informado";



    let capa = "";


    if (livro.cover_i) {

        capa =
            `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`;

    }



    const chave =
        livro.key || "";



    const link =
        chave
            ? `https://openlibrary.org${chave}`
            : "https://openlibrary.org/";



    const card =
        document.createElement("article");


    card.className =
        "card-livro";



    card.innerHTML = `

        <div class="capa-container">

            ${
                capa

                ?

                `
                <img
                    class="capa-livro"
                    src="${capa}"
                    alt="Capa do livro ${titulo}"
                >
                `

                :

                `
                <div class="capa-sem-imagem">
                    📖
                </div>
                `
            }

        </div>


        <div class="info-livro">

            <h2>
                ${titulo}
            </h2>


            <p class="autor">

                ✍️ ${autores}

            </p>


            <p class="detalhe">

                📅 Primeiro ano:
                ${ano}

            </p>


            <p class="detalhe">

                📚 ${edicoes}

            </p>


            <p class="detalhe">

                🔢 ISBN:
                ${isbn}

            </p>


            <a
                class="botao-detalhes"
                href="${link}"
                target="_blank"
                rel="noopener noreferrer"
            >

                Ver livro na Open Library →

            </a>

        </div>

    `;


    resultados.appendChild(card);

}
