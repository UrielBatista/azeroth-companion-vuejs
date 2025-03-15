<template>
  <div class="welcome-wrapper">
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/loginPage.mp4" type="video/mp4" />
      Seu navegador não suporta vídeos em HTML5.
    </video>

    <div class="parchment-wrapper">
      <div class="parchment-container" :class="{ 'open': isOpen }">
        <div class="parchment-roll-top"></div>
        <div class="parchment-content">
          <h1>{{ translations[language].title }}</h1>
          <p>{{ translations[language].description }}</p>
          <ol class="instructions">
            <li v-for="(step, index) in translations[language].steps" :key="index" v-html="step"></li>
          </ol>
          <div class="button-group">
            <button @click="goToPortuguese" class="btn-language">PT-BR</button>
            <button @click="goToEnglish" class="btn-language">EN-US</button>
          </div>
        </div>
        <div class="parchment-roll-bottom"></div>
      </div>
      <button @click="toggleParchment" class="btn-open-parchment">
        {{ currentToggleButton }}
      </button>
      <!-- Elementos de áudio escondidos -->
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
// Mantém o mesmo script original
export default {
  name: 'WelcomePage',
  data() {
    return {
      language: 'pt', // Idioma inicial: português
      isOpen: false, // Estado do pergaminho: fechado por padrão
      translations: {
        pt: {
          title: 'Bem-vindo ao Azeroth Companion',
          description: 'Este é um guia interativo para explorar personagens de World of Warcraft. Para começar, siga estes passos simples:',
          steps: [
            'Escolha o idioma desejado clicando em um dos botões abaixo.',
            'Na próxima tela, insira o <strong>Nome do Personagem</strong>.',
            'Selecione o <strong>Reino</strong> correspondente ao personagem.',
            'Clique em "Buscar" para visualizar os detalhes do personagem.'
          ],
          toggleButton: 'Abrir Pergaminho'
        },
        en: {
          title: 'Welcome to Azeroth Companion',
          description: 'This is an interactive guide to explore World of Warcraft characters. To get started, follow these simple steps:',
          steps: [
            'Choose your desired language by clicking one of the buttons below.',
            'On the next screen, enter the <strong>Character Name</strong>.',
            'Select the <strong>Realm</strong> corresponding to the character.',
            'Click "Search" to view the character details.'
          ],
          toggleButton: 'Open Parchment'
        }
      }
    };
  },
  computed: {
    currentToggleButton() {
      return this.isOpen
        ? (this.language === 'pt' ? 'Fechar Pergaminho' : 'Close Parchment')
        : this.translations[this.language].toggleButton;
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
        // Toca o som de abertura
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

/* Wrapper para conter o pergaminho e o botão */
.parchment-wrapper {
  width: 95%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Container do Pergaminho */
.parchment-container {
  position: relative;
  width: 600px;
  max-width: 90%;
  height: 120px; /* Altura inicial fixa (fechado) */
  background: url('@/assets/parchment-texture.png') no-repeat center center, #F5E8C7; /* Remove repetição */
  background-size: cover; /* Ajusta a imagem para cobrir o elemento */
  border: 3px solid gold; /* Borda dourada */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); /* Sombra dourada */
  z-index: 1;
  transition: height 0s; /* Remove transição inicial */
}

.parchment-container.open {
  height: 520px; /* Altura final ao abrir */
  animation: expandParchment 1.8s ease-in-out forwards;
}

/* Rolo superior do Pergaminho */
.parchment-roll-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* Altura fixa que define quantos pixels do topo serão exibidos */
  background: url('../assets/parchment-top.png') no-repeat center top -15px, #F5E8C7; /* Foca no topo da imagem */
  background-size: cover; /* Ajusta a imagem para cobrir o elemento */
  border-bottom: 2px solid gold; /* Borda dourada */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
  transform-origin: top center;
}

.parchment-container.open .parchment-roll-top {
  animation: unrollTop 1.5s ease-in-out forwards;
}

/* Rolo inferior do Pergaminho */
.parchment-roll-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px; /* Altura fixa inicial para cobrir metade do pergaminho fechado */
  background: url('../assets/parchment-top.png') no-repeat center top, #F5E8C7; /* Remove repetição */
  background-size: cover; /* Ajusta a imagem para cobrir o elemento */
  border-top: 2px solid gold; /* Borda dourada */
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.5), /* Sombra externa para cima (mantida) */
              inset 0 10px 10px rgba(0, 0, 0, 0.3); /* Sombra interna na parte superior */
  z-index: 2;
  transform-origin: bottom center;
}

.parchment-container.open .parchment-roll-bottom {
  animation: unrollBottom 1.5s ease-in-out forwards;
}

/* Conteúdo do Pergaminho */
.parchment-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2.5rem;
  text-align: center;
  font-family: 'MedievalSharp', cursive;
  background: url('@/assets/parchment-texture.png') no-repeat center center, #F5E8C7; /* Remove repetição */
  background-size: cover; /* Ajusta a imagem para cobrir o elemento */
  opacity: 0; /* Escondido por padrão */
  visibility: hidden; /* Garante que não seja visível ao carregar */
  z-index: 1;
  overflow-y: hidden; /* Remove a barra de rolagem vertical */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Garante que os botões fiquem no final */
}

.parchment-container.open .parchment-content {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in-out 1.5s; /* Aparece após a animação */
}

h1 {
  font-size: 2.2rem;
  color: rgb(0, 0, 0); /* Cor dourada */
  text-shadow: 2px 2px 4px rgba(255, 255, 0, 0.6); /* Sombra dourada */
  margin-bottom: 1.5rem;
  animation: fadeIn 1s ease-in-out forwards;
}

p {
  font-size: 1.3rem;
  color: rgb(0, 0, 0); /* Texto branco */
  margin-bottom: 1.5rem;
  animation: fadeIn 1s ease-in-out 0.2s forwards;
  opacity: 0;
}

.instructions {
  text-align: left;
  font-size: 1.2rem;
  color: rgb(0, 0, 0); /* Texto branco */
  margin-bottom: 2rem;
  padding-left: 1.5rem;
}

.instructions li {
  margin-bottom: 0.75rem;
  animation: fadeIn 1s ease-in-out 0.4s forwards;
  opacity: 0;
}

.instructions strong {
  color: gold; /* Destaque em dourado */
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  animation: fadeIn 1s ease-in-out 0.6s forwards;
  opacity: 0;
  margin-top: auto; /* Garante que os botões fiquem no final do conteúdo */
}

.btn-language {
  padding: 0.7rem;
  background: linear-gradient(180deg, #a00, #600); /* Gradiente vermelho escuro */
  border: 2px solid gold; /* Borda dourada */
  color: gold; /* Texto dourado */
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6); /* Sombra vermelha */
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-language:hover {
  background: linear-gradient(180deg, #c00, #800); /* Gradiente mais claro ao hover */
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
}

/* Botão de Abrir/Fechar */
.btn-open-parchment {
  margin-top: 20px;
  padding: 0.7rem;
  background: linear-gradient(180deg, #a00, #600); /* Gradiente vermelho escuro */
  border: 2px solid gold; /* Borda dourada */
  color: gold; /* Texto dourado */
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6); /* Sombra vermelha */
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 10;
}

.btn-open-parchment:hover {
  background: linear-gradient(180deg, #c00, #800); /* Gradiente mais claro ao hover */
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
}

/* Botão de Troca de Idioma */
.btn-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.5rem 1rem;
  background: linear-gradient(180deg, #a00, #600); /* Gradiente vermelho escuro */
  border: 2px solid gold; /* Borda dourada */
  color: gold; /* Texto dourado */
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6); /* Sombra vermelha */
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 10;
}

.btn-toggle:hover {
  background: linear-gradient(180deg, #c00, #800); /* Gradiente mais claro ao hover */
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
}

/* Rodapé */
.footer {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'MedievalSharp', cursive;
  font-size: 1rem;
  color: gold; /* Texto dourado */
  text-shadow: 2px 2px 4px rgba(255, 255, 0, 0.6); /* Sombra dourada */
  z-index: 10;
}

.footer-link {
  color: gold; /* Link dourado */
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #ffd700; /* Tom mais claro ao hover */
}

/* Animações do Pergaminho */
@keyframes expandParchment {
  0% {
    height: 120px;
  }
  50% {
    height: 400px; /* Ajuste proporcionalmente */
  }
  100% {
    height: 520px; /* Altura final ajustada */
  }
}

@keyframes unrollTop {
  0% {
    height: 60px;
    transform: scaleY(1) translateY(0) rotate(0deg);
  }
  50% {
    height: 30px;
    transform: scaleY(0.9) translateY(-15px) rotate(5deg);
  }
  100% {
    height: 0;
    transform: scaleY(0) translateY(-30px) rotate(0deg);
  }
}

@keyframes unrollBottom {
  0% {
    height: 60px;
    transform: scaleY(1) translateY(0) rotate(0deg);
  }
  50% {
    height: 30px;
    transform: scaleY(0.9) translateY(15px) rotate(-5deg);
  }
  100% {
    height: 0;
    transform: scaleY(0) translateY(30px) rotate(0deg);
  }
}

/* Animação de Fade-In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 600px) {
  .parchment-container {
    width: 90%;
    height: 120px; /* Altura inicial fixa */
  }

  .parchment-container.open {
    height: 520px; /* Ajuste para telas menores */
    animation: expandParchment 1.8s ease-in-out forwards;
  }

  .parchment-content {
    padding: 1.5rem; /* Reduz padding */
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .instructions {
    font-size: 1rem;
    margin-bottom: 1rem;
    padding-left: 1rem;
  }

  .instructions li {
    margin-bottom: 0.5rem;
  }

  .btn-open-parchment {
    margin-top: 15px;
  }

  .button-group {
    gap: 0.5rem;
  }

  .btn-language {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 400px) {
  .parchment-container {
    height: 120px; /* Altura inicial fixa */
  }

  .parchment-container.open {
    height: 400px; /* Reduz altura máxima */
    animation: expandParchmentMobile 1.8s ease-in-out forwards;
  }

  .parchment-content {
    padding: 1rem; /* Reduz ainda mais o padding */
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }

  .instructions {
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
    padding-left: 0.8rem;
  }

  .instructions li {
    margin-bottom: 0.4rem;
  }

  .btn-open-parchment {
    margin-top: 10px;
  }

  .button-group {
    gap: 0.3rem;
  }

  .btn-language {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .footer {
    font-size: 0.8rem;
    bottom: 10px;
  }
}

/* Ajuste da animação para telas menores */
@media (max-width: 600px) {
  @keyframes expandParchmentMobile {
    0% {
      height: 120px;
    }
    50% {
      height: 300px;
    }
    100% {
      height: 450px;
    }
  }
}

@media (max-width: 400px) {
  @keyframes expandParchmentMobile {
    0% {
      height: 120px;
    }
    50% {
      height: 250px;
    }
    100% {
      height: 400px;
    }
  }
}
</style>