// Datos iniciales editables. Verifica y ajusta con el parche actual del juego.
export const CHARACTERS = [
  { slug: "jinhsi", name: "Jinhsi", rarity: 5, element: "Spectro", weaponType: "Broadblade", role: "Main DPS",
    description: "Magistrada de Jinzhou. Daño Spectro con gran potencial de burst en ventanas cortas.",
    keyStats: [{ stat: "CRIT Rate", priority: 5, note: "Meta 60-70%" }, { stat: "CRIT DMG", priority: 5, note: "Mantén ratio 1:2" }, { stat: "ATK%", priority: 4 }, { stat: "Energy Regen", priority: 3, note: "~120-125%" }] },
  { slug: "changli", name: "Changli", rarity: 5, element: "Fusion", weaponType: "Sword", role: "Main DPS",
    description: "Pirotecnia y combos encadenados; brilla en equipos Fusion con Sub-DPS dedicado.",
    keyStats: [{ stat: "CRIT Rate", priority: 5 }, { stat: "CRIT DMG", priority: 5 }, { stat: "ATK%", priority: 4 }, { stat: "Energy Regen", priority: 3 }] },
  { slug: "camellya", name: "Camellya", rarity: 5, element: "Havoc", weaponType: "Sword", role: "Main DPS",
    description: "Daño Havoc sostenido con alta exigencia de rotación.",
    keyStats: [{ stat: "CRIT Rate", priority: 5 }, { stat: "CRIT DMG", priority: 5 }, { stat: "ATK%", priority: 4 }, { stat: "Basic ATK DMG%", priority: 3 }] },
  { slug: "carlotta", name: "Carlotta", rarity: 5, element: "Glacio", weaponType: "Pistols", role: "Main DPS",
    description: "Tiradora Glacio de gran daño en ráfagas con ventanas de ultimate.",
    keyStats: [{ stat: "CRIT Rate", priority: 5 }, { stat: "CRIT DMG", priority: 5 }, { stat: "ATK%", priority: 4 }, { stat: "Energy Regen", priority: 3 }] },
  { slug: "shorekeeper", name: "Shorekeeper", rarity: 5, element: "Spectro", weaponType: "Rectifier", role: "Healer / Support",
    description: "Soporte y sanadora con buffs de CRIT para el equipo.",
    keyStats: [{ stat: "Energy Regen", priority: 5, note: "Prioridad máxima" }, { stat: "HP%", priority: 4 }, { stat: "CRIT Rate", priority: 3 }, { stat: "Healing Bonus", priority: 3 }] },
  { slug: "xiangli-yao", name: "Xiangli Yao", rarity: 5, element: "Electro", weaponType: "Gauntlets", role: "Main DPS",
    description: "Daño Electro con combos rápidos y gran sinergia con Resonance Liberation.",
    keyStats: [{ stat: "CRIT Rate", priority: 5 }, { stat: "CRIT DMG", priority: 5 }, { stat: "ATK%", priority: 4 }, { stat: "Energy Regen", priority: 3 }] },
  { slug: "yinlin", name: "Yinlin", rarity: 5, element: "Electro", weaponType: "Rectifier", role: "Sub-DPS",
    description: "Sub-DPS Electro con marcas de Punishment y daño fuera de campo.",
    keyStats: [{ stat: "CRIT Rate", priority: 5 }, { stat: "Energy Regen", priority: 4 }, { stat: "CRIT DMG", priority: 4 }, { stat: "ATK%", priority: 4 }] },
  { slug: "verina", name: "Verina", rarity: 5, element: "Spectro", weaponType: "Rectifier", role: "Healer / Support",
    description: "Sanadora clásica con buff de ATK para el equipo.",
    keyStats: [{ stat: "Energy Regen", priority: 5 }, { stat: "ATK%", priority: 4 }, { stat: "Healing Bonus", priority: 3 }, { stat: "CRIT Rate", priority: 2 }] },
] as const;

// Builds oficiales de ejemplo por slug (sets de ecos: nombres ajustables)
export const OFFICIAL_BUILDS: Record<string, {
  title: string; description: string; weapon: string;
  echoSets: { name: string; pieces: "2" | "3" | "5" }[];
  mainStats: { cost4: string; cost3: string; cost1: string }; subStats: string[];
}> = {
  jinhsi: { title: "Burst Spectro estándar", weapon: "Arma 5★ de Broadblade",
    description: "Maximiza CRIT y ATK%. Prioriza Resonance Liberation DMG% en sub-stats.",
    echoSets: [{ name: "Celestial Light", pieces: "5" }],
    mainStats: { cost4: "CRIT Rate / CRIT DMG", cost3: "Spectro DMG%", cost1: "ATK%" },
    subStats: ["CRIT Rate", "CRIT DMG", "ATK%", "Resonance Liberation DMG%", "Energy Regen"] },
  changli: { title: "Fusion Carry", weapon: "Arma 5★ de Sword",
    description: "Ratio CRIT 1:2 y Energy Regen suficiente para el ciclo de ultimate.",
    echoSets: [{ name: "Molten Rift", pieces: "5" }],
    mainStats: { cost4: "CRIT Rate / CRIT DMG", cost3: "Fusion DMG%", cost1: "ATK%" },
    subStats: ["CRIT Rate", "CRIT DMG", "ATK%", "Heavy ATK DMG%", "Energy Regen"] },
  shorekeeper: { title: "Soporte de Energía", weapon: "Arma de Rectifier",
    description: "Energy Regen alto para alimentar al equipo; el HP% mejora la sanación.",
    echoSets: [{ name: "Rejuvenating Glow", pieces: "5" }],
    mainStats: { cost4: "Healing Bonus", cost3: "Energy Regen", cost1: "HP%" },
    subStats: ["Energy Regen", "HP%", "CRIT Rate", "Resonance Liberation DMG%"] },
};
