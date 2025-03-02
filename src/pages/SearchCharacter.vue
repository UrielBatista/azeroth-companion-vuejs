<template>
  <div class="login-wrapper">
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/loginPage.mp4" type="video/mp4" />
      Seu navegador não suporta vídeos em HTML5.
    </video>

    <div class="login-container">
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">Character Name</label>
          <input type="text" id="username" v-model="username" :class="{ 'error': !username.trim() && submitted }" required />
        </div>

        <div class="input-group reign-select">
          <label for="reign-search">Reign</label>
          <input 
            type="text" 
            id="reign-search" 
            v-model="searchTerm" 
            @focus="showDropdown = true" 
            @input="filterReigns" 
            @blur="handleBlur"
            @keydown.esc="closeDropdown"
            @keydown.down.prevent="handleArrowDown"
            @keydown.up.prevent="handleArrowUp"
            @keydown.enter.prevent="handleEnter"
            :class="{ 'error': !reign.trim() && submitted }"
            placeholder="Type to search..."
          />
          <ul v-if="showDropdown && filteredReigns.length" class="dropdown-list">
            <li 
              v-for="(reignOption, index) in filteredReigns" 
              :key="reignOption" 
              :class="{ highlighted: index === highlightedIndex }"
              @click="selectReign(reignOption)"
            >
              {{ reignOption }}
            </li>
          </ul>
        </div>
        <button type="submit" class="btn-login">Search</button>
      </form>
    </div>

    <footer class="footer">
      <a href="https://github.com/UrielBatista/azeroth-companion-vuejs" target="_blank" class="footer-link">Open Source Project</a>
    </footer>
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
      searchTerm: '', 
      showDropdown: false, 
      allReigns: [
        'anathema', 'arcanite-reaper', 'arugal', 'ashkandi', 'atiesh', 'azuresong', 'benediction', 
        'bigglesworth', 'blaumeux', 'bloodsail-buccaneers', 'chaos-bolt', 'crusader-strike', 
        'defias-pillager', 'deviate-delight', 'doomhowl', 'dreamscythe', 'earthfury', 'faerlina', 
        'fairbanks', 'felstriker', 'grobbulus', 'heartseeker', 'herod', 'incendius', 'kirtonos', 
        'kromcrush', 'kurinnaxx', 'lava-lash', 'living-flame', 'loatheb', 'lone-wolf', 
        'maladath (au)', 'mankrik', 'myzrael', 'netherwind', 'nightslayer', 'old-blanchy', 
        'pagle', 'penance (au)', 'rattlegore', 'remulos', 'shadowstrike (au)', 'skeram', 
        'skull-rock', 'smolderweb', 'stalagg', "sul'thraze", 'sulfuras', 'thalnos', 'thunderfury', 
        'westfall', 'whitemane', 'wild-growth', 'windseeker', 'yojamba', 'aegwynn', 'aerie-peak', 
        'agamaggan', 'aggramar', 'akama', 'alexstrasza', 'alleria', 'altar-of-storms', 
        'alterac-mountains', "aman'thul", 'andorhal', 'anetheron', 'antonidas', "anub'arak", 
        'anvilmar', 'arathor', 'archimonde', 'area-52', 'argent-dawn', 'arthas', 'arygos', 
        'auchindoun', 'azgalor', 'azjol-nerub', 'azralon', 'azshara', 'azuremyst', 'baelgun', 
        'balnazzar', 'barthilas', 'black-dragonflight', 'blackhand', 'blackrock', 
        'blackwater-raiders', 'blackwing-lair', "blade's-edge", 'bladefist', 'bleeding-hollow', 
        'blood-furnace', 'bloodhoof', 'bloodscalp', 'bonechewer', 'borean-tundra', 'boulderfist', 
        'bronzebeard', 'burning-blade', 'burning-legion', 'caelestrasz', 'cairne', 
        'cenarion-circle', 'cenarius', "cho'gall", 'chromaggus', 'coilfang', 'crushridge', 
        'daggerspine', 'dalaran', 'dalvengyr', 'dark-iron', 'darkspear', 'darrowmere', 
        "dath'remar", 'dawnbringer', 'deathwing', 'demon-soul', 'dentarg', 'destromath', 
        'dethecus', 'detheroc', 'doomhammer', 'draenor', 'dragonblight', 'dragonmaw', 
        "drak'tharon", "drak'thul", 'draka', 'drakkari', 'dreadmaul', 'drenden', 'dunemaul', 
        'durotan', 'duskwood', 'earthen-ring', 'echo-isles', 'eitrigg', "eldre'thalas", 
        'elune', 'emerald-dream', 'eonar', 'eredar', 'executus', 'exodar', 'farstriders', 
        'feathermoon', 'fenris', 'firetree', 'fizzcrank', 'frostmane', 'frostmourne', 
        'frostwolf', 'galakrond', 'gallywix', 'garithos', 'garona', 'garrosh', 'ghostlands', 
        'gilneas', 'gnomeregan', 'goldrinn', 'gorefiend', 'gorgonnash', 'greymane', 
        'grizzly-hills', "gul'dan", 'gundrak', 'gurubashi', 'hakkar', 'haomarush', 'hellscream', 
        'hydraxis', 'hyjal', 'icecrown', 'illidan', 'jaedenar', "jubei'thos", "kael'thas", 
        'kalecgos', 'kargath', "kel'thuzad", 'khadgar', 'khaz-modan', "khaz'goroth", 
        "kil'jaeden", 'kilrogg', 'kirin-tor', 'korgath', 'korialstrasz', 'kul-tiras', 
        'laughing-skull', 'lethon', 'lightbringer', "lightning's-blade", 'lightninghoof', 
        'llane', 'lothar', 'madoran', 'maelstrom', 'magtheridon', 'maiev', "mal'ganis", 
        'malfurion', 'malorne', 'malygos', 'mannoroth', 'medivh', 'misha', "mok'nathal", 
        'moon-guard', 'moonrunner', "mug'thol", 'muradin', 'nagrand', 'nathrezim', 'nazgrel', 
        'nazjatar', 'nemesis', "ner'zhul", 'nesingwary', 'nordrassil', 'norgannon', 'onyxia', 
        'perenolde', 'proudmoore', "quel'thalas", "quel'dorei", 'ragnaros', 'ravencrest', 
        'ravenholdt', 'rexxar', 'rivendare', 'runetotem', 'sargeras', 'saurfang', 
        'scarlet-crusade', 'scilla', "sen'jin", 'sentinels', 'shadow-council', 'shadowmoon', 
        'shadowsong', 'shandris', 'shattered-halls', 'shattered-hand', "shu'halo", 
        'silver-hand', 'silvermoon', 'sisters-of-elune', 'skullcrusher', 'skywall', 
        'smolderthorn', 'spinebreaker', 'spirestone', 'staghelm', 'steamwheedle-cartel', 
        'stonemaul', 'stormrage', 'stormreaver', 'stormscale', 'suramar', 'tanaris', 
        'terenas', 'terokkar', 'thaurissan', 'the-forgotten-coast', 'the-scryers', 
        'the-underbog', 'the-venture-co', 'thorium-brotherhood', 'thrall', 'thunderhorn', 
        'thunderlord', 'tichondrius', 'tol-barad', 'tortheldrin', 'trollbane', 'turalyon', 
        'twisting-nether', 'us-ps-realm-222', 'uldaman', 'uldum', 'undermine', 'ursin', 
        'uther', 'vashj', "vek'nilash", 'velen', 'warsong', 'whisperwind', 'wildhammer', 
        'windrunner', 'winterhoof', 'wyrmrest-accord', 'ysera', 'ysondre', 'zangarmarsh', 
        "zul'jin", 'zuluhed'
      ],
      filteredReigns: [],
      isMuted: true,
      highlightedIndex: -1,
      submitted: false
    };
  },
  mounted() {
    this.filteredReigns = this.allReigns;
  },
  methods: {
    toggleMute() {
      this.isMuted = !this.isMuted;
      if (!this.isMuted) {
        this.$refs.bgMusic.play().catch(err => console.error(err));
      }
    },
    handleBlur() {
      setTimeout(() => {
        this.showDropdown = false;
        this.highlightedIndex = -1;
      }, 100);
    },
    closeDropdown() {
      this.showDropdown = false;
      this.highlightedIndex = -1;
    },
    filterReigns() {
      const term = this.searchTerm.toLowerCase();
      this.filteredReigns = this.allReigns.filter(reign => reign.toLowerCase().includes(term));
      this.showDropdown = true;
      this.highlightedIndex = this.filteredReigns.length > 0 ? 0 : -1;
    },
    selectReign(reignOption) {
      this.reign = reignOption;
      this.searchTerm = reignOption;
      this.showDropdown = false;
      this.highlightedIndex = -1;
    },
    handleArrowDown() {
      if (!this.showDropdown) {
        this.showDropdown = true;
        return;
      }
      if (this.filteredReigns.length === 0) return;
      if (this.highlightedIndex < this.filteredReigns.length - 1) {
        this.highlightedIndex++;
      } else {
        this.highlightedIndex = 0;
      }
    },
    handleArrowUp() {
      if (!this.showDropdown) {
        this.showDropdown = true;
        return;
      }
      if (this.filteredReigns.length === 0) return;
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--;
      } else {
        this.highlightedIndex = this.filteredReigns.length - 1;
      }
    },
    handleEnter() {
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredReigns.length) {
        this.selectReign(this.filteredReigns[this.highlightedIndex]);
      }
    },
    async handleLogin() {
      if (!this.username.trim() || !this.reign.trim()) {
        alert("Please fill in both Character Name and Reign fields.");
      }

      try {
        const token = process.env.VUE_APP_WOW_TOKEN;
        const searchUsername = this.username.trim().toLowerCase();
        const searchReign = this.reign.trim().toLowerCase();
        const response = await axios.get(
          `https://us.api.blizzard.com/profile/wow/character/${searchReign}/${searchUsername}/character-media?namespace=profile-us`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const characterName = response.data.character.name;
        const characterRealm = response.data.character.realm.name.en_US;
        const characterImage = response.data.assets.find(asset => asset.key === "main-raw").value;

        this.$router.push({
          name: 'CharacterProfile',
          query: {
            name: characterName,
            realm: characterRealm,
            realmPath: this.reign,
            image: characterImage,
          }
        });

        this.username = "";
        this.reign = "";
        this.searchTerm = "";
        this.submitted = false;
      } catch (error) {
        console.error("Erro ao buscar personagem:", error);
        alert("Erro ao buscar personagem");
        this.submitted = false;
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

.input-group input {
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

.input-group input:focus {
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

/* Estilização do select personalizado */
.reign-select {
  position: relative;
}

.reign-select input {
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

.reign-select input:focus {
  border-color: gold;
  box-shadow: 0 0 10px gold;
  outline: none;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid gold;
  border-radius: 5px;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 100;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.dropdown-list li {
  padding: 0.7rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-list li.highlighted {
  background-color: rgba(255, 215, 0, 0.2);
}

.dropdown-list li:hover {
  background-color: rgba(255, 215, 0, 0.2);
}

.error {
  border-color: red !important;
  box-shadow: 0 0 10px red !important;
}

.footer {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'MedievalSharp', cursive;
  font-size: 1rem;
  color: gold;
  text-shadow: 2px 2px 4px rgba(255, 255, 0, 0.6);
  z-index: 10;
}

.footer-link {
  color: gold;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #ffd700;
}

@media (max-width: 480px) {
  .footer {
    font-size: 0.8rem;
    bottom: 10px;
  }
}

@media (max-width: 480px) {
  .login-container {
    width: 90%;
    padding: 1.5rem;
  }
}
</style>