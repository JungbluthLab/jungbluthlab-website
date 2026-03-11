import type { EraId } from './constants';

export interface EraContent {
  name: string;
  description: string;
  funFact: string;
  visible: boolean;
  style?: 'wood' | 'brick' | 'navy' | 'modern' | 'science' | 'landmark' | 'boat' | 'feature';
}

export interface BuildingDef {
  id: string;
  x: number; // tile x
  y: number; // tile y
  w: number; // width in tiles
  h: number; // height in tiles
  number?: string; // building number label
  eras: Record<EraId, EraContent>;
}

export const BUILDINGS: BuildingDef[] = [
  // ── Historic campus buildings ──────────────────────────────
  {
    id: 'bldg20', x: 20, y: 76, w: 4, h: 3, number: '20',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: "CO's Quarters (Bldg 20)",
        description: "Built in 1904 when the Navy bought this peninsula for $80,000. The most prestigious residence on the station, home to the Commanding Officer.",
        funFact: "The Navy bought the entire 53-acre site for just $80,000 — about $2.6 million today.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'Ohrenschall Guest House (Bldg 20)',
        description: "The oldest building on campus (1904), now a guest house for visiting researchers and dignitaries.",
        funFact: "This is the oldest surviving building on campus, built the year the Navy purchased the entire 53-acre site.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg22', x: 60, y: 42, w: 4, h: 3, number: '22',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Power Plant (Bldg 22)',
        description: "The station's brick power plant and boiler house. Its distinctive circular windows are unique among campus buildings.",
        funFact: "This is the only brick building on the entire 53-acre campus.",
        visible: true, style: 'brick',
      },
      modern: {
        name: 'Blacksmith / Power Plant (Bldg 22)',
        description: "The only brick building on campus, now used for fire department training. Note the unusual circular porthole windows.",
        funFact: "Its round porthole windows give it a distinctly nautical character unique among all campus buildings.",
        visible: true, style: 'brick',
      },
    },
  },
  {
    id: 'bldg30', x: 30, y: 36, w: 5, h: 3, number: '30',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Galley & Mess Hall (Bldg 30)',
        description: "Where hundreds of sailors ate their meals. Originally built as barracks in 1917, converted to a mess hall during WWII.",
        funFact: "This building has served as barracks, galley, and mess hall before becoming a research center.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'Smithsonian Research (Bldg 30)',
        description: "Part of the Smithsonian Institution's global network, conducting research on coastal ecosystems and environmental change.",
        funFact: "From feeding sailors to feeding scientific knowledge — this building's journey spans over a century.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg33', x: 26, y: 42, w: 4, h: 3, number: '33',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Station HQ (Bldg 33)',
        description: "Administrative nerve center of both the Fuel Depot and Net Depot eras. All station operations were coordinated here.",
        funFact: "The only building that served as headquarters continuously through both the Fuel Depot and Net Depot eras.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'Former HQ (Bldg 33)',
        description: "This 1919 building served as the administrative center through multiple military eras but now sits vacant, awaiting its next chapter.",
        funFact: "It witnessed the transition from fuel depot to net depot in 1940 and kept its headquarters role through both.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg36', x: 50, y: 50, w: 10, h: 5, number: '36',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Net Depot Warehouse (Bldg 36)',
        description: "This massive 30,900 sq ft warehouse was the industrial heart of the Net Depot. Workers cast submarine net weights here during WWII.",
        funFact: "Workers here cast the heavy weights anchoring submarine nets across the Golden Gate — defending SF Bay from enemy subs.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'EOS Center (Bldg 36)',
        description: "The campus's largest building (30,900 sq ft), now a hub for research, education, and community events at the Estuary & Ocean Science Center.",
        funFact: "During WWII, this building helped defend San Francisco Bay — workers cast concrete weights for anti-submarine nets here.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg37', x: 28, y: 28, w: 4, h: 3, number: '37',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Navy Dispensary (Bldg 37)',
        description: "The station's medical facility, providing healthcare to sailors assembling dangerous submarine nets.",
        funFact: "Net assembly involved heavy steel cables and massive buoys — the dispensary saw its share of injuries.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'Former Dispensary (Bldg 37)',
        description: "This WWII-era medical building now sits vacant. One of several campus buildings eligible for the National Register of Historic Places.",
        funFact: "This small building once cared for hundreds of sailors doing dangerous work with heavy steel nets and cables.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg39', x: 22, y: 26, w: 5, h: 3, number: '39',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: "Officers' Quarters (Bldg 39)",
        description: "Housing for unmarried officers. They enjoyed bay and Angel Island views from this hillside location.",
        funFact: "Officers here had some of the best views on the entire station — straight across to Angel Island.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'NERR Admin (Bldg 39)',
        description: "Home to the SF Bay National Estuarine Research Reserve, one of 30 reserves in a nationwide NOAA network protecting estuarine habitats.",
        funFact: "From officers' quarters to estuarine research HQ — this building now helps protect the very bay its former occupants gazed upon.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg49', x: 18, y: 54, w: 5, h: 3, number: '49',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Enlisted Barracks (Bldg 49)',
        description: "Housing for enlisted sailors, featuring a second-floor bowling alley for off-duty entertainment.",
        funFact: "Imagine sailors rolling strikes upstairs between shifts of assembling anti-submarine nets!",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'Facilities Mgmt (Bldg 49)',
        description: "Its glory days as a sailors' barracks with a bowling alley are past, but it still serves the campus practically.",
        funFact: "This barracks had a bowling alley on the second floor for off-duty sailors — pins and submarines!",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg50', x: 24, y: 54, w: 5, h: 3, number: '50',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Enlisted Barracks (Bldg 50)',
        description: "Another barracks with recreational facilities for sailors stationed at the Net Depot.",
        funFact: "A 'USE BOWLING SHOES ONLY' sign from the 1940s is reportedly still visible inside.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'Storage (Bldg 50)',
        description: "Now used for storage, but the original 'USE BOWLING SHOES ONLY' sign from the Navy era is said to still be visible inside.",
        funFact: "The 1940s bowling shoe sign is a ghost of sailors' off-duty fun — if you could peek inside, you might spot it.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg53', x: 40, y: 10, w: 6, h: 3, number: '53',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: "Officers' Mess & Bar (Bldg 53)",
        description: "Where officers dined and socialized. The bar featured murals painted by Navy personnel, some of which survive today.",
        funFact: "Navy-era murals painted by service members still decorate the walls — rare surviving wartime art.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'Bay Conference Center (Bldg 53)',
        description: "A popular venue for conferences and events, still adorned with WWII-era murals from its days as the Officers' Bar.",
        funFact: "Navy murals from the 1940s still decorate the walls — a rare example of wartime artistic expression.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg54', x: 56, y: 58, w: 5, h: 4, number: '54',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Theater (Bldg 54)',
        description: "This striking Streamline Moderne / Bauhaus building served as the station's entertainment venue. Named for Lt. John D. De Fries.",
        funFact: "Its 3-story control tower and Bauhaus design make it the most architecturally significant building on campus.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'De Fries Theatre (Bldg 54)',
        description: "This architecturally distinctive 3-story building with a control tower now houses fish physiology research. The campus's most striking structure.",
        funFact: "With Streamline Moderne design and a control tower, it's the most architecturally significant building on campus.",
        visible: true, style: 'modern',
      },
    },
  },
  {
    id: 'bldg75', x: 34, y: 44, w: 2, h: 2, number: '75',
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Water Tower (Bldg 75)',
        description: "Supplied fresh water to the entire station. Its cylindrical shape made it a visual landmark across the base.",
        funFact: "This tower has stood watch through the campus's transformation from military base to research center.",
        visible: true, style: 'landmark',
      },
      modern: {
        name: 'Water Tower (Bldg 75)',
        description: "No longer in active use, this iconic cylindrical tower is visible from across campus — a symbol of the site's Navy heritage.",
        funFact: "It has outlasted many buildings it once supplied, standing sentinel through decades of change.",
        visible: true, style: 'landmark',
      },
    },
  },
  {
    id: 'greenhouse', x: 64, y: 38, w: 4, h: 3,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: {
        name: 'Greenhouse',
        description: "Built by SFSU for botanical and marine biology research. Located near the waterfront for easy access to bay water.",
        funFact: "Its proximity to the bay allows researchers to pump in natural seawater for their experiments.",
        visible: true, style: 'science',
      },
    },
  },
  {
    id: 'boatramp', x: 72, y: 62, w: 3, h: 3,
    eras: {
      codfish: {
        name: 'Lynde & Hough Dock',
        description: "Where the codfish fleet launched and landed. At its peak, the company operated 19 sailing vessels from this point.",
        funFact: "This spot has launched vessels for three different purposes over 140+ years: codfish schooners, Navy boats, and research vessels.",
        visible: true, style: 'wood',
      },
      navy: {
        name: 'Navy Launch Ramp',
        description: "Used to launch and recover small vessels supporting net depot operations across San Francisco Bay.",
        funFact: "From codfish schooners to Navy launches — this ramp has served the water for over a century.",
        visible: true, style: 'navy',
      },
      modern: {
        name: 'Boat Launch',
        description: "Used daily for launching the R/V Questuary and other research vessels for estuary sampling and student training.",
        funFact: "Three eras, three fleets: codfish schooners, Navy launches, and now research vessels all launched from here.",
        visible: true, style: 'modern',
      },
    },
  },

  // ── Codfish-era objects ──────────────────────────────
  {
    id: 'fish_warehouse', x: 68, y: 46, w: 5, h: 4,
    eras: {
      codfish: {
        name: 'Pioneer Fish Warehouse',
        description: "The massive wharf building where salted cod from Alaska was dried, processed, packed in barrels, and shipped worldwide.",
        funFact: "At its peak in the 1880s, Lynde & Hough processed over 2 million pounds of codfish annually here.",
        visible: true, style: 'wood',
      },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: { name: '', description: '', funFact: '', visible: false },
    },
  },
  {
    id: 'flake_yards', x: 62, y: 42, w: 6, h: 3,
    eras: {
      codfish: {
        name: 'Cod Drying Flake Yards',
        description: "Open-air wooden racks where split, salted codfish were laid out to cure in the sun and salt breeze for several days.",
        funFact: "The word 'flake' comes from Old Norse — connecting California's cod trade to centuries-old Scandinavian fishing traditions.",
        visible: true, style: 'feature',
      },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: { name: '', description: '', funFact: '', visible: false },
    },
  },
  {
    id: 'schooners', x: 90, y: 52, w: 3, h: 2,
    eras: {
      codfish: {
        name: 'Codfish Fleet',
        description: "Lynde & Hough's fleet of 19 sailing schooners that voyaged to Alaska each spring, returning laden with salted cod.",
        funFact: "Each spring the fleet sailed 2,000+ miles to Alaska's cod banks, spending months at sea before returning.",
        visible: true, style: 'boat',
      },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: { name: '', description: '', funFact: '', visible: false },
    },
  },
  {
    id: 'brick_kiln', x: 14, y: 82, w: 3, h: 2,
    eras: {
      codfish: {
        name: 'Historic Brick Kiln Site',
        description: "Before the codfish era, this site had a brick-making operation. Fragments of locally-made bricks still wash up at low tide.",
        funFact: "You can still find pre-1860s brick fragments on the beach — tangible pieces of the site's earliest industry, 160+ years old.",
        visible: true, style: 'feature',
      },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: { name: '', description: '', funFact: '', visible: false },
    },
  },

  // ── Navy-era objects ──────────────────────────────
  {
    id: 'sub_nets', x: 66, y: 48, w: 8, h: 4,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Anti-Submarine Nets',
        description: "Massive steel nets assembled on 'the slab' and stretched across the Golden Gate to protect SF Bay from Japanese submarines in WWII.",
        funFact: "The net stretched 4,700 feet across the Golden Gate and hung 100 feet deep, opened and closed daily for ship traffic.",
        visible: true, style: 'feature',
      },
      modern: { name: '', description: '', funFact: '', visible: false },
    },
  },
  {
    id: 'buoy_yard', x: 68, y: 56, w: 5, h: 3,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Buoy Storage Yard',
        description: "Rows of 680-pound spherical steel buoys, each supporting 1.5 tons of netting. Hundreds stored here between deployments.",
        funFact: "Each buoy had to withstand the Golden Gate's tidal currents — some of the strongest on Earth.",
        visible: true, style: 'feature',
      },
      modern: { name: '', description: '', funFact: '', visible: false },
    },
  },
  {
    id: 'trolley', x: 60, y: 58, w: 5, h: 2,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'The Toonerville Trolley',
        description: "A repurposed coal-hauling narrow-gauge railway used to transport assembled nets from the slab to the wharf.",
        funFact: "Named after a famous cartoon strip, this improvised railway moved nets too heavy for sailors to carry by hand.",
        visible: true, style: 'feature',
      },
      modern: { name: '', description: '', funFact: '', visible: false },
    },
  },
  {
    id: 'bldg51', x: 46, y: 58, w: 5, h: 3,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: {
        name: 'Roebling Warehouse (Bldg 51)',
        description: "In 1933, John A. Roebling's Sons Company spun the massive cables for the Golden Gate Bridge in this building. Demolished 1986.",
        funFact: "The same site where Golden Gate Bridge cables were spun later helped protect the bridge's channel with anti-sub nets.",
        visible: true, style: 'navy',
      },
      modern: { name: '', description: '', funFact: '', visible: false },
    },
  },

  // ── Modern-era marine science objects ──────────────────────────────
  {
    id: 'kelp_mesocosms', x: 66, y: 38, w: 3, h: 2,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: {
        name: 'Kelp Forest Mesocosms',
        description: "Large tanks simulating kelp forest ecosystems. Scientists study how kelp forests respond to warming waters and environmental stressors.",
        funFact: "These tanks can recreate ocean conditions from different decades — essentially time-traveling to study kelp forest changes.",
        visible: true, style: 'science',
      },
    },
  },
  {
    id: 'eelgrass', x: 76, y: 62, w: 3, h: 2,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: {
        name: 'Eelgrass Restoration Beds',
        description: "Experimental nursery for growing eelgrass (Zostera marina), a critical SF Bay habitat plant. Seedlings are transplanted to restoration sites.",
        funFact: "Each tiny plant grown here could help restore habitat for hundreds of species of fish and invertebrates.",
        visible: true, style: 'science',
      },
    },
  },
  {
    id: 'starfish', x: 58, y: 60, w: 3, h: 2,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: {
        name: 'Sea Star Hatchery',
        description: "Breeding facility supporting recovery of sea star populations devastated by Wasting Syndrome, which killed millions along the Pacific Coast.",
        funFact: "Sea Star Wasting Syndrome wiped out an estimated 5.75 billion sea stars from Alaska to Mexico.",
        visible: true, style: 'science',
      },
    },
  },
  {
    id: 'questuary', x: 90, y: 54, w: 3, h: 2,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: {
        name: 'R/V Questuary',
        description: "The campus research vessel, used for estuary sampling, student training, and water quality monitoring throughout SF Bay.",
        funFact: "The name 'Questuary' is a portmanteau of 'quest' and 'estuary' — reflecting its mission to explore the bay.",
        visible: true, style: 'boat',
      },
    },
  },
  {
    id: 'water_station', x: 82, y: 50, w: 2, h: 2,
    eras: {
      codfish: { name: '', description: '', funFact: '', visible: false },
      navy: { name: '', description: '', funFact: '', visible: false },
      modern: {
        name: 'Water Quality Station',
        description: "Automated monitoring of SF Bay water temperature, salinity, dissolved oxygen, and nutrients — data feeds into national databases.",
        funFact: "This station takes measurements every 15 minutes, 24/7, generating 35,000+ data points annually.",
        visible: true, style: 'science',
      },
    },
  },
];

/** Get buildings/objects visible in the given era */
export function getVisibleBuildings(era: EraId): BuildingDef[] {
  return BUILDINGS.filter((b) => b.eras[era].visible);
}

/** Count total interactable objects in an era */
export function countForEra(era: EraId): number {
  return BUILDINGS.filter((b) => b.eras[era].visible).length;
}
