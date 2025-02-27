<template>
  <div class="app-wrapper">
    <audio 
      ref="bgMusic" 
      autoplay 
      loop 
      style="opacity: 0; position: absolute; left: -9999px;"
      :muted="isMuted"
      @canplay="onAudioCanPlay"
    >
      <source src="/tavernLogin.mp3" type="audio/mpeg" />
      Seu navegador não suporta áudio em HTML5.
    </audio>

    <button class="mute-btn" @click="toggleMute">
      {{ isMuted ? 'Unmute' : 'Mute' }}
    </button>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isMuted: true
    };
  },
  mounted() {
    const audio = this.$refs.bgMusic;
    audio.volume = 0.1;
    audio.play().catch(err => {
      console.warn("Autoplay bloqueado:", err);
    });
  },
  methods: {
    toggleMute() {
      this.isMuted = !this.isMuted;
      if (!this.isMuted) {
        this.$refs.bgMusic.play().catch(err => console.error(err));
      }
    },
    onAudioCanPlay() {
    }
  }
};
</script>

<style>
body {
  margin: 0;
}

.app-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.mute-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: gold;
  border: 2px solid gold;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'MedievalSharp', cursive;
  font-size: 1rem;
  text-transform: uppercase;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  transition: background-color 0.3s, transform 0.2s;
  z-index: 20;
}

.mute-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: scale(1.05);
}
</style>