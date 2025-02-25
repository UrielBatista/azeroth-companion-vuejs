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
      <h1>{{ name }}</h1>
      <h2>Reign: {{ realm }}</h2>

      <div class="image-container">
        <div v-if="!imageLoaded" class="loading-spinner"></div>
        <img 
          :src="image" 
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

      <!-- Container de Pvp -->
      <div class="stats-container">
        <div v-if="!stats" class="loading-spinner"></div>
        <div v-else>
          <h3>Pvp (WIP)</h3>
          <ul class="stats-grid">
            <li>
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
            <li>
            </li>
          </ul>
        </div>
      </div>

      <!-- Armor Modal Component -->
      <armor-modal 
        v-if="showArmorModal" 
        :character-image="imageArmor"
        :name="name"
        :realm="realm"
        @close="showArmorModal = false" 
      />

      <button @click="goBack" class="btn-back">Voltar</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ArmorModal from './ModalViewer.vue';

export default {
  name: 'CharacterProfile',
  components: {
    ArmorModal,
  },
  data() {
    return {
      name: this.$route.query.name || 'Unknow',
      realm: this.$route.query.realm || 'Unknow',
      image: this.$route.query.image || '',
      imageArmor: require('@/assets/character.png'),
      stats: null,
      imageLoaded: false,
      showArmorModal: false, // Control modal visibility
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
    };
  },
  computed: {
    statList() {
      if (!this.stats) return [];
      return [
        { key: 'health', label: 'HEALTH', value: this.stats.health },
        { key: 'power', label: 'ENERGY', value: this.stats.power },
        { key: 'stamina', label: 'STAMINA', value: this.stats.stamina?.effective },
        { key: 'agility', label: 'AGILITY', value: this.stats.agility?.effective },
        { key: 'critical', label: 'CRITICAL STRIKE', value: this.stats.melee_crit?.value.toFixed(2) + ' %' },
        { key: 'haste', label: 'HASTE', value: this.stats.melee_haste?.value.toFixed(2) + ' %' },
        { key: 'mastery', label: 'MASTERY', value: this.stats.mastery?.value.toFixed(1) + ' %' },
        { key: 'versatility', label: 'VERSATILITY', value: this.stats.versatility_damage_done_bonus?.toFixed(1) + ' %' },
      ].filter(stat => stat.value !== undefined);
    },
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'SearchCharacter' });
    },
    async fetchStats() {
      try {
        const token = "EU1AXooVLenxCzfLs17haPrA7R58kQ3vmz";
        const realmParam = this.realm.toLowerCase();
        const nameParam = this.name.toLowerCase();
        const url = `https://us.api.blizzard.com/profile/wow/character/${realmParam}/${nameParam}/statistics?namespace=profile-us&locale=en_US`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.stats = response.data;
        console.log("Estatísticas:", this.stats);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    },
    openArmorModal() {
      this.showArmorModal = true;
    },
  },
};
</script>

<style scoped>
/* Keep all existing styles from the original CharacterProfile.vue */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

/* ================================
   WRAPPER GERAL 
   ================================ */
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

/* Vídeo de fundo */
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

/* Overlay */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
  z-index: -1;
}

/* ================================
   CONTAINER PRINCIPAL (GLASS) 
   ================================ */
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

/* TÍTULO E SUBTÍTULO */
h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #c9b37f;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}
h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: #bda65b;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(189, 166, 91, 0.3);
}

/* ================================
   CONTAINER DA IMAGEM 
   ================================ */
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
  background-image: url('@/assets/background-character.webp');
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  position: relative;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
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
}

/* ================================
   ÁREA DE ESTATÍSTICAS 
   ================================ */
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

/* Layout em grid para as estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0 auto;
}

/* Responsividade do grid */
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

/* Cartão individual de cada stat */
.stat-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
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

/* Classes para colorir cada stat */
.stat-health {
  color: #27cc4e;
  border-color: #27cc4e;
}
.stat-power {
  color: #cb9501;
  border-color: #cb9501;
}
.stat-stamina {
  color: #ff8b2d;
  border-color: #ff8b2d;
}
.stat-strength {
  color: #ff5733;
  border-color: #ff5733;
}
.stat-agility {
  color: #ffd955;
  border-color: #ffd955;
}
.stat-critical {
  color: #e01c1c;
  border-color: #e01c1c;
}
.stat-haste {
  color: #0ed59b;
  border-color: #0ed59b;
}
.stat-mastery {
  color: #9256ff;
  border-color: #9256ff;
}
.stat-versatility {
  color: #bfbfbf;
  border-color: #bfbfbf;
}

/* ================================
   BOTÃO DE VOLTAR E ARMOR 
   ================================ */
.btn-back, .btn-armor {
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

.btn-back:hover, .btn-armor:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

/* Responsividade extra */
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
  .btn-back, .btn-armor {
    font-size: 1rem;
    padding: 0.6rem 1.5rem;
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
  text-align: center;
  justify-content: center;
}

.stat-icon {
  display: block;
  margin-left: 10% auto 1vw auto; /* centers horizontally, with bottom margin */
  width: 4vw;
  height: 4vw;
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
</style>