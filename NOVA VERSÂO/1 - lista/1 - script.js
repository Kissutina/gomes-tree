const gameContainer = document.getElementById('game-container');
let gamesData = []; // Variável para armazenar os dados dos jogos
let isConqFilterActive = false; // Estado do filtro conq = 100


// Função para aplicar todos os filtros ativos
function applyFilters() {
    const searchText = document.getElementById('search-bar').value.toLowerCase();
    const searchDev = document.getElementById('search-dev').value.toLowerCase();
    const searchPlatform = document.getElementById('search-platform').value.toLowerCase();
    const searchGenre = document.getElementById('search-genre').value.toLowerCase();
    const searchReleaseYear = document.getElementById('search-release-year').value;
    const playedYear = document.getElementById('filter-played-year').value;
    const filterScore = document.getElementById('filter-score').value;

    const filteredGames = gamesData.filter(item => {
        const isCollection = item.collection && item.collection.length > 0;

        // Filtra por texto de pesquisa (título)
        const matchesSearch = !searchText || (isCollection
            ? item.collection.some(game => game.title.toLowerCase().includes(searchText))
            : item.title.toLowerCase().includes(searchText)
        );

        // Filtra por ano jogado
        const matchesYear = playedYear === "" || (isCollection
            ? item.collection.some(game => {
                const years = game.year || [];
                return years.length > 0 && Math.max(...years) === parseInt(playedYear);
            })
            : (item.year && item.year.length > 0 && Math.max(...item.year) === parseInt(playedYear))
        );

        // Filtra por conq = 100 (se o filtro estiver ativo)
        const matchesConq = !isConqFilterActive || (isCollection
            ? item.collection.some(game => game.conq === 100)
            : item.conq === 100
        );

        // Filtra por desenvolvedor
        const matchesDev = !searchDev || (isCollection
            ? item.collection.some(game => game.dev.some(d => d.toLowerCase().includes(searchDev)))
            : item.dev.some(d => d.toLowerCase().includes(searchDev))
        );

        // Filtra por plataforma
        const matchesPlatform = !searchPlatform || (isCollection
            ? item.collection.some(game => game.platform.some(p => p.toLowerCase().includes(searchPlatform)))
            : item.platform.some(p => p.toLowerCase().includes(searchPlatform))
        );

        // Filtra por gênero
        const matchesGenre = !searchGenre || (isCollection
            ? item.collection.some(game => game.genres.some(g => g.toLowerCase().includes(searchGenre)))
            : item.genres.some(g => g.toLowerCase().includes(searchGenre))
        );

        // Filtra por ano de lançamento (considerando apenas o menor ano)
        const matchesReleaseYear = !searchReleaseYear || 
            (item.year && item.year.length > 0 && Math.min(...item.year).toString().includes(searchReleaseYear));

        // Filtra por nota mínima
        const matchesScore = !filterScore || (isCollection
            ? item.collection.some(game => game.score >= parseInt(filterScore))
            : (item.score >= parseInt(filterScore))
        );

        // Retorna true apenas se o item passar em todos os filtros ativos
        return matchesSearch && matchesYear && matchesConq && matchesDev && 
               matchesPlatform && matchesGenre && matchesReleaseYear && matchesScore;
    });

    renderGames(filteredGames);
}

// Função para renderizar os jogos e coleções
function renderGames(games) {
    gameContainer.innerHTML = ''; // Limpa o container
    games.forEach(item => {
        if (item.collection) {
            // Se for uma coleção, cria o card de coleção
            const collectionCard = createCollectionCard(item);
            gameContainer.appendChild(collectionCard);
        } else {
            // Se for um jogo individual, cria o card de jogo
            const gameCard = createGameCard(item);
            gameContainer.appendChild(gameCard);
        }
    });
}

// Função para alternar o filtro conq = 100
function toggleConqFilter() {
    isConqFilterActive = !isConqFilterActive; // Alterna o estado do filtro
    const filterButton = document.getElementById('filter-conq');

    if (isConqFilterActive) {
        filterButton.classList.add('active'); // Adiciona estilo de ativo
    } else {
        filterButton.classList.remove('active'); // Remove estilo de ativo
    }

    applyFilters(); // Aplica todos os filtros
}

// Função para ordenar os jogos
// Função para ordenar os jogos
function sortGames(sortType) {
    const searchText = document.getElementById('search-bar').value.toLowerCase();
    const playedYear = document.getElementById('filter-played-year').value;

    let filteredGames = gamesData.filter(item => {
        const isCollection = item.collection && item.collection.length > 0;

        const matchesSearch = !searchText || (isCollection
            ? item.collection.some(game => game.game.toLowerCase().includes(searchText))
            : item.title.toLowerCase().includes(searchText)
        );

        const matchesYear = playedYear === "" || (isCollection
            ? item.collection.some(game => {
                const years = game.year || [];
                return years.length > 0 && Math.max(...years) === parseInt(playedYear);
            })
            : (item.year && item.year.length > 0 && Math.max(...item.year) === parseInt(playedYear))
        );

        const matchesConq = !isConqFilterActive || (isCollection
            ? item.collection.some(game => game.conq === 100)
            : item.conq === 100
        );

        return matchesSearch && matchesYear && matchesConq;
    });

    switch (sortType) {
        case 'score':
            filteredGames.sort((a, b) => {
                const scoreA = a.collection ? Math.max(...a.collection.map(game => game.score)) : a.score;
                const scoreB = b.collection ? Math.max(...b.collection.map(game => game.score)) : b.score;
                return scoreB - scoreA;
            });
            break;
        case 'year':
            filteredGames.sort((a, b) => {
                const yearA = a.collection ? Math.min(...a.collection.flatMap(game => game.year)) : Math.min(...a.year);
                const yearB = b.collection ? Math.min(...b.collection.flatMap(game => game.year)) : Math.min(...b.year);
                return yearA - yearB;
            });
            break;
        case 'game':
            filteredGames.sort((a, b) => {
                const gameA = a.collection ? a.collection[0].game : a.game;
                const gameB = b.collection ? b.collection[0].game : b.game;
                return gameA.localeCompare(gameB);
            });
            break;
        default:
            break;
    }

    renderGames(filteredGames);
}

// Ordena os jogos pelo parâmetro "game" ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    sortGames('game');
});

// Função para criar um card de jogo
function createGameCard(game) {
    const card = document.createElement('div');
    card.classList.add('game-card');

    const img = document.createElement('img');
    img.src = game.img;
    img.alt = game.title;

    const info = document.createElement('div');
    info.classList.add('game-info');

    const title = document.createElement('h2');
    title.textContent = game.title;

    // Anos (mostrados separadamente)
    const yearContainer = document.createElement('div');
    yearContainer.classList.add('info-item');
    game.year.forEach((year, index) => {
        const yearItem = document.createElement('span');
        yearItem.textContent = year;
        yearItem.classList.add('year-item');
        yearContainer.appendChild(yearItem);
    });

    // Score (com cores específicas)
    const score = document.createElement('p');
    score.textContent = `${game.score}`;
    score.classList.add('info-item', 'score-item');
    score.setAttribute('data-score', game.score); // Para aplicar a cor correta

    // Gêneros
    const genres = document.createElement('p');
    genres.textContent = `${game.genres.join(', ')}`;
    genres.classList.add('info-item', 'genre-item');

    // Desenvolvedor
    const dev = document.createElement('p');
    dev.textContent = `${game.dev.join(', ')}`;
    dev.classList.add('info-item', 'dev-item');

    // Plataforma
    const platform = document.createElement('p');
    platform.textContent = `${game.platform.join(', ')}`;
    platform.classList.add('info-item', 'platform-item');

    info.appendChild(title);
    info.appendChild(yearContainer);
    info.appendChild(score);
    info.appendChild(genres);
    info.appendChild(dev);
    info.appendChild(platform);

    card.appendChild(img);
    card.appendChild(info);

    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
    });

    return card;
}

// Função para criar um card de coleção
function createCollectionCard(collection) {
    const collectionCard = document.createElement('div');
    collectionCard.classList.add('game-card');

    const img = document.createElement('img');
    img.src = collection.img;
    img.alt = collection.game;

    const info = document.createElement('div');
    info.classList.add('game-info');

    const title = document.createElement('h2');
    title.textContent = collection.game;

    info.appendChild(title);
    collectionCard.appendChild(img);
    collectionCard.appendChild(info);

    let isExpanded = false;

    collectionCard.addEventListener('click', () => {
        if (isExpanded) {
            // Remove os cards dos jogos da coleção
            const existingCollectionCards = document.querySelectorAll('.collection-game');
            existingCollectionCards.forEach(card => card.remove());
            isExpanded = false;
        } else {
            // Aplica os filtros de texto e ano aos jogos da coleção
            const searchText = document.getElementById('search-bar').value.toLowerCase();
            const playedYear = document.getElementById('filter-played-year').value;

            const filteredCollection = collection.collection.filter(game => {
                const matchesSearch = !searchText || game.title.toLowerCase().includes(searchText);
                const matchesYear = playedYear === "" || (game.year && game.year.length > 0 && Math.max(...game.year) === parseInt(playedYear));
                return matchesSearch && matchesYear;
            });

            // Renderiza os jogos filtrados da coleção
            filteredCollection.forEach(game => {
                const gameCard = createGameCard(game);
                gameCard.classList.add('collection-game');
                gameContainer.insertBefore(gameCard, collectionCard.nextSibling);
            });
            isExpanded = true;
        }
    });

    return collectionCard;
}

// Função para carregar os dados do JSON
async function loadGames() {
    try {
        const response = await fetch('1 - dados.json');
        gamesData = await response.json(); // Armazena os dados na variável
        applyFilters(); // Aplica os filtros iniciais
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

// Event listeners
document.getElementById('search-bar').addEventListener('input', () => applyFilters());
document.getElementById('filter-conq').addEventListener('click', toggleConqFilter);
document.getElementById('filter-played-year').addEventListener('change', () => applyFilters());
document.getElementById('sort-options').addEventListener('change', (e) => sortGames(e.target.value));

// Carrega os jogos quando a página é carregada
loadGames();

// Carrega os áudios
const openSound = new Audio('../audio/entrar.wav');
const closeSound = new Audio('../audio/sair.wav');

// Função para criar um card de jogo
function createGameCard(game) {
    const card = document.createElement('div');
    card.classList.add('game-card');

    const img = document.createElement('img');
    img.src = game.img;
    img.alt = game.title;

    const info = document.createElement('div');
    info.classList.add('game-info');

    const title = document.createElement('h2');
    title.textContent = game.title;

    // Anos (mostrados separadamente)
    const yearContainer = document.createElement('div');
    yearContainer.classList.add('info-item');
    game.year.forEach((year, index) => {
        const yearItem = document.createElement('span');
        yearItem.textContent = year;
        yearItem.classList.add('year-item');
        yearContainer.appendChild(yearItem);
    });

    // Score (com cores específicas)
    const score = document.createElement('p');
    score.textContent = `${game.score}`;
    score.classList.add('info-item', 'score-item');
    score.setAttribute('data-score', game.score); // Para aplicar a cor correta

    // Gêneros
    const genres = document.createElement('p');
    genres.textContent = `${game.genres.join(', ')}`;
    genres.classList.add('info-item', 'genre-item');

    // Desenvolvedor
    const dev = document.createElement('p');
    dev.textContent = `${game.dev.join(', ')}`;
    dev.classList.add('info-item', 'dev-item');

    // Plataforma
    const platform = document.createElement('p');
    platform.textContent = `${game.platform.join(', ')}`;
    platform.classList.add('info-item', 'platform-item');

    info.appendChild(title);
    info.appendChild(yearContainer);
    info.appendChild(score);
    info.appendChild(genres);
    info.appendChild(dev);
    info.appendChild(platform);

    card.appendChild(img);
    card.appendChild(info);

    card.addEventListener('click', () => {
        if (card.classList.contains('expanded')) {
            // Se o card já está expandido, recolhe e toca o som de fechar
            card.classList.remove('expanded');
            closeSound.play();
        } else {
            // Se o card não está expandido, expande e toca o som de abrir
            card.classList.add('expanded');
            openSound.play();
        }
    });

    return card;
}
