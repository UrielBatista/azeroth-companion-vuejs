<template>
  <div class="profile-wrapper">
    <!-- Vídeo de fundo -->
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/CharacterScreen.mp4" type="video/mp4" />
      Seu navegador não suporta vídeos em HTML5.
    </video>

    <!-- Overlay de gradiente -->
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

      <!-- Container de Estatísticas -->
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

      <!-- Etapa de PvP -->
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

      <!-- Container de IA -->
      <div class="stats-container">
        <div v-if="!stats" class="loading-spinner"></div>
        <div v-else>
          <h3>Improvement your gameplay with IA (WIP)</h3>
          <ul class="stats-grid">
            <li></li>
          </ul>
        </div>
      </div>

      <!-- Armor Modal Component -->
      <armor-modal 
        v-if="showArmorModal" 
        :character-image="imageArmor"
        :backgroundImage="backgroundImage"
        :name="name"
        :realm="realm"
        :averageIlvl="characterInfo.averageIlvl"
        @close="showArmorModal = false" 
      />

      <button @click="goBack" class="btn-back">Exit</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ArmorModal from '../components/ModalViewer.vue';
import CharacterDetails from '../components/CharacterDetails.vue';

// Importação explícita dos arquivos .webp
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

// Importação das imagens de brasão
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
      name: this.$route.query.name || 'Unknown',
      realm: this.$route.query.realm || 'Unknown',
      realmPath: this.$route.query.realmPath || 'Unknow',
      imageArmor: this.$route.query.image || '',
      stats: null,
      pvp2s: null,
      pvp3s: null,
      imageLoaded: false,
      showArmorModal: false,
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
      // Mapeamento de faixas de rating para imagens de brasão
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
  },
  mounted() {
    this.fetchCharacterData();
    this.fetchStats();
    this.fetchPvPBracket();
    // window.history.pushState({}, document.title, this.$route.path);
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'SearchCharacter' });
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
          axios.get(pvp2s, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(pvp3s, { headers: { Authorization: `Bearer ${token}` } }),
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
    // Função para mapear o rating para a imagem de brasão
    getBrasaoImage(rating) {
      for (const brasao of this.brasaoImages) {
        if (rating >= brasao.min && rating <= brasao.max) {
          return brasao.image;
        }
      }
      return arena01299; // Imagem padrão para ratings fora das faixas
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

/* Estilos existentes permanecem inalterados até a seção de PvP */
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

/* Estilização aprimorada para os itens de PvP */
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