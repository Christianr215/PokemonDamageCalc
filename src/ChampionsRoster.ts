const toId = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Reg M-C legal Pokémon. Megas aren't listed separately
const ROSTER = `
Abomasnow, Absol, Aegislash, Aerodactyl, Aggron, Alakazam, Alcremie, Altaria,
Ampharos, Annihilape, Appletun, Araquanid, Arbok, Arboliva, Arcanine, Archaludon,
Ariados, Armarouge, Aromatisse, Audino, Aurorus, Avalugg, Azumarill, Banette,
Barbaracle, Basculegion, Bastiodon, Baxcalibur, Beartic, Beedrill, Bellibolt,
Blastoise, Blaziken, Camerupt, Castform, Ceruledge, Chandelure, Charizard,
Chesnaught, Chimecho, Cinderace, Clawitzer, Clefable, Cofagrigus, Conkeldurr,
Corviknight, Crabominable, Decidueye, Dedenne, Delphox, Diggersby, Ditto,
Dragalge, Dragapult, Dragonite, Drampa, Eelektross, Emboar, Emolga, Empoleon,
Espathra, Espeon, Excadrill, Falinks, Farfetch'd, Farfetch'd Galar, Farigiraf,
Feraligatr, Flapple, Flareon, Floette, Florges, Forretress, Froslass, Furfrou,
Gallade, Garbodor, Garchomp, Gardevoir, Garganacl, Gengar, Gholdengo, Glaceon,
Glalie, Glimmora, Gliscor, Gogoat, Golisopod, Golurk, Goodra, Gourgeist,
Grapploct, Greninja, Grimmsnarl, Gyarados, Hatterene, Hawlucha, Heliolisk,
Heracross, Hippowdon, Houndoom, Houndstone, Hydrapple, Hydreigon, Incineroar,
Indeedee, Indeedee Female, Indeedee Male, Infernape, Inteleon, Jolteon,
Kangaskhan, Kingambit, Kleavor, Klefki, Kommo O, Krookodile, Leafeon, Liepard,
Lopunny, Lucario, Luxray, Lycanroc, Mabosstiff, Machamp, Malamar, Mamoswine,
Manectric, Maushold, Mawile, Medicham, Meganium, Meowscarada, Meowstic,
Metagross, Milotic, Mimikyu, Morpeko, Mr Mime, Mr Mime Galar, Mr Rime, Mudsdale,
Musharna, Ninetales, Noivern, Oranguru, Orthworm, Overqwil, Palafin, Pangoro,
Passimian, Patrat, Pawmot, Pelipper, Perrserker, Persian, Persian Alola,
Pidgeot, Pikachu, Pincurchin, Pinsir, Politoed, Polteageist, Primarina, Pyroar,
Quaquaval, Qwilfish, Raichu, Rampardos, Reuniclus, Rhyperior, Rillaboom,
Roserade, Rotom, Runerigus, Sableye, Salamence, Salazzle, Samurott, Sandaconda,
Sceptile, Scizor, Scolipede, Scovillain, Scrafty, Serperior, Sharpedo, Simipour,
Simisage, Simisear, Sinistcha, Sirfetch'd, Skarmory, Skeledirge, Slowbro,
Slowking, Slurpuff, Sneasler, Snorlax, Spiritomb, Squawkabilly, Staraptor,
Starmie, Steelix, Stunfisk, Swalot, Swampert, Sylveon, Talonflame, Tauros,
Thievul, Tinkaton, Torkoal, Torterra, Toucannon, Toxapex, Toxicroak, Toxtricity,
Toxtricity Amped, Toxtricity Low Key, Trevenant, Tsareena, Typhlosion, Tyranitar,
Tyrantrum, Umbreon, Vanilluxe, Vaporeon, Venusaur, Victreebel, Vileplume,
Vivillon, Volcarona, Weavile, Whimsicott, Wigglytuff, Wyrdeer, Zoroark
`
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const legalIds = new Set(ROSTER.map(toId));

// Returns the part of the name that matched the roster:
// "Arcanine-Hisui" -> "Arcanine", "Kommo-o" -> "Kommo", illegal -> null
function matchBase(name: string): string | null {
  let n = name;
  while (true) {
    if (legalIds.has(toId(n))) return n;
    const i = n.lastIndexOf('-');
    if (i < 0) return null;
    n = n.slice(0, i);
  }
}

export const isChampionsLegal = (name: string) => matchBase(name) !== null;

const FORM_WORDS: Record<string, string> = {
  Hisui: 'Hisuian',
  Alola: 'Alolan',
  Galar: 'Galarian',
  Paldea: 'Paldean',
  F: 'Female',
  M: 'Male',
};

// "Arcanine-Hisui" -> "Arcanine (Hisuian)", "Charizard-Mega-X" -> "Charizard (Mega X)"
export function speciesLabel(name: string): string {
  const base = matchBase(name) ?? name;
  const rest = name.slice(base.length).replace(/^-/, '');
  if (!rest) return base;
  const words = rest.split('-').map((w) => FORM_WORDS[w] ?? w);
  return `${base} (${words.join(' ')})`;
}