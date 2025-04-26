const gameContainer = document.getElementById('game-container');
let gamesData = []; // Variável para armazenar os dados dos jogos
let isConqFilterActive = false; // Estado do filtro conq = 100
let currentSortType = null; // Armazena o tipo de ordenação atual


// Função para ordenar os jogos (sem perder os filtros ativos)
function sortGames(sortType) {
    currentSortType = sortType; // Armazena a ordenação atual
    // Aplica todos os filtros atuais antes de ordenar
    let filteredGames = applyFilters(true); // Passamos 'true' para indicar que é uma chamada interna

    switch (sortType) {
        case 'score':
            filteredGames.sort((a, b) => b.score - a.score); // Maior score primeiro
            break;
        case 'year':
            filteredGames.sort((a, b) => Math.min(...a.year) - Math.min(...b.year)); // Ano mais antigo primeiro
            break;
        case 'game':
            filteredGames.sort((a, b) => a.title.localeCompare(b.title)); // Ordem alfabética
            break;
        case 'time':
            filteredGames.sort((a, b) => (b.time || 0) - (a.time || 0)); // Mais tempo jogado primeiro
            break;
        case 'conq':
            filteredGames.sort((a, b) => b.conq - a.conq); // Maior % de conquistas primeiro
            break;
        case 'played':
            filteredGames.sort((a, b) => (b.played || 0) - (a.played || 0)); // Mais zerações primeiro
            break;
        case 'n':
            filteredGames.sort((a, b) => (a.n || Infinity) - (b.n || Infinity)); // Jogos mais recentes primeiro (n menor)
                break;
        default:
            break;
    }

    renderGames(filteredGames, currentSortType);
}

// Função ajustada para aplicar filtros (com suporte para chamada interna)
function applyFilters(isInternalCall = false) {
    const searchText = document.getElementById('search-bar').value.toLowerCase();
    const searchDev = document.getElementById('search-dev').value.toLowerCase();
    const searchPlatform = document.getElementById('search-platform').value.toLowerCase();
    const searchGenre = document.getElementById('search-genre').value.toLowerCase();
    const searchReleaseYear = document.getElementById('search-release-year').value;
    const playedYear = document.getElementById('filter-played-year').value;
    const filterScore = document.getElementById('filter-score').value;

    const filteredGames = gamesData.filter(item => {
        // Filtra por texto de pesquisa (título)
        const matchesSearch = !searchText || item.title.toLowerCase().includes(searchText);

        // Filtra por ano jogado
        const matchesYear = playedYear === "" || 
            (item.year && item.year.length > 0 && Math.max(...item.year) === parseInt(playedYear));

        // Filtra por conq = 100 (se o filtro estiver ativo)
        const matchesConq = !isConqFilterActive || item.conq === 100;

        // Filtra por desenvolvedor
        const matchesDev = !searchDev || item.dev.some(d => d.toLowerCase().includes(searchDev));

        // Filtra por plataforma
        const matchesPlatform = !searchPlatform || item.platform.some(p => p.toLowerCase().includes(searchPlatform));

        // Filtra por gênero
        const matchesGenre = !searchGenre || item.genres.some(g => g.toLowerCase().includes(searchGenre));

        // Filtra por ano de lançamento
        const matchesReleaseYear = !searchReleaseYear || 
            (item.year && item.year.length > 0 && Math.min(...item.year).toString().includes(searchReleaseYear));

        // Filtra por nota exata
        const matchesScore = !filterScore || item.score === parseInt(filterScore);

        return matchesSearch && matchesYear && matchesConq && matchesDev && 
               matchesPlatform && matchesGenre && matchesReleaseYear && matchesScore;
    });

    // Só renderiza se não for uma chamada interna da sortGames()
    if (!isInternalCall) {
        renderGames(filteredGames);
    }

    return filteredGames; // Retorna os jogos filtrados para uso interno
}

// Função para renderizar os jogos e coleções
function renderGames(games, sortType = null) {
    gameContainer.innerHTML = '';
    games.forEach(item => {
        if (item.collection) {
            gameContainer.appendChild(createCollectionCard(item));
        } else {
            gameContainer.appendChild(createGameCard(item, sortType));
        }
    });
}

// Função para alternar o filtro conq = 100
function toggleConqFilter() {
    isConqFilterActive = !isConqFilterActive;
    const filterButton = document.getElementById('filter-conq');

    filterButton.classList.toggle('active', isConqFilterActive);
    
    // Aplica os filtros mantendo a ordenação atual
    let filteredGames = applyFilters(true);
    
    // Reordena se houver uma ordenação ativa
    if (currentSortType) {
        sortGames(currentSortType); // Isso vai reaplicar a ordenação
    } else {
        renderGames(filteredGames);
    }
}

// Ordena os jogos pelo parâmetro "game" ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    sortGames('game');
});

// Função para criar um card de jogo
function createGameCard(game, sortType = null) {
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

    // Adiciona o indicador apenas se não for coleção e houver sortType
    if (!game.collection && sortType && sortType !== 'game') {
        const sortIndicator = document.createElement('div');
        sortIndicator.classList.add('sort-indicator');
        
        // Formata o valor conforme o tipo de ordenação
        let indicatorValue = '';
        switch(sortType) {
            case 'time': indicatorValue = `${game.time || 0}h`; break;
            case 'year': indicatorValue = game.year ? `${Math.min(...game.year)}` : ''; break;
            case 'score': indicatorValue = `${game.score}`; break;
            case 'conq': indicatorValue = `${game.conq}%`; break;
            case 'played': indicatorValue = `Zerado ${game.played || 0}x`; break;
            case 'n': indicatorValue = `#${game.n}`; break;
        }

        if (indicatorValue) {
            sortIndicator.textContent = indicatorValue;
            card.appendChild(sortIndicator);
        }
    }

    return card;

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
function createGameCard(game, sortType) {
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
    // Adiciona o indicador de ordenação no canto inferior direito
    if (sortType && sortType !== 'game') {
        const sortIndicator = document.createElement('div');
        sortIndicator.classList.add('sort-indicator');
        
        // Define o texto e valor conforme o tipo de ordenação
        switch(sortType) {
            case 'time':
                sortIndicator.textContent = `${game.time || 0}h`;
                break;
            case 'year':
                sortIndicator.textContent = `${Math.min(...game.year)}`;
                break;
            case 'score':
                sortIndicator.textContent = `${game.score}`;
                break;
            case 'conq':
                sortIndicator.textContent = `${game.conq}%`;
                break;
            case 'played':
                sortIndicator.textContent = `Zerado ${game.played || 0}x`;
                break;
            case 'n':
                sortIndicator.textContent = `#${game.n}`;
                break;
        }

        card.appendChild(sortIndicator);
    }

    return card;
}
