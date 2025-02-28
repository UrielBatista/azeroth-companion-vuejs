<template>
  <div class="profile-wrapper">
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/CharacterScreen.mp4" type="video/mp4" />
      Seu navegador não suporta vídeos em HTML5.
    </video>

    <div class="overlay"></div>

    <div class="profile-container">
      <div v-if="!stats" class="loading-spinner"></div>
      <h1>{{ name }}-{{ realm }}</h1>
      <character-details :details="characterInfo" />

      <div class="image-container" :style="{ '--background-image': `url(${backgroundImage})` }">
        <div v-if="!imageLoaded" class="loading-spinner"></div>
        <img 
          :src="imageArmor" 
          alt="Personagem" 
          class="character-image"
          @click="openArmorModal"
          @load="imageLoaded = true"
        />
      </div>

      <div class="stats-container">
        <div v-if="!stats" class="loading-spinner"></div>
        <div v-else>
          <h3>Statistics</h3>
          <ul class="stats-grid">
            <li v-for="stat in statList" :key="stat.key" class="stat-item" :class="`stat-${stat.key}`">
              <img :src="statIcons[stat.key]" :alt="`${stat.label} Icon`" class="stat-icon" />
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </li>
          </ul>
        </div>
      </div>

      <div class="stats-container">
        <div v-if="!pvp2s" class="loading-spinner"></div>
        <div v-else>
          <h3>Pvp</h3>
          <ul class="pvp-grid">
            <li class="pvp-item">
              <img :src="getBrasaoImage(pvp2s.rating)" class="pvp-icon" />
              <div class="pvp-value">{{ pvp2s.rating }}</div>
              <div class="pvp-label">Wins: {{ pvp2s.season_match_statistics.won }}</div>
              <div class="pvp-label">Lost: {{ pvp2s.season_match_statistics.lost }}</div>
              <div class="pvp-label">Played: {{ pvp2s.season_match_statistics.played }}</div>
            </li>
            <li class="pvp-item">
              <img :src="getBrasaoImage(pvp3s.rating)" class="pvp-icon" />
              <div class="pvp-value">{{ pvp3s.rating }}</div>
              <div class="pvp-label">Wins: {{ pvp3s.season_match_statistics.won }}</div>
              <div class="pvp-label">Lost: {{ pvp3s.season_match_statistics.lost }}</div>
              <div class="pvp-label">Played: {{ pvp3s.season_match_statistics.played }}</div>
            </li>
          </ul>
        </div>
      </div>

      <!-- In development AI -->
      <div class="stats-container ai-container">
        <div v-if="!stats" class="loading-spinner"></div>
        <div v-else>
          <h3>Improvement your gameplay with IA</h3>
          <div class="ai-controls">
            <div class="toggle-container">
              <label class="toggle-label">Game Mode:</label>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="gameMode" 
                  v-model="isPvE"
                >
                <label for="gameMode" class="toggle-slider">
                  <span class="toggle-option toggle-pvp">PvP</span>
                  <span class="toggle-option toggle-pve">PvE</span>
                </label>
              </div>
            </div>

            <div class="checkbox-container">
              <input 
                type="checkbox" 
                id="strategicRotation" 
                v-model="searchStrategicRotation"
              >
              <label for="strategicRotation">Search Strategic Rotation</label>
            </div>

            <div class="btn-container">
              <button 
                @click="searchAI" 
                class="btn-search-ai" 
                :disabled="isSearchDisabled || isLoadingAi"
              >
                Search
              </button>
              <div v-if="isSearchDisabled" class="cooldown-timer">
                Next search in: {{ formattedRemainingTime }}
              </div>
            </div>

          </div>
          <div class="ai-response-container">
            <div class="ai-response" v-if="isLoadingAi || aiResponse">
              <div class="ai-header">
                <span class="ai-title">AI Analysis</span>
              </div>
              <div class="ai-content">
                <div v-if="isLoadingAi" class="loading-gif">
                  <img src="https://media.giphy.com/media/vVnHvknWYdtQs/giphy.gif" alt="Loading data ai..." />
                </div>
                <div v-else v-html="formattedResponse"></div>
              </div>
            </div>
            <div class="ai-placeholder" v-else>
              Select options above to get AI recommendations
            </div>
          </div>
        </div>
      </div>

      <armor-modal 
        v-if="showArmorModal" 
        :character-image="imageArmor"
        :backgroundImage="backgroundImage"
        :name="name"
        :realm="realm"
        :averageIlvl="characterInfo.averageIlvl"
        :equipaments="equipaments"
        @close="showArmorModal = false" 
      />

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ArmorModal from '../components/ModalViewer.vue';
import CharacterDetails from '../components/CharacterDetails.vue';

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

import arena01299 from '@/assets/arena-0-1299.png';
import arena13001499 from '@/assets/arena-1300-1499.png';
import arena15001799 from '@/assets/arena-1500-1799.png';
import arena18001950 from '@/assets/arena-1800-1950.png';
import arena19512100 from '@/assets/arena-1951-2100.png';
import arena21012250 from '@/assets/arena-2101-2250.png';
import arena22515000 from '@/assets/arena-2251-5000.png';

export default {
  name: 'CharacterProfile',
  components: {
    ArmorModal,
    CharacterDetails,
  },
  data() {
    return {
      characterInfo: {
        level: 0,
        faction: '',
        averageIlvl: 0,
        spec: '',
        race: '',
        classtype: '',
        guild: '',
        lastLogin: null
      },
      formattedResponse: '',
      name: this.$route.query.name || 'Unknown',
      realm: this.$route.query.realm || 'Unknown',
      realmPath: this.$route.query.realmPath || 'Unknow',
      imageArmor: this.$route.query.image || '',
      equipaments: null,
      stats: null,
      pvp2s: null,
      pvp3s: null,
      imageLoaded: false,
      lastSearchTime: null, 
      remainingTime: 0,
      isLoadingAi: false,
      showArmorModal: false,
      isPvE: false,
      searchStrategicRotation: false,
      aiResponse: null,
      statIcons: {
        health: require('@/assets/icons/health.svg'),
        power: require('@/assets/icons/energy.svg'),
        stamina: require('@/assets/icons/stamina.svg'),
        agility: require('@/assets/icons/agility.svg'),
        critical: require('@/assets/icons/critical.svg'),
        haste: require('@/assets/icons/haste.svg'),
        mastery: require('@/assets/icons/mastery.svg'),
        versatility: require('@/assets/icons/versatility.svg'),
      },
      classBackgrounds: {
        'Death Knight': deathknightBackground,
        'Demon Hunter': demonhunterBackground,
        'Dragon': dragonBackground,
        'Druid': druidBackground,
        'Hunter': hunterBackground,
        'Mage': mageBackground,
        'Monk': monkBackground,
        'Paladin': paladinBackground,
        'Priest': priestBackground,
        'Rogue': rogueBackground,
        'Warlock': warlockBackground,
        'Warrior': warriorBackground,
        'Shaman': shamanBackground,
      },
      
      brasaoImages: [
        { min: 0, max: 1299, image: arena01299 },
        { min: 1300, max: 1499, image: arena13001499 },
        { min: 1500, max: 1799, image: arena15001799 },
        { min: 1800, max: 1950, image: arena18001950 },
        { min: 1951, max: 2100, image: arena19512100 },
        { min: 2101, max: 2250, image: arena21012250 },
        { min: 2251, max: 5000, image: arena22515000 },
      ],
    };
  },
  computed: {
    statList() {
      if (!this.stats) return [];
      return [
        { key: 'health', label: 'HEALTH', value: this.stats.health.toLocaleString('pt-BR') },
        { key: 'power', label: 'ENERGY', value: this.stats.power.toLocaleString('pt-BR') },
        { key: 'stamina', label: 'STAMINA', value: this.stats.stamina?.effective.toLocaleString('pt-BR') },
        { key: 'agility', label: 'AGILITY', value: this.stats.agility?.effective.toLocaleString('pt-BR') },
        { key: 'critical', label: 'CRITICAL STRIKE', value: this.stats.melee_crit?.value.toFixed(2) + ' %' },
        { key: 'haste', label: 'HASTE', value: this.stats.melee_haste?.value.toFixed(2) + ' %' },
        { key: 'mastery', label: 'MASTERY', value: this.stats.mastery?.value.toFixed(1) + ' %' },
        { key: 'versatility', label: 'VERSATILITY', value: this.stats.versatility_damage_done_bonus?.toFixed(1) + ' %' },
      ].filter(stat => stat.value !== undefined);
    },
    backgroundImage() {
      const classType = this.characterInfo.classtype || 'Rogue';
      return this.classBackgrounds[classType] || this.classBackgrounds['Rogue'];
    },
    isSearchDisabled() {
      if (!this.lastSearchTime) return false; 
      const now = new Date().getTime();
      const cooldownEnd = this.lastSearchTime + 5 * 60 * 1000;
      return now < cooldownEnd; 
    },
    formattedRemainingTime() {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Ex: "4:32"
    },
  },
  mounted() {
    this.fetchCharacterData();
    this.fetchEquipaments();
    this.fetchStats();
    this.fetchPvPBracket();
    // window.history.pushState({}, document.title, this.$route.path);

    const savedTime = localStorage.getItem('lastSearchTime');
    if (savedTime) {
      this.lastSearchTime = parseInt(savedTime);
      this.updateCooldownTimer();
    }
  },
  methods: {
    updateCooldownTimer() {
      if (!this.lastSearchTime) {
        this.remainingTime = 0;
        return;
      }
      const now = new Date().getTime();
      const cooldownEnd = this.lastSearchTime + 5 * 60 * 1000; 
      const timeLeft = Math.max(0, Math.floor((cooldownEnd - now) / 1000)); 
      this.remainingTime = timeLeft;

      if (timeLeft > 0) {
        setTimeout(this.updateCooldownTimer, 1000); 
      }
    },
    goBack() {
      this.$router.push({ name: 'SearchCharacter' });
    },
    formatResponse() {
      let formatted = this.aiResponse
        .replace(/\n/g, '<br>') 
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 

      formatted = formatted
        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>');

      this.formattedResponse = formatted;
    },
    async fetchEquipaments() {
        const token = process.env.VUE_APP_WOW_TOKEN;
        const apiFetch = url => fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const equipmentUrl = `https://us.api.blizzard.com/profile/wow/character/${this.realm.toLowerCase()}/${this.name.toLowerCase()}/equipment?namespace=profile-us&locale=en_US`;
        const responseEquipments = await apiFetch(equipmentUrl);
        
        if (!responseEquipments.ok) throw new Error('Failed to fetch equipment');
        
        const data = await responseEquipments.json();
        
        this.equipaments = data;
    },
    async updateAIMode() {

      if (this.isSearchDisabled) return;
      this.lastSearchTime = new Date().getTime();
      localStorage.setItem('lastSearchTime', this.lastSearchTime);
      this.updateCooldownTimer();

      this.isLoadingAi = true;
      // const mode = this.isPvE ? 'PvE' : 'PvP';
      // const rotation = this.searchStrategicRotation ? 'e qual a melhor estratégia de rotação' : '';

      // const tokenAi = process.env.VUE_APP_AI_TOKEN;
      // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${tokenAi}`;

      // const requestBody = {
      //   contents: [{
      //     parts: [{
      //       text: `Ajude-me com base nos dados de equipamento do personagem da classe ${this.characterInfo.classtype} 
      //         do World of Warcraft, ${rotation} ${mode}. \n Equipamentos que devem ser analisados do ${this.realmPath} \n 
      //         ${JSON.stringify(this.equipaments)}`
      //     }]
      //   }]
      // };

      // const responseAi = await axios.post(url, requestBody, {
      //     headers: { 'Content-Type': 'application/json' }
      // });
      
      let responseAi = await new Promise(resolve => setTimeout(resolve, 5000));
      responseAi = "blablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablabla";
      // this.aiResponse = responseAi.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      this.aiResponse = responseAi;
      this.formatResponse();
      this.isLoadingAi = false;
    },
    searchAI() {
      this.updateAIMode();
    },
    clearAI() {
      this.aiResponse = null;
      this.isPvE = false;
      this.searchStrategicRotation = false;
    },
    async fetchCharacterData() {
      try {
        const token = process.env.VUE_APP_WOW_TOKEN;
        const realmParam = this.realmPath.toLowerCase();
        const nameParam = this.name.toLowerCase();
        const url = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}?namespace=profile-us&locale=en_US`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.updateCharacterData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do personagem:', error);
        this.name = this.$route.query.name || 'Unknown';
        this.realm = this.$route.query.realm || 'Unknown';
        this.level = this.$route.query.level || 0;
      }
    },
    async fetchStats() {
      try {
        const token = process.env.VUE_APP_WOW_TOKEN;
        const realmParam = this.realmPath.toLowerCase();
        const nameParam = this.name.toLowerCase();
        const url = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}/statistics?namespace=profile-us&locale=en_US`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.stats = response.data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    },
    async fetchPvPBracket() {
      const token = process.env.VUE_APP_WOW_TOKEN;
      const realmParam = this.realmPath.toLowerCase();
      const nameParam = this.name.toLowerCase();
      const pvp2s = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}/pvp-bracket/2v2?namespace=profile-us&locale=en_US`;
      const pvp3s = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}/pvp-bracket/3v3?namespace=profile-us&locale=en_US`;

      try {
        const [response2s, response3s] = await Promise.all([
          axios.get(pvp2s, { headers: { Authorization: `Bearer ${token}` } })
          .catch(err => {
            err;
            console.log('Not Found 2x2');
            return {data: {rating: 0, season_match_statistics: {lost: 0, won: 0, played: 0}}};
          }),
          axios.get(pvp3s, { headers: { Authorization: `Bearer ${token}` } })
          .catch(err => {
            err;
            console.log('Not Found 3x3');
            return {data: {rating: 0, season_match_statistics: {lost: 0, won: 0, played: 0}}};
          }),
        ]);
        this.pvp2s = response2s.data;
        this.pvp3s = response3s.data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas PvP:', error);
      }
    },
    updateCharacterData(data) {
      this.characterInfo = {
        ...this.characterInfo,
        level: data.level || 0,
        averageIlvl: data.average_item_level,
        faction: data.faction?.name || '',
        spec: data.active_spec?.name || '',
        race: data.race?.name || '',
        classtype: data.character_class?.name || '',
        guild: data.guild?.name || '',
        lastLogin: data.last_login_timestamp || null
      };
    },
    openArmorModal() {
      this.showArmorModal = true;
      let elevate = 0.8;
      if (!this.aiResponse){
        elevate = 0.9;
      }
      this.$nextTick(() => {
        window.scrollTo({
          top: window.innerHeight / elevate,
          behavior: 'smooth'
        });
      });
    },
    getBrasaoImage(rating) {
      for (const brasao of this.brasaoImages) {
        if (rating >= brasao.min && rating <= brasao.max) {
          return brasao.image;
        }
      }
      return arena01299;
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

.profile-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Cinzel', serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  z-index: -2;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
  z-index: -1;
}

.profile-container {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  width: 90%;
  min-height: 80vh;
  background: rgba(0, 0, 0, 0.419);
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  transition: all 0.3s ease;
}

.cooldown-timer {
  margin-top: 0.5rem;
  color: #c9b37f;
  font-size: 1rem;
  text-align: center;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.4);
}

.btn-search-ai:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
}

h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #c9b37f;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

.image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--background-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(6px);
  z-index: -1;
}

.image-container {
  width: 850px;
  height: 600px;
  max-width: 90vw;
  max-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 30px rgba(189, 166, 91, 0.2);
  transition: transform 0.3s ease;
}

.image-container:hover {
  transform: scale(1.02);
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: crisp-edges;
  filter: contrast(1.2) saturate(1.1);
  position: relative;
  z-index: 1;
}

.stats-container {
  width: 90%;
  max-width: 800px;
  margin-top: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
}

.stats-container h3 {
  font-size: clamp(1.8rem, 4vw, 2rem);
  color: #c9b37f;
  margin-bottom: 2rem;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0 auto;
}

.pvp-grid {
  display: grid;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0 auto;
  align-items: center;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* IA Container */
.ai-container {
  margin-bottom: 2rem;
}

.loading-gif {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-gif img {
  width: 50px;
  height: 50px;
}

.ai-controls {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.toggle-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.toggle-label {
  color: #c9b37f;
  margin-right: 1rem;
  font-size: 1.2rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  transition: 0.4s;
  border-radius: 34px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.toggle-option {
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.toggle-pvp { color: #e01c1c; }
.toggle-pve { color: #0ed59b; }

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 50%;
  left: 0.1px;
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.8), rgba(189, 166, 91, 0.8));
  transition: 0.4s;
  border-radius: 34px;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.2);
}

input:checked + .toggle-slider:before {
  transform: translateX(100%);
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-container input {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkbox-container input:checked {
  background: #c9b37f;
  border-color: #c9b37f;
  position: relative;
}

.checkbox-container input:checked:after {
  content: '✓';
  position: absolute;
  color: #000;
  font-size: 14px;
  left: 4px;
  bottom: 0.1px;
}

.checkbox-container label {
  color: #ffffff;
  font-size: 1.1rem;
  cursor: pointer;
}

.ai-response-container {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

.ai-response {
  color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.ai-header {
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.2), rgba(189, 166, 91, 0.2));
  padding: 0.5rem 1rem;
  border-radius: 6px 6px 0 0;
  margin-bottom: 0.5rem;
}

.ai-title {
  color: #c9b37f;
  font-size: 1.2rem;
  font-weight: bold;
}

.ai-content {
  padding: 0.5rem;
  line-height: 1.5;
  flex-grow: 1; /* Permite que o conteúdo se expanda */
  overflow-y: auto; /* Adiciona rolagem vertical se necessário */
  max-height: 300px; /* Define uma altura máxima opcional */
}

.ai-placeholder {
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.btn-container {
  margin-top: 10px;
  margin-bottom: -20px;
}

.btn-search-ai {
  display: block;
  margin: 0 auto 1rem;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.8), rgba(189, 166, 91, 0.8));
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
  font-family: 'Cinzel', serif;
}

.btn-search-ai:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.btn-clear-ai {
  display: block;
  margin: 1rem auto 0;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.8), rgba(189, 166, 91, 0.8));
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
  font-family: 'Cinzel', serif;
}

.btn-clear-ai:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
}

.pvp-item {
  position: relative;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.pvp-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/pvp-wallpaper.png');
  background-size: cover;
  background-position: center;
  filter: blur(4px);
  z-index: -1;
}

.pvp-item:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
}

.pvp-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
  z-index: 1;
}

.pvp-value, .pvp-label {
  color: #ffffff;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  z-index: 1;
}

.pvp-value {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.pvp-label {
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
}

.stat-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #c9b37f;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.stat-health { color: #27cc4e; border-color: #27cc4e; }
.stat-power { color: #cb9501; border-color: #cb9501; }
.stat-stamina { color: #ff8b2d; border-color: #ff8b2d; }
.stat-strength { color: #ff5733; border-color: #ff5733; }
.stat-agility { color: #ffd955; border-color: #ffd955; }
.stat-critical { color: #e01c1c; border-color: #e01c1c; }
.stat-haste { color: #0ed59b; border-color: #0ed59b; }
.stat-mastery { color: #9256ff; border-color: #9256ff; }
.stat-versatility { color: #bfbfbf; border-color: #bfbfbf; }

.btn-back {
  margin-top: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.8), rgba(189, 166, 91, 0.8));
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
}

.btn-back:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

@media (max-width: 768px) {
  .image-container {
    width: 90%;
    height: auto;
    max-height: 400px;
  }
  .stats-container {
    margin-top: 1.5rem;
    padding: 1.5rem;
  }
  .btn-back {
    font-size: 1rem;
    padding: 0.6rem 1.5rem;
  }
}

.stat-icon {
  display: block;
  margin: 0 auto 1vw auto;
  width: 4vw;
  height: 4vw;
}
</style>