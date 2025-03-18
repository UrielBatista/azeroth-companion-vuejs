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
      <source :src="currentTrack" type="audio/mpeg" />
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
      isMuted: true,
      tracks: [
        '/tavernLogin.mp3',
        '/dwarfTavern.mp3',
      ],
      currentTrackIndex: 0
    };
  },
  computed: {
    currentTrack() {
      return this.tracks[this.currentTrackIndex];
    }
  },
  mounted() {
    this.selectRandomTrack();
    const audio = this.$refs.bgMusic;
    audio.volume = 0.1;
    audio.play().catch(err => {
      console.warn("Autoplay bloqueado:", err);
    });
  },
  methods: {
    toggleMute() {
      this.isMuted = !this.isMuted;
      const audio = this.$refs.bgMusic;
      if (!this.isMuted) {
        this.selectRandomTrack();
        audio.load(); // Carrega a nova faixa
        audio.play().catch(err => console.error(err));
      }
    },
    selectRandomTrack() {
      const newIndex = Math.floor(Math.random() * this.tracks.length);
      this.currentTrackIndex = newIndex;
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