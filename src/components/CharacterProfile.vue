<template>
  <div class="profile-wrapper">
    <!-- Vídeo de fundo -->
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/CharacterScreen.mp4" type="video/mp4" />
      Seu navegador não suporta vídeos em HTML5.
    </video>

    <!-- Overlay de gradiente para deixar o vídeo mais escuro -->
    <div class="overlay"></div>

    <div class="profile-container">
      <!-- Título do Personagem -->
      <h1>{{ name }}</h1>
      <!-- Reino -->
      <h2>Reino: {{ realm }}</h2>

      <!-- Container para a imagem -->
      <div class="image-container">
        <img :src="image" alt="Personagem" class="character-image" />
      </div>

      <!-- Container de Estatísticas (aparece somente se 'stats' não for nulo) -->
      <div class="stats-container" v-if="stats">
        <h3>Statistics</h3>
        <ul class="stats-grid">
          <!-- HEALTH -->
          <li v-if="stats.health" class="stat-item stat-health">
            <div class="stat-value">{{ stats.health }}</div>
            <div class="stat-label">HEALTH</div>
          </li>

          <!-- POWER -->
          <li v-if="stats.power" class="stat-item stat-power">
            <div class="stat-value">{{ stats.power }}</div>
            <div class="stat-label">ENERGY</div>
          </li>

          <!-- SPEED (exibe rating e bonus) -->
          <li v-if="stats.speed" class="stat-item stat-speed">
            <div class="stat-value">
              {{ stats.speed.rating }}
              <span v-if="stats.speed.rating_bonus">
              </span>
            </div>
            <div class="stat-label">SPEED</div>
          </li>

          <!-- AGILITY -->
          <li v-if="stats.agility" class="stat-item stat-agility">
            <div class="stat-value">
              {{ stats.agility.effective }}
              <span v-if="stats.agility.base">
              </span>
            </div>
            <div class="stat-label">AGILITY</div>
          </li>

          <!-- CRITICAL STRIKE -->
          <li v-if="stats.intellect" class="stat-item stat-critical">
            <div class="stat-value">
              {{ stats.melee_crit.value.toFixed(2) }} %
              <span v-if="stats.intellect.base">
              </span>
            </div>
            <div class="stat-label">CRITICAL STRIKE</div>
          </li>

          <!-- HASTE -->
          <li v-if="stats.stamina" class="stat-item stat-haste">
            <div class="stat-value">
              {{ stats.melee_haste.value.toFixed(2) }} %
              <span v-if="stats.stamina.base">
              </span>
            </div>
            <div class="stat-label">HASTE</div>
          </li>

          <!-- MASTERY -->
          <li v-if="stats.stamina" class="stat-item stat-mastery">
            <div class="stat-value">
              {{ stats.mastery.value.toFixed(1) }} %
              <span v-if="stats.stamina.base">
              </span>
            </div>
            <div class="stat-label">MASTERY</div>
          </li>
        </ul>
      </div>

      <!-- Botão de Voltar -->
      <button @click="goBack" class="btn-back">Voltar</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CharacterProfile',
  data() {
    return {
      name: this.$route.query.name || 'Desconhecido',
      realm: this.$route.query.realm || 'Desconhecido',
      image: this.$route.query.image || '',
      stats: null
    };
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
        // Substitua pelo seu token, se necessário
        const token = "EUvnxC33xk3TyO2e2KvI8ZBVRbqEsD6oGI";
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
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

/* 
  Fonte e variáveis de cor (caso deseje usar variáveis)
  :root {
    --primary-color: #c9b37f;
    --secondary-color: #bda65b;
    --dark-bg: #0b0b0b;
  }
*/

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

/* 
  VÍDEO DE FUNDO 
  Mantém a animação ao fundo 
*/
.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  z-index: -2; /* Fica atrás de tudo */
}

/* 
  OVERLAY - gradiente escuro 
  para deixar o vídeo mais suave 
*/
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.4)
  );
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

  /* Glass morphism */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* para não "forçar" no centro vertical */
  
  /* Sombra leve */
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
  width: 600px;
  height: 600px;
  max-width: 90vw;
  max-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;

  /* Borda com leve transparência */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  
  box-shadow: 0 0 30px rgba(189, 166, 91, 0.2);
  transition: transform 0.3s ease;
}

/* Animação ao passar o mouse na imagem */
.image-container:hover {
  transform: scale(1.02);
}

/* IMAGEM DO PERSONAGEM */
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
  
  /* Glass morphism mais suave */
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0 auto;
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

/* Hover nos cartões */
.stat-item:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
}

/* Valor em destaque */
.stat-value {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
}

/* Label da stat */
.stat-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

/* Classes para colorir cada stat */
.stat-health {
  color: #27ae60;
  border-color: #27ae60;
}
.stat-power {
  color: #ffc300;
  border-color: #ffc300;
}
.stat-speed {
  color: #3498db;
  border-color: #3498db;
}
.stat-strength {
  color: #ff5733;
  border-color: #ff5733;
}
.stat-agility {
  color: #d68910;
  border-color: #d68910;
}
.stat-critical {
  color: #ff2600;
  border-color: #ff0000;
}
.stat-haste {
  color: #48c9b0;
  border-color: #48c9b0;
}
.stat-mastery {
  color: #6702aa;
  border-color: #530097;
}

/* ================================
   BOTÃO DE VOLTAR 
   ================================ */
.btn-back {
  margin-top: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(
    135deg,
    rgba(201, 179, 127, 0.8),
    rgba(189, 166, 91, 0.8)
  );
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
  .btn-back {
    font-size: 1rem;
    padding: 0.6rem 1.5rem;
  }
}
</style>
