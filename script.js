class Pokedex {
  constructor() {
    this.currentPokemonId = 1;
    this.elements = {
      img: document.querySelector("#pokemon-img"),
      name: document.querySelector("#pokemon-name"),
      id: document.querySelector("#pokemon-id"),
      types: document.querySelector("#pokemon-types"),
      height: document.querySelector("#height"),
      weight: document.querySelector("#weight"),
      abilities: document.querySelector("#abilities"),
      stats: document.querySelector("#stats"),
      error: document.querySelector("#error-message"),
      form: document.querySelector("#search-form"),
      input: document.querySelector("#search-input"),
      prevBtn: document.querySelector("#prev-btn"),
      nextBtn: document.querySelector("#next-btn"),
    };

    this.typeColors = {
      normal: "#A8A77A",
      fire: "#EE8130",
      water: "#6390F0",
      electric: "#F7D02C",
      grass: "#7AC74C",
      ice: "#96D9D6",
      fighting: "#C22E28",
      poison: "#A33EA1",
      ground: "#E2BF65",
      flying: "#A98FF3",
      psychic: "#F95587",
      bug: "#A6B91A",
      rock: "#B6A136",
      ghost: "#735797",
      dragon: "#6F35FC",
      dark: "#705746",
      steel: "#B7B7CE",
      fairy: "#D685AD"
    };

    this.addEventListeners();
    this.getPokemon(this.currentPokemonId);
  }

  addEventListeners() {
    this.elements.form.addEventListener("submit", event => {
      event.preventDefault();

      const searchValue = this.elements.input.value.toLowerCase().trim();

      if (searchValue) {
        this.getPokemon(searchValue);
        this.elements.input.value = "";
      }
    });

    this.elements.prevBtn.addEventListener("click", () => {
      this.previousPokemon();
    });

    this.elements.nextBtn.addEventListener("click", () => {
      this.nextPokemon();
    });
  }

  async getPokemon(pokemon) {
    try {
      this.elements.error.textContent = "";

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

      if (!response.ok) {
        throw new Error("Pokémon not found.");
      }

      const data = await response.json();

      if (data.id < 1 || data.id > 151) {
        throw new Error("Only original 151 Pokémon are allowed.");
      }

      this.currentPokemonId = data.id;
      this.renderPokemon(data);
    } catch (error) {
      this.elements.error.textContent = error.message;
    }
  }

  renderPokemon(pokemon) {
    const cry = new Audio(pokemon.cries.latest);
    cry.play();
    cry.volume = 0.2;

    this.elements.name.textContent = pokemon.name;
    this.elements.id.textContent = `#${String(pokemon.id).padStart(3, "0")}`;
    this.elements.img.src = this.getPokemonImage(pokemon);
    this.elements.img.alt = pokemon.name;
    this.elements.height.textContent = `${pokemon.height / 10} m`;
    this.elements.weight.textContent = `${pokemon.weight / 10} kg`;

    this.renderTypes(pokemon.types);
    this.renderAbilities(pokemon.abilities);
    this.renderStats(pokemon.stats);
  }

  getPokemonImage(pokemon) {
    return (
      pokemon.sprites.other["official-artwork"].front_default ||
      pokemon.sprites.front_default
    );
  }

  renderTypes(types) {
    this.elements.types.innerHTML = "";

    types.forEach(typeInfo => {
      const typeName = typeInfo.type.name;
      const span = document.createElement("span");

      span.textContent = typeName;
      span.classList.add("type");
      span.style.backgroundColor = this.typeColors[typeName];

      this.elements.types.appendChild(span);
    });
  }

  renderAbilities(abilities) {
    this.elements.abilities.innerHTML = "";

    abilities.forEach(abilityInfo => {
      const li = document.createElement("li");
      li.textContent = abilityInfo.ability.name;
      this.elements.abilities.appendChild(li);
    });
  }

  renderStats(stats) {
    this.elements.stats.innerHTML = "";

    stats.forEach(statInfo => {
      this.elements.stats.appendChild(this.createStatElement(statInfo));
    });
  }

  createStatElement(statInfo) {
    const statDiv = document.createElement("div");
    statDiv.classList.add("stat");

    const statName = document.createElement("p");
    statName.classList.add("stat-name");
    statName.textContent = `${statInfo.stat.name}: ${statInfo.base_stat}`;

    const statBar = document.createElement("div");
    statBar.classList.add("stat-bar");

    const statFill = document.createElement("div");
    statFill.classList.add("stat-fill");
    statFill.style.width = `${Math.min(statInfo.base_stat, 100)}%`;

    statBar.appendChild(statFill);
    statDiv.append(statName, statBar);

    return statDiv;
  }

  nextPokemon() {
    if (this.currentPokemonId < 151) {
      this.getPokemon(this.currentPokemonId + 1);
    }
  }

  previousPokemon() {
    if (this.currentPokemonId > 1) {
      this.getPokemon(this.currentPokemonId - 1);
    }
  }
}

const pokedex = new Pokedex();