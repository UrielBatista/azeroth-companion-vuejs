<template>
  <div class="class-info-container">
    <h2>Class Information</h2>
    <p class="class-description">{{ classDescription }}</p>
    <h3>Combat Strategy</h3>
    <p class="combat-strategy">{{ combatStrategy }}</p>
  </div>
</template>

<script>
export default {
  name: 'ClassInfo',
  props: {
    classType: {
      type: String,
      required: true,
      default: 'Rogue'
    }
  },
  computed: {
    classDescription() {
      switch (this.classType) {
        case 'Rogue':
          return 'For rogues, the only code is the contract, and their honor can be bought with gold. Free from scruples, these mercenaries employ brutal and efficient tactics. Lethal assassins and masters of stealth, rogues approach their targets from behind, pierce a vital organ, and vanish into the shadows before the victim hits the ground.';
        case 'Warrior':
          return 'Wars come and go, but some heroes dedicate themselves tirelessly to mastering every aspect of the art of battle. Warriors combine strength, leadership, and vast knowledge of weapons and armor to wreak havoc on the battlefield. Some hold the front line with shields, keeping enemies at bay while their allies support with spells and ranged attacks. Others forgo shields and unleash their fury on the nearest threat, wielding a wide array of lethal weapons.';
        case 'Paladin':
          return 'This is the paladin’s duty: to protect the weak, bring justice to the unjust, and eradicate evil from the darkest corners of the world. These holy warriors are equipped with plate armor to face the toughest foes and wield the blessings of the Light, allowing them to heal wounds and, in some cases, even resurrect the dead.';
        case 'Hunter':
          return 'From an early age, the call of the wild draws some adventurers to abandon the comfort of their homes and venture into the unforgiving wilderness. Those who survive become hunters. Masters of their domain, hunters can glide like ghosts through the trees and set traps in their enemies’ paths.';
        case 'Priest':
          return 'Priests are devoted to spirituality and express their unwavering faith by serving the people. For thousands of years, these individuals have left the confines of their temples and all comforts to support their allies in war-torn lands. No hero questions the value of the priestly order amidst a fierce battle.';
        case 'Shaman':
          return 'Shamans are spiritual guides, not of divine power, but of the elemental forces. Unlike other mystics, shamans commune with forces that are not always benevolent. The elements are chaotic and, when left unchecked, constantly clash in an endless cycle of primal fury. It is the shaman’s call to bring balance to this chaos. Acting as mediators between earth, fire, water, and air, shamans summon totems that direct the elements to aid their allies and punish those who threaten them.';
        case 'Mage':
          return 'Students gifted with keen intellect and unshakable discipline may tread the path of the mage. The arcane magic at a mage’s disposal is both wondrous and dangerous, and thus its secrets are revealed only to the most devoted practitioners. To prevent interference with their spellcasting, mages wear cloth armor, but arcane shields and enchantments provide additional protection. To keep enemies at bay, mages can summon bursts of fire to incinerate targets and trigger eruptions across entire areas, setting groups ablaze.';
        case 'Warlock':
          return 'Faced with demonic powers, most heroes see death. Warlocks see only opportunity. Domination is their goal, and they have found a path to it through mastery of the dark arts. To aid their schemes, these sorcerers summon monstrous minions to fight by their side. Early in their journey, warlocks command only imps, but over time, new allies like seductive succubi, chaotic voidwalkers, and ferocious felhunters join them to crush any threat.';
        case 'Monk':
          return 'When the pandaren were subjugated by the mogu centuries ago, monks rekindled hope in a seemingly bleak future. With weapons out of reach, the enslaved pandaren turned to focusing their chi and developed unarmed combat techniques. When the opportunity for revolution arose, they were already trained to topple their oppressors.';
        case 'Druid':
          return 'Druids harness the vast powers of nature to preserve balance and protect life. A skilled druid can unleash nature’s raw energy, raining celestial wrath upon enemies from afar, binding them with enchanted roots, or ensnaring them in relentless cyclones.';
        case 'Demon Hunter':
          return 'Demon Hunters, disciples of Illidan Stormrage, uphold a dark legacy that terrifies both foes and allies alike. The Illidari wield chaotic and fel magic—energies that have long threatened Azeroth—believing them essential to defeating the Burning Legion. By embracing the powers of the demons they slay, demon hunters develop fiendish traits that inspire fear and disdain among other elves.';
        case 'Death Knight':
          return 'When the Lich King’s hold over his death knights broke, his former champions found new purpose as Knights of the Ebon Blade. After donning the helm to contain the Scourge undead, Bolvar Fordragon raised a new generation of death knights to champion the Ebon Blade’s cause.';
        case 'Evoker':
          return 'Dracthyr Evokers were created to wield the magic of all five dragonflights and seek to forge their own path in Azeroth. They enhance their draconic abilities through magic and can charge their attacks to unleash them at the perfect moment with devastating effect. They can also use their superior mobility to weave in and out of combat as needed.';
        default:
          return 'Class description not available.';
      }
    },
    combatStrategy() {
      switch (this.classType) {
        case 'Rogue':
          return 'Rogues typically initiate combat with a surprise attack from the shadows, followed by brutal melee strikes. In prolonged battles, they rely on combinations of successive attacks that set up a finishing blow. However, rogues must choose their targets carefully to avoid wasting their combos. They must also be cunning enough to know when to hide or flee from a fight that turns against them.';
        case 'Warrior':
          return 'Warriors gear up thoroughly for combat and face enemies head-on, letting heavy armor absorb their blows. They employ various combat strategies and weapon types to protect vulnerable allies. Warriors must manage their rage, which fuels their most powerful attacks, to maximize their effectiveness in battle.';
        case 'Paladin':
          return 'Paladins confront enemies head-on, relying on heavy armor and healing to survive combat. Whether with massive shields or devastating two-handed weapons, paladins can keep claws and blades away from weaker allies or use healing spells to ensure they stay standing.';
        case 'Hunter':
          return 'Hunters engage enemies from afar or up close, commanding their pets to attack while firing arrows, shooting guns, or striking with pole weapons. Though equipped with effective short- and long-range tools, hunters are also highly agile. They can escape or trap enemies to control the battlefield.';
        case 'Priest':
          return 'Priests use powerful healing spells to bolster themselves and their allies. They wield potent ranged attack spells, but enemies can catch them off guard due to their light armor. Skilled priests carefully balance their offensive powers when tasked with keeping their group alive.';
        case 'Shaman':
          return 'In combat, shamans place damage and control totems on the ground to maximize efficiency while thwarting enemy actions. Shamans are versatile enough to fight in melee or at range, but the wisest adapt their attack plan based on their enemies’ strengths and weaknesses.';
        case 'Mage':
          return 'Mages obliterate their foes with arcane spellcasting. Though they wield powerful offensive magic, mages are fragile and wear light armor, leaving them particularly vulnerable to melee attacks. Wise mages use their spells cautiously to keep enemies at a distance and immobilized.';
        case 'Warlock':
          return 'Warlocks burn and destroy enemies by combining debilitating curses with dark magic. While demonic minions protect them and provide benefits, warlocks strike from afar. With light armor and physical frailty, the wisest warlocks let their minions take most enemy attacks to preserve themselves.';
        case 'Monk':
          return 'Whatever their combat role, monks rely primarily on their hands, feet, and a deep connection to their chi to enhance their abilities. Monks can also heal allies while simultaneously dealing damage to enemies.';
        case 'Druid':
          return 'Druids are versatile fighters capable of filling nearly any role: healer, tank, or damage dealer. It’s crucial for druids to adapt their style to the current battle situation, as each role serves a specific purpose.';
        case 'Demon Hunter':
          return 'Demon Hunters eschew heavy armor in favor of speed, closing in quickly to slash enemies with one-handed weapons. However, the Illidari must also use this agility defensively to ensure battles end in their favor.';
        case 'Death Knight':
          return 'Death knights face foes with melee attacks, supplementing their weapon strikes with dark magic that weakens enemies or deals damage with unholy power. They draw enemies into one-on-one fights, preventing them from targeting weaker allies. To keep foes within reach, death knights must stay mindful of the powers they draw from runes and maintain the right rhythm for their attacks.';
        case 'Evoker':
          return 'Evokers have special empowered abilities that can be charged to alter the strength of the spell or ability they’re casting. Wise evokers leverage these empowered spells, fighting at medium range, scorching enemies with fiery breaths or healing allies to keep them in the fight.';
        default:
          return 'Class description not available.';
      }
    }
  }
}
</script>

<style scoped>
.class-info-container {
font-family: 'Cinzel', serif;
background-size: cover;
background-position: center;
padding: 2rem;
border-radius: 12px;
color: #ffffff;
text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
background: rgba(0, 0, 0, 0.6); /* Semi-transparent overlay */
backdrop-filter: blur(8px) saturate(180%);
-webkit-backdrop-filter: blur(8px) saturate(180%);
border: 2px solid #c9b37f; /* Golden border */
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 10px rgba(201, 179, 127, 0.5);
margin-top: 2rem;
width: 100%;
max-width: 800px;
position: relative;
overflow: hidden;
animation: fadeIn 1s ease-in-out;
}

h2 {
font-size: 1.8rem;
color: #c9b37f;
margin-bottom: 1rem;
text-align: center;
text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

h3 {
font-size: 1.4rem;
color: #c9b37f;
margin-top: 1.5rem;
margin-bottom: 0.5rem;
text-align: center;
}

.class-description,
.combat-strategy {
font-size: 1rem;
line-height: 1.5;
text-align: left; /* Changed from justify to left */
hyphens: auto; /* Allows hyphenation for long words */
-webkit-hyphens: auto; /* Webkit support */
-moz-hyphens: auto; /* Firefox support */
word-spacing: 0; /* Ensures default word spacing */
}
</style>