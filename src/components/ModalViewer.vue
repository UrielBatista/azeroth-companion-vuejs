<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal-title">Armor</h2>
      <!-- Show spinner if loading or if no equipment items were found -->
      <div v-if="showSpinner" class="loading-container">
        <div class="spinner"></div>
      </div>
      <div v-else class="modal-content">
        <div class="side-panel left">
          <div
            v-for="item in armorPieces"
            :key="item.id"
            class="thumbnail"
            :class="{ selected: item === currentPiece }"
            @click="selectPiece(item)"
          >
            <img :src="item.image" :alt="item.name" />
            <div class="tooltip" v-if="item.details">
              <div class="tooltip-content">
                <h3>{{ item.details.name }}</h3>
                <p>Item Level: {{ item.details.itemLevel }}</p>
                <p>Transmogrified to: {{ item.details.transmog || 'None' }}</p>
                <p v-if="item.details.bind">Binds: {{ item.details.bind }}</p>
                <p>{{ item.details.type }}</p>
                <ul>
                  <li v-for="stat in item.details.stats" :key="stat.name">
                    +{{ stat.value }} {{ stat.name }}
                  </li>
                </ul>
                <p v-if="item.details.socket">Socket: {{ item.details.socket }}</p>
                <p>Requires Level: {{ item.details.requiredLevel }}</p>
                <p>Sell Price: {{ item.details.sellPrice }}</p>
              </div>
            </div>
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
            <div class="tooltip" v-if="item.details">
              <div class="tooltip-content">
                <h3>{{ item.details.name }}</h3>
                <p>Item Level: {{ item.details.itemLevel }}</p>
                <p>Transmogrified to: {{ item.details.transmog || 'None' }}</p>
                <p v-if="item.details.bind">Binds: {{ item.details.bind }}</p>
                <p>{{ item.details.type }}</p>
                <ul>
                  <li v-for="stat in item.details.stats" :key="stat.name">
                    +{{ stat.value }} {{ stat.name }}
                  </li>
                </ul>
                <p v-if="item.details.socket">Socket: {{ item.details.socket }}</p>
                <p>Requires Level: {{ item.details.requiredLevel }}</p>
                <p>Sell Price: {{ item.details.sellPrice }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Icons (e.g., weapons) -->
        <div class="bottom-icons">
          <div 
            v-for="icon in bottomIcons" 
            :key="icon.id" 
            class="thumbnail" 
            :class="{ selected: icon === currentBottomIcons }" 
            @click="selectBottomIcons(icon)"
          >
            <img :src="icon.image" :alt="icon.name" />
            <div class="tooltip" v-if="icon.details">
              <div class="tooltip-content">
                <h3>{{ icon.details.name }}</h3>
                <p>Item Level: {{ icon.details.itemLevel }}</p>
                <p>Transmogrified to: {{ icon.details.transmog || 'None' }}</p>
                <p v-if="icon.details.bind">Binds: {{ icon.details.bind }}</p>
                <p>{{ icon.details.type }}</p>
                <ul>
                  <li v-for="stat in icon.details.stats" :key="stat.name">
                    +{{ stat.value }} {{ stat.name }}
                  </li>
                </ul>
                <p v-if="icon.details.socket">Socket: {{ icon.details.socket }}</p>
                <p>Requires Level: {{ icon.details.requiredLevel }}</p>
                <p>Sell Price: {{ icon.details.sellPrice }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      },
    },
    data() {
      return {
        isLoading: true,
        currentPiece: null,
        currentRightItem: null,
        currentBottomIcons: null,
        armorPieces: [],
        rightItems: [],
        bottomIcons: [],
      };
    },
    computed: {
      // Show spinner if still loading or if no equipment is available.
      showSpinner() {
        return (
          this.isLoading ||
          (this.armorPieces.length === 0 &&
            this.rightItems.length === 0 &&
            this.bottomIcons.length === 0)
        );
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
      async fetchItemMedia(itemId) {
        try {
          const url = `https://us.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-us&locale=en_US`;
          const response = await fetch(url, {
            headers: {
              'Authorization': 'Bearer EU1AXooVLenxCzfLs17haPrA7R58kQ3vmz'
            }
          });
  
          if (!response.ok) {
            throw new Error(`Erro ao buscar media do item ${itemId}`);
          }
  
          const data = await response.json();
          return data.assets && data.assets.length > 0 ? data.assets[0].value : null;
        } catch (error) {
          console.error('Erro ao carregar media do item:', error);
          return null;
        }
      },
      async fetchEquipment() {
        try {
          const url = `https://us.api.blizzard.com/profile/wow/character/${this.realm.toLowerCase()}/${this.name.toLowerCase()}/equipment?namespace=profile-us&locale=en_US`;
          const responseEquipaments = await fetch(url, {
            headers: {
              'Authorization': 'Bearer EU1AXooVLenxCzfLs17haPrA7R58kQ3vmz'
            }
          });
          
          if (!responseEquipaments.ok) {
            throw new Error('Erro ao buscar equipamento');
          }
  
          const data = await responseEquipaments.json();
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
  
          // Process each equipped item and fetch its media
          for (const item of equipment) {
            const slotName = slotMapping[item.slot.type];
            if (!slotName) continue;
  
            const mediaUrl = `https://us.api.blizzard.com/data/wow/media/item/${item.item.id}?namespace=static-us&locale=en_US`;
            const imageResponse = await fetch(mediaUrl, {
              headers: {
                'Authorization': 'Bearer EU1AXooVLenxCzfLs17haPrA7R58kQ3vmz'
              }
            });
  
            if (!imageResponse.ok) {
              throw new Error('Erro ao buscar imagens');
            }

            // Fetch item details (stats, level, etc.)
            const itemDetailsUrl = `https://us.api.blizzard.com/data/wow/item/${item.item.id}?namespace=static-us&locale=en_US`;
            const detailsResponse = await fetch(itemDetailsUrl, {
              headers: {
                'Authorization': 'Bearer EU1AXooVLenxCzfLs17haPrA7R58kQ3vmz'
              }
            });

            if (!detailsResponse.ok) {
              throw new Error('Erro ao buscar detalhes do item');
            }

            const detailsData = await detailsResponse.json();
            
            const itemDetails = {
              name: detailsData.name || slotName,
              itemLevel: detailsData.level || 0,
              transmog: item.is_transmogrified ? item.display.slot.type : 'None', // Adjust based on API response
              bind: detailsData.binding?.type === 'ON_PICKUP' ? 'Binds when picked up' : null,
              type: detailsData.inventory_type?.type || 'Leather', // Adjust based on item type
              stats: detailsData.preview_item.stats?.map(stat => ({
                name: stat.type.name,
                value: stat.value
              })) || [],
              socket: detailsData.sockets ? 'Socket Available' : null,
              requiredLevel: detailsData.required_level || 0,
              sellPrice: this.formatSellPrice(detailsData.sell_price) || 'N/A'
            };
  
            const imageData = await imageResponse.json();
            const itemImage = imageData.assets[0]?.value || '';

            const itemData = {
              id: item.item.id,
              name: slotName,
              image: itemImage,
              details: itemDetails
            };
  
            // Divide items into groups
            if (['Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Shirt', 'Tabard', 'Wrist'].includes(slotName)) {
              armorPiecesTemp.push(itemData);
            } else if (['Hands', 'Waist', 'Legs', 'Feet', 'Finger_1', 'Finger_2', 'Trinket_1', 'Trinket_2'].includes(slotName)) {
              rightItemsTemp.push(itemData);
            } else if (['Main_hand', 'Off_hand'].includes(slotName)) {
              bottomIconsTemp.push(itemData);
            }
          }
          
          // Update equipment arrays
          this.armorPieces = armorPiecesTemp;
          this.rightItems = rightItemsTemp;
          this.bottomIcons = bottomIconsTemp;
          console.log(this.bottomIcons);
          // Set default selections if available
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
        } finally {
          this.isLoading = false;
        }
      },
      formatSellPrice(price) {
        if (!price) return null;
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

/* Loading spinner styles */
.loading-container {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Existing styles remain unchanged */

/* New style for the modal title */
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
  width: 80px;
  height: 80px;
  border: 2px solid #020100;
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

.thumbnail:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 4px 20px rgba(236, 168, 8, 0.15);
}

/* Removed .thumbnail.selected styling */

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

/* Removed .icon.selected styling */

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

.tooltip {
  position: relative;
  display: none;
}

.thumbnail:hover .tooltip {
  display: block;
  position: absolute;
  z-index: 1001;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  width: 250px;
  color: #f4ecd8;
  font-family: 'Cinzel', serif;
  box-shadow: 0 4px 15px rgba(31, 38, 135, 0.37);
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content {
  text-align: left;
}

.tooltip-content h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #ffffff;
}

.tooltip-content p, .tooltip-content ul {
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
</style>
  