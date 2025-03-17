<template>
  <div class="welcome-wrapper">
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/loginPage.mp4" type="video/mp4" />
      Seu navegador não suporta vídeos em HTML5.
    </video>

    <div class="parchment-wrapper">
      <img 
        src="@/assets/interrogation-removebg-preview.png" 
        alt="Interrogation Mark" 
        class="interrogation" 
        @click="toggleParchment"
      >
      <div class="parchment-content" :class="{ 'open': isOpen }">
        <h1>
        <span v-for="(line, index) in titleLines" :key="index" class="title-line" v-html="line"></span>
      </h1>
        <p v-html="descriptionLines.join(' ')"></p>
        <ol class="instructions">
        <li v-for="(step, index) in translations[language].steps" :key="index" v-html="step"></li>
      </ol>
        <div class="button-group">
          <button @click="goToPortuguese" class="btn-language">PT-BR</button>
          <button @click="goToEnglish" class="btn-language">EN-US</button>
        </div>
      </div>
      <audio ref="parchmentOpenSound" preload="auto">
        <source src="../../public/parchment-open.mp3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </div>

    <button @click="toggleLanguage" class="btn-toggle">
      {{ language === 'pt' ? 'EN' : 'PT' }}
    </button>

    <footer class="footer">
      <a href="https://github.com/UrielBatista/azeroth-companion-vuejs" target="_blank" class="footer-link">Open Source Project</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  data() {
    return {
      language: 'pt',
      isOpen: false,
      translations: {
        pt: {
          title: ['Bem-vindo ao', 'Azeroth Companion'],
          description: [
            'Um guia interativo para',
            'explorar personagens de',
            'World of Warcraft.'
          ],
          steps: [
            '1. Escolha o idioma clicando nos botões abaixo.',
            '2. Insira o <strong>Nome do Personagem</strong>.',
            '3. Selecione o <strong>Reino</strong> do personagem.',
            '4. Clique em "Buscar" para ver os detalhes.'
          ]
        },
        en: {
          title: ['Welcome to', 'Azeroth Companion'],
          description: [
            'An interactive guide to',
            'explore World of Warcraft',
            'characters.'
          ],
          steps: [
            '1. Choose the language using the buttons below.',
            '2. Enter the <strong>Character Name</strong>.',
            '3. Select the <strong>Realm</strong> of the character.',
            '4. Click "Search" to view the details.'
          ]
        }
      }
    };
  },
  computed: {
    titleLines() {
      return this.translations[this.language].title;
    },
    descriptionLines() {
      return this.translations[this.language].description;
    }
  },
  methods: {
    toggleLanguage() {
      this.language = this.language === 'pt' ? 'en' : 'pt';
    },
    goToPortuguese() {
      this.$router.push({ path: '/pt-br' });
    },
    goToEnglish() {
      this.$router.push({ path: '/en-us' });
    },
    toggleParchment() {
      const openSound = this.$refs.parchmentOpenSound;
      if (!this.isOpen) {
        openSound.currentTime = 0;
        openSound.play().catch(error => {
          console.error('Erro ao tocar o som de abertura:', error);
        });
      }
      this.isOpen = !this.isOpen;
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

.welcome-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.95));
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.7;
  filter: blur(2px);
}

.parchment-wrapper {
  width: 95%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  perspective: 1000px;
}

.interrogation {
  width: 100px;
  height: auto;
  cursor: pointer;
  animation: float 6s ease-in-out infinite;
  transition: transform 0.3s ease;
  z-index: 10;
}

.interrogation:hover {
  transform: scale(1.1);
}

/* Conteúdo */
.parchment-content {
  position: relative;
  width: 600px;
  max-width: 90%;
  height: 0;
  padding: 0 2.5rem;
  text-align: center;
  font-family: 'MedievalSharp', cursive;
  background: url('@/assets/parchment-texture.png') no-repeat center center / cover;
  opacity: 0;
  visibility: hidden;
  transition: height 0.8s ease-in-out, opacity 0.5s ease-in-out, visibility 0s 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 15px;
}

.parchment-content.open {
  height: 400px; /* Altura fixa que comporta o conteúdo sem scroll */
  padding: 2rem 2.5rem;
  opacity: 1;
  visibility: visible;
  transition: height 0.8s ease-in-out, opacity 0.5s ease-in-out 0.3s;
}

/* Estilização do Conteúdo */
h1 {
  font-size: 2rem;
  color: #000;
  text-shadow: 4px 4px 8px rgba(255, 215, 0, 0.9), 0 0 15px rgba(255, 0, 0, 0.5);
  margin-bottom: 1rem;
  letter-spacing: 2px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-line {
  display: block;
  clip-path: inset(0 100% 0 0);
  animation: write 3s ease-out forwards;
  animation-delay: calc(1s + 3s * var(--index));
}

.title-line:nth-child(1) { --index: 0; }
.title-line:nth-child(2) { --index: 1; }

p {
  font-size: 1.2rem;
  color: #000;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(255, 215, 0, 0.6);
  text-align: left;
  clip-path: inset(0 100% 0 0);
  animation: write 3s ease-out forwards;
  animation-delay: 7s;
}

.description-line {
  display: block;
  clip-path: inset(0 100% 0 0);
  animation: write 3s ease-out forwards;
  animation-delay: calc(7s + 3s * var(--index));
}

.description-line:nth-child(1) { --index: 0; }
.description-line:nth-child(2) { --index: 1; }
.description-line:nth-child(3) { --index: 2; }

.instructions {
  text-align: left;
  font-size: 1rem;
  color: #000;
  margin-bottom: 1rem;
  padding-left: 1rem;
  text-shadow: 1px 1px 3px rgba(255, 215, 0, 0.5);
}

.instructions li {
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.2rem;
  clip-path: inset(0 100% 0 0);
  animation: write 3s ease-out forwards;
  animation-delay: calc(16s + 3s * var(--index));
}

.instructions li {
  --index: calc(var(--n) - 1); /* Calcula o índice para o delay */
}

.instructions li:nth-child(1) { --n: 1; }
.instructions li:nth-child(2) { --n: 2; }
.instructions li:nth-child(3) { --n: 3; }
.instructions li:nth-child(4) { --n: 4; }

.instructions strong {
  color: gold;
  text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.7);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 2rem;
  opacity: 0;
  animation: fadeIn 1s ease-in-out forwards 28s; /* Aparece após 28s */
  margin-top: auto; /* Garante que os botões fiquem na parte inferior */
}

.btn-language {
  padding: 0.9rem 1.5rem;
  background: linear-gradient(180deg, #a00, #600);
  border: 3px solid gold;
  color: gold;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.8), inset 0 0 8px rgba(255, 215, 0, 0.6);
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
}

.btn-language:hover {
  background: linear-gradient(180deg, #c00, #800);
  box-shadow: 0 10px 25px rgba(255, 0, 0, 0.9), inset 0 0 10px rgba(255, 215, 0, 0.8);
  transform: scale(1.08) translateY(-2px);
}

.btn-toggle {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(180deg, #a00, #600);
  border: 2px solid gold;
  color: gold;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.7);
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
  z-index: 10;
}

.btn-toggle:hover {
  background: linear-gradient(180deg, #c00, #800);
  box-shadow: 0 8px 20px rgba(255, 0, 0, 0.9);
  transform: scale(1.05);
}

.footer {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'MedievalSharp', cursive;
  font-size: 1.1rem;
  color: gold;
  text-shadow: 3px 3px 6px rgba(255, 255, 0, 0.7), 0 0 15px rgba(255, 0, 0, 0.5);
  z-index: 10;
}

.footer-link {
  color: gold;
  text-decoration: none;
  transition: color 0.3s, text-shadow 0.3s;
}

.footer-link:hover {
  color: #ffd700;
  text-shadow: 3px 3px 8px rgba(255, 255, 0, 0.9), 0 0 20px rgba(255, 0, 0, 0.7);
}

/* Animações */
@keyframes float {
  0% { transform: translateY(0) translateZ(0); }
  50% { transform: translateY(-45px) translateZ(10px); }
  100% { transform: translateY(0) translateZ(0); }
}

@keyframes write {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsividade para Smartphones */
@media (max-width: 768px) {
  .parchment-content {
    width: 90%;
    border-radius: 15px;
  }

  .parchment-content.open {
    height: 450px; /* Ajustado para caber o conteúdo */
  }

  .interrogation {
    width: 80px;
  }

  .parchment-content {
    padding: 0 1.5rem;
  }

  .parchment-content.open {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
    text-align: center;
  }

  .instructions {
    font-size: 0.7rem;
    padding-left: 1rem;
  }

  .btn-language {
    padding: 0.7rem 1.2rem;
    font-size: 1.2rem;
    border: 2px solid gold;
  }

  .btn-toggle {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .footer {
    font-size: 0.9rem;
    bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .parchment-content {
    width: 95%;
    border-radius: 12px;
  }

  .parchment-content.open {
    height: 400px; /* Ajustado para caber o conteúdo */
  }

  .interrogation {
    width: 60px;
  }

  .parchment-content {
    padding: 0 1rem;
  }

  .parchment-content.open {
    padding: 1rem;
  }

  h1 {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
  }

  .instructions {
    font-size: 1rem;
    padding-left: 1rem;
    margin-bottom: 0.8rem;
  }

  .instructions li {
    margin-bottom: 0.4rem;
  }

  .button-group {
    gap: 1rem;
  }

  .btn-language {
    padding: 0.6rem 1rem;
    font-size: 1rem;
  }

  .btn-toggle {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    top: 0.3rem;
    right: 0.3rem;
  }

  .footer {
    font-size: 0.75rem;
    bottom: 0.3rem;
  }
}

@media (max-width: 360px) {
  .parchment-content.open {
    height: 380px; /* Ajustado para caber o conteúdo */
  }

  .interrogation {
    width: 50px;
  }

  .parchment-content {
    padding: 0 0.8rem;
  }

  .parchment-content.open {
    padding: 0.8rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 0.95rem;
  }

  .instructions {
    font-size: 0.85rem;
    padding-left: 0.8rem;
  }

  .btn-language {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>