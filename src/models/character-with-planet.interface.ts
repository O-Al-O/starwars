export interface CharacterWithPlanet {
  characterName: string;
  originPlanet: {
    name: string;
    population: string;
    climate: string;
    weather?: { description: string; temperature: { current: string; max: string; }; humidity: number };
  };
}