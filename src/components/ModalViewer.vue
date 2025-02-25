<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal">
        <div class="modal-content">
          <div class="side-panel left">
            <div
              v-for="item in armorPieces"
              :key="item.id"
              class="thumbnail"
              :class="{ selected: item === currentPiece }"
              @click="selectPiece(item)"
            >
              <img :src="item.image" :alt="item.name" />
            </div>
          </div>
  
          <!-- Central Display (unique character image) -->
          <div class="central-display">
            <img :src="characterImage" alt="Character Armor" />
          </div>
  
          <!-- Right Thumbnails (unique items, e.g., weapons or accessories) -->
          <div class="side-panel right">
            <div
              v-for="item in rightItems"
              :key="item.id"
              class="thumbnail"
              :class="{ selected: item === currentRightItem }"
              @click="selectRightItem(item)"
            >
              <img :src="item.image" :alt="item.name" />
            </div>
          </div>
  
          <!-- Bottom Icons (e.g., weapons) -->
          <div class="bottom-icons">
            <div v-for="icon in bottomIcons" :key="icon.id" class="icon">
              <img :src="icon.image" :alt="icon.name" />
            </div>
          </div>
        </div>
        <button @click="$emit('close')" class="close-btn">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ArmorModal',
    props: {
      characterImage: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      realm: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        currentPiece: null,
        currentRightItem: null,
        armorPieces: [],
        rightItems: [],
        bottomIcons: [],
      };
    },
    methods: {
      selectPiece(piece) {
        this.currentPiece = piece;
      },
      selectRightItem(item) {
        this.currentRightItem = item;
      },
      selectBottomIcons(icon) {
        this.currentBottomIcons = icon;
      },
      async fetchItemMedia(itemId) {
        try {
          const url = `https://us.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-us&locale=en_US`;
          const response = await fetch(url, {
            headers: {
              'Authorization': 'Bearer EU1AXooVLenxCzfLs17haPrA7R58kQ3vmz' // Use o mesmo token
            }
          });
  
          if (!response.ok) {
            throw new Error(`Erro ao buscar media do item ${itemId}`);
          }
  
          const data = await response.json();
          // Retorna a URL da primeira imagem disponível em assets
          return data.assets && data.assets.length > 0 ? data.assets[0].value : null;
        } catch (error) {
          console.error('Erro ao carregar media do item:', error);
          return null; // Retorna null em caso de erro
        }
      },
      async fetchEquipment() {
        try {
          const url = `https://us.api.blizzard.com/profile/wow/character/${this.realm.toLowerCase()}/${this.name.toLowerCase()}/equipment?namespace=profile-us&locale=en_US`;
          
          const response = await fetch(url, {
            headers: {
              'Authorization': 'Bearer EU1AXooVLenxCzfLs17haPrA7R58kQ3vmz'
            }
          });
          
          if (!response.ok) {
            throw new Error('Erro ao buscar equipamento');
          }
  
          const data = await response.json();
          const equipment = data.equipped_items || [];
  
          const slotMapping = {
            'HEAD': 'Head',
            'NECK': 'Neck',
            'SHOULDER': 'Shoulder',
            'BACK': 'Back',
            'CHEST': 'Chest',
            'SHIRT': 'Shirt',
            'TABARD': 'Tabard',
            'WRIST': 'Wrist',
            'HANDS': 'Hands',
            'WAIST': 'Waist',
            'LEGS': 'Legs',
            'FEET': 'Feet',
            'FINGER_1': 'Finger_1',
            'FINGER_2': 'Finger_2',
            'TRINKET_1': 'Trinket_1',
            'TRINKET_2': 'Trinket_2',
            'MAIN_HAND': 'Main_hand',
            'OFF_HAND': 'Off_hand'
          };
  
          const armorPiecesTemp = [];
          const rightItemsTemp = [];
          const bottomIconsTemp = [];
  
          // Processar cada item e buscar sua imagem
          for (const item of equipment) {
            const slotName = slotMapping[item.slot.type];
            if (!slotName) continue;
  
            // Buscar a imagem do item na API de media
            const url = `https://us.api.blizzard.com/data/wow/media/item/${item.item.id}?namespace=static-us&locale=en_US`;
            const imageResponse = await fetch(url, {
                headers: {
                'Authorization': 'Bearer EU1AXooVLenxCzfLs17haPrA7R58kQ3vmz'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar imagens');
            }

            const imageData = await imageResponse.json();

            const itemData = {
              id: item.item.id,
              name: slotName,
              image: imageData.assets[0].value
            };
  
            // Dividir entre armorPieces e rightItems
            if (['Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Shirt', 'Tabard', 'Wrist'].includes(slotName)) {
              armorPiecesTemp.push(itemData);
            } else if (['Hands', 'Waist', 'Legs', 'Feet', 'Finger_1', 'Finger_2', 'Trinket_1', 'Trinket_2'].includes(slotName)) {
              rightItemsTemp.push(itemData);
            } else if (['Main_hand', 'Off_hand'].includes(slotName)){
                bottomIconsTemp.push(itemData);
            }
          }
  
          // Atualizar os arrays
          this.armorPieces = armorPiecesTemp;
          this.rightItems = rightItemsTemp;
          this.bottomIcons = bottomIconsTemp;
  
          // Definir itens iniciais selecionados
          if (this.armorPieces.length > 0) {
            this.currentPiece = this.armorPieces[0];
          }
          if (this.rightItems.length > 0) {
            this.currentRightItem = this.rightItems[0];
          }
          if (this.bottomIcons.length > 0) {
            this.currentBottomIcons = this.bottomIcons[0];
          }
  
        } catch (error) {
          console.error('Erro ao carregar equipamento:', error);
        }
      }
    },
    created() {
      this.fetchEquipment();
    },
  };
  
  // O restante do código (style) permanece igual
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
  
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px) saturate(180%);
    -webkit-backdrop-filter: blur(8px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 20px;
    width: 80%;
    max-width: 1000px;
    position: relative;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    font-family: 'Cinzel', serif;
    color: #f4ecd8;
  }
  
  .modal-content {
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  
  .side-panel {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .thumbnail {
    width: 80px;
    height: 80px;
    border: 2px solid #8b6d5c;
    margin: 10px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }
  
  .thumbnail:hover,
  .thumbnail.selected {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 4px 20px rgba(201, 179, 127, 0.15);
    border-color: #c9b37f;
  }
  
  .central-display {
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .central-display img {
    max-width: 100%;
    max-height: 500px;
    object-fit: cover;
    image-rendering: crisp-edges;
    filter: contrast(1.2) saturate(1.1);
    /* Removed border, box-shadow, and transition */
  }
  
  .bottom-icons {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
  }
  
  .icon {
    width: 50px;
    height: 50px;
    margin: 0 10px;
    border: 2px solid #8b6d5c;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }
  
  .icon:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 4px 20px rgba(201, 179, 127, 0.15);
  }
  
  .candles {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .candle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ffcc00;
    border-radius: 50%;
    box-shadow: 0 0 10px #ffcc00;
    animation: flicker 1.5s infinite;
  }
  
  @keyframes flicker {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
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
  
  .close-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
  }
  
  /* Modal transition */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  </style>