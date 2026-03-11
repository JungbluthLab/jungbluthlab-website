import type { EraId } from './constants';

export interface NPCContent {
  label: string;
  dialogue: string[];
  skinColor: string;
  shirtColor: string;
  hatColor?: string;
}

export interface NPC {
  id: string;
  x: number;
  y: number;
  dir: number;
  eras: Partial<Record<EraId, NPCContent>>;
}

export const NPCS: NPC[] = [
  {
    id: 'fisher', x: 70, y: 60, dir: 3,
    eras: {
      codfish: {
        label: 'Fisherman',
        dialogue: [
          "We salt and dry the cod right on those flake yards!",
          "Our fleet sails to Alaska every spring for the cod banks.",
          "We ship dried codfish all over the world from this wharf.",
        ],
        skinColor: '#deb887', shirtColor: '#8B7355', hatColor: '#6a4a2a',
      },
    },
  },
  {
    id: 'sailor', x: 66, y: 50, dir: 0,
    eras: {
      navy: {
        label: 'Sailor',
        dialogue: [
          "Those nets stretch clear across the Golden Gate!",
          "Each buoy weighs 680 pounds — takes a crane to move 'em.",
          "The gate opens once a day to let ships through.",
        ],
        skinColor: '#deb887', shirtColor: '#ffffff', hatColor: '#2a3a6a',
      },
    },
  },
  {
    id: 'scientist1', x: 62, y: 40, dir: 2,
    eras: {
      modern: {
        label: 'Researcher',
        dialogue: [
          "The kelp mesocosms are showing promising results!",
          "We can simulate decades of ocean change in these tanks.",
        ],
        skinColor: '#c68642', shirtColor: '#f0f0f0',
      },
    },
  },
  {
    id: 'scientist2', x: 32, y: 38, dir: 0,
    eras: {
      modern: {
        label: 'Marine Biologist',
        dialogue: [
          "Did you know SF Bay has over 500 species?",
          "Our monitoring station takes readings every 15 minutes.",
        ],
        skinColor: '#deb887', shirtColor: '#f0f0f0',
      },
    },
  },
  {
    id: 'guard', x: 20, y: 84, dir: 3,
    eras: {
      navy: {
        label: 'Guard',
        dialogue: [
          "This station is classified. Stay on the road, sailor!",
          "The net depot is critical to the war effort.",
          "No cameras allowed on the premises!",
        ],
        skinColor: '#deb887', shirtColor: '#4a5a3a', hatColor: '#3a4a2a',
      },
      modern: {
        label: 'Groundskeeper',
        dialogue: [
          "Welcome to the EOS Center! Enjoy the campus.",
          "We have Smithsonian and SFSU labs on site.",
          "Keep an eye out for hawks on the hillside!",
        ],
        skinColor: '#8d5524', shirtColor: '#2d5a27',
      },
    },
  },
  {
    id: 'cooper', x: 68, y: 50, dir: 3,
    eras: {
      codfish: {
        label: 'Barrel Cooper',
        dialogue: [
          "I make the barrels for packing the salt cod.",
          "Each barrel holds about 200 pounds of dried fish.",
        ],
        skinColor: '#deb887', shirtColor: '#8B7355', hatColor: '#6a4a2a',
      },
    },
  },
  {
    id: 'captain', x: 90, y: 54, dir: 0,
    eras: {
      codfish: {
        label: 'Schooner Captain',
        dialogue: [
          "My schooner sails for Alaska at first light!",
          "Two thousand miles to the cod banks and back again.",
          "Lynde and Hough run 19 vessels out of this port.",
        ],
        skinColor: '#c68642', shirtColor: '#2a3a5a', hatColor: '#1a2a3a',
      },
    },
  },
  {
    id: 'networker', x: 56, y: 52, dir: 2,
    eras: {
      navy: {
        label: 'Net Assembler',
        dialogue: [
          "These steel cables weigh a ton — literally!",
          "We assemble the nets right here on the slab.",
          "The Toonerville Trolley hauls the finished nets to the wharf.",
        ],
        skinColor: '#deb887', shirtColor: '#4a5a3a', hatColor: '#3a4a2a',
      },
    },
  },
  {
    id: 'officer', x: 40, y: 12, dir: 0,
    eras: {
      navy: {
        label: 'Navy Officer',
        dialogue: [
          "The Officers' Mess has the best murals on base.",
          "This station was a codfish operation before the Navy.",
        ],
        skinColor: '#deb887', shirtColor: '#2a3a6a', hatColor: '#1a2a4a',
      },
    },
  },
  {
    id: 'radioman', x: 60, y: 58, dir: 1,
    eras: {
      navy: {
        label: 'Radioman',
        dialogue: [
          "Communications are vital — enemy subs are out there.",
          "We track every ship entering the Golden Gate.",
        ],
        skinColor: '#c68642', shirtColor: '#4a5a3a', hatColor: '#3a4a2a',
      },
    },
  },
  {
    id: 'student', x: 62, y: 42, dir: 2,
    eras: {
      modern: {
        label: 'Grad Student',
        dialogue: [
          "I'm studying eelgrass restoration for my thesis.",
          "The greenhouse pumps in real seawater from the bay!",
        ],
        skinColor: '#8d5524', shirtColor: '#f0f0f0',
      },
    },
  },
  {
    id: 'docent', x: 48, y: 52, dir: 0,
    eras: {
      modern: {
        label: 'Campus Docent',
        dialogue: [
          "Welcome! This campus has over 140 years of history.",
          "Did you know the Golden Gate Bridge cables were spun here?",
          "Check out the old Navy murals in the Bay Conference Center!",
        ],
        skinColor: '#deb887', shirtColor: '#2d5a27',
      },
    },
  },
];

export function getVisibleNPCs(era: EraId): NPC[] {
  return NPCS.filter(n => n.eras[era] !== undefined);
}
