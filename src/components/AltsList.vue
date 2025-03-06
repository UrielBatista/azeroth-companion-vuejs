<template>
      <!-- Campo de busca -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by alt name..."
          class="search-input"
        />
      </div>
  
      <!-- Grid de alts paginados com animação -->
      <transition-group name="alt-list" tag="div" class="alts-grid">
        <div
          v-for="alt in paginatedAlts"
          :key="alt.name + alt.realm"
          class="alt-card"
          @click="handleClick(alt.name, alt.realm)"
          :style="{ backgroundImage: `url(${getBackground(alt.class)})` }"
        >
          <div class="alt-info">
            <h3>{{ alt.name }} - {{ alt.realm }}</h3>
            <p>Class: {{ getClassName(alt.class) }}</p>
            <!-- <p>Level: {{ alt.level }}</p> -->
          </div>
        </div>
      </transition-group>
  
      <!-- Controles de paginação -->
      <div class="pagination-container" v-if="filteredAlts.length > itemsPerPage">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
  
      <!-- Mensagem caso não haja resultados -->
      <transition name="fade">
        <p v-if="filteredAlts.length === 0" class="no-alts">
          No alts found matching your search.
        </p>
      </transition>
</template>

<script>

import axios from 'axios';

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
  name: 'AltsList',
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
      currentPage: 1,
      itemsPerPage: 3,
      backgroundImage: '',
    };
  },
  computed: {
    filteredAlts() {
      if (!this.searchQuery) return this.alts;
      return this.alts.filter((alt) =>
        alt.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredAlts.length / this.itemsPerPage);
    },
    paginatedAlts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAlts.slice(start, end);
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
          name: 'CharacterProfile',
          query: {
            name: characterName,
            realm: characterRealm,
            realmPath: searchReign,
            image: characterImage,
          }
        });

      } catch (error) {
        if (error.status === 404){
          alert("Personagem não existe ou disabilitado para buscas");
          this.submitted = false;
        } else {
        console.error("Erro ao buscar personagem:", error);
        alert("Erro ao buscar personagem");
        this.submitted = false;
        }
      }
    },
    getClassName(classId) {
      const classMap = {
        1: 'Warrior',
        2: 'Paladin',
        3: 'Hunter',
        4: 'Rogue',
        5: 'Priest',
        6: 'Death Knight',
        7: 'Shaman',
        8: 'Mage',
        9: 'Warlock',
        10: 'Monk',
        11: 'Druid',
        12: 'Demon Hunter',
        13: 'Evoker',
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
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
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

/* Animação para transição de cards */
.alt-list-enter-active,
.alt-list-leave-active {
  transition: all 0.5s ease;
}

.alt-list-enter-from,
.alt-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.alt-list-move {
  transition: transform 0.5s ease;
}

/* Estilização do card */
.alt-card {
  cursor: pointer;
  background-image: url('@/assets/warrior-background.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid rgba(255, 215, 0, 0.25);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2), 0 0 12px rgba(255, 215, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
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

.alt-thumbnail {
  width: 100%;
  max-width: 160px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 0.8rem;
  z-index: 1;
  transition: transform 0.3s ease;
  position: relative;
}

.alt-card:hover .alt-thumbnail {
  transform: scale(1.05);
}

.alt-info {
  text-align: center;
  z-index: 1;
  position: relative;
}

.alt-info h3 {
  font-size: 1.3rem;
  color: #c9b37f;
  margin-bottom: 0.6rem;
  font-family: 'Cinzel', serif;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
  transition: color 0.3s ease;
}

.alt-card:hover .alt-info h3 {
  color: #ffd700;
}

.alt-info p {
  font-size: 0.95rem;
  color: #ffffff;
  margin: 0.25rem 0;
  transition: color 0.3s ease;
}

.alt-card:hover .alt-info p {
  color: #e0e0e0;
}

/* Paginação */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.9), rgba(189, 166, 91, 0.9));
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.25);
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, rgba(255, 215, 0, 1), rgba(201, 179, 127, 1));
}

.pagination-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.page-info {
  color: #c9b37f;
  font-size: 1.1rem;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

/* Mensagem de "sem resultados" com animação */
.no-alts {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-style: italic;
  padding: 1.5rem;
  font-size: 1.1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animação para transição de cards */
.alt-list-enter-active,
.alt-list-leave-active {
  transition: all 0.6s ease-in-out;
}

.alt-list-enter-from,
.alt-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.alt-list-move {
  transition: all 0.6s ease-in-out;
}

.alt-list-enter-active {
  transition-delay: 0.01s;
}

</style>