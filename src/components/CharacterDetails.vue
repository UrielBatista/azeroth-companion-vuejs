<template>
    <div class="character-details">
      <div class="detail-item">
        <span class="detail-label">Level:</span>
        <span class="detail-value">{{ details.level }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Faction:</span>
        <span class="detail-value">{{ details.faction || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Spec:</span>
        <span class="detail-value">{{ details.spec || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Race:</span>
        <span class="detail-value">{{ details.race || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Class:</span>
        <span class="detail-value">{{ details.classtype || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Guild:</span>
        <span class="detail-value">{{ details.guild || 'N/A' }}</span>
      </div>
      <div class="detail-item" v-if="details.lastLogin">
        <span class="detail-label">Last Login:</span>
        <span class="detail-value">{{ formatDate(details.lastLogin) }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CharacterDetails',
    props: {
      details: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .character-details {
    width: 90%;
    max-width: 800px;
    margin: 1rem auto;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .detail-item {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
  }
  
  .detail-label {
    color: #c9b37f;
    font-size: 1.1rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .detail-value {
    color: #ffffff;
    font-size: 1rem;
    margin-top: 0.3rem;
  }
  
  @media (max-width: 768px) {
    .character-details {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
  }
  </style>