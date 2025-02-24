<template>
  <div class="login-wrapper">
    <!-- Vídeo de fundo -->
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/loginPage.mp4" type="video/mp4" />
      Seu navegador não suporta vídeos em HTML5.
    </video>

    <!-- Áudio de fundo -->
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

    <div class="login-container">
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">Character Name</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <!-- Select para 'reign' -->
        <div class="input-group">
          <label for="reign">Reign</label>
          <select id="reign" v-model="reign">
            <option value=""></option>
            <option value="azralon">azralon</option>
            <option value="tichondrius">tichondrius</option>
          </select>
        </div>
        <button type="submit" class="btn-login">Search</button>
      </form>
    </div>

    <!-- Botão de Mute/Unmute -->
    <button class="mute-btn" @click="toggleMute">
      {{ isMuted ? 'Unmute' : 'Mute' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchCharacter',
  data() {
    return {
      username: '',
      reign: '',
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
    async handleLogin() {
      try {
        const token = "EUvnxC33xk3TyO2e2KvI8ZBVRbqEsD6oGI";
        const response = await axios.get(
          `https://us.api.blizzard.com/profile/wow/character/${this.reign}/${this.username}/character-media?namespace=profile-us`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(response.data);

        // Pegando nome, reino e imagem do personagem
        const characterName = response.data.character.name;
        const characterRealm = response.data.character.realm.name.en_US;
        console.log(characterRealm)
        const characterImage = response.data.assets.find(asset => asset.key === "main-raw").value;


        // Redirecionando para a nova página com os dados
        this.$router.push({
          name: 'CharacterProfile',
          query: {
            name: characterName,
            realm: characterRealm,
            image: characterImage
          }
        });

        // Resetando os campos
        this.username = "";
        this.reign = "";
      } catch (error) {
        console.error("Erro ao buscar personagem:", error);
        alert("Erro ao buscar personagem");
      }
    }
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.login-container {
  background: rgba(0, 0, 0, 0.8);
  border: 3px solid gold;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  font-family: 'MedievalSharp', cursive;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  width: 350px;
  z-index: 10;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: gold;
  text-shadow: 2px 2px 4px rgba(255, 255, 0, 0.6);
  margin-bottom: 0.5rem;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.7rem;
  font-size: 1rem;
  border: 2px solid #444;
  background-color: rgba(20, 20, 20, 0.9);
  color: white;
  text-align: center;
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(255, 215, 0, 0.4);
}

.input-group input:focus,
.input-group select:focus {
  border-color: gold;
  box-shadow: 0 0 10px gold;
  outline: none;
}

.btn-login {
  width: 100%;
  padding: 0.7rem;
  background: linear-gradient(180deg, #a00, #600);
  border: 2px solid gold;
  color: gold;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-login:hover {
  background: linear-gradient(180deg, #c00, #800);
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
}

.btn-login:active {
  transform: scale(1);
}

/* Botão de mute/unmute */
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

/* Responsividade */
@media (max-width: 480px) {
  .login-container {
    width: 90%;
    padding: 1.5rem;
  }
}
</style>
