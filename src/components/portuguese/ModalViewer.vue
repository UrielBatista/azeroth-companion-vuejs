<template>
  <transition name="fade">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal" :style="{ '--background-image': `url(${backgroundImage})` }">
        <h2 class="modal-title">Nível da Armadura: {{ averageIlvl }}</h2>
        <div v-if="showSpinner" class="loading-container">
          <div class="spinner"></div>
        </div>
        <div v-else-if="!hasEquipment" class="no-equipment">
          <p>Nenhum equipamento encontrado.</p>
        </div>
        <div v-else class="modal-content">
          <div class="side-panel left" :class="{ 'loaded': isContentLoaded }">
            <div
              v-for="(item, index) in armorPieces"
              :key="item.id"
              class="thumbnail"
              :class="{ selected: item === currentPiece, 'loaded': isContentLoaded }"
              @click="selectPiece(item)"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <img :src="item.image" :alt="item.name" />
              <div class="tooltip" v-if="item.details">
                <div class="tooltip-content">
                  <h3>{{ item.details.name }}</h3>
                  <p>{{ item.details.type }}</p>
                  <p>Nível do Item: {{ item.details.itemLevel }}</p>
                  <p>Transmogrifado para: {{ item.details.transmog || 'None' }}</p>
                  <p v-if="item.details.bind">Vínculados: {{ item.details.bind }}</p>
                  <ul>
                    <li v-for="stat in item.details.stats" :key="stat.name">
                      +{{ stat.value }} {{ stat.name }}
                    </li>
                  </ul>
                  <p v-if="item.details.socket">Soquete: {{ item.details.socket }}</p>
                  <p>Requer Nível: {{ item.details.requiredLevel }}</p>
                  <p>Preço de Venda: {{ item.details.sellPrice }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="central-display">
            <img :src="characterImage" alt="Character Armor" />
          </div>

          <div class="side-panel right" :class="{ 'loaded': isContentLoaded }">
            <div
              v-for="(item, index) in rightItems"
              :key="item.id"
              class="thumbnail"
              :class="{ selected: item === currentRightItem, 'loaded': isContentLoaded }"
              @click="selectRightItem(item)"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <img :src="item.image" :alt="item.name" />
              <div class="tooltip" v-if="item.details">
                <div class="tooltip-content">
                  <h3>{{ item.details.name }}</h3>
                  <p>{{ item.details.type }}</p>
                  <p>Nível do Item: {{ item.details.itemLevel }}</p>
                  <p>Transmogrifado para: {{ item.details.transmog || 'None' }}</p>
                  <p v-if="item.details.bind">Vínculados: {{ item.details.bind }}</p>
                  <ul>
                    <li v-for="stat in item.details.stats" :key="stat.name">
                      +{{ stat.value }} {{ stat.name }}
                    </li>
                  </ul>
                  <p v-if="item.details.socket">Soquete: {{ item.details.socket }}</p>
                  <p>Requer Nível: {{ item.details.requiredLevel }}</p>
                  <p>Preço de Venda: {{ item.details.sellPrice }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bottom-icons" :class="{ 'loaded': isContentLoaded }">
            <div
              v-for="(icon, index) in bottomIcons"
              :key="icon.id"
              class="thumbnail"
              :class="{ selected: icon === currentBottomIcons, 'loaded': isContentLoaded }"
              @click="selectBottomIcons(icon)"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <img :src="icon.image" :alt="icon.name" />
              <div class="tooltip" v-if="icon.details">
                <div class="tooltip-content">
                  <h3>{{ icon.details.name }}</h3>
                  <p>{{ icon.details.type }}</p>
                  <p>Nível do Item: {{ icon.details.itemLevel }}</p>
                  <p>Transmogrifado para: {{ icon.details.transmog || 'None' }}</p>
                  <p v-if="icon.details.bind">Vínculos: {{ icon.details.bind }}</p>
                  <ul>
                    <li v-for="stat in icon.details.stats" :key="stat.name">
                      +{{ stat.value }} {{ stat.name }}
                    </li>
                  </ul>
                  <p v-if="icon.details.socket">Soquete: {{ icon.details.socket }}</p>
                  <p>Requer Nível: {{ icon.details.requiredLevel }}</p>
                  <p>Preço de Venda: {{ icon.details.sellPrice }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
  
<script>
export default {
  name: 'ArmorModalPT',
  props: {
    characterImage: { type: String, required: true },
    backgroundImage: { type: String, required: true },
    name: { type: String, required: true },
    realm: { type: String, required: true },
    averageIlvl: { type: Number, required: true, default: 0 },
    equipaments: { type: Object, required: true },
  },
  data() {
    return {
      isLoading: true,
      isContentLoaded: false, // Novo controle para o fade-in
      currentPiece: null,
      currentRightItem: null,
      currentBottomIcons: null,
      armorPieces: [],
      rightItems: [],
      bottomIcons: [],
    };
  },
  computed: {
    showSpinner() {
      return this.isLoading;
    },
    hasEquipment() {
      return this.armorPieces.length > 0 || this.rightItems.length > 0 || this.bottomIcons.length > 0;
    },
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
    async fetchEquipment() {
      this.isLoading = true;
      const token = localStorage.getItem('access_token');
      const apiFetch = url => fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      try {
        const equipment = this.equipaments.equipped_items || [];

        const slotMapping = {
          'HEAD': 'Head', 'NECK': 'Neck', 'SHOULDER': 'Shoulder', 'BACK': 'Back',
          'CHEST': 'Chest', 'SHIRT': 'Shirt', 'TABARD': 'Tabard', 'WRIST': 'Wrist',
          'HANDS': 'Hands', 'WAIST': 'Waist', 'LEGS': 'Legs', 'FEET': 'Feet',
          'FINGER_1': 'Finger_1', 'FINGER_2': 'Finger_2', 'TRINKET_1': 'Trinket_1',
          'TRINKET_2': 'Trinket_2', 'MAIN_HAND': 'Main_hand', 'OFF_HAND': 'Off_hand',
        };

        const itemPromises = equipment.map(async item => {
          const slotName = slotMapping[item.slot.type];
          if (!slotName) return null;

          const mediaUrl = `https://us.api.blizzard.com/data/wow/media/item/${item.item.id}?namespace=static-us&locale=pt_BR`;
          const detailsUrl = `https://us.api.blizzard.com/data/wow/item/${item.item.id}?namespace=static-us&locale=pt_BR`;

          try {
            const [mediaResponse, detailsResponse] = await Promise.all([
              apiFetch(mediaUrl),
              apiFetch(detailsUrl),
            ]);

            if (!mediaResponse.ok || !detailsResponse.ok) return null;

            const mediaData = await mediaResponse.json();
            const detailsData = await detailsResponse.json();

            return {
              id: item.item.id,
              name: slotName,
              image: mediaData.assets?.[0]?.value || '',
              details: {
                name: detailsData.name || slotName,
                itemLevel: detailsData.level || 0,
                transmog: item?.transmog?.item?.name ? item?.transmog?.item?.name : 'None',
                bind: detailsData.binding?.type === 'ON_PICKUP' ? 'Binds when picked up' : null,
                type: detailsData.inventory_type?.name || 'Leather',
                stats: detailsData.preview_item?.stats?.map(stat => ({
                  name: stat.type.name,
                  value: stat.value,
                })) || [],
                socket: detailsData.sockets ? 'Socket Available' : null,
                requiredLevel: detailsData.required_level || 0,
                sellPrice: this.formatSellPrice(detailsData.sell_price) || 'N/A',
              },
            };
          } catch (error) {
            console.error(`Error fetching item ${item.item.id}:`, error);
            return null;
          }
        });

        const items = await Promise.all(itemPromises);
        const validItems = items.filter(Boolean);

        const slotOrder = Object.values(slotMapping);

        validItems.sort((a, b) => {
          const indexA = slotOrder.indexOf(a.name);
          const indexB = slotOrder.indexOf(b.name);
          return indexA - indexB;
        });

        this.armorPieces = validItems.filter(i => ['Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Shirt', 'Tabard', 'Wrist'].includes(i.name));
        this.rightItems = validItems.filter(i => ['Hands', 'Waist', 'Legs', 'Feet', 'Finger_1', 'Finger_2', 'Trinket_1', 'Trinket_2'].includes(i.name));
        this.bottomIcons = validItems.filter(i => ['Main_hand', 'Off_hand'].includes(i.name));

        if (this.armorPieces.length) this.currentPiece = this.armorPieces[0];
        if (this.rightItems.length) this.currentRightItem = this.rightItems[0];
        if (this.bottomIcons.length) this.currentBottomIcons = this.bottomIcons[0];

        this.isContentLoaded = true;
      } catch (error) {
        console.error('Error loading equipment:', error);
      } finally {
        this.isLoading = false;
      }
    },
    formatSellPrice(price) {
      if (!price) return 'N/A';
      const gold = Math.floor(price / 10000);
      const silver = Math.floor((price % 10000) / 100);
      const copper = price % 100;
      return `${gold} 🥇 ${silver} 🥈 ${copper} 🥉`;
    },
  },
  created() {
    this.fetchEquipment();
  },
};
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-image: var(--background-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  width: 80%;
  max-width: 1000px;
  position: fixed;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  font-family: 'Cinzel', serif;
  color: #f4ecd8;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -60%);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%);
}

.modal-backdrop.fade-enter-active,
.modal-backdrop.fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop.fade-enter-from,
.modal-backdrop.fade-leave-to {
  opacity: 0;
}

.no-equipment {
  text-align: center;
  padding: 20px;
  color: #f4ecd8;
  font-size: 1.2rem;
}

.loading-container {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-family: 'Cinzel', serif;
  color: #f4ecd8;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(31, 38, 135, 0.37);
}

.spinner {
  border: 8px solid rgba(255, 255, 255, 0.1);
  border-top: 8px solid #f4ecd8;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  width: 60px;
  height: 60px;
  border: 2px solid #020100;
  margin: 10px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1001;
}

/* Estado inicial dos thumbnails */
.side-panel.left .thumbnail,
.side-panel.right .thumbnail,
.bottom-icons .thumbnail {
  opacity: 0;
}

/* Animação para thumbnails do side-panel left */
.side-panel.left .thumbnail.loaded {
  animation: fadeInFromLeft 0.5s ease-in-out forwards;
}

/* Animação para thumbnails do side-panel right */
.side-panel.right .thumbnail.loaded {
  animation: fadeInFromRight 0.5s ease-in-out forwards;
}

/* Animação para thumbnails do bottom-icons */
.bottom-icons .thumbnail.loaded {
  animation: fadeInFromBottom 0.5s ease-in-out forwards;
}

/* Definição das animações */
@keyframes fadeInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInFromRight {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInFromBottom {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.thumbnail:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 4px 20px rgba(236, 168, 8, 0.15);
}

.bottom-icons .thumbnail {
  width: 40px;
  height: 40px;
  margin: 0 8px;
  border: 2px solid #8b6d5c;
}

.central-display {
  z-index: -1;
  width: 100%;
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
}

.bottom-icons {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  z-index: 1000;
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

.tooltip {
  display: none;
  position: absolute;
  z-index: 9999;
  background: rgba(122, 108, 108, 0.826);
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.493);
  border-radius: 8px;
  padding: 10px;
  width: 250px;
  color: #f4ecd8;
  font-family: 'Cinzel', serif;
  box-shadow: 0 4px 15px rgba(31, 38, 135, 0.37);
}

.side-panel.left .thumbnail:hover .tooltip {
  display: block;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  margin-left: 10px;
}

.side-panel.right .thumbnail:hover .tooltip {
  display: block;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  margin-right: 10px;
}

.bottom-icons .thumbnail:hover .tooltip {
  display: block;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
}

.tooltip-content {
  text-align: left;
}

.tooltip-content h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #ffffff;
}

.tooltip-content p,
.tooltip-content ul {
  margin: 5px 0;
  font-size: 0.9rem;
}

.tooltip-content ul {
  list-style: none;
  padding: 0;
}

.tooltip-content li {
  color: #f4ecd8;
}

.tooltip-content li span.green {
  color: #00ff00;
}

@media (max-width: 768px) {
  .modal-backdrop {
    height: 33%;
  }
  .modal {
    width: 90%;
    padding: 10px;
    max-height: 90vh;
  }

  .modal-title {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .thumbnail {
    width: 30px;
    height: 30px;
    margin: 5px;
  }

  .bottom-icons .thumbnail {
    width: 25px;
    height: 25px;
    margin: 0 5px;
  }

  .central-display {
    z-index: -1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .central-display img {
    max-height: 100%;
  }

  .bottom-icons {
    margin-top: 10px;
  }

  .tooltip {
    width: 200px;
    font-size: 0.8rem;
  }

  .tooltip-content h3 {
    font-size: 1rem;
  }

  .tooltip-content p,
  .tooltip-content ul {
    font-size: 0.8rem;
  }

}
</style>