class PokemonAPI {
    constructor() {
        this.baseUrlToGetPokemonsList = 'https://pokeapi.co/api/v2/pokemon/';
        this.offsetToGetPokemonsList = 0;
        this.limitToGetPokemonsList = 20;
        this.nextUrlToGetPokemonsList = `${this.baseUrlToGetPokemonsList}?offset=${this.offsetToGetPokemonsList}&limit=${this.limitToGetPokemonsList}`;
    }

    async obtenerDetallesPokemon(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const pokemon = await response.json();
            return pokemon;
        } catch (error) {
            console.error('Error en la solicitud:', error);
            throw error; // Rechazar la promesa en caso de error
        }
    }

    async mostrarPokemons(pokemons) {
        const pokemonsContainer = document.getElementById('pokemons-container');

        for (const pokemon of pokemons) {
            try {
                const pokemonInfo = await this.obtenerDetallesPokemon(pokemon.url);
                const pokemonId = pokemonInfo.id.toString().padStart(3, '0');
                const pokemonCard = document.createElement('div');
             
                pokemonCard.setAttribute('id', `pokemon-${pokemonInfo.id}`); // Usar comillas backtick (`) para la interpolación de cadenas
                pokemonCard.setAttribute('class', 'pokemon');

                const pokemonCardTop = document.createElement('div');
                pokemonCardTop.setAttribute('class', 'pokemon-card-top');

                const pokemonCardImg = document.createElement('img');
                pokemonCardImg.setAttribute('src', pokemonInfo.sprites.other.dream_world.front_default); 
                pokemonCardImg.setAttribute('class', 'pokemon-card-img');
                pokemonCardTop.appendChild(pokemonCardImg);

                const pokemonCardBottom = document.createElement('div');
                pokemonCardBottom.setAttribute('class', 'pokemon-card-bottom');
                const lastSpecieOfThisPokemon = pokemonInfo.types[pokemonInfo.types.length - 1];
                const lastSpecieOfThisPokemonName = lastSpecieOfThisPokemon.type.name;
                pokemonCardBottom.classList.add(lastSpecieOfThisPokemonName);

                const pokemonCardId = document.createElement('h2');
                pokemonCardId.setAttribute('class', 'pokemon-card-id');
                pokemonCardId.textContent = `#${pokemonId}`;

                pokemonCardBottom.appendChild(pokemonCardId);

                const pokemonCardTitle = document.createElement('h1'); 
                pokemonCardTitle.setAttribute('class', 'pokemon-card-title');
                pokemonCardTitle.textContent = pokemon.name;

                pokemonCardBottom.appendChild(pokemonCardTitle);

                const pokemonCardBottomSpeciesImages = document.createElement('div');
                pokemonCardBottomSpeciesImages.setAttribute('class', 'pokemon-card-bottom-species-images');
                console.log(pokemonInfo.types[0].type.name);
                (pokemonInfo.types.reverse()).forEach(elemento => {
                    const pokemonBottomSpecies = document.createElement('img');
                    const pokemonCardBottomSpeciesImagesDiv = document.createElement('div');
                    pokemonBottomSpecies.setAttribute('src', `assets/img/icon/${elemento.type.name}.svg`); 
                    pokemonBottomSpecies.setAttribute('class', 'species-img'); 
                    pokemonCardBottomSpeciesImagesDiv.classList.add('pokemon-card-bottom-species-images-div', elemento.type.name);
                    pokemonCardBottomSpeciesImagesDiv.appendChild(pokemonBottomSpecies);
                    pokemonCardBottomSpeciesImages.appendChild(pokemonCardBottomSpeciesImagesDiv);
                });

                pokemonCardBottom.appendChild(pokemonCardBottomSpeciesImages);

                pokemonCard.appendChild(pokemonCardTop);
                pokemonCard.appendChild(pokemonCardBottom);

                pokemonsContainer.appendChild(pokemonCard);


            } catch (error) {
                console.error('Error obteniendo detalles del Pokémon:', error);
            }
        }
    }

    async obtenerPokemons() {
        try {
            const response = await fetch(this.nextUrlToGetPokemonsList);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.mostrarPokemons(data.results);

            this.offsetToGetPokemonsList += this.limitToGetPokemonsList;
            this.nextUrlToGetPokemonsList = `${this.baseUrlToGetPokemonsList}?offset=${this.offsetToGetPokemonsList}&limit=${this.limitToGetPokemonsList}`;
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }

}

const api = new PokemonAPI();
api.obtenerPokemons();