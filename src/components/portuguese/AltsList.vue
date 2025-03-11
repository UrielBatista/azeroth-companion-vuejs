<template>
  <!-- Campo de busca -->
  <div class="search-container">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Filtre um personagem..."
      class="search-input"
    />
  </div>

  <!-- Grid de alts sem transition-group -->
  <div class="alts-grid">
    <!-- Ao mudar o key, o Flickity será recriado -->
    <Flickity ref="flickity" :key="flickityKey" class="carousel" :options="flickityOptions">
      <div
        v-for="alt in filteredAlts"
        :key="alt.name + alt.realm"
        class="alt-card"
        :style="{ backgroundImage: `url(${getBackground(alt.class)})` }"
      >
        <div class="alt-info">
          <h3  @click="handleClick(alt.name, alt.realm)" class="clickable-name">
            {{ alt.name }} - {{ alt.realm }}</h3>
          <p>Classe: {{ getClassName(alt.class) }}</p>
        </div>
      </div>
    </Flickity>
  </div>

  <!-- Mensagem caso não haja resultados -->
  <transition name="fade">
    <p v-if="filteredAlts.length === 0" class="no-alts">
      Nenhum personagem secundário encontrado.
    </p>
  </transition>
</template>

<script>
import axios from 'axios';
import Flickity from "vue-flickity";

import deathknightBackground from '@/assets/deathknight-background.webp';
import demonhunterBackground from '@/assets/demonhunter-background.webp';
import dragonBackground from '@/assets/dragon-background.webp';
import druidBackground from '@/assets/druid-background.webp';
import hunterBackground from '@/assets/hunter-background.webp';
import mageBackground from '@/assets/mage-background.webp';
import monkBackground from '@/assets/monk-background.webp';
import paladinBackground from '@/assets/paladin-background.webp';
import priestBackground from '@/assets/prist-background.webp';
import rogueBackground from '@/assets/rogue-background.webp';
import warlockBackground from '@/assets/warlock-background.webp';
import warriorBackground from '@/assets/warrior-background.webp';
import shamanBackground from '@/assets/xama-background.webp';

export default {
  name: 'AltsListPT',
  inheritAttrs: false,
  props: {
    alts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      backgroundImage: '',
      flickityOptions: {
        pageDots: false,
        prevNextButtons: false,
        wrapAround: false,
      }
    };
  },
  components: {
    Flickity,
  },
  computed: {
    filteredAlts() {
      if (!this.searchQuery) return this.alts;
      return this.alts.filter((alt) =>
        alt.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    flickityKey() {
      // A key muda sempre que o valor do searchQuery ou o número de itens filtrados mudar
      return `${this.searchQuery}-${this.filteredAlts.length}`;
    },
  },
  methods: {
    async handleClick(name, realm) {
      try {
        const token = localStorage.getItem('access_token');
        const searchUsername = name.toLowerCase();
        const searchReign = realm.toLowerCase();
        const response = await axios.get(
          `https://us.api.blizzard.com/profile/wow/character/${searchReign}/${searchUsername}/character-media?namespace=profile-us`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const characterName = response.data.character.name;
        const characterRealm = response.data.character.realm.name.en_US;
        const characterImage = response.data.assets.find(asset => asset.key === "main-raw").value;

        this.$router.push({
          name: 'CharacterProfilePT',
          query: {
            name: characterName,
            realm: characterRealm,
            realmPath: searchReign,
            image: characterImage,
          }
        });

      } catch (error) {
        if (error.status === 404) {
          alert("Personagem não existe ou desabilitado para buscas");
        } else {
          console.error("Erro ao buscar personagem:", error);
          alert("Erro ao buscar personagem");
        }
      }
    },
    getClassName(classId) {
      const classMap = {
        1: 'Guerreiro',
        2: 'Paladino',
        3: 'Caçador',
        4: 'Ladino',
        5: 'Sacerdote',
        6: 'Cavaleiro da Morte',
        7: 'Xamã',
        8: 'Mago',
        9: 'Bruxo',
        10: 'Monge',
        11: 'Druida',
        12: 'Caçador de Demônios',
        13: 'Conjurante',
      };
      return classMap[classId] || 'Unknown';
    },
    getBackground(classId) {
      const backgroundMap = {
        1: warriorBackground,
        2: paladinBackground,
        3: hunterBackground,
        4: rogueBackground,
        5: priestBackground,
        6: deathknightBackground,
        7: shamanBackground,
        8: mageBackground,
        9: warlockBackground,
        10: monkBackground,
        11: druidBackground,
        12: demonhunterBackground,
        13: dragonBackground, 
      };
      return backgroundMap[classId] || warriorBackground;
    },
  },
};
</script>

<style scoped>
/* Campo de busca */
.search-container {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.search-input {
  padding: 0.7rem 1.2rem;
  width: 100%;
  max-width: 320px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.search-input:focus {
  border-color: #c9b37f;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
  transform: scale(1.02);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
  transition: opacity 0.3s ease;
}

.search-input:focus::placeholder {
  opacity: 0.8;
}

/* Grid de alts */
.alts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

/* Estilização do card */
.alt-card {
  cursor: grab;
  background-image: url('@/assets/warrior-background.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid rgba(255, 215, 0, 0.25);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2), 0 0 12px rgba(255, 215, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  display: block;
  width: 66%;
  height: 200px;
  counter-increment: carousel-cell;
  position: relative;
  overflow: hidden;
  margin: 0 1rem;
}

.alt-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.15), rgba(0, 0, 0, 0.6));
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 0;
  opacity: 0.85;
  transition: opacity 0.3s ease;
}

.alt-card:hover::before {
  opacity: 1;
}

.alt-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.25);
  border-color: rgba(255, 215, 0, 0.5);
}

.alt-info {
  text-align: center;
  position: relative;
  z-index: 1;
}

.alt-info h3 {
  font-size: 2.0rem;
  color: #c9b37f;
  margin-bottom: 0.6rem;
  font-family: 'Cinzel', serif;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
  transition: color 0.3s ease;
}

.alt-card:hover .alt-info h3 {
  color: #ffd700;
}

/* Estilo do nome clicável */
.clickable-name {
  cursor: pointer;
  font-size: 1.3rem;
  color: #c9b37f;
  margin-bottom: 0.6rem;
  font-family: 'Cinzel', serif;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
  transition: color 0.3s ease;
}

.clickable-name:hover {
  color: #ffd700;
}

.alt-info p {
  font-size: 1.05rem;
  color: #ffffff;
  margin: 0.25rem 0;
  transition: color 0.3s ease;
}

.alt-card:hover .alt-info p {
  color: #e0e0e0;
}


@media (max-width: 600px) {
  .alt-info h3,
  .clickable-name {
    font-size: 1.5rem; /* Tamanho menor para o h3 em smartphones */
  }

  .alt-info p {
    font-size: 0.9rem; /* Tamanho menor para o p em smartphones */
  }
}

/* Mensagem de "sem resultados" */
.no-alts {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-style: italic;
  padding: 1.5rem;
  font-size: 1.1rem;
}

/* Transições para a mensagem de "sem resultados" */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
