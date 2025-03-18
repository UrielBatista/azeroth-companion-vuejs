<template>
    <div class="top-pvp-players-container">
      <h3>Melhores Jogadores PvP - {{ classType }}</h3>
      <div v-if="loading" class="loading-spinner"></div>
      <div v-else class="pvp-ranking">
        <!-- 2v2 Section -->
        <div class="pvp-section">
          <h4>2v2 Arena</h4>
          <ul class="pvp-player-list">
            <li v-for="(player, index) in top2v2Players" :key="`2v2-${index}`" class="pvp-player-item">
              <div class="pvp-overlay"></div>
              <img :src="getBrasaoImage(player.rating)" class="pvp-icon" />
              <div class="player-info">
                <div class="player-name">{{ player.name }} - {{ player.realm }}</div>
                <div class="player-rating">{{ player.rating }}</div>
              </div>
            </li>
          </ul>
        </div>
  
        <!-- 3v3 Section -->
        <div class="pvp-section">
          <h4>3v3 Arena</h4>
          <ul class="pvp-player-list">
            <li v-for="(player, index) in top3v3Players" :key="`3v3-${index}`" class="pvp-player-item">
              <div class="pvp-overlay"></div>
              <img :src="getBrasaoImage(player.rating)" class="pvp-icon" />
              <div class="player-info">
                <div class="player-name">{{ player.name }} - {{ player.realm }}</div>
                <div class="player-rating">{{ player.rating }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import arena01299 from '@/assets/arena-0-1299.png';
  import arena13001499 from '@/assets/arena-1300-1499.png';
  import arena15001799 from '@/assets/arena-1500-1799.png';
  import arena18001950 from '@/assets/arena-1800-1950.png';
  import arena19512100 from '@/assets/arena-1951-2100.png';
  import arena21012250 from '@/assets/arena-2101-2250.png';
  import arena22515000 from '@/assets/arena-2251-5000.png';
  
  export default {
    name: 'TopPvPPlayers',
    props: {
      classType: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        brasaoImages: [
          { min: 0, max: 1299, image: arena01299 },
          { min: 1300, max: 1499, image: arena13001499 },
          { min: 1500, max: 1799, image: arena15001799 },
          { min: 1800, max: 1950, image: arena18001950 },
          { min: 1951, max: 2100, image: arena19512100 },
          { min: 2101, max: 2250, image: arena21012250 },
          { min: 2251, max: 5000, image: arena22515000 },
        ],
        top2v2Players: [],
        top3v3Players: [],
        loading: true,
      };
    },
    mounted() {
      this.fetchTopPlayers();
    },
    watch: {
      classType(newClassType, oldClassType) {
        if (newClassType !== oldClassType) {
          this.fetchTopPlayers();
        }
      },
    },
    methods: {
      getBrasaoImage(rating) {
        for (const brasao of this.brasaoImages) {
          if (rating >= brasao.min && rating <= brasao.max) {
            return brasao.image;
          }
        }
        return arena01299;
      },
      getClassName(className) {
        const classMap = {
          'Guerreiro': "Warrior",
          'Paladino': "Paladin",
          'Caçador': "Hunter",
          'Ladino': "Rogue",
          'Sacerdote': "Priest",
          'Cavaleiro da Morte': "Death Knight",
          'Xamã': "Shaman",
          'Mago': "Mage",
          "Bruxo": "Warlock",
          'Monge': "Monk",
          'Druida': "Druid",
          'Caçador de Demônios': "Demon Hunter",
          'Conjurante': "Evoker",
        };
        return classMap[className] || 'Unknown';
      },
      async fetchTopPlayers() {
        const token = localStorage.getItem('access_token');
        this.loading = true;
        try {
          const baseUrl = 'https://scrapping-python-alts-production.up.railway.app/leaderboard';
          const headers = { Accept: 'application/json' };
  
          const response2v2 = await axios.get(`${baseUrl}/${this.getClassName(this.classType)}/2v2/${token}`, { headers });
          this.top2v2Players = response2v2.data.slice(0, 3);
  
          const response3v3 = await axios.get(`${baseUrl}/${this.getClassName(this.classType)}/3v3/${token}`, { headers });
          this.top3v3Players = response3v3.data.slice(0, 3);
        } catch (error) {
          console.error('Erro ao buscar dados dos top PvP players:', error);
          this.top2v2Players = [
            { name: 'None', realm: 'None', rating: 1 },
            { name: 'None', realm: 'None', rating: 1 },
            { name: 'None', realm: 'None', rating: 1 },
          ];
          this.top3v3Players = [
            { name: 'None', realm: 'None', rating: 1 },
            { name: 'None', realm: 'None', rating: 1 },
            { name: 'None', realm: 'None', rating: 1 },
          ];
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .top-pvp-players-container h3 {
    font-size: clamp(1.5rem, 4vw, 1.8rem);
    color: #c9b37f;
    margin-top: 3rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .pvp-ranking {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .pvp-section h4 {
    font-size: clamp(1.2rem, 3vw, 1.4rem);
    color: #ffffff;
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
  
  .pvp-player-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .pvp-player-item {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 0.8rem;
    margin-bottom: 1rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
  }
  
  .pvp-player-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
  }
  
  .pvp-player-item .pvp-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    transition: background 0.3s ease;
    z-index: 1;
    pointer-events: none;
  }
  
  .pvp-player-item:hover .pvp-overlay {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.2) 100%
    );
  }
  
  .pvp-player-item .pvp-icon {
    width: clamp(40px, 10vw, 60px);
    height: clamp(40px, 10vw, 60px);
    margin-right: 1rem;
    z-index: 2;
    transition: filter 0.3s ease;
  }
  
  .pvp-player-item:hover .pvp-icon {
    filter: brightness(0.8);
  }
  
  .player-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.3rem;
    z-index: 2;
  }
  
  .player-name {
    font-size: clamp(0.9rem, 2.5vw, 1.2rem);
    color: #ffffff;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .player-rating {
    font-size: clamp(1rem, 2.8vw, 1.4rem);
    font-weight: bold;
    color: #c9b37f;
    text-align: right;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.4);
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
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Media Queries para responsividade */
  @media (max-width: 1200px) {
    .pvp-ranking {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    .pvp-ranking {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  
    .pvp-player-item {
      flex-direction: column;
      text-align: center;
      padding: 1rem;
    }
  
    .pvp-player-item .pvp-icon {
      margin: 0 auto 0.5rem;
    }
  
    .player-info {
      align-items: center;
      gap: 0.5rem;
    }
  
    .player-name {
      text-align: center;
    }
  
    .player-rating {
      text-align: center;
    }
  }
  
  @media (max-width: 480px) {
    .top-pvp-players-container {
      padding: 0.5rem;
    }
  
    .pvp-player-item {
      padding: 0.5rem;
    }
  
    .pvp-player-item .pvp-icon {
      width: 40px;
      height: 40px;
    }
  
    .player-name {
      font-size: 0.9rem;
    }
  
    .player-rating {
      font-size: 1rem;
    }
  }
  </style>