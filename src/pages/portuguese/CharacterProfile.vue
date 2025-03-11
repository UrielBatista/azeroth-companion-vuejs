<template>
  <div class="profile-wrapper">
  <video autoplay loop muted playsinline class="background-video">
    <source src="@/assets/CharacterScreen.mp4" type="video/mp4" />
    Seu navegador não suporta vídeos em HTML5.
  </video>

  <div class="overlay"></div>
  <transition name="fade">
    <div class="profile-container">
    <h1>{{ name }}-{{ realm }}</h1>
    <character-details :details="characterInfo" />

    <div 
      class="image-container" 
      :class="{ 'loaded': isContentLoaded }"
      :style="{ '--background-image': `url(${backgroundImage})` }"
    >
      <img 
        :src="imageArmor" 
        alt="Personagem" 
        class="character-image"
        @click="openArmorModal"
        @load="imageLoaded = true"
      />
    </div>

    <div class="alts-container">
      <h3>Personagens Secundários</h3>
        <div v-if="isLoadingAlts" class="loading-spinner"></div>
          <alts-list v-else :alts="alts" class="alts-list-animate" :backgroundImage="backgroundImage"/>
        </div>
    <class-info :classType="characterInfo.classtype" />
    

    <div class="info-wrapper">
      <div class="stats-container">
        <div v-if="!stats" class="loading-spinner"></div>
        <div v-else>
          <h3>Estatísticas</h3>
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
          <h3>PvP</h3>
          <ul class="pvp-grid">
            <li class="pvp-item">
              <div class="pvp-overlay"></div>
              <img :src="getBrasaoImage(pvp2s.rating)" class="pvp-icon" />
              <div class="pvp-value">{{ pvp2s.rating }}</div>
              <div class="pvp-label">Vitórias: {{ pvp2s.season_match_statistics.won }}</div>
              <div class="pvp-label">Derrotas: {{ pvp2s.season_match_statistics.lost }}</div>
              <div class="pvp-label">Partidas: {{ pvp2s.season_match_statistics.played }}</div>
              <div class="pvp-rank-label">2x2</div>
            </li>
            <li class="pvp-item">
              <div class="pvp-overlay"></div>
              <img :src="getBrasaoImage(pvp3s.rating)" class="pvp-icon" />
              <div class="pvp-value">{{ pvp3s.rating }}</div>
              <div class="pvp-label">Vitórias: {{ pvp3s.season_match_statistics.won }}</div>
              <div class="pvp-label">Derrotas: {{ pvp3s.season_match_statistics.lost }}</div>
              <div class="pvp-label">Partidas: {{ pvp3s.season_match_statistics.played }}</div>
              <div class="pvp-rank-label">3x3</div>
            </li>
          </ul>
        </div>
      </div>

      <div class="stats-container ai-container">
        <div v-if="!stats" class="loading-spinner"></div>
        <div v-else>
          <h3>Melhore sua jogabilidade com IA</h3>
          <div class="ai-controls">
            <div class="toggle-container">
              <label class="toggle-label">Modo de jogo:</label>
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
              <label for="strategicRotation">Busque Rotação Estratégica</label>
            </div>

            <div class="btn-container">
              <button 
                @click="searchAI" 
                class="btn-search-ai" 
                :disabled="isSearchDisabled || isLoadingAi"
              >
                Buscar
              </button>
              <div v-if="isSearchDisabled" class="cooldown-timer">
                Próxima busca em: {{ formattedRemainingTime }}
              </div>
            </div>
          </div>
          <div class="ai-response-container">
            <div class="ai-response" v-if="isLoadingAi || aiResponse">
              <div class="ai-header">
                <span class="ai-title">Análise IA</span>
              </div>
              <div class="ai-content">
                <div v-if="isLoadingAi" class="loading-gif">
                  <img src="https://media.giphy.com/media/vVnHvknWYdtQs/giphy.gif" alt="Loading data ai..." />
                </div>
                <div v-else v-html="formattedResponse"></div>
              </div>
            </div>
            <div class="ai-placeholder" v-else>
              Selecione as recomendações para ter a resposta da IA
            </div>
          </div>
          <button @click="goBack" class="btn-back">Sair</button>
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
</transition>
</div>
</template>

<script>
import axios from 'axios';
import ArmorModal from '../../components/portuguese/ModalViewer.vue';
import CharacterDetails from '../../components/portuguese/CharacterDetails.vue';
import ClassInfo from '../../components/portuguese/ClassInfo.vue';
import AltsList from '../../components/portuguese/AltsList.vue';

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
  name: 'CharacterProfilePT',
  components: {
    ArmorModal,
    CharacterDetails,
    ClassInfo,
    AltsList,
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
      classStats: {
        'Guerreiro': ['health', 'rage', 'strength', 'stamina'],
        'Paladino': ['health', 'mana', 'strength', 'stamina'],
        'Caçador': ['health', 'focus', 'agility', 'stamina'],
        'Ladino': ['health', 'energy', 'agility', 'stamina'],
        'Sacerdote': ['health', 'mana', 'intellect', 'stamina'],
        'Xamã': ['health', 'mana', 'intellect', 'stamina'],
        'Mago': ['health', 'mana', 'intellect', 'stamina'],
        'Bruxo': ['health', 'mana', 'intellect', 'stamina'],
        'Monge': ['health', 'energy', 'agility', 'stamina'],
        'Druida': ['health', 'mana', 'intellect', 'stamina'],
        'Caçador de Demônios': ['health', 'fury', 'agility', 'stamina'],
        'Cavaleiro da Morte': ['health', 'runic', 'strength', 'stamina'],
        'Conjurante': ['health', 'mana', 'intellect', 'stamina'], // Conjurante
      },
      formattedResponse: "",
      name: this.$route.query.name || 'Unknown',
      realm: this.$route.query.realm || 'Unknown',
      realmPath: this.$route.query.realmPath || 'Unknow',
      imageArmor: this.$route.query.image || '',
      classId: 0,
      level: 0,
      equipaments: null,
      stats: null,
      pvp2s: null,
      pvp3s: null,
      imageLoaded: false,
      backgroundLoaded: false,
      lastSearchTime: null, 
      remainingTime: 0,
      isLoadingAi: false,
      showArmorModal: false,
      isPvE: false,
      searchStrategicRotation: false,
      aiResponse: null,
      alts: [],
      isLoadingAlts: true,
      statIcons: {
        health: require('@/assets/icons/health.svg'),
        energy: require('@/assets/icons/energy.svg'),
        stamina: require('@/assets/icons/stamina.svg'),
        agility: require('@/assets/icons/agility.svg'),
        critical: require('@/assets/icons/critical.svg'),
        haste: require('@/assets/icons/haste.svg'),
        mastery: require('@/assets/icons/mastery.svg'),
        versatility: require('@/assets/icons/versatility.svg'),
        mana: require('@/assets/icons/mana.svg'),
        fury: require('@/assets/icons/fury.svg'),
        intellect: require('@/assets/icons/intellect.svg'),
        rage: require('@/assets/icons/rage.svg'),
        runic: require('@/assets/icons/runic.svg'),
        strength: require('@/assets/icons/strength.svg'),
      },
      classBackgrounds: {
        'Cavaleiro da Morte': deathknightBackground,
        'Caçador de Demônios': demonhunterBackground,
        'Conjurante': dragonBackground,
        'Druida': druidBackground,
        'Caçador': hunterBackground,
        'Mago': mageBackground,
        'Monge': monkBackground,
        'Paladino': paladinBackground,
        'Sacerdote': priestBackground,
        'Ladino': rogueBackground,
        'Bruxo': warlockBackground,
        'Guerreiro': warriorBackground,
        'Xamã': shamanBackground,
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

      // Obter os atributos primários com base na classe
      const classType = this.characterInfo.classtype || 'Warrior'; // Default para Guerreiro
      const primaryStats = this.classStats[classType] || this.classStats['Warrior'];

      // Mapear os atributos primários
      const primaryStatsList = primaryStats.map(stat => {
        let label, value;
        switch (stat) {
          case 'health':
            label = 'VIDA';
            value = this.stats.health.toLocaleString('pt-BR');
            break;
          case 'rage':
            label = 'RAIVA';
            value = this.stats.power.toLocaleString('pt-BR'); // Assumindo que "power" representa RAIVA
            break;
          case 'strength':
            label = 'FORÇA';
            value = this.stats.strength?.effective.toLocaleString('pt-BR');
            break;
          case 'stamina':
            label = 'VIGOR';
            value = this.stats.stamina?.effective.toLocaleString('pt-BR');
            break;
          case 'mana':
            label = 'MANA';
            value = this.stats.power.toLocaleString('pt-BR'); // Assumindo que "power" representa MANA
            break;
          case 'focus':
            label = 'CONCENTRAÇÃO';
            value = this.stats.power.toLocaleString('pt-BR'); // Assumindo que "power" representa CONCENTRAÇÃO
            break;
          case 'agility':
            label = 'AGILIDADE';
            value = this.stats.agility?.effective.toLocaleString('pt-BR');
            break;
          case 'energy':
            label = 'ENERGIA';
            value = this.stats.power.toLocaleString('pt-BR'); // Assumindo que "power" representa ENERGIA
            break;
          case 'intellect':
            label = 'INTELECTO';
            value = this.stats.intellect?.effective.toLocaleString('pt-BR');
            break;
          case 'fury':
            label = 'FÚRIA';
            value = this.stats.power.toLocaleString('pt-BR'); // Assumindo que "power" representa FÚRIA
            break;
          case 'runic':
            label = 'PODER RÚNICO';
            value = this.stats.power.toLocaleString('pt-BR'); // Assumindo que "power" representa PODER RÚNICO
            break;
          default:
            label = stat.toUpperCase();
            value = 'N/A';
        }
        return { key: stat, label, value };
      });

      // Atributos secundários fixos
      const secondaryStatsList = [
        { key: 'critical', label: 'ACERTO CRÍTICO', value: this.stats.melee_crit?.value.toFixed(2) + ' %' },
        { key: 'haste', label: 'ACELERAÇÃO', value: this.stats.melee_haste?.value.toFixed(2) + ' %' },
        { key: 'mastery', label: 'MAESTRIA', value: this.stats.mastery?.value.toFixed(1) + ' %' },
        { key: 'versatility', label: 'VERSATILIDADE', value: this.stats.versatility_damage_done_bonus?.toFixed(1) + ' %' },
      ].filter(stat => stat.value !== undefined);

      // Combinar atributos primários e secundários
      return [...primaryStatsList, ...secondaryStatsList].filter(stat => stat.value !== undefined);
    },
    isContentLoaded() {
      return this.imageLoaded && this.backgroundLoaded;
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
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  mounted() {
    this.fetchCharacterData();
    this.fetchEquipaments();
    this.fetchStats();
    this.fetchPvPBracket();
    this.loadBackgroundImage();
    this.checkImageLoaded();
    // window.history.pushState({}, document.title, this.$route.path);

    const savedTime = localStorage.getItem('lastSearchTime');
    if (savedTime) {
      this.lastSearchTime = parseInt(savedTime);
      this.updateCooldownTimer();
    }
  },
  watch: {
    '$route.query'(newQuery, oldQuery) {
      // Verifica se houve mudança significativa nos parâmetros relevantes
      if (newQuery.name !== oldQuery.name || newQuery.realm !== oldQuery.realm || newQuery.realmPath !== oldQuery.realmPath || newQuery.image !== oldQuery.image) {
        this.name = newQuery.name || 'Unknown';
        this.realm = newQuery.realm || 'Unknown';
        this.realmPath = newQuery.realmPath || 'Unknown';
        this.imageArmor = newQuery.image || '';

        // Recarrega os dados do personagem
        this.fetchCharacterData();
        this.fetchEquipaments();
        this.fetchStats();
        this.fetchPvPBracket();

        // Verifica as imagens novamente
        this.checkImageLoaded();
        this.loadBackgroundImage();
      }
    }
  },
  methods: {
    loadBackgroundImage() {
      const img = new Image();
      img.src = this.backgroundImage;
      if (img.complete) {
        this.backgroundLoaded = true;
      } else {
        img.onload = () => {
          this.backgroundLoaded = true;
        };
        img.onerror = () => {
          console.error('Erro ao carregar a imagem de fundo');
          this.backgroundLoaded = true;
        };
      }
    },
    getClassId(className) {
      const classMap = {
        'Guerreiro': 1,
        'Paladino': 2,
        'Caçador': 3,
        'Ladino': 4,
        'Sacerdote': 5,
        'Cavaleiro da Morte': 6,
        'Xamã': 7,
        'Mago': 8,
        'Bruxo': 9,
        'Monge': 10,
        'Druida': 11,
        'Caçador de Demônios': 12,
        'Conjurante': 13,
      };
      return classMap[className] || 'Unknown';
    },
    checkImageLoaded() {
      const img = new Image();
      img.src = this.imageArmor;
      if (img.complete) {
        this.imageLoaded = true;
      } else {
          img.onload = () => {
          this.imageLoaded = true;
        };
        img.onerror = () => {
          console.error('Erro ao carregar a imagem do personagem');
          this.imageLoaded = true;
        };
      }
    },
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
      this.$router.push({ name: 'SearchCharacterPT' });
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
    async updateAIMode() {

      if (this.isSearchDisabled) return;
      this.lastSearchTime = new Date().getTime();
      localStorage.setItem('lastSearchTime', this.lastSearchTime);
      this.updateCooldownTimer();

      this.isLoadingAi = true;
      const mode = this.isPvE ? 'PvE' : 'PvP';
      const rotation = this.searchStrategicRotation ? 'e qual a melhor estratégia de rotação' : '';

      const tokenAi = process.env.VUE_APP_AI_TOKEN;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${tokenAi}`;

      const requestBody = {
        contents: [{
          parts: [{
            text: `Ajude-me com base nos dados de equipamento do personagem da classe ${this.characterInfo.classtype} 
              do World of Warcraft, ${rotation} ${mode}. \n Equipamentos que devem ser analisados do ${this.realmPath} \n 
              ${JSON.stringify(this.equipaments)}`
          }]
        }]
      };

      const responseAi = await axios.post(url, requestBody, {
          headers: { 'Content-Type': 'application/json' }
      });
      // let responseAi = await new Promise(resolve => setTimeout(resolve, 5000));

      this.aiResponse = responseAi.data?.candidates?.[0]?.content?.parts?.[0]?.text;
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
    async fetchAlts() {
      this.isLoadingAlts = true;
      try {
        const realmParam = this.realm;
        const nameParam = this.name;

        const url = `https://scrapping-python-alts-production.up.railway.app/alts/${this.level}/${this.classId}/${realmParam}/${nameParam}`;
        
        const response = await axios.get(url);
        this.alts = response.data.data.alts;
        this.isLoadingAlts = false;
        
      } catch (error) {
        console.error('Erro ao buscar alts:', error);
        this.alts = [];
        this.isLoadingAlts = false;
      }
    },
    async fetchCharacterData() {
      try {
        const token = localStorage.getItem('access_token');
        const realmParam = this.realmPath.toLowerCase();
        const nameParam = this.name.toLowerCase();
        const url = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}?namespace=profile-us&locale=pt_BR`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        this.level = response.data.level || this.$route.query.level || 0;
        this.classId = this.getClassId(response.data.character_class.name);
        
        this.updateCharacterData(response.data);
        await this.fetchAlts();
      } catch (error) {
        console.error('Erro ao buscar dados do personagem:', error);
        this.name = this.$route.query.name || 'Unknown';
        this.realm = this.$route.query.realm || 'Unknown';
        this.level = this.$route.query.level || 0;
        await this.fetchAlts();
      }
    },
    async fetchEquipaments() {
        const token = localStorage.getItem('access_token');
        const apiFetch = url => fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const equipmentUrl = `https://us.api.blizzard.com/profile/wow/character/${this.realmPath.toLowerCase()}/${this.name.toLowerCase()}/equipment?namespace=profile-us&locale=pt_BR`;
        const responseEquipments = await apiFetch(equipmentUrl);
        
        if (!responseEquipments.ok) throw new Error('Failed to fetch equipment');
        
        const data = await responseEquipments.json();
        this.equipaments = data;

    },
    async fetchStats() {
      try {
        const token = localStorage.getItem('access_token');
        const realmParam = this.realmPath.toLowerCase();
        const nameParam = this.name.toLowerCase();
        const url = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}/statistics?namespace=profile-us&locale=pt_BR`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.stats = response.data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    },
    async fetchPvPBracket() {
      const token = localStorage.getItem('access_token');
      const realmParam = this.realmPath.toLowerCase();
      const nameParam = this.name.toLowerCase();
      const pvp2s = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}/pvp-bracket/2v2?namespace=profile-us&locale=pt_BR`;
      const pvp3s = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}/pvp-bracket/3v3?namespace=profile-us&locale=pt_BR`;

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

.alts-container {
  margin-top: 2rem;
  width: 100%;
}


.alts-container h3 {
  font-size: 1.8rem;
  color: #c9b37f;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
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
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.image-container {
  cursor: pointer;
  width: 850px;
  height: 600px;
  max-width: 90vw;
  max-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 10px rgba(189, 166, 91, 0.1);
  transition: transform 0.5s ease;
  opacity: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease-in-out;
}

.image-container.loaded {
  opacity: 1;
}

.image-container.loaded::before {
  opacity: 1;
}

.image-container:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: crisp-edges;
  filter: contrast(1.2) saturate(1.1);
  position: relative;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.image-container.loaded .character-image {
  opacity: 1;
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
}

.stats-container {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.stats-container h3 {
  font-size: 1.8rem;
  color: #c9b37f;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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
  .image-container {
    width: 90%;
    margin: 1rem auto;
    padding: 0.8rem;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.ai-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.ai-container h3 {
  font-size: 1.8rem;
  color: #c9b37f;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.loading-gif img {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  display: block;
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
  margin-right: 0.5rem;
  font-size: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 24px;
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
  background: rgba(255, 255, 255, 0.1);
  transition: 0.4s;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}

.toggle-option {
  color: #ffffff;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.toggle-pvp { color: #e01c1c; }
.toggle-pve { color: #0ed59b; }

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 40px;
  left: 2px;
  bottom: 2px;
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.8), rgba(189, 166, 91, 0.8));
  transition: 0.4s;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.2);
}

input:checked + .toggle-slider:before {
  transform: translateX(38px);
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.checkbox-container input {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.checkbox-container input:checked {
  background: #c9b37f;
  border-color: #c9b37f;
}

.checkbox-container input:checked:after {
  content: '✓';
  position: absolute;
  color: #000;
  font-size: 12px;
  left: 3px;
  top: 1px;
}

.checkbox-container label {
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
}

.ai-response-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.ai-response {
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
}

.ai-header {
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.2), rgba(189, 166, 91, 0.2));
  padding: 0.5rem 1rem;
  border-radius: 6px 6px 0 0;
  margin-bottom: 0.5rem;
}

.ai-title {
  color: #c9b37f;
  font-size: 1.1rem;
  font-weight: bold;
}

.ai-content {
  padding: 0.5rem;
  line-height: 1.5;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 300px;
}

.ai-placeholder {
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.btn-container {
  margin-top: 1rem;
  text-align: center;
}

.btn-search-ai {
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgba(201, 179, 127, 0.8), rgba(189, 166, 91, 0.8));
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
  font-family: 'Cinzel', serif;
}

.btn-search-ai:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
}

.btn-search-ai:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
}

:root {
  --gold-gradient: linear-gradient(135deg, #c9b37f 0%, #bda65b 100%);
  --shadow-glow: 0 4px 15px rgba(255, 215, 0, 0.3);
  --shadow-hover: 0 6px 25px rgba(255, 215, 0, 0.5);
  --transition-all: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-back {
  position: absolute;
  inset: 1rem 1rem auto auto;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: none;
  border: none;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  transition: var(--transition-all);
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
  z-index: 2;
}

.btn-back:hover {
  transform: translateY(-3px) scale(1.05);
  text-shadow: 0 4px 20px rgba(255, 215, 0, 0.8);
  color: #fff;
}

.btn-back:active {
  transform: scale(0.95);
}

/* Animação de entrada */
.btn-back {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .btn-back {
    inset: 0.75rem 0.75rem auto auto;
  }
}

.cooldown-timer {
  margin-top: 0.5rem;
  color: #c9b37f;
  font-size: 0.9rem;
  text-align: center;
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

.pvp-item:hover,
.pvp-item:active {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
}

.pvp-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0); /* Inicialmente transparente */
  transition: background 0.3s ease;
  z-index: 1;
  pointer-events: none; /* Permite interação com o item abaixo */
}

.pvp-item:hover .pvp-overlay,
.pvp-item:active .pvp-overlay {
  background: rgba(0, 0, 0, 0.7);
}

.pvp-item:hover .pvp-icon,
.pvp-item:active .pvp-icon {
  filter: brightness(0.8);
}

.pvp-rank-label {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.932), rgba(92, 92, 92, 0.808));
  color: #ffffff;
  font-family: 'Cinzel', serif;
  font-size: 1.4rem; 
  font-weight: bold;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.185);
  z-index: 3;
  opacity: 0;
  transition: bottom 0.4s ease, opacity 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.pvp-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
  z-index: 2;
  transition: filter 0.3s ease;
}

.pvp-value,
.pvp-label {
  color: #ffffff;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  z-index: 2;
  transition: color 0.3s ease;
}

.pvp-item:hover .pvp-value,
.pvp-item:hover .pvp-label,
.pvp-item:active .pvp-value,
.pvp-item:active .pvp-label {
  color: rgba(255, 255, 255, 0.7);
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

.pvp-item:hover .pvp-rank-label,
.pvp-item:active .pvp-rank-label {
  bottom: 0;
  opacity: 1;
  animation: slideUp 0.4s ease-out forwards;
}

@keyframes slideUp {
  0% {
    bottom: -30px;
    opacity: 0;
  }
  100% {
    bottom: 10px;
    opacity: 1;
  }
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
  margin: 2rem auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stat-health { color: #27cc4e; border-color: #27cc4e; }
.stat-energy { color: #cb9501; border-color: #cb9501; }
.stat-stamina { color: #ff8b2d; border-color: #ff8b2d; }
.stat-agility { color: #ffd955; border-color: #ffd955; }
.stat-critical { color: #e01c1c; border-color: #e01c1c; }
.stat-haste { color: #0ed59b; border-color: #0ed59b; }
.stat-mastery { color: #9256ff; border-color: #9256ff; }
.stat-versatility { color: #bfbfbf; border-color: #bfbfbf; }
.stat-fury { color: #8400ff; border-color: #8400ff; }
.stat-intellect { color: #d26cd1; border-color: #d26cd1; }
.stat-mana { color: #1c8aff; border-color: #1c8aff; }
.stat-rage { color: #ab0000; border-color: #ab0000; }
.stat-runic { color: #00bcde; border-color: #00bcde; }
.stat-strength { color: #f33232; border-color: #f33232; }

@media (max-width: 768px) {
  .image-container {
    width: 90%;
    height: auto;
    max-height: 400px;
  }
  .stats-container {
    margin-top: 1.5rem;
  }
}

.stat-icon {
  display: block;
  margin: 0 auto 1vw auto;
  width: 4vw;
  height: 4vw;
}

.alts-list-animate {
  animation: slideUp 1.2s ease-out forwards;
}

@keyframes slideUp {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>