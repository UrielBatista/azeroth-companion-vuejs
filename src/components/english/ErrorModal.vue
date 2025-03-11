<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h2 class="modal-title">Personagem não encontrado</h2>
        <p class="modal-text">
          O personagem não existe ou está desabilitado para buscas
        </p>
        <p class="modal-instructions">
          <strong>Obs:</strong> Para habilitar o personagem, o usuário da conta battle.net deve seguir os seguintes passos.
        </p>
        <ol class="modal-steps">
          <li>
            Acesso o site da Battle.net:
            <ul>
              <li>Abra seu navegador e vá para o site oficial da Battle.net <a href="https://battle.net/" target="_blank" class="modal-link">https://battle.net/</a>.</li>
              <li>Faça login com sua conta que você usa para jogar World of Warcraft</li>
            </ul>
          </li>
          <li>
            Vá para as Configurações da Conta:
            <ul>
              <li>Após fazer login, clique no ícone do seu perfil (geralmente no canto superior direito) e selecione "Account Settings" (Configurações da Conta) ou "Gerenciar Conta".</li>
            </ul>
          </li>
          <li>
            Encontre as Configurações de Privacidade:
            <ul>
              <li>No menu de configurações, procure pela seção "Privacy" (Privacidade) ou "Game Data and Profile Privacy" (Privacidade de Dados do Jogo e Perfil).</li>
            </ul>
          </li>
          <li>
            Clique em atualizar:
            <ul>
              <li>Clique no checkbox para habilitar o compartilhamento de dados do jogo.</li>
            </ul>
          </li>
        </ol>
        <button class="modal-close-btn" @click="handleClose">Close</button>
      </div>
    </div>
  </template>
  
  <script>
export default {
  name: 'ErrorModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>
  
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  background: rgba(0, 0, 0, 0.9);
  border: 3px solid gold;
  border-radius: 10px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  font-family: 'MedievalSharp', cursive;
  color: white;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.modal-title {
  font-size: 1.8rem;
  color: gold;
  text-shadow: 2px 2px 4px rgba(255, 255, 0, 0.6);
  margin-bottom: 1rem;
}

.modal-text {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.modal-instructions {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.modal-steps {
  list-style: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.modal-steps li {
  margin-bottom: 0.5rem;
}

.modal-steps ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.modal-link {
  color: gold;
  text-decoration: none;
}

.modal-link:hover {
  color: #ffd700;
}

.modal-close-btn {
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

.modal-close-btn:hover {
  background: linear-gradient(180deg, #c00, #800);
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
}

.modal-close-btn:active {
  transform: scale(1);
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1rem;
    max-width: 100%;
    width: 95%;
    max-height: 85vh;
  }

  .modal-title {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }

  .modal-text {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }

  .modal-instructions {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }

  .modal-steps {
    padding-left: 1rem;
    font-size: 0.9rem;
  }

  .modal-steps ul {
    padding-left: 1rem;
    font-size: 0.85rem;
  }

  .modal-close-btn {
    padding: 0.6rem;
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .modal-title {
    font-size: 1.2rem;
  }

  .modal-text {
    font-size: 0.9rem;
  }

  .modal-instructions {
    font-size: 0.85rem;
  }

  .modal-steps {
    font-size: 0.85rem;
  }

  .modal-steps ul {
    font-size: 0.8rem;
  }

  .modal-close-btn {
    font-size: 0.9rem;
  }
}
</style>