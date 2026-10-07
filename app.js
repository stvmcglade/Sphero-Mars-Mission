const canvas = document.querySelector("#arenaCanvas");
const ctx = canvas.getContext("2d");
const missionSelect = document.querySelector("#missionSelect");
const missionTitle = document.querySelector("#missionTitle");
const missionBrief = document.querySelector("#missionBrief");
const missionStatus = document.querySelector("#missionStatus");
const scoreReadout = document.querySelector("#scoreReadout");
const objectiveList = document.querySelector("#objectiveList");
const codeEditor = document.querySelector("#codeEditor");
const logOutput = document.querySelector("#logOutput");
const runBtn = document.querySelector("#runBtn");
const stopBtn = document.querySelector("#stopBtn");
const resetBtn = document.querySelector("#resetBtn");
const resetCodeBtn = document.querySelector("#resetCodeBtn");
const hintBtn = document.querySelector("#hintBtn");
const hintOutput = document.querySelector("#hintOutput");
const storyOutput = document.querySelector("#storyOutput");
const compassNeedle = document.querySelector("#compassNeedle");
const headingReadout = document.querySelector("#headingReadout");
const mentorOverlay = document.querySelector("#mentorOverlay");
const studentNameInput = document.querySelector("#studentNameInput");
const saveNameBtn = document.querySelector("#saveNameBtn");
const mentorReadout = document.querySelector("#mentorReadout");
const rankWordOutput = document.querySelector("#rankWordOutput");
const rankGuessBtn = document.querySelector("#rankGuessBtn");
const rankGuessOutput = document.querySelector("#rankGuessOutput");

const WORLD = { width: 920, height: 620 };
const robotRadius = 22;
const missionCompleteDelay = 250;
const STORAGE_KEY = "sphero-mission-control-v2-progress";

const PLANETS = [
  {
    id: "mars", name: "Mars", type: "Rocky desert planet", terrain: "Red dunes, craters, and rocky outcrops",
    description: "Begin your expedition on a rust-red landscape. Learn to navigate, collect samples, and send signals while keeping your rover clear of the rocks.",
    accent: "#f7b267", floor: "#633821", floorEnd: "#39251d", edge: "#f7b267", grid: "rgba(247,178,103,.16)", sky: "#211b22", dust: "#d7a071",
    learning: "Write a sequence of movement and checkpoint commands.",
    names: ["Landing Zone Beacon Check", "Solar Relay Alignment", "Starter Sample Sweep", "Depot Route Test"],
    stories: [
      "Your rover has landed on Mars, but the landing team needs a safe unloading zone. Reach navigation beacon A, send its orange-blue signal, then find a route around the rocks to beacon B and send blue-blue. Your signals will confirm that the landing corridor is ready.",
      "Two solar relays near the Mars landing site have lost contact with base. Drive to the first relay and send blue-orange, then reach the second and send blue-white. Avoid the sand basin and scattered debris so the team can restore its communications link.",
      "The geology team has marked two sample sites near base. Collect a basalt rock sample, then a buried ice sample, in that order. Plan a route around the dust hazards so both samples reach the rover's science compartment safely.",
      "Tomorrow's survey needs equipment from two field stations. Collect the sealed sample tube, then the surface sensor pack. Keep clear of the rough terrain and deliver a working program that the supply team can reuse.",
    ],
  },
  {
    id: "glacia", name: "Glacia", type: "Ice planet", terrain: "Frozen plains, crystal ridges, and ice fissures",
    description: "Cross a pale-blue world of ice and towering crystals. The polar stations need your rover to reconnect their relays and recover supplies.",
    accent: "#99e6ff", floor: "#326679", floorEnd: "#173645", edge: "#b8f1ff", grid: "rgba(196,242,255,.17)", sky: "#142c40", dust: "#d4f4ff",
    learning: "Plan multi-stage routes and use the correct action at each checkpoint.",
    names: ["Aurora Beacon Survey", "Frozen Relay Rescue", "Crystal Core Retrieval", "Polar Shelter Supply"],
    stories: [
      "An aurora has disrupted Glacia's navigation network. Reach all three ice beacons in order and send the colour signal shown at each one. Steer around the crystal ridges so arriving supply rovers can follow a reliable route to the polar station.",
      "Glacia's remote research station has gone silent. Restore three frozen relays in sequence, then collect the stored data package from the return depot. Ice ridges block the direct route, so map your turns carefully before sending the rover out.",
      "The ice laboratory needs a crystal sample, an ice core, and a frost sample from three marked sites. Recover each one in order while keeping clear of the ice fissures. Your sample collection will help the station choose its next research area.",
      "A cold front is approaching the polar shelter. Collect a thermal cell and heater kit, signal the weather relay, then collect the shelter clearance tag. Navigate the frozen obstacles and get the supply checklist ready before the shelter crew heads out.",
    ],
  },
  {
    id: "verdantia", name: "Verdantia", type: "Forest planet", terrain: "Emerald groves, giant roots, and glowing plants",
    description: "Explore an imagined living world beneath a glowing canopy. Use loops and decisions to gather specimens and keep the research outposts connected.",
    accent: "#9ee3a7", floor: "#214e3d", floorEnd: "#112e2b", edge: "#95dd9d", grid: "rgba(160,232,180,.15)", sky: "#112c30", dust: "#b7dba9",
    learning: "Use a loop and an if / else decision to collect at early stops and signal at the final stop.",
    names: ["Canopy Supply Route", "Rainforest Relay Repair", "Glowspore Sample Sweep", "Habitat Sensor Trail"],
    labels: [["Seed Pod", "Leaf Sample", "Canopy Beacon"], ["Repair Kit", "Power Cell", "Jungle Relay"], ["Glowspore", "Moss Core", "Bio Signal"], ["Sensor Pack", "Root Sensor", "Habitat Gate"]],
    stories: [
      "Verdantia's canopy nursery is waiting for its first field delivery. Collect the seed pod and leaf sample, then send orange-blue at the canopy beacon. Build a loop that repeats the journey and uses a decision to change from collecting to signalling at the final stop.",
      "A fallen branch has interrupted the rainforest relay route. Recover a repair kit and power cell from the first two stations, then send orange-blue at the jungle relay. Your rover must follow a repeatable route between the root groves and choose the right action each time.",
      "Glowing plants have appeared along a new research trail. Collect a glowspore and moss core, then transmit orange-blue at the bio signal post. Use a loop and branching logic to make the rover collect specimens before reporting to the laboratory.",
      "The forest habitat needs replacement sensors before its next field survey. Collect the sensor pack and root sensor, then signal orange-blue at the habitat gate. Guide the rover between the groves using code that repeats movement but changes its task at the last stop.",
    ],
  },
  {
    id: "pyron", name: "Pyron", type: "Volcanic planet", terrain: "Lava channels, obsidian ridges, and ash fields",
    description: "Lead the final expedition across an imagined volcanic world. Design your own movement and decisions to finish four-stop missions between the lava fields.",
    accent: "#ff9b73", floor: "#38262f", floorEnd: "#1c1825", edge: "#ff9267", grid: "rgba(255,143,102,.16)", sky: "#2d192e", dust: "#dc927c",
    learning: "Complete the movement and action placeholders using a counted loop and if / else logic.",
    names: ["Heatshield Delivery", "Lava Ridge Mapping", "Obsidian Sample Chain", "Volcanic Uplink Finale"],
    labels: [["Heat Shield", "Coolant Cell", "Launch Tools", "Launch Beacon"], ["Repair Kit", "Mapping Probe", "Route Sensor", "Mapping Relay"], ["Obsidian Core", "Ash Sample", "Mineral Tube", "Survey Signal"], ["Data Capsule", "Power Cell", "Antenna Kit", "Earth Uplink"]],
    stories: [
      "Pyron's launch outpost needs protection for its next supply capsule. Collect the heat shield, coolant cell, and launch tools, then send blue-orange at the launch beacon. Complete your own route and branching logic while avoiding the lava channels and obsidian ridges.",
      "The mapping team is preparing a safe trail across a volcanic ridge. Collect the repair kit, mapping probe, and route sensor, then send blue-orange at the mapping relay. Turn the starter scaffold into a four-stop program that repeats movement and chooses the correct checkpoint task.",
      "Three specimen stations are ready for the final geology run: an obsidian core, an ash sample, and a mineral tube. Collect them in order, then send blue-orange at the survey signal post. Write your own loop and decisions to finish the chain without entering the lava fields.",
      "Your expedition's final transmission is waiting at Pyron's uplink station. Collect the data capsule, power cell, and antenna kit, then send blue-orange at the Earth uplink. Complete the four-stop route and deliver the program that brings the planetary expedition to a successful finish.",
    ],
  },
];

const missions = buildMissions();

function buildMissions() {
  const ranks = [
    { title: "Rank 1: Mars Landing Cadet", requiresLoop: false, requiresIfElse: false },
    { title: "Rank 2: Glacia Survey Operator", requiresLoop: false, requiresIfElse: false },
    { title: "Rank 3: Verdantia Research Specialist", requiresLoop: true, requiresIfElse: true },
    { title: "Rank 4: Pyron Mission Lead", requiresLoop: true, requiresIfElse: true },
  ];

  const routes = [
    {
      id: "beacons",
      theme: "mars",
      start: { x: 96, y: 520, heading: 0, color: "#f47b20" },
      points: [
        { x: 230, y: 445, label: "Beacon A", kind: "capsule", action: "flash", code: "orange-blue", objective: "Flash orange-blue at navigation beacon A" },
        { x: 500, y: 300, label: "Beacon B", kind: "capsule", action: "flash", code: "blue-blue", objective: "Flash blue-blue at navigation beacon B" },
        { x: 770, y: 145, label: "Beacon C", kind: "capsule", action: "flash", code: "orange-white", objective: "Flash orange-white at navigation beacon C" },
      ],
      decorations: [
        { kind: "command", x: 112, y: 470, label: "Base Camp" },
        { kind: "crater", x: 358, y: 225, size: 42 },
      ],
      moves: [
        [80, 330, 1.1],
        [80, 335, 2.3],
        [80, 335, 2.8],
      ],
    },
    {
      id: "relay",
      theme: "mars",
      start: { x: 140, y: 500, heading: 0, color: "#f47b20" },
      points: [
        { x: 140, y: 168, label: "Relay 1", kind: "satellite", action: "flash", code: "blue-orange", objective: "Transmit blue-orange to relay 1" },
        { x: 760, y: 168, label: "Relay 2", kind: "satellite", action: "flash", code: "blue-white", objective: "Transmit blue-white to relay 2" },
        { x: 760, y: 500, label: "Relay 3", kind: "satellite", action: "flash", code: "orange-orange", objective: "Transmit orange-orange to relay 3" },
        { x: 140, y: 500, label: "Depot", kind: "dock", action: "collect", objective: "Collect the data package from the return depot" },
      ],
      decorations: [
        { kind: "command", x: 132, y: 506, label: "Comms Hub" },
        { kind: "crater", x: 510, y: 298, size: 46 },
      ],
      moves: [
        [70, 270, 3.8],
        [70, 0, 7.5],
        [70, 90, 3.8],
        [70, 180, 7.5],
      ],
    },
    {
      id: "samples",
      theme: "mars",
      start: { x: 86, y: 92, heading: 0, color: "#f47b20" },
      points: [
        { x: 290, y: 120, label: "Rock", kind: "sample", action: "collect", objective: "Collect the basalt rock sample" },
        { x: 426, y: 482, label: "Ice", kind: "sample", action: "collect", objective: "Collect the buried ice sample" },
        { x: 792, y: 342, label: "Soil", kind: "sample", action: "collect", objective: "Collect the red soil sample" },
      ],
      decorations: [
        { kind: "habitat", x: 112, y: 96, label: "Lab" },
        { kind: "crater", x: 560, y: 250, size: 52 },
      ],
      moves: [
        [75, 8, 2.5],
        [75, 78, 4.8],
        [75, 340, 4.8],
      ],
    },
    {
      id: "return",
      theme: "mars",
      start: { x: 86, y: 520, heading: 0, color: "#f47b20" },
      points: [
        { x: 260, y: 500, label: "Tube", kind: "sample", action: "collect", objective: "Collect the sealed sample tube" },
        { x: 420, y: 365, label: "Sensor", kind: "sample", action: "collect", objective: "Collect the surface sensor pack" },
        { x: 610, y: 260, label: "Mast", kind: "satellite", action: "flash", code: "orange-blue-white", objective: "Flash orange-blue-white at the weather mast" },
        { x: 800, y: 175, label: "Capsule", kind: "dock", action: "collect", objective: "Collect the return capsule clearance tag" },
      ],
      decorations: [
        { kind: "habitat", x: 100, y: 500, label: "Depot" },
        { kind: "crater", x: 680, y: 430, size: 44 },
      ],
      moves: [
        [70, 354, 2.0],
        [70, 320, 2.8],
        [70, 335, 2.6],
        [70, 335, 2.6],
      ],
    },
  ];

  const rankNames = PLANETS.map(planet => planet.names);

  return ranks.flatMap((rank, rankIndex) =>
    routes.map((route, routeIndex) => {
      const missionRoute = rankIndex >= 2 ? makeYear8Route(route, routeIndex, rankIndex) : makeDifficultyRoute(route, rankIndex);
      const planet = PLANETS[rankIndex];
      const points = missionRoute.points.map((point, index) => {
        let label = planet.labels?.[routeIndex][index] || point.label;
        if (rankIndex === 1) {
          const glaciaLabels = [["Ice Beacon A", "Ice Beacon B", "Ice Beacon C"], ["Frozen Relay 1", "Frozen Relay 2", "Frozen Relay 3", "Return Depot"], ["Crystal", "Ice Core", "Frost Sample"], ["Thermal Cell", "Heater Kit", "Weather Relay", "Shelter Tag"]];
          label = glaciaLabels[routeIndex][index];
        }
        return {...point, label, r: point.kind === "dock" ? 32 : 28,
          objective: rankIndex === 0 ? point.objective : point.action === "flash" ? `Send ${point.code} at ${label}` : `Collect the ${label.toLowerCase()}`};
      });
      return {
        id: `rank-${rankIndex + 1}-${missionRoute.id}`,
        rank: rank.title,
        rankIndex,
        routeIndex,
        name: rankNames[rankIndex][routeIndex],
        brief: makeBrief(rankIndex, routeIndex, points),
        theme: planet.id,
        planet,
        start: missionRoute.start,
        beacons: points,
        hazards: makeObstacleLayout(rankIndex, routeIndex),
        decorations: missionRoute.decorations.map(item => ({...item, label: item.label ? `${planet.name} Base` : undefined})),
        story: makeStory(rankIndex, routeIndex),
        hint: makeHint(rankIndex, routeIndex, points),
        requiresLoop: rank.requiresLoop,
        requiresIfElse: rank.requiresIfElse,
        starter: makeStarter(rank.title, rankNames[rankIndex][routeIndex], points, missionRoute.moves, rank.requiresLoop, rank.requiresIfElse, missionRoute.start, rankIndex),
      };
    }),
  );
}

function makeObstacleLayout(rankIndex, routeIndex) {
  // Curated mission maps: fixed on retries, with room for the rover at every checkpoint.
  // Each tuple is [x, y, width, height, terrain]. The first demonstrated move stays clear.
  const layouts = [
    [
      [[345, 365, 85, 110, "rock"], [590, 145, 150, 65, "sand"], [155, 195, 105, 75, "dust"]],
      [[435, 100, 85, 155, "rock"], [270, 345, 175, 80, "sand"], [645, 405, 100, 65, "debris"]],
      [[330, 250, 70, 120, "rock"], [125, 305, 120, 70, "dust"], [570, 410, 155, 65, "sand"]],
      [[335, 435, 70, 110, "debris"], [165, 195, 145, 60, "rock"], [540, 295, 90, 135, "dust"]],
    ],
    [
      [[340, 350, 75, 130, "ice"], [605, 210, 55, 160, "fissure"], [140, 170, 145, 75, "snow"], [690, 455, 135, 60, "ice"]],
      [[305, 110, 95, 145, "fissure"], [485, 305, 150, 70, "ice"], [255, 435, 145, 60, "snow"], [620, 450, 60, 95, "ice"]],
      [[355, 180, 65, 150, "ice"], [170, 365, 140, 70, "snow"], [560, 335, 80, 155, "fissure"], [720, 95, 100, 75, "ice"]],
      [[335, 435, 60, 110, "snow"], [470, 190, 60, 110, "ice"], [670, 265, 60, 160, "fissure"], [165, 115, 130, 70, "ice"]],
    ],
    [
      [[300, 170, 110, 85, "grove"], [475, 405, 160, 75, "roots"], [700, 90, 65, 155, "thorns"], [100, 275, 90, 70, "grove"]],
      [[120, 190, 110, 125, "roots"], [340, 130, 120, 95, "grove"], [630, 365, 80, 135, "thorns"], [775, 110, 90, 85, "grove"]],
      [[315, 485, 140, 60, "thorns"], [450, 75, 65, 95, "roots"], [650, 225, 140, 65, "grove"], [160, 200, 95, 90, "roots"]],
      [[155, 185, 75, 155, "grove"], [380, 445, 90, 100, "thorns"], [625, 70, 55, 180, "roots"], [745, 385, 90, 120, "grove"]],
    ],
    [
      [[310, 350, 35, 70, "lava"], [480, 125, 70, 65, "obsidian"], [610, 325, 145, 65, "ash"], [150, 170, 95, 115, "obsidian"], [775, 455, 65, 85, "lava"]],
      [[315, 200, 85, 80, "obsidian"], [465, 270, 35, 90, "lava"], [120, 320, 75, 85, "ash"], [630, 455, 140, 60, "lava"], [790, 90, 60, 125, "obsidian"]],
      [[295, 340, 50, 55, "obsidian"], [465, 405, 100, 100, "ash"], [620, 150, 35, 85, "lava"], [130, 120, 150, 80, "lava"], [770, 325, 65, 120, "obsidian"]],
      [[195, 255, 100, 75, "ash"], [305, 465, 140, 65, "lava"], [460, 210, 40, 70, "obsidian"], [610, 365, 70, 145, "obsidian"], [755, 230, 80, 80, "lava"]],
    ],
  ];
  return layouts[rankIndex][routeIndex].map(([x, y, w, h, kind]) => ({x, y, w, h, kind}));
}

function makeDifficultyRoute(route, rankIndex) {
  if (rankIndex === 0) {
    return {
      ...route,
      points: route.points.slice(0, Math.min(2, route.points.length)),
      moves: route.moves.slice(0, Math.min(2, route.moves.length)),
    };
  }

  return {...route};
}

function makeYear8Route(route, routeIndex, rankIndex) {
  const labels = [
    ["Supply Crate", "Beacon"],
    ["Tool Kit", "Relay"],
    ["Core Sample", "Signal"],
    ["Sample Tube", "Gate"],
  ][routeIndex];
  const code = rankIndex === 2 ? "orange-blue" : "blue-orange";
  const lastStep = rankIndex === 2 ? 3 : 4;
  const pointTemplates = [
    { x: 250, y: 430, name: labels[0], action: "collect", kind: "sample" },
    { x: 405, y: 340, name: "Cache", action: "collect", kind: "sample" },
    { x: 560, y: 250, name: labels[1], action: "flash", kind: routeIndex === 3 ? "dock" : "satellite" },
    { x: 715, y: 160, name: "Final", action: "flash", kind: "satellite" },
  ].slice(0, lastStep);
  pointTemplates.forEach((point, index) => {
    if (index < pointTemplates.length - 1) {
      point.action = "collect";
      point.kind = "sample";
    } else {
      point.action = "flash";
      point.kind = routeIndex === 3 ? "dock" : "satellite";
      point.name = labels[1];
    }
  });

  return {
    id: `${route.id}-year8`,
    theme: route.theme,
    start: { x: 96, y: 520, heading: 0, color: "#f47b20" },
    points: pointTemplates.map((point, index) => ({
      x: point.x,
      y: point.y,
      label: point.name,
      kind: point.kind,
      action: point.action,
      code: point.action === "flash" ? code : undefined,
      objective:
        point.action === "flash"
          ? `Flash ${code} at the ${point.name.toLowerCase()}`
          : `Collect the ${point.name.toLowerCase()}`,
      step: index + 1,
    })),
    decorations: [
      ...(route.decorations || []).slice(0, 1),
      { kind: "crater", x: 720, y: 250, size: 38 },
    ],
    moves: [
      [70, 60, 2],
      [70, 60, 2],
      [70, 60, 2],
      [70, 60, 2],
    ].slice(0, lastStep),
  };
}

function makeStory(rankIndex, routeIndex) {
  return PLANETS[rankIndex].stories[routeIndex];
}

function makeHint(rankIndex, routeIndex, points) {
  const flashPoint = points.find((point) => point.action === "flash");
  const collectCount = points.filter((point) => point.action === "collect").length;
  if (rankIndex >= 2) {
    return `Use a loop from 1 to ${points.length}. If the step is less than ${points.length}, roll and collect(). Otherwise roll and flash_colour_code("${flashPoint?.code || "orange-blue"}").`;
  }
  if (collectCount && flashPoint) {
    return `Move to each target in order. Use collect() for item targets, and use flash_colour_code("${flashPoint.code}") when the target shows colour chips.`;
  }
  if (flashPoint) {
    return `Each target needs a colour signal. Roll to the target, then use flash_colour_code("${flashPoint.code}") or the code shown above that target.`;
  }
  return "Roll to each target in order and use collect() when the rover reaches the item.";
}

function makeBrief(rankIndex, routeIndex, points) {
  const collectCount = points.filter(point => point.action === "collect").length;
  const signalCount = points.length - collectCount;
  const jobs = [];
  if (collectCount) jobs.push(`${collectCount} collection${collectCount === 1 ? "" : "s"}`);
  if (signalCount) jobs.push(`${signalCount} signal${signalCount === 1 ? "" : "s"}`);
  return `${points.length} checkpoints on ${PLANETS[rankIndex].name}: ${jobs.join(" and ")}. ${rankIndex >= 2 ? "Use a loop and if / else to choose your actions." : "Visit each target in order and avoid the terrain hazards."}`;
}

function makeStarter(rank, name, points, moves, requiresLoop, requiresIfElse, start, rankIndex) {
  const actionLines = points.map((point) =>
    point.action === "flash" ? `flash_colour_code("${point.code}")` : "collect()",
  );

  if (requiresLoop && requiresIfElse) {
    const loopMove = moves[0];

    if (rankIndex === 3) {
      return `# ${rank}
# Mission: ${name}
# Build your own route and decisions for all ${points.length} checkpoints.

set_color("orange")

# TODO: change the range so the loop covers every checkpoint.
for step in range(1, 2):
  # TODO: choose a heading and duration to reach the next checkpoint.
  roll(70, 0, 0)

  # TODO: choose when to collect and when to send the required signal.
  if step == 1:
    pass  # Replace with the correct checkpoint action.
  else:
    pass  # Replace with the correct checkpoint action.

stop()`;
    }

    return `# ${rank}
# Mission: ${name}
# This example reaches and collects the first checkpoint only.
# Extend it to finish all ${points.length} checkpoints.

set_color("orange")

# TODO: extend the range to visit the remaining checkpoints.
for step in range(1, 2):
  roll(${loopMove[0]}, ${loopMove[1]}, ${loopMove[2]})

  # TODO: adapt this condition to choose the right action at each stop.
  if step == 1:
    collect()
  else:
    pass  # TODO: add the required colour signal here.

stop()`;
  }

  const lines = [`# ${rank}`, `# Mission: ${name}`, "# The first move reaches your first checkpoint.", "# Plan the remaining moves around the terrain hazards.", "", 'set_color("orange")'];
  const first = points[0];
  const heading = (Math.atan2(first.x - start.x, start.y - first.y) * 180 / Math.PI + 360) % 360;
  const seconds = Math.hypot(first.x - start.x, first.y - start.y) / (70 * 1.28);
  moves.forEach((move, index) => {
    if (index === 0) {
      lines.push(`roll(70, ${heading.toFixed(1)}, ${seconds.toFixed(2)})`);
      lines.push(actionLines[index]);
    } else {
      lines.push("", `# TODO: reach ${points[index].label}, then use ${actionLines[index]}`);
      lines.push("# Add your roll() commands here.");
    }
  });
  lines.push("stop()");
  return lines.join("\n");
}

let currentMission = missions[0];
let robot;
let abortRun = false;
let running = false;
let commandQueue = Promise.resolve();
let studentName = "";
const completedMissions = new Set();
const savedMissionCode = new Map();
const missionDrafts = new Map();
const missionStats = new Map();
const scoringReferences = new Map();
let activeAttempt = null;
let scoreUISignature = "";
const unlockedHints = new Set();
const awardedCertificates = new Set();
let unlockedRankIndex = 3;
let lastMissionId = missions[0].id;
let resetAfterRun = false;
let programSteps = 0;
let briefedMissionId = null;
const briefingOverlay = document.querySelector("#briefingOverlay");
briefingOverlay.hidden = true;
const functionGuide = document.querySelector("#functionGuide");
let functionGuideOpener = null;
let selectedGuideId = "roll";
const FUNCTION_GUIDE_ENTRIES = [
  {id: "roll", name: "roll()", group: "Movement", summary: "Drive the rover", signature: "roll(speed, heading, seconds)",
    description: "Move in a straight line at the chosen speed and compass heading for a set number of seconds.",
    arguments: [["speed", "A number from 0 to 100. A larger number moves faster; 0 stays still. Default: 50."], ["heading", "0–359 degrees: 0 north, 90 east, 180 south, 270 west. Default: the rover's current heading."], ["seconds", "How long to move, from 0 to 10 seconds. Default: 1."]],
    example: "roll(70, 90, 2)", explanation: "Drive east at speed 70 for 2 seconds, covering about 179 arena units.",
    tip: "Check the map before moving. A collision stops the run. Turn the heading and adjust the duration to plan your own safe route."},
  {id: "turn", name: "turn()", group: "Movement", summary: "Turn from your current heading", signature: "turn(degrees)",
    description: "Rotate the rover relative to the direction it is already facing. Its position stays the same.",
    arguments: [["degrees", "A number from −360 to 360. Positive turns clockwise; negative turns anticlockwise. Default: 90."]],
    example: "set_heading(0)\nturn(90)", explanation: "Face north, then turn 90 degrees clockwise to face east.",
    tip: "Use roll() after turning to start moving. Two turn(90) commands rotate 180 degrees from the original heading."},
  {id: "set_heading", name: "set_heading()", group: "Movement", summary: "Face a compass direction", signature: "set_heading(degrees)", aliases: ["setHeading"],
    description: "Set an absolute compass heading, regardless of the rover's previous direction. Its position stays the same.",
    arguments: [["degrees", "A number from 0 to 359. Use 0 for north, 90 for east, 180 for south, or 270 for west. Default: 0."]],
    example: "set_heading(270)\nroll(50)", explanation: "Face west, then move at speed 50 for the default 1 second using that heading.",
    tip: "set_heading(90) always faces east. turn(90) turns clockwise from wherever you are currently facing."},
  {id: "collect", name: "collect()", group: "Checkpoint actions", summary: "Pick up a sample or supply", signature: "collect()",
    description: "Complete the next checkpoint when its objective asks you to collect a sample, supply, or package.",
    arguments: [["No arguments", "Keep the brackets empty."]], example: "collect()", explanation: "Run this after your movement commands have put the rover on the next collection target.",
    tip: "Visit the checkpoints in order. Calling collect() away from the next target, or at a signal target, stops the program with an explanation in the run log."},
  {id: "flash_colour_code", name: "flash_colour_code()", group: "Checkpoint actions", summary: "Send a checkpoint signal", signature: "flash_colour_code(code)", aliases: ["flash_color_code", "flashColourCode", "flashColorCode"],
    description: "Flash a sequence of colours to complete the next signal checkpoint. Match the code in its objective.",
    arguments: [["code", "Put the colour sequence in quotes, separated by hyphens, such as \"orange-blue\". The colour order matters."]],
    example: "flash_colour_code(\"orange-blue\")", explanation: "Flash orange followed by blue while on a target that requires orange-blue.",
    tip: "Reach the next signal target first. A wrong code or a signal sent away from the target stops the program. Read that target's objective for its exact code."},
  {id: "set_color", name: "set_color()", group: "Checkpoint actions", summary: "Change the rover light", signature: "set_color(colour)", aliases: ["setColor"],
    description: "Change the rover's light and trail colour. This is useful for showing which part of your program is running.",
    arguments: [["colour", "A colour name in quotes: blue, cyan, green, lime, orange, pink, red, yellow, or white. Default: cyan. A CSS colour string such as \"#35a7ff\" also works."]],
    example: "set_color(\"green\")", explanation: "Make the rover light and new trail segments green.",
    tip: "Signal checkpoints need flash_colour_code() with the required sequence. Changing the light with set_color() does not complete a signal objective."},
  {id: "wait", name: "wait()", group: "Timing & messages", summary: "Pause before the next command", signature: "wait(seconds)",
    description: "Pause the program for a set time, then continue with the next command. The rover stays still during the pause.",
    arguments: [["seconds", "A number from 0 to 10. Decimals such as 0.5 are allowed. Default: 1."]],
    example: "set_color(\"blue\")\nwait(1)\nset_color(\"orange\")", explanation: "Show blue for one second, then change to orange.",
    tip: "A pause is useful when you want to observe a change. It does not collect a sample or send a checkpoint signal."},
  {id: "say", name: "say()", group: "Timing & messages", summary: "Display a rover message", signature: "say(message)",
    description: "Show a short message above the rover and in the run log. Use it to follow what your code is doing.",
    arguments: [["message", "Text in quotes, or a number or variable. The rover displays the first 28 characters. Default: an empty message."]],
    example: "say(\"Ready to explore\")", explanation: "Display Ready to explore above the rover and record it in the log.",
    tip: "Inside a loop, say(step) shows the current step number. Writing say(\"step\") shows the word step instead."},
  {id: "stop", name: "stop()", group: "Timing & messages", summary: "Finish your program", signature: "stop()",
    description: "End the student's program at this line. Commands written after stop() will not run.",
    arguments: [["No arguments", "Keep the brackets empty."]], example: "say(\"Finished\")\nstop()", explanation: "Display Finished, then end the program.",
    tip: "A mission is complete only when every checkpoint action has succeeded. stop() ends the program without resetting the rover."},
  {id: "for", name: "for / range()", group: "Loops, decisions & variables", summary: "Repeat a counted sequence", signature: "for step in range(start, end):",
    description: "Repeat the indented commands once for each number in range(). The end number is excluded. This app supports range(end) or range(start, end).",
    arguments: [["start", "The first number to use. If you write range(3), the start is 0."], ["end", "Stop before this number. range(1, 4) uses 1, 2, and 3."], ["step", "A variable name for the current loop number. You can choose another name."]],
    example: "for step in range(1, 4):\n  say(step)\n  wait(0.5)", explanation: "Display 1, 2, then 3, pausing briefly after each number. Indent the repeated lines with two spaces.",
    tip: "range(1, 4) repeats three times. Plan the commands inside the loop for your own mission; repeated movement can still hit obstacles."},
  {id: "while", name: "while", group: "Loops, decisions & variables", summary: "Repeat while a condition is true", signature: "while condition:",
    description: "Repeat the indented lines while the condition is true. Change a variable inside the loop so the condition can eventually become false.",
    arguments: [["condition", "A comparison such as count < 3. The app supports ==, !=, <, >, <=, >=, and, or, and not."]],
    example: "count = 0\nwhile count < 3:\n  say(count)\n  count = count + 1", explanation: "Display 0, 1, and 2. Increasing count makes the loop finish when count reaches 3.",
    tip: "An unchanged condition can create an endless loop. Use the Stop button to cancel a run; the simulator also has a loop limit."},
  {id: "if", name: "if / else", group: "Loops, decisions & variables", summary: "Choose between two actions", signature: "if condition:\n  command\nelse:\n  other_command",
    description: "Run one block when a condition is true, or the else block when it is false. Only the chosen block runs.",
    arguments: [["condition", "A comparison such as step == 1. Use == to compare values, and = when assigning a variable."], ["Indentation", "Use two spaces for the commands inside each block. Align else: with its matching if."]],
    example: "step = 1\nif step == 1:\n  set_color(\"green\")\nelse:\n  set_color(\"blue\")", explanation: "Set the light to green because step is 1. If step had a different value, the light would become blue.",
    tip: "Higher ranks use if / else to choose the correct checkpoint action. Work out which steps collect and which step sends a signal."},
  {id: "variables", name: "Variables", group: "Loops, decisions & variables", summary: "Store and reuse a number", signature: "name = value",
    description: "Give a numeric value a name, then reuse that name in commands and conditions. Changing the value lets you adjust several commands together.",
    arguments: [["name", "Start with a letter or underscore, then use letters, numbers, or underscores. Use your own names such as duration or count."], ["value", "A number or arithmetic expression. Use = to assign it."]],
    example: "duration = 1.5\nroll(50, 90, duration)", explanation: "Store 1.5 in duration, then drive east for 1.5 seconds.",
    tip: "This simulator supports a teaching subset of Python. Use the commands and structures in this guide; custom def functions and imported libraries are outside this subset."},
];

function renderFunctionGuideList() {
  const query = document.querySelector("#functionGuideSearch").value.trim().toLowerCase();
  const list = document.querySelector("#functionGuideList");
  list.textContent = "";
  let group = "", count = 0;
  FUNCTION_GUIDE_ENTRIES.forEach(entry => {
    if (query && ![entry.name, entry.group, entry.summary, entry.description, ...(entry.aliases || [])].join(" ").toLowerCase().includes(query)) return;
    if (entry.group !== group) {
      group = entry.group;
      const heading = document.createElement("h3"); heading.textContent = group; list.append(heading);
    }
    const button = document.createElement("button"), name = document.createElement("code"), summary = document.createElement("span");
    button.type = "button"; button.className = "guide-function-button"; button.dataset.guideId = entry.id;
    button.setAttribute("aria-pressed", String(entry.id === selectedGuideId));
    name.textContent = entry.name; summary.textContent = entry.summary; button.append(name, summary);
    button.addEventListener("click", () => selectGuideFunction(entry.id)); list.append(button); count++;
  });
  if (!count) {const empty = document.createElement("p"); empty.className = "guide-empty"; empty.textContent = "No matches. Try roll, colour, loop, or collect."; list.append(empty);}
}

function selectGuideFunction(id, focus = true) {
  const entry = FUNCTION_GUIDE_ENTRIES.find(item => item.id === id) || FUNCTION_GUIDE_ENTRIES[0];
  selectedGuideId = entry.id;
  document.querySelector("#guideCategory").textContent = entry.group;
  document.querySelector("#guideFunctionName").textContent = entry.name;
  document.querySelector("#guideSignature").textContent = entry.signature;
  document.querySelector("#guideDescription").textContent = entry.description;
  document.querySelector("#guideArgumentsTitle").textContent = entry.group === "Loops, decisions & variables" ? "How to use it" : "Arguments";
  const args = document.querySelector("#guideArguments"); args.textContent = "";
  entry.arguments.forEach(([name, description]) => {
    const row = document.createElement("div"), label = document.createElement("dt"), explanation = document.createElement("dd");
    label.textContent = name; explanation.textContent = description; row.append(label, explanation); args.append(row);
  });
  document.querySelector("#guideExample").textContent = entry.example;
  document.querySelector("#guideExampleExplanation").textContent = entry.explanation;
  document.querySelector("#guideTip").textContent = entry.tip;
  document.querySelector("#guideAliases").textContent = entry.aliases?.length ? `Also accepted: ${entry.aliases.map(name => `${name}()`).join(", ")}.` : "";
  document.querySelector("#functionGuideDetail").scrollTop = 0;
  document.querySelector("#functionGuideList").querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.guideId === entry.id)));
  if (focus) document.querySelector("#guideFunctionName").focus({preventScroll: true});
}

function openFunctionGuide(opener) {
  if (running || !briefingOverlay.hidden || !mentorOverlay.classList.contains("hidden") || functionGuide.open) return;
  functionGuideOpener = opener || document.querySelector("#openFunctionGuideBtn");
  document.querySelector("#functionGuideSearch").value = "";
  renderFunctionGuideList();
  selectGuideFunction(selectedGuideId, false);
  functionGuide.showModal();
  document.querySelector("#closeFunctionGuideBtn").focus();
}

const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
let reducedMotion = motionPreference?.matches || false;
const sceneAnimation = {
  frame: null, lastTime: null, moving: false, wheelPhase: 0, dustDistance: 0,
  visualHeading: 0, particles: [], pulses: [], crash: null,
};

function requestSceneAnimation() {
  if (sceneAnimation.frame !== null || document.hidden || !window.requestAnimationFrame) return;
  sceneAnimation.frame = window.requestAnimationFrame(animateSceneFrame);
}

function animateSceneFrame(time) {
  sceneAnimation.frame = null;
  if (document.hidden) { sceneAnimation.lastTime = null; return; }
  const delta = sceneAnimation.lastTime === null ? 1 / 60 : Math.min(0.05, Math.max(0, (time - sceneAnimation.lastTime) / 1000));
  sceneAnimation.lastTime = time;
  const headingDelta = ((robot.heading - sceneAnimation.visualHeading + 540) % 360) - 180;
  sceneAnimation.visualHeading += reducedMotion ? headingDelta : headingDelta * Math.min(1, delta * 16);
  sceneAnimation.particles = sceneAnimation.particles.filter(p => time - p.started < p.life);
  sceneAnimation.pulses = sceneAnimation.pulses.filter(p => time - p.started < p.life);
  draw();
  const crashActive = sceneAnimation.crash && time - sceneAnimation.crash.started < 2600;
  if (running || sceneAnimation.moving || crashActive || sceneAnimation.particles.length || sceneAnimation.pulses.length || Math.abs(headingDelta) > 0.2) requestSceneAnimation();
  else sceneAnimation.lastTime = null;
}

function resetSceneAnimation() {
  if (sceneAnimation.frame !== null) window.cancelAnimationFrame?.(sceneAnimation.frame);
  Object.assign(sceneAnimation, {frame: null, lastTime: null, moving: false, wheelPhase: 0, dustDistance: 0, visualHeading: currentMission.start.heading, particles: [], pulses: [], crash: null});
}

function addSceneParticle(kind, x, y, vx, vy, life, color, size) {
  if (reducedMotion) return;
  if (sceneAnimation.particles.length >= 140) sceneAnimation.particles.shift();
  sceneAnimation.particles.push({kind, x, y, vx, vy, life, color, size, started: performance.now()});
}

function animateRoverMovement(distance, direction) {
  sceneAnimation.wheelPhase += distance / 9;
  sceneAnimation.dustDistance += distance;
  if (sceneAnimation.dustDistance < 12 || reducedMotion) return;
  sceneAnimation.dustDistance %= 12;
  for (let i = 0; i < 2; i++) {
    const spread = (Math.random() - 0.5) * 20;
    addSceneParticle("dust", robot.x - direction.x * 17 - direction.y * spread, robot.y - direction.y * 17 + direction.x * spread,
      -direction.x * 22 + spread, -direction.y * 22 - spread, 700, currentMission.planet.dust, 5 + Math.random() * 4);
  }
}

function crashRover(message, normal, kind = "terrain") {
  if (robot.crashed) return;
  if (activeAttempt && !activeAttempt.collided) {
    activeAttempt.collided = true;
    getMissionStats().collisions++;
    persistProgress();
    updateScoreUI();
  }
  robot.crashed = true;
  abortRun = true;
  sceneAnimation.moving = false;
  sceneAnimation.crash = {started: performance.now(), x: robot.x, y: robot.y, normal, kind};
  robot.message = "";
  const impactX = robot.x - normal.x * robotRadius;
  const impactY = robot.y - normal.y * robotRadius;
  for (let i = 0; i < 24; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 90;
    addSceneParticle("spark", impactX, impactY, Math.cos(angle) * speed, Math.sin(angle) * speed, 450 + Math.random() * 450, i % 2 ? "#ffd06e" : "#ff8450", 2 + Math.random() * 2);
  }
  for (let i = 0; i < 12; i++) {
    addSceneParticle("smoke", robot.x, robot.y, (Math.random() - .5) * 26, -10 - Math.random() * 12, 1400 + Math.random() * 1000, "#8b8788", 8 + Math.random() * 8);
  }
  sceneAnimation.pulses.push({x: impactX, y: impactY, started: performance.now(), life: 700, color: "#ff9b66", crash: true});
  addLog(message, "error");
  updateMissionProgress();
  requestSceneAnimation();
}

function resetRobot() {
  resetSceneAnimation();
  robot = {
    x: currentMission.start.x,
    y: currentMission.start.y,
    heading: currentMission.start.heading,
    color: currentMission.start.color,
    trail: [],
    visited: new Set(),
    atBeaconIndex: null,
    notifiedBeaconIndex: null,
    ignoredHazards: new Set(),
    wallPasses: 0,
    collectBoost: 0,
    flashing: false,
    crashed: false,
    message: "",
  };
  abortRun = false;
  updateMissionProgress();
  draw();
  if (running) requestSceneAnimation();
}

function resizeCanvasForDisplay() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function getSceneMetrics() {
  const rect = canvas.getBoundingClientRect();
  const ySquash = 0.72;
  const scale = Math.min((rect.width * 0.92) / WORLD.width, (rect.height * 0.8) / (WORLD.height * ySquash));
  const fieldWidth = WORLD.width * scale;
  const fieldHeight = WORLD.height * scale * ySquash;

  return {
    rect,
    scale,
    ySquash,
    originX: (rect.width - fieldWidth) / 2,
    originY: rect.height * 0.58 - fieldHeight / 2,
    fieldWidth,
    fieldHeight,
  };
}

function worldToCanvas(point, z = 0, scene = getSceneMetrics()) {
  return {
    x: scene.originX + point.x * scene.scale,
    y: scene.originY + point.y * scene.scale * scene.ySquash - z * scene.scale,
  };
}

function drawRoundedRect(x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
  ctx.fill();
}

function headingToCanvasRadians(heading) {
  return ((heading - 90) * Math.PI) / 180;
}

function headingToUnitVector(heading) {
  const radians = headingToCanvasRadians(heading);
  return {
    x: Math.cos(radians),
    y: Math.sin(radians),
  };
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  const scene = getSceneMetrics();
  ctx.clearRect(0, 0, rect.width, rect.height);
  updateCompass();

  const sky = ctx.createLinearGradient(0, 0, 0, rect.height);
  sky.addColorStop(0, "#070910");
  sky.addColorStop(0.56, "#111827");
  sky.addColorStop(1, currentMission.planet.sky);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, rect.width, rect.height);

  drawStarfield(rect);
  drawPlanetBackdrop(rect);
  ctx.save();
  const crashAge = sceneAnimation.crash ? performance.now() - sceneAnimation.crash.started : Infinity;
  if (!reducedMotion && crashAge < 450) {
    const strength = 5 * (1 - crashAge / 450);
    ctx.translate(Math.sin(crashAge * .085) * strength, Math.cos(crashAge * .063) * strength * .6);
  }
  drawMissionMat(scene);
  drawMissionDecorations(scene);
  drawMissionArt(scene);
  drawTrail(scene);
  drawRobot(scene);
  drawSceneEffects(scene);
  ctx.restore();
  if (robot.crashed) drawCrashNotice(rect);
}

function drawSceneEffects(scene) {
  const now = performance.now();
  ctx.save();
  for (const pulse of sceneAnimation.pulses) {
    const progress = Math.min(1, (now - pulse.started) / pulse.life);
    const point = worldToCanvas(pulse, 5, scene);
    ctx.globalAlpha = (1 - progress) * .8;
    ctx.strokeStyle = pulse.color;
    ctx.lineWidth = Math.max(1, 3 * scene.scale * (1 - progress));
    ctx.beginPath();
    const radius = (reducedMotion ? 35 : 18 + progress * (pulse.crash ? 80 : 55)) * scene.scale;
    ctx.ellipse(point.x, point.y, radius, radius * scene.ySquash, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (const particle of sceneAnimation.particles) {
    const age = Math.max(0, now - particle.started);
    const progress = age / particle.life;
    if (progress >= 1) continue;
    const seconds = age / 1000;
    const point = worldToCanvas({x: particle.x + particle.vx * seconds, y: particle.y + particle.vy * seconds}, particle.kind === "smoke" ? 20 + seconds * 26 : 5, scene);
    ctx.globalAlpha = (1 - progress) * (particle.kind === "spark" ? 1 : .38);
    ctx.fillStyle = particle.color;
    if (particle.kind === "spark") {
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = Math.max(1.2, particle.size * scene.scale);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x - particle.vx * .04 * scene.scale, point.y - particle.vy * .04 * scene.scale * scene.ySquash);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(point.x, point.y, particle.size * scene.scale * (1 + progress * 2.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawCrashNotice(rect) {
  const width = Math.min(320, rect.width - 24);
  const x = 12, y = 14;
  ctx.save();
  ctx.fillStyle = "rgba(49, 20, 23, .94)";
  drawRoundedRect(x, y, width, 66, 10);
  ctx.strokeStyle = "#ef916c";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + 1, y + 12); ctx.lineTo(x + 1, y + 54); ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffd4b8";
  ctx.font = "700 14px system-ui, sans-serif";
  ctx.fillText(sceneAnimation.crash?.kind === "boundary" ? "Rover left the arena" : "Impact detected", x + 16, y + 25);
  ctx.fillStyle = "#e7bcb5";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("Reset the rover and adjust your route.", x + 16, y + 47, width - 28);
  ctx.restore();
}

function drawStarfield(rect) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  for (let i = 0; i < 145; i += 1) {
    const x = (i * 83) % rect.width;
    const y = (i * 47) % rect.height;
    const radius = i % 9 === 0 ? 1.7 : 0.9;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(79, 217, 191, 0.22)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 211) % rect.width) - 60;
    const y = 92 + ((i * 67) % Math.max(120, rect.height - 180));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 90, y - 26);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(80, 184, 255, 0.18)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 11; i += 1) {
    const x = ((i * 157) % rect.width) - 140;
    const y = 60 + ((i * 89) % Math.max(120, rect.height - 120));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 170, y + 34);
    ctx.stroke();
  }
}

function drawMissionMat(scene) {
  const planet = currentMission.planet;
  const floorX = scene.originX;
  const floorY = scene.originY;
  const floorW = scene.fieldWidth;
  const floorH = scene.fieldHeight;
  const depth = Math.max(18, scene.scale * 30);

  ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
  ctx.beginPath();
  ctx.ellipse(floorX + floorW / 2, floorY + floorH + depth * 1.2, floorW * 0.55, depth * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = planet.floorEnd;
  ctx.beginPath();
  ctx.moveTo(floorX, floorY + floorH);
  ctx.lineTo(floorX + floorW, floorY + floorH);
  ctx.lineTo(floorX + floorW - depth, floorY + floorH + depth);
  ctx.lineTo(floorX + depth, floorY + floorH + depth);
  ctx.closePath();
  ctx.fill();

  const surface = ctx.createLinearGradient(floorX, floorY, floorX, floorY + floorH);
  surface.addColorStop(0, planet.floor); surface.addColorStop(1, planet.floorEnd);
  ctx.fillStyle = surface;
  ctx.strokeStyle = planet.edge;
  ctx.lineWidth = 2;
  drawRoundedRect(floorX, floorY, floorW, floorH, 8);
  ctx.stroke();
  drawPlanetSurface(scene);

  ctx.strokeStyle = planet.grid;
  ctx.lineWidth = 1;
  for (let x = 0; x <= WORLD.width; x += 92) {
    const start = worldToCanvas({ x, y: 0 }, 0, scene);
    const end = worldToCanvas({ x, y: WORLD.height }, 0, scene);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  for (let y = 0; y <= WORLD.height; y += 92) {
    const start = worldToCanvas({ x: 0, y }, 0, scene);
    const end = worldToCanvas({ x: WORLD.width, y }, 0, scene);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
}

function drawMissionDecorations(scene) {
  for (const item of currentMission.decorations || []) {
    if (item.kind === "planet") drawPlanetMark(item, scene);
    if (item.kind === "orbit") drawOrbitPath(item, scene);
    if (item.kind === "crater") drawCrater(item, scene);
    if (item.kind === "habitat") drawHabitat(item, scene);
    if (item.kind === "command") drawCommandPost(item, scene);
  }
}

function drawMissionArt(scene) {
  for (const hazard of currentMission.hazards) {
    drawHazard(hazard, scene);
  }

  currentMission.beacons.forEach((beacon, index) => {
    drawMissionTarget(beacon, robot.visited.has(index), scene);
  });
}

function drawHazard(hazard, scene) {
  if (["fissure", "snow", "roots", "thorns", "ash"].includes(hazard.kind)) { drawTerrainPatch(hazard, scene); return; }
  if (hazard.kind === "ice") { drawIceRidge(hazard, scene); return; }
  if (hazard.kind === "grove") { drawForestGrove(hazard, scene); return; }
  if (hazard.kind === "lava" || hazard.kind === "obsidian") { drawVolcanicRidge(hazard, scene); return; }
  if (hazard.kind === "rock" || hazard.kind === "asteroid") {
    drawRockField(hazard, scene);
    return;
  }
  if (hazard.kind === "sand" || hazard.kind === "radiation") {
    drawSandTrap(hazard, scene);
    return;
  }
  if (hazard.kind === "dust") {
    drawDustStorm(hazard, scene);
    return;
  }
  if (hazard.kind === "debris") {
    drawDebrisCloud(hazard, scene);
    return;
  }
  drawHazardBlock(hazard, scene, "#d33f49", "#a8232d");
}

function drawTerrainPatch(hazard, scene) {
  const palettes = {
    fissure: ["#173647", "#102332", "#99e6ff"],
    snow: ["#bddde3", "#678b9d", "#f1fcff"],
    roots: ["#594632", "#2f3022", "#b59a65"],
    thorns: ["#465136", "#263b2c", "#b6ce72"],
    ash: ["#68606c", "#36303e", "#c0aebf"],
  };
  const [top, side, detail] = palettes[hazard.kind];
  drawHazardBlock(hazard, scene, top, side);
  ctx.save();
  clipHazardTop(hazard, scene);
  ctx.strokeStyle = detail;
  ctx.fillStyle = detail;
  const count = Math.max(4, Math.round((hazard.w + hazard.h) / 35));
  for (let i = 0; i < count; i++) {
    const point = worldToCanvas({x: hazard.x + 12 + i * 37 % (hazard.w - 20), y: hazard.y + 12 + i * 23 % (hazard.h - 20)}, 35, scene);
    const size = (8 + i % 3 * 3) * scene.scale;
    ctx.lineWidth = Math.max(1, scene.scale * (hazard.kind === "roots" ? 6 : 2));
    ctx.beginPath();
    if (hazard.kind === "fissure") {
      ctx.moveTo(point.x - size, point.y + size); ctx.lineTo(point.x, point.y);
      ctx.lineTo(point.x - size * .3, point.y - size); ctx.lineTo(point.x + size, point.y - size * 1.5); ctx.stroke();
    } else if (hazard.kind === "roots") {
      ctx.moveTo(point.x - size * 2, point.y + size);
      ctx.bezierCurveTo(point.x, point.y - size * 2, point.x, point.y + size, point.x + size * 2, point.y - size); ctx.stroke();
    } else if (hazard.kind === "thorns") {
      ctx.moveTo(point.x - size, point.y); ctx.lineTo(point.x, point.y - size * 1.6);
      ctx.lineTo(point.x + size * .6, point.y); ctx.closePath(); ctx.fill();
    } else {
      ctx.ellipse(point.x, point.y, size, size * .35, -.2, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
}

function clipHazardTop(hazard, scene) {
  ctx.beginPath();
  [[hazard.x, hazard.y], [hazard.x + hazard.w, hazard.y], [hazard.x + hazard.w, hazard.y + hazard.h], [hazard.x, hazard.y + hazard.h]].forEach(([x, y], index) => {
    const point = worldToCanvas({x, y}, 34, scene);
    if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath(); ctx.clip();
}

function drawPlanetBackdrop(rect) {
  const planet = currentMission.planet;
  const x = rect.width * .84, y = 49, radius = Math.max(22, Math.min(42, rect.width * .055));
  ctx.save();
  const glow = ctx.createRadialGradient(x, y, radius * .3, x, y, radius * 1.8);
  glow.addColorStop(0, planet.accent + "35"); glow.addColorStop(1, planet.accent + "00");
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, radius * 1.8, 0, Math.PI * 2); ctx.fill();
  const globe = ctx.createRadialGradient(x - radius * .4, y - radius * .4, 1, x, y, radius);
  globe.addColorStop(0, planet.accent); globe.addColorStop(.55, planet.floor); globe.addColorStop(1, "#0d1623");
  ctx.fillStyle = globe; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  ctx.clip();
  ctx.strokeStyle = planet.accent + "55"; ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.ellipse(x + (i - 2) * 7, y + (i - 2) * 14, radius, radius * .2, -.25, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

function drawPlanetSurface(scene) {
  ctx.save();
  ctx.beginPath(); ctx.rect(scene.originX + 2, scene.originY + 2, scene.fieldWidth - 4, scene.fieldHeight - 4); ctx.clip();
  for (let i = 0; i < 45; i++) {
    const point = worldToCanvas({x: 36 + i * 137 % 855, y: 24 + i * 83 % 570}, 0, scene);
    const size = (8 + i % 4 * 4) * scene.scale;
    if (currentMission.theme === "glacia") {
      ctx.strokeStyle = "rgba(190,239,255,.22)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(point.x - size * 2, point.y - size * .4); ctx.lineTo(point.x, point.y);
      ctx.lineTo(point.x + size, point.y - size * .5); ctx.lineTo(point.x + size * 2, point.y + size * .2); ctx.stroke();
    } else if (currentMission.theme === "verdantia") {
      ctx.fillStyle = i % 3 ? "rgba(117,191,127,.1)" : "rgba(167,232,142,.15)";
      ctx.beginPath(); ctx.ellipse(point.x, point.y, size, size * .5, -.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(191,248,181,.5)"; ctx.beginPath(); ctx.arc(point.x, point.y, Math.max(1, scene.scale * 1.5), 0, Math.PI * 2); ctx.fill();
    } else if (currentMission.theme === "pyron") {
      ctx.strokeStyle = "rgba(231,109,73,.2)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(point.x - size, point.y + size * .3); ctx.lineTo(point.x, point.y); ctx.lineTo(point.x + size * .4, point.y - size); ctx.stroke();
    } else {
      ctx.fillStyle = "rgba(232,172,107,.12)"; ctx.beginPath(); ctx.ellipse(point.x, point.y, size, size * .3, .15, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

function drawIceRidge(hazard, scene) {
  drawHazardBlock(hazard, scene, "#649eae", "#2c586d");
  const count = Math.max(3, Math.round((hazard.w + hazard.h) / 45));
  for (let i = 0; i < count; i++) {
    const point = worldToCanvas({x:hazard.x + 12 + i * 37 % Math.max(14, hazard.w - 22), y:hazard.y + 10 + i * 29 % Math.max(14, hazard.h - 20)}, 36, scene);
    const width = (10 + i % 3 * 4) * scene.scale, height = (26 + i % 3 * 14) * scene.scale;
    ctx.fillStyle = i % 2 ? "#ade9f4" : "#7fc8de";
    ctx.beginPath(); ctx.moveTo(point.x - width, point.y); ctx.lineTo(point.x - width * .4, point.y - height * .65);
    ctx.lineTo(point.x + width * .1, point.y - height); ctx.lineTo(point.x + width, point.y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#d8f8ff"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(point.x + width * .1, point.y - height); ctx.lineTo(point.x + width * .25, point.y); ctx.stroke();
  }
}

function drawForestGrove(hazard, scene) {
  drawHazardBlock(hazard, scene, "#325a3d", "#183727");
  const count = Math.max(3, Math.round((hazard.w + hazard.h) / 60));
  for (let i = 0; i < count; i++) {
    const point = worldToCanvas({x:hazard.x + 13 + i * 43 % Math.max(14, hazard.w - 25), y:hazard.y + 12 + i * 31 % Math.max(14, hazard.h - 23)}, 33, scene);
    const size = (15 + i % 3 * 5) * scene.scale;
    ctx.fillStyle = "#94714f"; ctx.fillRect(point.x - size * .14, point.y - size, size * .28, size * 1.3);
    ctx.fillStyle = i % 2 ? "#69aa68" : "#4f9062";
    ctx.beginPath(); ctx.ellipse(point.x, point.y - size * 1.1, size * 1.1, size * .75, -.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#aed58e"; ctx.beginPath(); ctx.ellipse(point.x - size * .35, point.y - size * 1.3, size * .5, size * .23, -.3, 0, Math.PI * 2); ctx.fill();
  }
}

function drawVolcanicRidge(hazard, scene) {
  drawHazardBlock(hazard, scene, "#433039", "#211d29");
  const phase = reducedMotion ? 0 : performance.now() / 650;
  const start = worldToCanvas({x:hazard.x + 8,y:hazard.y + hazard.h * .8}, 36, scene);
  const end = worldToCanvas({x:hazard.x + hazard.w - 8,y:hazard.y + hazard.h * .2}, 36, scene);
  ctx.save();
  ctx.strokeStyle = "#f87842"; ctx.shadowColor = "#fa652c"; ctx.shadowBlur = hazard.kind === "lava" ? 10 : 5;
  ctx.lineWidth = Math.max(2, (hazard.kind === "lava" ? 9 : 4) * scene.scale);
  ctx.beginPath(); ctx.moveTo(start.x,start.y);
  ctx.lineTo(start.x + (end.x - start.x) * .3, start.y - (start.y - end.y) * .25 + Math.sin(phase) * scene.scale * 2);
  ctx.lineTo(start.x + (end.x - start.x) * .7, start.y - (start.y - end.y) * .7); ctx.lineTo(end.x,end.y); ctx.stroke();
  ctx.shadowBlur = 0; ctx.strokeStyle = "#ffcd7d"; ctx.lineWidth = Math.max(1, scene.scale * 2); ctx.stroke();
  ctx.restore();
  if (hazard.kind === "obsidian") {
    for (let i = 0; i < 4; i++) {
      const point = worldToCanvas({x:hazard.x + 14 + i * 19 % Math.max(15,hazard.w - 26), y:hazard.y + 12 + i * 27 % Math.max(15,hazard.h - 24)}, 38, scene);
      const size = (12 + i % 2 * 7) * scene.scale;
      ctx.fillStyle = "#625267"; ctx.strokeStyle = "#a796b1"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(point.x-size,point.y); ctx.lineTo(point.x-size*.3,point.y-size*1.7); ctx.lineTo(point.x+size,point.y-size*.4); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  }
}

function drawHazardBlock(hazard, scene, topColor = "#d33f49", sideColor = "#a8232d") {
  const height = 34;
  const topLeft = worldToCanvas({ x: hazard.x, y: hazard.y }, height, scene);
  const topRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y }, height, scene);
  const bottomRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y + hazard.h }, height, scene);
  const bottomLeft = worldToCanvas({ x: hazard.x, y: hazard.y + hazard.h }, height, scene);
  const floorRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y + hazard.h }, 0, scene);
  const floorLeft = worldToCanvas({ x: hazard.x, y: hazard.y + hazard.h }, 0, scene);

  ctx.fillStyle = "rgba(25, 34, 30, 0.2)";
  ctx.beginPath();
  ctx.ellipse((floorLeft.x + floorRight.x) / 2, floorRight.y + 11, (floorRight.x - floorLeft.x) * 0.58, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = sideColor;
  ctx.beginPath();
  ctx.moveTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.lineTo(floorRight.x, floorRight.y);
  ctx.lineTo(floorLeft.x, floorLeft.y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.lineTo(bottomLeft.x, bottomLeft.y);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  clipHazardTop(hazard, scene);
  ctx.strokeStyle = currentMission.theme === "mars" ? "rgba(255, 255, 255, 0.38)" : currentMission.planet.grid;
  ctx.lineWidth = currentMission.theme === "mars" ? 5 : 2;
  for (let stripe = hazard.x - hazard.h; stripe < hazard.x + hazard.w; stripe += 42) {
    const a = worldToCanvas({ x: stripe, y: hazard.y + hazard.h }, height + 1, scene);
    const b = worldToCanvas({ x: stripe + hazard.h, y: hazard.y }, height + 1, scene);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRockField(hazard, scene) {
  drawHazardBlock(hazard, scene, "#7f6757", "#4c3a31");
  const count = Math.max(4, Math.round((hazard.w + hazard.h) / 55));
  for (let i = 0; i < count; i += 1) {
    const rock = {
      x: hazard.x + 18 + ((i * 43) % Math.max(24, hazard.w - 28)),
      y: hazard.y + 14 + ((i * 31) % Math.max(18, hazard.h - 22)),
    };
    const point = worldToCanvas(rock, 42, scene);
    const radius = (9 + (i % 3) * 4) * scene.scale;
    ctx.fillStyle = i % 2 ? "#b48b6a" : "#8d684e";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, radius * 1.25, radius, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e4c7ac";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawSandTrap(hazard, scene) {
  drawHazardBlock(hazard, scene, "#d59a52", "#8f5e2a");
  const center = worldToCanvas({ x: hazard.x + hazard.w / 2, y: hazard.y + hazard.h / 2 }, 44, scene);
  ctx.strokeStyle = "rgba(255, 234, 199, 0.72)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    const radius = (22 + i * 18) * scene.scale;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, Math.PI * 0.9, Math.PI * 1.85);
    ctx.stroke();
  }
}

function drawDustStorm(hazard, scene) {
  drawHazardBlock(hazard, scene, "#b96b42", "#6d3926");
  ctx.strokeStyle = "rgba(255, 225, 172, 0.58)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 5; i += 1) {
    const start = worldToCanvas({ x: hazard.x + i * 18, y: hazard.y + hazard.h - 10 }, 45, scene);
    const end = worldToCanvas({ x: hazard.x + hazard.w - i * 10, y: hazard.y + 10 + i * 9 }, 45, scene);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(start.x + 38, start.y - 24, end.x - 42, end.y + 18, end.x, end.y);
    ctx.stroke();
  }
}

function drawDebrisCloud(hazard, scene) {
  drawHazardBlock(hazard, scene, "#45515f", "#242b34");
  ctx.fillStyle = "#cfd8e3";
  for (let i = 0; i < 9; i += 1) {
    const bit = {
      x: hazard.x + 12 + ((i * 19) % Math.max(20, hazard.w - 22)),
      y: hazard.y + 10 + ((i * 17) % Math.max(16, hazard.h - 18)),
    };
    const point = worldToCanvas(bit, 43, scene);
    const size = (5 + (i % 3) * 3) * scene.scale;
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(i * 0.7);
    ctx.fillRect(-size / 2, -size / 2, size, size * 0.7);
    ctx.restore();
  }
}

function drawMissionTarget(beacon, complete, scene) {
  if (beacon.kind === "capsule") drawCapsule(beacon, complete, scene);
  else if (beacon.kind === "satellite") drawSatellite(beacon, complete, scene);
  else if (beacon.kind === "dock") drawDock(beacon, complete, scene);
  else if (beacon.kind === "sample") drawSample(beacon, complete, scene);
  else drawSample(beacon, complete, scene);
}

function drawTargetBase(beacon, complete, scene) {
  const point = worldToCanvas(beacon, 7, scene);
  const ground = worldToCanvas(beacon, 0, scene);
  const radius = beacon.r * scene.scale;
  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y + 9, radius * 1.2, radius * scene.ySquash * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = complete ? "#1f8a70" : "#f5b942";
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, radius, radius * scene.ySquash, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = complete ? "#9affea" : "#ffe49a";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (beacon.code) drawColorCodeChips(beacon.code, point, radius);
  return { point, radius };
}

function drawColorCodeChips(code, point, radius) {
  const colors = normalizeColorCode(code).split("-");
  const chipSize = Math.max(5, radius * 0.17);
  const totalWidth = colors.length * chipSize + (colors.length - 1) * chipSize * 0.45;
  let x = point.x - totalWidth / 2;
  const y = point.y - radius * 1.2;
  colors.forEach((color) => {
    ctx.fillStyle = colorValue(color);
    ctx.fillRect(x, y, chipSize, chipSize);
    ctx.strokeStyle = "rgba(255,255,255,0.76)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, chipSize, chipSize);
    x += chipSize * 1.45;
  });
}

function drawCapsule(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = complete ? "#effff6" : "#e7efe9";
  drawRoundedRect(point.x - radius * 0.18, point.y - radius * 1.02, radius * 0.36, radius * 1.1, radius * 0.16);
  ctx.fillStyle = "#6bd2ff";
  ctx.fillRect(point.x - radius * 0.58, point.y - radius * 0.42, radius * 1.16, radius * 0.12);
  ctx.strokeStyle = "#c8f0ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - radius * 1.02);
  ctx.lineTo(point.x, point.y - radius * 1.34);
  ctx.stroke();
  drawTargetLabel(beacon.label, point, radius);
}

function drawSatellite(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = complete ? "#e6fff6" : "#cdd7de";
  drawRoundedRect(point.x - radius * 0.2, point.y - radius * 0.7, radius * 0.4, radius * 0.95, 4);
  ctx.fillStyle = "#2db4d6";
  ctx.fillRect(point.x - radius * 0.95, point.y - radius * 0.46, radius * 0.58, radius * 0.2);
  ctx.fillRect(point.x + radius * 0.37, point.y - radius * 0.46, radius * 0.58, radius * 0.2);
  ctx.strokeStyle = "#eef8ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - radius * 0.7);
  ctx.lineTo(point.x + radius * 0.2, point.y - radius * 1.08);
  ctx.stroke();
  drawTargetLabel(beacon.label, point, radius);
}

function drawDock(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.strokeStyle = complete ? "#9affea" : "#ffffff";
  ctx.lineWidth = 4;
  ctx.strokeRect(point.x - radius * 0.58, point.y - radius * 0.42, radius * 1.16, radius * 0.84);
  ctx.fillStyle = complete ? "#9affea" : "#f3c178";
  ctx.fillRect(point.x - radius * 0.46, point.y - radius * 0.14, radius * 0.92, radius * 0.28);
  ctx.fillStyle = "#5f4638";
  ctx.fillRect(point.x - radius * 0.18, point.y - radius * 0.54, radius * 0.36, radius * 0.34);
  drawTargetLabel(beacon.label, point, radius);
}

function drawSample(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = beacon.label === "Ice" ? "#9fdfff" : beacon.label === "Soil" ? "#cf7d43" : "#9f8e7a";
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = complete ? "#9affea" : "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.arc(point.x - radius * 0.12, point.y - radius * 0.12, radius * 0.16, 0, Math.PI * 2);
  ctx.fill();
  drawTargetLabel(beacon.label, point, radius);
}

function drawTargetLabel(label, point, radius) {
  ctx.fillStyle = "#eef8f2";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
  ctx.lineWidth = 4;
  ctx.font = `800 ${Math.max(11, radius * 0.36)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(label, point.x, point.y + radius * 0.98);
  ctx.fillText(label, point.x, point.y + radius * 0.98);
}

function drawPlanetMark(item, scene) {
  const point = worldToCanvas(item, 2, scene);
  const radius = item.size * scene.scale;
  ctx.fillStyle = "rgba(80, 184, 255, 0.16)";
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(80, 184, 255, 0.38)";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawOrbitPath(item, scene) {
  const point = worldToCanvas(item, 1, scene);
  ctx.strokeStyle = "rgba(116, 231, 255, 0.25)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, (item.w * scene.scale) / 2, (item.h * scene.scale * scene.ySquash) / 2, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCrater(item, scene) {
  const point = worldToCanvas(item, 1, scene);
  const radius = item.size * scene.scale;
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, radius, radius * scene.ySquash * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.13)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawHabitat(item, scene) {
  const point = worldToCanvas(item, 18, scene);
  const size = 44 * scene.scale;
  ctx.fillStyle = "#d8d4c7";
  ctx.beginPath();
  ctx.arc(point.x, point.y, size * 0.55, Math.PI, 0);
  ctx.lineTo(point.x + size * 0.55, point.y + size * 0.35);
  ctx.lineTo(point.x - size * 0.55, point.y + size * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f7b267";
  ctx.fillRect(point.x - size * 0.72, point.y + size * 0.06, size * 1.44, size * 0.16);
  drawSmallLabel(item.label, point.x, point.y + size * 0.6);
}

function drawCommandPost(item, scene) {
  const point = worldToCanvas(item, 18, scene);
  const size = 42 * scene.scale;
  ctx.fillStyle = "#d8d4c7";
  drawRoundedRect(point.x - size * 0.5, point.y - size * 0.36, size, size * 0.72, 6);
  ctx.strokeStyle = "#6bd2ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - size * 0.36);
  ctx.lineTo(point.x, point.y - size * 0.95);
  ctx.lineTo(point.x + size * 0.42, point.y - size * 0.7);
  ctx.stroke();
  drawSmallLabel(item.label, point.x, point.y + size * 0.65);
}

function drawSmallLabel(label, x, y) {
  ctx.fillStyle = "#eef8f2";
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
}

function drawTrail(scene) {
  if (robot.trail.length < 2) return;
  ctx.strokeStyle = robot.color;
  ctx.lineWidth = Math.max(4, scene.scale * 7);
  ctx.lineCap = "round";
  ctx.beginPath();
  robot.trail.forEach((point, index) => {
    const mapped = worldToCanvas(point, 4, scene);
    if (index === 0) ctx.moveTo(mapped.x, mapped.y);
    else ctx.lineTo(mapped.x, mapped.y);
  });
  ctx.stroke();
}

function drawRobot(scene) {
  const ground = worldToCanvas(robot, 0, scene);
  const point = worldToCanvas(robot, robotRadius * 0.72, scene);
  const radius = robotRadius * scene.scale;
  const headingRadians = headingToCanvasRadians(sceneAnimation.visualHeading);
  const headingVector = headingToUnitVector(sceneAnimation.visualHeading);
  const arrowX = headingVector.x;
  const arrowY = headingVector.y * scene.ySquash;
  const crashAge = sceneAnimation.crash ? performance.now() - sceneAnimation.crash.started : Infinity;
  const recoil = !reducedMotion && crashAge < 550 ? Math.sin(crashAge / 550 * Math.PI) * 15 : 0;
  if (sceneAnimation.crash) {
    point.x += sceneAnimation.crash.normal.x * recoil * scene.scale;
    point.y += sceneAnimation.crash.normal.y * recoil * scene.scale * scene.ySquash;
  }
  if (sceneAnimation.moving && !reducedMotion) point.y -= Math.sin(sceneAnimation.wheelPhase * 2) * 1.8 * scene.scale;

  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y + 10, radius * 1.5, radius * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(point.x, point.y);
  const wobble = !reducedMotion && crashAge < 650 ? Math.sin(crashAge * .04) * .22 * (1 - crashAge / 650) : 0;
  ctx.rotate(headingRadians + wobble + (robot.crashed ? .12 : 0));
  drawRoverBody(radius);
  drawRoverWheels(radius);
  drawRoverMast(radius);
  ctx.rotate(-headingRadians - wobble - (robot.crashed ? .12 : 0));
  ctx.translate(-point.x, -point.y);

  ctx.strokeStyle = robot.color;
  ctx.lineWidth = Math.max(2, radius * 0.08);
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(point.x + arrowX * radius * 0.95, point.y + arrowY * radius * 0.95);
  ctx.lineTo(point.x + arrowX * radius * 1.26, point.y + arrowY * radius * 1.26);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  if (robot.message) {
    ctx.fillStyle = "#eef8f2";
    ctx.strokeStyle = "rgba(0,0,0,0.75)";
    ctx.lineWidth = 4;
    ctx.font = "700 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    const messageY = point.y - radius - 18;
    ctx.strokeText(robot.message, point.x, messageY);
    ctx.fillText(robot.message, point.x, messageY);
  }
}

function drawRoverBody(radius) {
  const body = ctx.createLinearGradient(0, -radius, 0, radius);
  body.addColorStop(0, robot.crashed ? "#877e75" : "#efe8d6");
  body.addColorStop(1, robot.crashed ? "#413a37" : "#a2876f");
  ctx.fillStyle = body;
  drawRoundedRect(-radius * 0.95, -radius * 0.36, radius * 1.9, radius * 0.88, 8);
  ctx.fillStyle = robot.crashed ? "#ff6655" : robot.flashing || robot.color;
  ctx.fillRect(-radius * 0.42, -radius * 0.18, radius * 0.84, radius * 0.16);
  ctx.fillStyle = "#6e7176";
  ctx.fillRect(-radius * 0.22, radius * 0.04, radius * 0.44, radius * 0.16);
}

function drawRoverWheels(radius) {
  ctx.fillStyle = "#35393f";
  const wheelX = radius * 0.88;
  const wheelY = radius * 0.44;
  const wheelW = radius * 0.34;
  const wheelH = radius * 0.22;
  [
    [-wheelX, -wheelY],
    [wheelX - wheelW, -wheelY],
    [-wheelX, wheelY],
    [wheelX - wheelW, wheelY],
  ].forEach(([x, y]) => {
    ctx.fillStyle = "#35393f";
    ctx.fillRect(x, y, wheelW, wheelH);
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, wheelW, wheelH); ctx.clip();
    ctx.strokeStyle = "#9ba3ac";
    ctx.lineWidth = Math.max(1, radius * .045);
    const spacing = wheelW / 3;
    const phase = reducedMotion ? 0 : sceneAnimation.wheelPhase % 1;
    for (let tread = -1; tread < 4; tread++) {
      const treadX = x + (tread + phase) * spacing;
      ctx.beginPath(); ctx.moveTo(treadX, y); ctx.lineTo(treadX, y + wheelH); ctx.stroke();
    }
    ctx.restore();
  });
}

function drawRoverMast(radius) {
  ctx.strokeStyle = "#d9dde2";
  ctx.lineWidth = Math.max(2, radius * 0.07);
  ctx.beginPath();
  ctx.moveTo(radius * 0.22, -radius * 0.22);
  ctx.lineTo(radius * 0.42, -radius * 0.82);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(radius * 0.46, -radius * 0.9, radius * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#202a32";
  ctx.beginPath();
  ctx.arc(radius * 0.5, -radius * 0.9, radius * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function addLog(message, type = "") {
  const line = document.createElement("div");
  line.className = `log-line ${type}`.trim();
  line.textContent = message;
  logOutput.append(line);
  logOutput.scrollTop = logOutput.scrollHeight;
}

function clearLog() {
  logOutput.textContent = "";
}

function populateMissions() {
  missionSelect.textContent = "";
  const groups = new Map();
  missions.forEach((mission) => {
    if (!groups.has(mission.rank)) {
      const group = document.createElement("optgroup");
      group.label = mission.rank;
      groups.set(mission.rank, group);
      missionSelect.append(group);
    }
    const option = document.createElement("option");
    option.value = mission.id;
    option.textContent = missionOptionLabel(mission);
    option.disabled = mission.rankIndex > unlockedRankIndex;
    groups.get(mission.rank).append(option);
  });
}

function missionOptionLabel(mission) {
  const best = missionStats.get(mission.id)?.best;
  return completedMissions.has(mission.id) ? `★ ${mission.name}${best ? ` · ${best.points} pts` : ""}` : mission.name;
}

function refreshMissionOptionLabels() {
  missionSelect.querySelectorAll("option").forEach((option) => {
    const mission = missions.find((item) => item.id === option.value);
    if (mission) option.textContent = missionOptionLabel(mission);
  });
}

function refreshMissionLocks() {
  missionSelect.querySelectorAll("option").forEach((option) => {
    const mission = missions.find((item) => item.id === option.value);
    option.disabled = mission.rankIndex > unlockedRankIndex;
  });
}

function loadMission(id) {
  if (running) return;
  if (functionGuide.open) functionGuide.close();
  activeAttempt = null;
  const requestedMission = missions.find((mission) => mission.id === id) || missions[0];
  currentMission = requestedMission;
  briefedMissionId = null;
  briefingOverlay.hidden = true;
  document.querySelector(".app-shell").inert = false;
  document.querySelector("body").dataset.planet = currentMission.theme;
  document.querySelector("body").style.setProperty("--planet-accent", currentMission.planet.accent);
  canvas.setAttribute("aria-label", `${currentMission.planet.name} rover arena: ${currentMission.planet.terrain}, checkpoints, and terrain hazards`);
  lastMissionId = currentMission.id;
  missionSelect.value = currentMission.id;
  missionTitle.textContent = currentMission.name;
  document.querySelector("#missionRank").textContent = currentMission.rank;
  missionBrief.textContent = currentMission.brief;
  storyOutput.textContent = currentMission.story;
  const completedCode = completedMissions.has(currentMission.id) ? savedMissionCode.get(currentMission.id) : undefined;
  codeEditor.value = completedCode ?? missionDrafts.get(currentMission.id) ?? currentMission.starter;
  updateLineNumbers();
  renderObjectives();
  clearLog();
  addLog(`Loaded ${currentMission.name}.`);
  if (completedCode !== undefined) addLog("Your successful program has been restored.", "success");
  resetRobot();
  updateHintUI();
  updateStudentReadout();
  updateCertificateUI();
  persistProgress();
  if (studentName && mentorOverlay.classList.contains("hidden")) showMissionBriefing();
}

function showMissionBriefing() {
  if (running || !studentName) return;
  if (functionGuide.open) functionGuide.close();
  const planet = currentMission.planet;
  briefingOverlay.dataset.planet = planet.id;
  document.querySelector("#briefingRank").textContent = `Rank ${currentMission.rankIndex + 1} · Mission ${currentMission.routeIndex + 1} of 4`;
  document.querySelector("#briefingPlanetName").textContent = planet.name;
  document.querySelector("#briefingPlanetType").textContent = planet.type;
  document.querySelector("#briefingPlanetDescription").textContent = planet.description;
  const terrainNames = {rock: "rock fields", sand: "sand traps", dust: "dust storms", debris: "debris", ice: "crystal ridges", fissure: "ice fissures", snow: "snow banks", grove: "forest groves", roots: "giant roots", thorns: "thorn patches", lava: "lava channels", obsidian: "obsidian ridges", ash: "ash banks"};
  const terrainTypes = [...new Set(currentMission.hazards.map(hazard => terrainNames[hazard.kind]))];
  document.querySelector("#briefingTerrain").textContent = `${currentMission.hazards.length} obstacles: ${terrainTypes.join(", ")}. Scout this mission's layout before plotting your route.`;
  document.querySelector("#briefingTitle").textContent = currentMission.name;
  document.querySelector("#briefingStory").textContent = currentMission.story;
  document.querySelector("#briefingLearning").textContent = planet.learning;
  const checklist = document.querySelector("#briefingObjectives");
  checklist.textContent = "";
  currentMission.beacons.forEach(beacon => {
    const item = document.createElement("li");
    item.textContent = beacon.objective;
    checklist.append(item);
  });
  briefingOverlay.hidden = false;
  document.querySelector(".briefing-dialog").scrollTop = 0;
  document.querySelector(".app-shell").inert = true;
  document.querySelector("#briefingTitle").focus({preventScroll: true});
}

function beginMission() {
  if (running || !studentName) return;
  briefedMissionId = currentMission.id;
  briefingOverlay.hidden = true;
  document.querySelector(".app-shell").inert = false;
  missionSelect.focus({preventScroll: true});
}

function renderObjectives() {
  objectiveList.textContent = "";
  currentMission.beacons.forEach((beacon, index) => {
    const item = document.createElement("li");
    item.dataset.index = String(index);
    item.className = "objective-item pending";

    const status = document.createElement("span");
    status.className = "objective-status";
    status.textContent = "○";

    const text = document.createElement("span");
    text.className = "objective-text";
    const commandHint =
      beacon.action === "flash"
        ? ` using flash_colour_code("${beacon.code}")`
        : beacon.action === "collect"
          ? " using collect()"
          : "";
    text.textContent = `${beacon.objective || `Reach ${beacon.label}`}${commandHint}`;
    item.append(status, text);
    objectiveList.append(item);
  });
  updateMissionProgress();
}

function showHint() {
  if (!unlockedHints.has(currentMission.id)) {
    hintOutput.textContent = "This hint is still locked. Complete the previous mission first.";
    return;
  }
  hintOutput.textContent = currentMission.hint;
  const stats = getMissionStats();
  const firstUse = !stats.hintUsed;
  stats.hintUsed = true;
  addLog(firstUse ? "Flight support shared a route hint. Independent-work bonus is now 80 / 100; reopening this hint has no further cost." : "Flight support shared the hint again. No extra point cost.");
  persistProgress();
  updateScoreUI();
}

function getMissionStats(mission = currentMission) {
  if (!missionStats.has(mission.id)) missionStats.set(mission.id, {attempts: 0, collisions: 0, hintUsed: false, best: null, lastScore: null});
  return missionStats.get(mission.id);
}

function getScoringReference(mission) {
  if (scoringReferences.has(mission.id)) return scoringReferences.get(mission.id);
  // Shortest safe paths through a visibility graph around expanded obstacle corners.
  // This gives detours a fair allowance instead of comparing against a route through rocks.
  const clearance = robotRadius + 5;
  const blocks = mission.hazards.map(h => ({left: h.x - clearance, right: h.x + h.w + clearance, top: h.y - clearance, bottom: h.y + h.h + clearance}));
  const safePoint = p => p.x >= clearance && p.x <= WORLD.width - clearance && p.y >= clearance && p.y <= WORLD.height - clearance && blocks.every(b => p.x <= b.left || p.x >= b.right || p.y <= b.top || p.y >= b.bottom);
  const clearSegment = (a, b) => blocks.every(block => {
    let entry = 0, exit = 1;
    for (const [position, delta, low, high] of [[a.x, b.x - a.x, block.left, block.right], [a.y, b.y - a.y, block.top, block.bottom]]) {
      if (Math.abs(delta) < 1e-9) { if (position <= low || position >= high) return true; }
      else {
        const first = (low - position) / delta, second = (high - position) / delta;
        entry = Math.max(entry, Math.min(first, second)); exit = Math.min(exit, Math.max(first, second));
        if (entry >= exit) return true;
      }
    }
    return false;
  });
  const nodes = [mission.start, ...mission.beacons];
  blocks.forEach(b => {
    for (const x of [b.left - 2, b.right + 2]) for (const y of [b.top - 2, b.bottom + 2]) {
      const point = {x, y}; if (safePoint(point)) nodes.push(point);
    }
  });
  const edges = nodes.map(() => []);
  nodes.forEach((a, i) => nodes.forEach((b, j) => {
    if (j > i && clearSegment(a, b)) {
      const distance = Math.hypot(b.x - a.x, b.y - a.y);
      edges[i].push({to: j, distance}); edges[j].push({to: i, distance});
    }
  }));
  let distance = 0, rolls = 0;
  for (let goal = 1; goal <= mission.beacons.length; goal++) {
    const costs = nodes.map(() => Infinity), steps = nodes.map(() => Infinity), visited = new Set();
    costs[goal - 1] = 0; steps[goal - 1] = 0;
    while (!visited.has(goal)) {
      let next = -1;
      costs.forEach((cost, index) => {if (!visited.has(index) && Number.isFinite(cost) && (next < 0 || cost < costs[next])) next = index;});
      if (next < 0) break;
      visited.add(next);
      for (const edge of edges[next]) {
        const cost = costs[next] + edge.distance;
        if (cost < costs[edge.to]) {costs[edge.to] = cost; steps[edge.to] = steps[next] + 1;}
      }
    }
    // Conservative fallback for future maps with corridors too narrow for this graph.
    distance += Number.isFinite(costs[goal]) ? costs[goal] : Math.hypot(nodes[goal].x - nodes[goal - 1].x, nodes[goal].y - nodes[goal - 1].y);
    rolls += Number.isFinite(steps[goal]) ? steps[goal] : 2;
  }
  const reference = {distance, commandBudget: rolls + mission.beacons.length + 2};
  scoringReferences.set(mission.id, reference);
  return reference;
}

function calculateMissionScore(mission, stats, attempt) {
  const reference = getScoringReference(mission);
  const routePoints = Math.round(60 * Math.min(1, reference.distance / Math.max(1, attempt.distance)));
  const commandPoints = Math.round(40 * Math.min(1, reference.commandBudget / Math.max(1, attempt.commands)));
  const parts = {
    completion: 500,
    attempts: Math.max(0, 200 - 20 * Math.max(0, stats.attempts - 1)),
    safety: Math.max(0, 100 - 20 * stats.collisions),
    independence: stats.hintUsed ? 80 : 100,
    efficiency: routePoints + commandPoints,
  };
  return {points: Object.values(parts).reduce((total, points) => total + points, 0), parts, attempts: stats.attempts, collisions: stats.collisions, hintUsed: stats.hintUsed, distance: attempt.distance, commands: attempt.commands, routePoints, commandPoints};
}

function updateScoreUI() {
  const stats = getMissionStats();
  const signature = JSON.stringify([currentMission.id, stats.attempts, stats.collisions, stats.hintUsed, stats.best, stats.lastScore, running]);
  if (signature === scoreUISignature) return;
  scoreUISignature = signature;
  document.querySelector("#missionPoints").textContent = stats.best ? `Best: ${stats.best.points} pts` : "Best: —";
  document.querySelector("#bestMissionScore").textContent = stats.best ? stats.best.points.toLocaleString() : "—";
  document.querySelector("#attemptCount").textContent = stats.attempts;
  document.querySelector("#collisionCount").textContent = stats.collisions;
  document.querySelector("#hintUseStatus").textContent = stats.hintUsed ? "Used · −20 pts" : "Not used";
  document.querySelector("#scoreFeedback").textContent = running ? `Attempt ${stats.attempts} in progress. Points are awarded after completing every goal.` : stats.lastScore ? `Latest completion: ${stats.lastScore.points} / 1,000 points. Your best score is kept when you practise again.` : completedMissions.has(currentMission.id) ? "Your earlier completion is saved. Complete the mission again to earn a score." : "Complete every goal to earn points. Keep exploring and refine your route.";
  const breakdown = document.querySelector("#scoreBreakdown");
  breakdown.textContent = "";
  breakdown.hidden = !stats.lastScore;
  if (stats.lastScore) {
    const score = stats.lastScore;
    const rows = [
      ["Mission complete", score.parts.completion, 500],
      [`Attempts · ${score.attempts} total`, score.parts.attempts, 200],
      [`Safety · ${score.collisions} impacts`, score.parts.safety, 100],
      [`Independent work · hint ${score.hintUsed ? "used" : "not used"}`, score.parts.independence, 100],
      [`Efficiency · route ${score.routePoints}/60 + commands ${score.commandPoints}/40`, score.parts.efficiency, 100],
    ];
    const heading = document.createElement("li"); heading.className = "score-breakdown-heading"; heading.textContent = "Latest completed run"; breakdown.append(heading);
    rows.forEach(([label, points, maximum]) => {
      const row = document.createElement("li"), text = document.createElement("span"), value = document.createElement("strong");
      text.textContent = label; value.textContent = `${points} / ${maximum}`; row.append(text, value); breakdown.append(row);
    });
    const telemetry = document.createElement("li"); telemetry.className = "score-telemetry";
    telemetry.textContent = `${Math.round(score.distance)} arena units travelled · ${score.commands} commands executed`;
    breakdown.append(telemetry);
  }
}

function completedMissionCount(rankIndex) {
  return missions.filter((mission) => mission.rankIndex === rankIndex && completedMissions.has(mission.id)).length;
}

function allRankMissionsComplete(rankIndex) {
  return completedMissionCount(rankIndex) === 4;
}

function checkProgress() {
  if (robot.crashed) return;
  const nextBeacon = currentMission.beacons[robot.visited.size];
  robot.atBeaconIndex = null;
  if (nextBeacon) {
    const distance = Math.hypot(robot.x - nextBeacon.x, robot.y - nextBeacon.y);
    if (distance <= nextBeacon.r + robotRadius * 0.5 + robot.collectBoost) {
      robot.atBeaconIndex = robot.visited.size;
      if (!nextBeacon.action || nextBeacon.action === "visit") {
        completeCurrentGoal(`Goal reached: ${nextBeacon.label}`);
      } else if (robot.notifiedBeaconIndex !== robot.atBeaconIndex) {
        robot.notifiedBeaconIndex = robot.atBeaconIndex;
        addLog(`At ${nextBeacon.label}. Use ${requiredCommandText(nextBeacon)}.`);
      }
    }
  }

  for (const [hazardIndex, hazard] of currentMission.hazards.entries()) {
    const nearestX = Math.max(hazard.x, Math.min(robot.x, hazard.x + hazard.w));
    const nearestY = Math.max(hazard.y, Math.min(robot.y, hazard.y + hazard.h));
    if (Math.hypot(robot.x - nearestX, robot.y - nearestY) < robotRadius) {
      if (robot.ignoredHazards.has(hazardIndex)) continue;
      const dx = robot.x - nearestX, dy = robot.y - nearestY;
      const distance = Math.hypot(dx, dy);
      const direction = headingToUnitVector(robot.heading);
      const normal = distance ? {x: dx / distance, y: dy / distance} : {x: -direction.x, y: -direction.y};
      crashRover("Collision detected. Reset and try a new route.", normal);
      break;
    }
  }

  if (
    robot.x < robotRadius ||
    robot.x > WORLD.width - robotRadius ||
    robot.y < robotRadius ||
    robot.y > WORLD.height - robotRadius
  ) {
    const direction = headingToUnitVector(robot.heading);
    crashRover("The rover left the mission mat.", {x: -direction.x, y: -direction.y}, "boundary");
  }

  updateMissionProgress();
}

function completeCurrentGoal(message) {
  const index = robot.visited.size;
  if (index >= currentMission.beacons.length) return;
  robot.visited.add(index);
  const beacon = currentMission.beacons[index];
  sceneAnimation.pulses.push({x: beacon.x, y: beacon.y, started: performance.now(), life: 900, color: "#7de2dd"});
  if (robot.visited.size === currentMission.beacons.length) {
    for (let i = 0; i < 22; i++) {
      const angle = i / 22 * Math.PI * 2;
      addSceneParticle("spark", robot.x, robot.y, Math.cos(angle) * 70, Math.sin(angle) * 70, 1000, i % 2 ? "#7de2dd" : "#ffe8a0", 2);
    }
  }
  requestSceneAnimation();
  robot.notifiedBeaconIndex = null;
  addLog(message, "success");
  updateMissionProgress();
}

function requiredCommandText(beacon) {
  if (beacon.action === "flash") return `flash_colour_code("${beacon.code}")`;
  if (beacon.action === "collect") return "collect()";
  return "the next command";
}

function enqueueCommand(action) {
  commandQueue = commandQueue.then(async () => {
    assertRunning();
    if (activeAttempt) activeAttempt.commands++;
    await action();
  });
  return commandQueue;
}

function sleep(ms) {
  return new Promise((resolve, reject) => {
    const end = performance.now() + ms;
    function tick() {
      if (abortRun) { reject(new Error("Run stopped")); return; }
      const remaining = end - performance.now();
      if (remaining <= 0) { resolve(); return; }
      window.setTimeout(tick, Math.min(80, remaining));
    }
    tick();
  });
}

function assertRunning() {
  if (abortRun) throw new Error("Run stopped");
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function roll(speed = 50, heading = robot.heading, seconds = 1) {
  return enqueueCommand(async () => {
    const safeSpeed = clampNumber(speed, 0, 100, 50);
    const safeHeading = clampNumber(heading, 0, 359, robot.heading);
    const safeSeconds = clampNumber(seconds, 0, 10, 1);
    robot.heading = safeHeading;
    addLog(`roll(${safeSpeed}, ${safeHeading}, ${safeSeconds})`);

    const started = performance.now();
    const duration = safeSeconds * 1000;
    const pixelsPerSecond = safeSpeed * 1.28;
    let last = started;
    sceneAnimation.moving = safeSpeed > 0 && safeSeconds > 0;
    requestSceneAnimation();
    try {
      while (performance.now() - started < duration) {
        assertRunning();
        const now = performance.now();
        const delta = (Math.min(now, started + duration) - last) / 1000;
        last = now;
        const direction = headingToUnitVector(safeHeading);
        // Small collision steps keep a slow rendered frame from skipping over terrain.
        const distance = pixelsPerSecond * delta;
        const steps = Math.max(1, Math.ceil(distance / 6));
        for (let step = 0; step < steps; step++) {
          if (activeAttempt) activeAttempt.distance += distance / steps;
          robot.x += direction.x * distance / steps;
          robot.y += direction.y * distance / steps;
          animateRoverMovement(distance / steps, direction);
          robot.trail.push({ x: robot.x, y: robot.y });
          checkProgress();
          if (robot.crashed) break;
        }
        draw();
        await sleep(16);
      }
    } finally {
      sceneAnimation.moving = false;
      draw();
    }
  });
}

function turn(degrees = 90) {
  return enqueueCommand(async () => {
    const amount = clampNumber(degrees, -360, 360, 90);
    robot.heading = (robot.heading + amount + 360) % 360;
    addLog(`turn(${amount}) -> heading ${Math.round(robot.heading)}`);
    draw();
    await sleep(250);
  });
}

function setHeading(degrees = 0) {
  return enqueueCommand(async () => {
    robot.heading = clampNumber(degrees, 0, 359, 0);
    addLog(`set_heading(${Math.round(robot.heading)})`);
    draw();
    await sleep(160);
  });
}

function setColor(color = "cyan") {
  return enqueueCommand(() => {
    robot.color = colorValue(color);
    addLog(`set_color("${color}")`);
    draw();
  });
}

function colorValue(color = "orange") {
  const namedColors = {
    blue: "#35a7ff",
    cyan: "#3ddbd9",
    green: "#48c774",
    lime: "#a7d948",
    orange: "#f47b20",
    pink: "#ff5c8a",
    red: "#d33f49",
    yellow: "#f5b942",
    white: "#f8faf7",
  };
  return namedColors[String(color).toLowerCase()] || String(color);
}

function normalizeColorCode(code) {
  if (Array.isArray(code)) return code.map((part) => String(part).toLowerCase()).join("-");
  return String(code)
    .toLowerCase()
    .replace(/[\s,>]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function collect() {
  return enqueueCommand(async () => {
    const beacon = currentMission.beacons[robot.visited.size];
    if (!beacon || robot.atBeaconIndex !== robot.visited.size) {
      addLog("collect() only works when the rover is on the next mission target.", "error");
      abortRun = true;
      throw new Error("Move the rover onto the target before using collect().");
    }
    if (beacon.action !== "collect") {
      addLog(`This target needs ${requiredCommandText(beacon)}, not collect().`, "error");
      abortRun = true;
      throw new Error(`Wrong command for ${beacon.label}. Use ${requiredCommandText(beacon)}.`);
    }
    robot.message = "Collected";
    draw();
    await sleep(260);
    robot.message = "";
    completeCurrentGoal(`Collected: ${beacon.label}`);
    draw();
  });
}

function flashColorCode(code = "orange") {
  return enqueueCommand(async () => {
    const beacon = currentMission.beacons[robot.visited.size];
    const normalized = normalizeColorCode(code);
    if (!beacon || robot.atBeaconIndex !== robot.visited.size) {
      addLog("flash_colour_code() only works when the rover is on the next signal target.", "error");
      abortRun = true;
      throw new Error("Move the rover onto the signal target before using flash_colour_code().");
    }
    if (beacon.action !== "flash") {
      addLog(`This target needs ${requiredCommandText(beacon)}, not a colour flash.`, "error");
      abortRun = true;
      throw new Error(`Wrong command for ${beacon.label}. Use ${requiredCommandText(beacon)}.`);
    }

    const colors = normalized.split("-").filter(Boolean);
    addLog(`flash_colour_code("${normalized}")`);
    for (const color of colors) {
      robot.flashing = colorValue(color);
      draw();
      await sleep(180);
      robot.flashing = false;
      draw();
      await sleep(90);
    }

    if (normalized === beacon.code) {
      completeCurrentGoal(`Signal accepted at ${beacon.label}`);
    } else {
      addLog(`Signal rejected. Expected ${beacon.code}.`, "error");
      abortRun = true;
      throw new Error(`Incorrect colour code at ${beacon.label}. Expected ${beacon.code}.`);
    }
    draw();
  });
}

const flashColourCode = flashColorCode;

function wait(seconds = 1) {
  return enqueueCommand(async () => {
    const safeSeconds = clampNumber(seconds, 0, 10, 1);
    addLog(`wait(${safeSeconds})`);
    await sleep(safeSeconds * 1000);
  });
}

function stop() {
  return enqueueCommand(() => {
    addLog("stop()");
  });
}

function say(message = "") {
  return enqueueCommand(() => {
    robot.message = String(message).slice(0, 28);
    addLog(`say("${robot.message}")`);
    draw();
  });
}

function convertPythonCondition(condition) {
  return condition
    .replace(/\band\b/g, "&&")
    .replace(/\bor\b/g, "||")
    .replace(/\bnot\b/g, "!")
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false");
}

function stripPythonComment(line) {
  let quote = "";
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const previous = line[index - 1];
    if ((char === '"' || char === "'") && previous !== "\\") {
      quote = quote === char ? "" : quote || char;
    }
    if (char === "#" && !quote) {
      return line.slice(0, index);
    }
  }
  return line;
}

function translatePythonCode(source) {
  const output = [];
  const stack = [];
  const variables = new Set();
  let pendingIndent = null;
  const lines = source.replace(/\t/g, "  ").split(/\r?\n/);

  function closeTo(indent) {
    while (stack.length && stack[stack.length - 1].indent >= indent) {
      output.push(" ".repeat(stack[stack.length - 1].indent) + "}");
      stack.pop();
    }
  }

  lines.forEach((rawLine, lineIndex) => {
    const indent = rawLine.match(/^ */)[0].length;
    const withoutComment = stripPythonComment(rawLine);
    const trimmed = withoutComment.trim();

    if (!trimmed) {
      output.push(rawLine.trim().startsWith("#") ? `${" ".repeat(indent)}//${rawLine.trim().slice(1)}` : "");
      return;
    }
    if (pendingIndent !== null && indent <= pendingIndent) {
      throw new Error(`Python line ${lineIndex + 1}: indent the commands inside this block.`);
    }
    if (pendingIndent === null && indent > (stack.length ? stack[stack.length - 1].indent : 0) && !stack.length) {
      throw new Error(`Python line ${lineIndex + 1}: unexpected indentation.`);
    }
    pendingIndent = null;

    if (trimmed === "else:") {
      while (stack.length && stack[stack.length - 1].indent > indent) {
        output.push(" ".repeat(stack[stack.length - 1].indent) + "}");
        stack.pop();
      }
      if (!stack.length || stack[stack.length - 1].type !== "if" || stack[stack.length - 1].indent !== indent) {
        throw new Error(`Python line ${lineIndex + 1}: else must match an if at the same indentation.`);
      }
      stack.pop();
      output.push(`${" ".repeat(indent)}} else {`);
      stack.push({ indent, type: "else" });
      pendingIndent = indent;
      return;
    }

    closeTo(indent);
    if (stack.length) {
      const block = stack[stack.length - 1];
      if (block.bodyIndent === undefined) block.bodyIndent = indent;
      if (indent !== block.bodyIndent) throw new Error(`Python line ${lineIndex + 1}: match the indentation of the other commands in this block.`);
    } else if (indent !== 0) {
      throw new Error(`Python line ${lineIndex + 1}: unexpected indentation.`);
    }

    const forMatch = trimmed.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\(([^)]*)\):$/);
    if (forMatch) {
      const variable = forMatch[1];
      const parts = forMatch[2].split(",").map((part) => part.trim()).filter(Boolean);
      if (parts.length < 1 || parts.length > 2) throw new Error(`Python line ${lineIndex + 1}: range accepts one or two arguments.`);
      const start = parts.length === 1 ? "0" : parts[0];
      const end = parts.length === 1 ? parts[0] : parts[1];
      output.push(`${" ".repeat(indent)}for (let ${variable} = ${start}; ${variable} < ${end}; ${variable} += 1) { await _step();`);
      stack.push({ indent, type: "for" });
      pendingIndent = indent;
      return;
    }

    const ifMatch = trimmed.match(/^if\s+(.+):$/);
    if (ifMatch) {
      output.push(`${" ".repeat(indent)}if (${convertPythonCondition(ifMatch[1])}) {`);
      stack.push({ indent, type: "if" });
      pendingIndent = indent;
      return;
    }

    const whileMatch = trimmed.match(/^while\s+(.+):$/);
    if (whileMatch) {
      output.push(`${" ".repeat(indent)}while (${convertPythonCondition(whileMatch[1])}) { await _step();`);
      stack.push({ indent, type: "while" });
      pendingIndent = indent;
      return;
    }

    if (trimmed.endsWith(":")) {
      throw new Error(`Python line ${lineIndex + 1}: I only understand for, if, else, and while blocks.`);
    }

    const command = /^(roll|turn|set_heading|setHeading|set_color|setColor|flash_colour_code|flash_color_code|flashColourCode|flashColorCode|collect|wait|stop|say)\(.*\)$/.test(trimmed);
    const assignment = trimmed.match(/^([A-Za-z_]\w*)\s*=\s*([^=].*)$/);
    if (command) {
      output.push(`${" ".repeat(indent)}await ${trimmed};`);
      if (trimmed === "stop()") output.push("return;");
    } else if (assignment) {
      const name = assignment[1];
      variables.add(name);
      output.push(`${" ".repeat(indent)}${name} = ${convertPythonCondition(assignment[2])};`);
    } else if (trimmed === "pass") {
      output.push("await _step();");
    } else {
      throw new Error(`Python line ${lineIndex + 1}: use a command from the reference, a variable, or a for / while / if / else block.`);
    }
  });

  if (pendingIndent !== null) throw new Error("Add an indented command after the final block heading.");
  closeTo(-1);
  return (variables.size ? `let ${[...variables].join(", ")};\n` : "") + output.join("\n");
}

function validateMissionConcepts(code) {
  code = code.split(/\r?\n/).map(stripPythonComment).join("\n");
  if (currentMission.requiresLoop && !/\bfor\s+\w+\s+in\s+range\s*\(|\bwhile\s+.+:/.test(code)) {
    return "This rank practises loops. Keep it simple: use a loop like for step in range(1, 3):";
  }
  if (currentMission.requiresIfElse && !/\bif\s+[\s\S]*?:[\s\S]*\belse\s*:/.test(code)) {
    return "This rank practises branching. Add one if / else decision to choose between collect() and flash_colour_code().";
  }
  return "";
}

function stopRun() {
  if (!running) return;
  abortRun = true;
  stopBtn.disabled = true;
  addLog("Stopped by user.");
  updateMissionProgress();
}

function getStorageSnapshot() {
  return {
    studentName,
    completedMissions: [...completedMissions],
    savedMissionCode: Object.fromEntries(savedMissionCode),
    missionDrafts: Object.fromEntries(missionDrafts),
    missionStats: Object.fromEntries(missionStats),
    unlockedHints: [...unlockedHints],
    awardedCertificates: [...awardedCertificates],
    lastMissionId,
  };
}

function persistProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getStorageSnapshot()));
    document.querySelector("#saveStatus").textContent = "Saved on this browser";
  } catch (error) {
    document.querySelector("#saveStatus").textContent = "Browser storage unavailable. Use Save code to keep your program.";
  }
}

function hydrateProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    studentName = data.studentName || "";
    completedMissions.clear();
    (data.completedMissions || []).forEach((id) => completedMissions.add(id));
    savedMissionCode.clear();
    Object.entries(data.savedMissionCode || {}).forEach(([id, code]) => savedMissionCode.set(id, code));
    missionDrafts.clear();
    Object.entries(data.missionDrafts || {}).forEach(([id, code]) => missionDrafts.set(id, code));
    missionStats.clear();
    missions.forEach(mission => {
      const stored = data.missionStats?.[mission.id];
      if (!stored || typeof stored !== "object") return;
      const count = value => Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
      const restoreScore = score => {
        if (!score || !Number.isFinite(score.distance) || score.distance < 0 || !Number.isFinite(score.commands) || score.commands < 1 || !Number.isFinite(score.attempts) || score.attempts < 1) return null;
        const limits = {completion: 500, attempts: 200, safety: 100, independence: 100, efficiency: 100};
        if (!score.parts || Object.entries(limits).some(([part, limit]) => !Number.isInteger(score.parts[part]) || score.parts[part] < 0 || score.parts[part] > limit)) return null;
        const parts = Object.fromEntries(Object.keys(limits).map(part => [part, score.parts[part]]));
        const points = Object.values(parts).reduce((sum, value) => sum + value, 0);
        if (parts.completion !== 500 || score.points !== points || !Number.isInteger(score.routePoints) || score.routePoints < 0 || score.routePoints > 60 || !Number.isInteger(score.commandPoints) || score.commandPoints < 0 || score.commandPoints > 40 || score.routePoints + score.commandPoints !== parts.efficiency) return null;
        // Keep the earned result intact even if a later app update changes a map or reference.
        return {points, parts, attempts: count(score.attempts), collisions: count(score.collisions), hintUsed: score.hintUsed === true, distance: score.distance, commands: count(score.commands), routePoints: score.routePoints, commandPoints: score.commandPoints};
      };
      const lastScore = restoreScore(stored.lastScore);
      const best = restoreScore(stored.best);
      missionStats.set(mission.id, {attempts: count(stored.attempts), collisions: count(stored.collisions), hintUsed: stored.hintUsed === true, lastScore, best: best && (!lastScore || best.points >= lastScore.points) ? best : lastScore});
    });
    unlockedHints.clear();
    if (Array.isArray(data.unlockedHints) && data.unlockedHints.length) {
      data.unlockedHints.forEach((id) => unlockedHints.add(id));
    } else {
      missions.forEach((mission) => unlockedHints.add(mission.id));
    }
    awardedCertificates.clear();
    (data.awardedCertificates || []).forEach((rank) => awardedCertificates.add(rank));
    lastMissionId = data.lastMissionId || missions[0].id;
  } catch (error) {
    console.warn("Could not load saved progress", error);
  }
}

function updateStudentReadout() {
  mentorReadout.textContent = studentName
    ? `${studentName} is logged in on this computer. Completed missions stay saved locally.`
    : "";
}

function updateCompass() {
  if (!robot) return;
  const heading = ((Math.round(robot.heading) % 360) + 360) % 360;
  if (compassNeedle) compassNeedle.style.transform = `translate(-50%, -100%) rotate(${heading}deg)`;
  if (headingReadout) headingReadout.textContent = `Heading: ${heading}°`;
}

function updateHintUI() {
  const unlocked = unlockedHints.has(currentMission.id) || completedMissions.has(currentMission.id);
  hintBtn.disabled = !unlocked;
  hintOutput.textContent = unlocked
    ? getMissionStats().hintUsed ? "Hint already used for this mission. Reopen it freely; there is no further point cost." : "Need a hand? A hint helps plan your route and costs 20 points from the independent-work bonus once per mission."
    : "Locked. Complete more missions to unlock this hint.";
}

function updateCertificateUI() {
  const rankIndex = currentMission.rankIndex;
  const allComplete = allRankMissionsComplete(rankIndex);
  const awarded = awardedCertificates.has(rankIndex);
  rankWordOutput.textContent = `${currentMission.rank}: ${completedMissionCount(rankIndex)} of 4 missions complete.`;
  rankGuessBtn.textContent = awarded ? "Download Again" : "Download Certificate";
  rankGuessBtn.disabled = !allComplete || !studentName;
  rankGuessOutput.textContent = !studentName
    ? "Enter your name to personalise certificates."
    : allComplete
      ? "Certificate unlocked for this rank."
      : "Complete all four missions in this rank to unlock the certificate.";
}

function drawCertificate(rankIndex) {
  const missionRank = missions.find((mission) => mission.rankIndex === rankIndex)?.rank || `Rank ${rankIndex + 1}`;
  const certCanvas = document.createElement("canvas");
  certCanvas.width = 1600;
  certCanvas.height = 1100;
  const certCtx = certCanvas.getContext("2d");

  const bg = certCtx.createLinearGradient(0, 0, certCanvas.width, certCanvas.height);
  bg.addColorStop(0, "#0b1220");
  bg.addColorStop(1, "#402515");
  certCtx.fillStyle = bg;
  certCtx.fillRect(0, 0, certCanvas.width, certCanvas.height);

  certCtx.strokeStyle = "#f7c948";
  certCtx.lineWidth = 16;
  certCtx.strokeRect(44, 44, certCanvas.width - 88, certCanvas.height - 88);
  certCtx.lineWidth = 4;
  certCtx.strokeStyle = "#6bd2ff";
  certCtx.strokeRect(78, 78, certCanvas.width - 156, certCanvas.height - 156);

  certCtx.fillStyle = "#eef8f2";
  certCtx.textAlign = "center";
  certCtx.font = "700 46px Georgia, serif";
  certCtx.fillText("Planet Explorer Missions", certCanvas.width / 2, 180);
  certCtx.font = "700 78px Georgia, serif";
  certCtx.fillText("Certificate of Achievement", certCanvas.width / 2, 300);
  certCtx.font = "500 34px Inter, Arial, sans-serif";
  certCtx.fillText("This certifies that", certCanvas.width / 2, 420);
  certCtx.font = "700 72px Georgia, serif";
  certCtx.fillStyle = "#ffd0a8";
  certCtx.fillText(studentName, certCanvas.width / 2, 535, 1350);
  certCtx.fillStyle = "#eef8f2";
  certCtx.font = "500 34px Inter, Arial, sans-serif";
  certCtx.fillText("successfully completed all missions in", certCanvas.width / 2, 635);
  certCtx.font = "700 54px Georgia, serif";
  certCtx.fillText(missionRank, certCanvas.width / 2, 730, 1360);
  certCtx.font = "500 28px Inter, Arial, sans-serif";
  certCtx.fillText(`Awarded on ${new Date().toLocaleDateString("en-AU", { timeZone: "Australia/Sydney" })}`, certCanvas.width / 2, 845);
  certCtx.fillText(`${PLANETS[rankIndex].name} · ${PLANETS[rankIndex].type}`, certCanvas.width / 2, 900);

  const link = document.createElement("a");
  link.href = certCanvas.toDataURL("image/png");
  link.download = `${studentName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${missionRank.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-certificate.png`;
  link.click();
}

function downloadCurrentCertificate() {
  const rankIndex = currentMission.rankIndex;
  if (!studentName) {
    rankGuessOutput.textContent = "Enter your name before downloading a certificate.";
    mentorOverlay.classList.remove("hidden");
    return;
  }
  if (!allRankMissionsComplete(rankIndex)) {
    rankGuessOutput.textContent = "Complete all four missions in this rank before downloading the certificate.";
    return;
  }
  awardedCertificates.add(rankIndex);
  drawCertificate(rankIndex);
  updateCertificateUI();
  persistProgress();
  addLog(`Certificate downloaded for ${currentMission.rank}.`, "success");
}

function completeMissionProgress() {
  if (!completedMissions.has(currentMission.id)) {
    completedMissions.add(currentMission.id);
    refreshMissionOptionLabels();
    addLog(`Mission saved as complete: ${currentMission.name}`, "success");
  }
  missions.forEach((mission) => unlockedHints.add(mission.id));
  if (allRankMissionsComplete(currentMission.rankIndex) && !awardedCertificates.has(currentMission.rankIndex)) {
    addLog(`All missions complete for ${currentMission.rank}. Certificate unlocked.`, "success");
  }
  updateHintUI();
  updateCertificateUI();
  persistProgress();
}

function updateMissionProgress() {
  const goals = currentMission.beacons.length;
  scoreReadout.textContent = `${robot?.visited.size || 0} / ${goals} goals`;
  if (!robot) return;
  objectiveList.querySelectorAll("li").forEach((item) => {
    const complete = robot.visited.has(Number(item.dataset.index));
    const status = item.querySelector(".objective-status");
    item.classList.toggle("complete", complete);
    item.classList.toggle("pending", !complete);
    if (status) status.textContent = complete ? "★" : "○";
  });
  missionStatus.textContent = robot.crashed ? "Crashed" : robot.visited.size === goals ? "Mission complete" : running ? "Running" : "Ready";
  document.querySelector("#nextMissionBtn").hidden = !completedMissions.has(currentMission.id) || currentMission === missions[missions.length - 1];
  updateExpeditionUI();
  updateScoreUI();
}

async function runStudentCode() {
  if (running || functionGuide.open) return;
  if (!studentName) {
    addLog("Enter your name before starting the mission.", "error");
    mentorOverlay.classList.remove("hidden");
    return;
  }
  if (briefedMissionId !== currentMission.id || !briefingOverlay.hidden) {
    showMissionBriefing();
    return;
  }
  running = true;
  programSteps = 0;
  resetAfterRun = false;
  abortRun = false;
  setRunControls(true);
  requestSceneAnimation();
  clearLog();
  resetRobot();
  const stats = getMissionStats();
  stats.attempts++;
  activeAttempt = {distance: 0, commands: 0, collided: false};
  persistProgress();
  commandQueue = Promise.resolve();
  updateMissionProgress();

  const conceptError = validateMissionConcepts(codeEditor.value);
  if (conceptError) {
    addLog(conceptError, "error");
    running = false;
    activeAttempt = null;
    setRunControls(false);
    updateMissionProgress();
    return;
  }

  const api = {
    _step: async () => {
      assertRunning();
      if (++programSteps > 10000) throw new Error("Loop limit reached. Check the loop condition and try again.");
      // Yield even for loops with no rover commands so Stop remains responsive.
      if (programSteps % 25 === 0) await new Promise(resolve => window.setTimeout(resolve, 0));
    },
    roll,
    turn,
    setHeading,
    setColor,
    flashColorCode,
    flashColourCode,
    set_heading: setHeading,
    set_color: setColor,
    flash_color_code: flashColorCode,
    flash_colour_code: flashColorCode,
    collect,
    wait,
    stop,
    say,
  };

  try {
    const translatedCode = translatePythonCode(codeEditor.value);
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const studentProgram = new AsyncFunction(...Object.keys(api), `"use strict";\n${translatedCode}`);
    await studentProgram(...Object.values(api));
    await commandQueue;
    await sleep(missionCompleteDelay);
    if (!abortRun && !robot.crashed && robot.visited.size === currentMission.beacons.length) {
      savedMissionCode.set(currentMission.id, codeEditor.value);
      missionDrafts.set(currentMission.id, codeEditor.value);
      addLog("Mission complete. Nicely coded.", "success");
      const result = calculateMissionScore(currentMission, stats, activeAttempt);
      const improved = !stats.best || result.points > stats.best.points;
      stats.lastScore = result;
      if (improved) stats.best = result;
      refreshMissionOptionLabels();
      addLog(`Mission score: ${result.points} / 1000. ${improved ? "New personal best!" : `Personal best stays at ${stats.best.points}.`}`, "success");
      completeMissionProgress();
    } else if (!robot.crashed && !abortRun) {
      addLog("Run finished. Some objectives are still waiting.");
      persistProgress();
    }
  } catch (error) {
    if (error.message !== "Run stopped") addLog(error.message, "error");
  } finally {
    running = false;
    activeAttempt = null;
    persistProgress();
    setRunControls(false);
    if (resetAfterRun) { resetRobot(); addLog("Rover reset."); }
    updateMissionProgress();
    draw();
  }
}

function saveStudentName() {
  const nextName = (studentNameInput?.value || "").trim();
  if (!nextName) {
    document.querySelector("#nameError").textContent = "Enter your explorer name to begin.";
    studentNameInput.focus();
    return;
  }
  studentName = nextName;
  document.querySelector("#nameError").textContent = "";
  mentorOverlay.classList.add("hidden");
  updateStudentReadout();
  updateCertificateUI();
  persistProgress();
  addLog(`${studentName} is ready to explore ${currentMission.planet.name}.`, "success");
  if (briefedMissionId !== currentMission.id) showMissionBriefing();
  else codeEditor.focus();
}

function setRunControls(active) {
  runBtn.disabled = active;
  stopBtn.disabled = !active;
  missionSelect.disabled = active;
  resetCodeBtn.disabled = active;
  codeEditor.readOnly = active;
  document.querySelector("#nextMissionBtn").disabled = active;
  document.querySelector("#editNameBtn").disabled = active;
  document.querySelector("#viewBriefingBtn").disabled = active;
  document.querySelector("#openFunctionGuideBtn").disabled = active;
  document.querySelector("#codeFunctionGuideBtn").disabled = active;
}

function updateLineNumbers() {
  const lines = codeEditor.value.split("\n").length;
  document.querySelector("#lineNumbers").textContent = Array.from({length: lines}, (_, i) => i + 1).join("\n");
  document.querySelector("#lineNumbers").scrollTop = codeEditor.scrollTop;
}

function updateExpeditionUI() {
  document.querySelector("#totalProgress").textContent = `${completedMissions.size} of ${missions.length} missions`;
  document.querySelector("#totalProgressBar").style.width = `${completedMissions.size / missions.length * 100}%`;
  const points = missions.reduce((total, mission) => total + (missionStats.get(mission.id)?.best?.points || 0), 0);
  document.querySelector("#expeditionPoints").textContent = `${points.toLocaleString()} / 16,000 points`;
  const track = document.querySelector("#rankTrack");
  if (!track.children.length) {
    for (let rank = 0; rank < 4; rank++) {
      const item = document.createElement("div");
      item.className = "rank-step";
      const number = document.createElement("span");
      number.className = "rank-number";
      const text = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = PLANETS[rank].name;
      text.append(title, document.createElement("small"));
      item.append(number, text);
      track.append(item);
    }
  }
  Array.from(track.children).forEach((item, rank) => {
    const count = completedMissionCount(rank);
    item.classList.toggle("active", currentMission.rankIndex === rank);
    item.classList.toggle("complete", count === 4);
    item.querySelector(".rank-number").textContent = count === 4 ? "✓" : String(rank + 1).padStart(2, "0");
    item.querySelector("small").textContent = `${PLANETS[rank].type} · ${count} / 4`;
  });
}

function boot() {
  ["#openFunctionGuideBtn", "#codeFunctionGuideBtn"].forEach(selector => {
    const button = document.querySelector(selector);
    button.addEventListener("click", () => openFunctionGuide(button));
  });
  document.querySelector("#closeFunctionGuideBtn").addEventListener("click", () => functionGuide.close());
  document.querySelector("#functionGuideSearch").addEventListener("input", renderFunctionGuideList);
  functionGuide.addEventListener("close", () => {functionGuideOpener?.focus({preventScroll: true});});
  functionGuide.addEventListener("keydown", event => {
    if (event.key === "Escape") {event.preventDefault(); functionGuide.close();}
    if (event.key === "Tab") {
      const first = document.querySelector("#closeFunctionGuideBtn"), last = document.querySelector("#functionGuideDetail");
      if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
    }
  });
  document.querySelector("#beginMissionBtn").addEventListener("click", beginMission);
  document.querySelector("#viewBriefingBtn").addEventListener("click", showMissionBriefing);
  briefingOverlay.addEventListener("keydown", event => {
    if (event.key === "Tab") {
      event.preventDefault();
      document.querySelector("#beginMissionBtn").focus();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) { sceneAnimation.lastTime = null; requestSceneAnimation(); }
  });
  motionPreference?.addEventListener("change", event => {
    reducedMotion = event.matches;
    if (reducedMotion) sceneAnimation.particles = [];
    requestSceneAnimation();
  });
  hydrateProgress();
  missions.forEach((mission) => unlockedHints.add(mission.id));
  populateMissions();
  refreshMissionOptionLabels();
  refreshMissionLocks();
  document.querySelector("#editNameBtn").addEventListener("click", () => {
    studentNameInput.value = studentName;
    mentorOverlay.classList.remove("hidden");
    studentNameInput.focus();
  });
  document.querySelector("#nextMissionBtn").addEventListener("click", () => {
    const index = missions.indexOf(currentMission);
    if (index < missions.length - 1) loadMission(missions[index + 1].id);
  });
  document.querySelector("#downloadCodeBtn").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([codeEditor.value], {type: "text/x-python"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentMission.id}.py`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.addEventListener("keydown", event => {
    if (!briefingOverlay.hidden || functionGuide.open) return;
    if (event.key === "Escape" && studentName && !mentorOverlay.classList.contains("hidden")) {
      mentorOverlay.classList.add("hidden");
      document.querySelector("#editNameBtn").focus();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && mentorOverlay.classList.contains("hidden")) {
      event.preventDefault();
      runStudentCode();
    }
  });
  missionSelect.addEventListener("change", () => loadMission(missionSelect.value));
  runBtn.addEventListener("click", runStudentCode);
  stopBtn.addEventListener("click", stopRun);
  hintBtn.addEventListener("click", showHint);
  rankGuessBtn.addEventListener("click", downloadCurrentCertificate);
  document.querySelector("#saveNameBtn")?.addEventListener("click", saveStudentName);
  document.querySelector("#studentNameInput")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveStudentName();
  });
  codeEditor.addEventListener("keydown", (event) => {
    if (codeEditor.readOnly) return;
    if (event.key !== "Tab") return;
    event.preventDefault();
    const start = codeEditor.selectionStart;
    const end = codeEditor.selectionEnd;
    codeEditor.value = `${codeEditor.value.slice(0, start)}  ${codeEditor.value.slice(end)}`;
    codeEditor.selectionStart = start + 2;
    codeEditor.selectionEnd = start + 2;
    codeEditor.dispatchEvent(new Event("input"));
  });
  codeEditor.addEventListener("input", () => {
    updateLineNumbers();
    missionDrafts.set(currentMission.id, codeEditor.value);
    persistProgress();
  });
  resetBtn.addEventListener("click", () => {
    if (running) { resetAfterRun = true; stopRun(); }
    else { resetRobot(); addLog("Rover reset."); }
  });
  resetCodeBtn.addEventListener("click", () => {
    codeEditor.value = currentMission.starter;
    updateLineNumbers();
    missionDrafts.set(currentMission.id, codeEditor.value);
    persistProgress();
    addLog("Starter code restored.");
  });
  window.addEventListener("resize", () => {
    resizeCanvasForDisplay();
    draw();
  });
  codeEditor.addEventListener("scroll", updateLineNumbers);
  mentorOverlay.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    if (event.shiftKey && document.activeElement === studentNameInput) {
      event.preventDefault(); saveNameBtn.focus();
    } else if (!event.shiftKey && document.activeElement === saveNameBtn) {
      event.preventDefault(); studentNameInput.focus();
    }
  });

  resizeCanvasForDisplay();
  loadMission(lastMissionId);
  updateHintUI();
  updateStudentReadout();
  updateCertificateUI();
  if (studentName) {
    mentorOverlay.classList.add("hidden");
    if (studentNameInput) studentNameInput.value = studentName;
    showMissionBriefing();
  } else {
    mentorOverlay.classList.remove("hidden");
    studentNameInput.focus();
  }
}

boot();
