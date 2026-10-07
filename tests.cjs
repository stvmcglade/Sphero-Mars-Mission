const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

class Element {
  constructor(tag = 'div') { this.tag = tag; this.children = []; this.dataset = {}; this.style = {setProperty(name, value) {this[name] = value;}}; this.attributes = {}; this.value = ''; this._text = ''; this.events = {}; this.classes = new Set(); this.classList = {add: x => this.classes.add(x), remove: x => this.classes.delete(x), contains: x => this.classes.has(x), toggle: (x, yes) => yes ? this.classes.add(x) : this.classes.delete(x)}; }
  set textContent(value) { this._text = value; this.children = []; }
  get textContent() { return this._text; }
  set className(value) { this.classes = new Set(value.split(' ')); }
  append(...items) { this.children.push(...items); }
  querySelectorAll(selector) { const result = []; for (const child of this.children) { if (selector === child.tag || (selector.startsWith('.') && child.classes.has(selector.slice(1)))) result.push(child); result.push(...child.querySelectorAll(selector)); } return result; }
  querySelector(selector) { return this.querySelectorAll(selector)[0]; }
  addEventListener(name, callback) { this.events[name] = callback; }
  dispatchEvent(event) { this.events[event.type]?.(event); }
  focus() { context.document.activeElement = this; }
  showModal() { this.open = true; }
  close() { if (!this.open) return; this.open = false; this.events.close?.({type:'close'}); }
  setAttribute(name, value) { this.attributes[name] = value; }
  click() { this.events.click?.(); }
  getBoundingClientRect() { return {width: 1000, height: 450}; }
  getContext() { return new Proxy({}, { get: (_, name) => name === 'measureText' ? text => ({width: text.length * 8}) : name === 'createLinearGradient' || name === 'createRadialGradient' ? () => ({addColorStop() {}}) : () => {}, set: () => true }); }
  toDataURL() { return 'data:image/png;base64,test'; }
}
const elements = new Map();
const element = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
const storage = new Map();
let clock = 0;
let timerExtra = 0;
let frameSequence = 0;
const animationFrames = new Map();
const context = vm.createContext({
  console, Blob, URL, Event,
  document: { querySelector: element, createElement: tag => new Element(tag), addEventListener() {} },
  localStorage: {setItem: (key, value) => storage.set(key, value), getItem: key => storage.get(key)},
  performance: { now: () => clock },
  window: {devicePixelRatio: 1, addEventListener() {},
    requestAnimationFrame: callback => {const id = ++frameSequence; animationFrames.set(id, callback); return id;},
    cancelAnimationFrame: id => animationFrames.delete(id),
    setTimeout: (callback, ms) => setImmediate(() => {clock += Math.max(1, ms) + timerExtra; callback();})}
});
const run = code => vm.runInContext(code, context);
vm.runInContext(fs.readFileSync('app.js', 'utf8'), context, {timeout: 5000});
let checks = 0;
const check = (condition, label) => { assert.ok(condition, label); checks++; };

async function runMissionProgram() {
  run('beginMission()');
  await run('runStudentCode()');
}

function routeProgram(mission) {
  const radius = 27;
  const safe = (x, y) => x >= radius && x <= 920 - radius && y >= radius && y <= 620 - radius && mission.hazards.every(h => Math.hypot(x - Math.max(h.x, Math.min(x, h.x + h.w)), y - Math.max(h.y, Math.min(y, h.y + h.h))) >= radius);
  const result = ['set_color("orange")'];
  let position = { ...mission.start };
  const move = destination => {
    const dx = destination.x - position.x, dy = destination.y - position.y;
    const distance = Math.hypot(dx, dy);
    if (distance) result.push(`roll(70, ${((Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360).toFixed(5)}, ${(distance / 89.6).toFixed(5)})`);
    position = destination;
  };
  move({x: Math.round(position.x / 10) * 10, y: Math.round(position.y / 10) * 10});
  for (const beacon of mission.beacons) {
    const queue = [{...position, parent: -1}], seen = new Set([`${position.x},${position.y}`]);
    let found = -1;
    for (let i = 0; i < queue.length; i++) {
      const point = queue[i];
      if (Math.hypot(point.x - beacon.x, point.y - beacon.y) <= beacon.r - 4) { found = i; break; }
      for (const [dx, dy] of [[10,0],[-10,0],[0,10],[0,-10]]) {
        const x = point.x + dx, y = point.y + dy, key = `${x},${y}`;
        if (!seen.has(key) && safe(x,y)) {seen.add(key); queue.push({x,y,parent:i});}
      }
    }
    assert.ok(found >= 0, `Reachable checkpoint: ${mission.name} / ${beacon.label}`);
    const path = [];
    for (let i = found; queue[i].parent >= 0; i = queue[i].parent) path.unshift(queue[i]);
    for (let i = 0; i < path.length; i++) {
      const current = path[i], next = path[i + 1];
      const previous = i ? path[i - 1] : position;
      if (!next || (current.x - previous.x !== next.x - current.x) || (current.y - previous.y !== next.y - current.y)) move({x:current.x,y:current.y});
    }
    result.push(beacon.action === 'collect' ? 'collect()' : `flash_colour_code("${beacon.code}")`);
  }
  if (mission.requiresLoop) return `for step in range(1, 2):\n  if step == 1:\n${result.map(line => '    ' + line).join('\n')}\n  else:\n    stop()\nstop()`;
  return result.join('\n');
}

(async () => {
  check(run('missions.length') === 16, '16 missions available');
  check(run('briefingOverlay.hidden && !studentName'), 'Name entry comes before the first mission scenario');
  check(run('new Set(missions.map(m => m.theme)).size === 4 && PLANETS.every(p => missions.filter(m => m.theme === p.id).length === 4)'), 'Four different planet worlds, one per rank');
  check(run('new Set(PLANETS.map(p => p.floor)).size === 4 && new Set(PLANETS.map(p => p.type)).size === 4'), 'Distinct planet surfaces and types');
  check(run('new Set(missions.map(m => JSON.stringify(m.hazards.map(({x,y,w,h}) => [x,y,w,h])))).size === 16'), 'All 16 missions have different obstacle positions and shapes');
  check(run('missions.every(m => new Set(m.hazards.map(h => h.kind)).size >= 3)'), 'Every mission mixes at least three terrain types');
  check(run('missions.every(m => m.hazards.length === [3,4,4,5][m.rankIndex])'), 'Obstacle counts build up across the ranks');
  for (let i = 0; i < 16; i++) {
    const mission = JSON.parse(run(`JSON.stringify(missions[${i}])`));
    const distanceFrom = (point, h) => Math.hypot(point.x - Math.max(h.x, Math.min(point.x, h.x + h.w)), point.y - Math.max(h.y, Math.min(point.y, h.y + h.h)));
    check(mission.hazards.every(h => h.x > 0 && h.y > 0 && h.w > 0 && h.h > 0 && h.x + h.w < 920 && h.y + h.h < 620), `Obstacles stay inside arena: mission ${i + 1}`);
    check(mission.hazards.every(h => distanceFrom(mission.start, h) >= 45 && mission.beacons.every(b => distanceFrom(b, h) >= b.r + 27)), `Start and checkpoint approach areas remain clear: mission ${i + 1}`);
    const layout = JSON.stringify(mission.hazards);
    run(`loadMission(missions[${i}].id); resetRobot(); loadMission(missions[${(i + 1) % 16}].id); loadMission(missions[${i}].id)`);
    check(run('JSON.stringify(currentMission.hazards)') === layout, `Obstacle layout stays fixed on retries and return: mission ${i + 1}`);
  }
  run('loadMission(missions[0].id)');
  check(run('missions.map(m => m.id).join(",")') === [1,2,3,4].flatMap(rank => ['beacons','relay','samples','return'].map(route => `rank-${rank}-${route}${rank >= 3 ? '-year8' : ''}`)).join(','), 'Existing mission IDs remain compatible with student progress');
  check(run('Math.abs(headingToUnitVector(0).y + 1) < .001 && Math.abs(headingToUnitVector(90).x - 1) < .001'), 'Compass and movement agree');
  run('studentNameInput.value = "Test Explorer"; saveStudentName()');
  check(run('!briefingOverlay.hidden && document.querySelector(".app-shell").inert && briefedMissionId === null'), 'Student sees the scenario before starting');
  check(run('getMissionStats().attempts === 0 && !getMissionStats().best'), 'Opening a mission does not count as an attempt or award points');
  await run('runStudentCode()');
  check(run('!running && !briefingOverlay.hidden && robot.visited.size === 0'), 'Run cannot bypass the mission briefing');
  check(run('getMissionStats().attempts === 0'), 'Blocked Run before briefing acknowledgement does not count');
  run('beginMission()');
  check(run('briefingOverlay.hidden && !document.querySelector(".app-shell").inert && briefedMissionId === currentMission.id && !running'), 'Start mission opens the workspace without running code');
  const beforeGuide = run('JSON.stringify(getStorageSnapshot())');
  const guideCode = element('#codeEditor').value;
  element('#openFunctionGuideBtn').click();
  check(run('functionGuide.open') && run('document.activeElement === document.querySelector("#closeFunctionGuideBtn")'), 'Header button opens a modal guide with keyboard focus inside it');
  element('#functionGuide').dispatchEvent({type:'keydown',key:'Tab',shiftKey:true,preventDefault(){}});
  check(run('document.activeElement === document.querySelector("#functionGuideDetail")'), 'Shift+Tab at the start wraps to the explanation inside the guide');
  element('#functionGuide').dispatchEvent({type:'keydown',key:'Tab',shiftKey:false,preventDefault(){}});
  check(run('document.activeElement === document.querySelector("#closeFunctionGuideBtn")'), 'Tab at the end wraps back to Close inside the guide');
  const source = fs.readFileSync('app.js','utf8');
  const apiBlock = source.match(/const api = \{([\s\S]*?)\n  \};/)[1];
  const apiNames = [...apiBlock.matchAll(/^ {4}([A-Za-z_]\w*)(?:,|:)/gm)].map(match => match[1]).filter(name => name !== '_step');
  const guideNames = JSON.parse(run('JSON.stringify(FUNCTION_GUIDE_ENTRIES.flatMap(entry => [entry.id, ...(entry.aliases || [])]))'));
  check(apiNames.every(name => guideNames.includes(name)), 'Guide covers every student rover function and accepted alias exposed by the simulator');
  for (const example of JSON.parse(run('JSON.stringify(FUNCTION_GUIDE_ENTRIES.map(entry => entry.example))'))) {
    element('#codeEditor').value = example;
    check(run('translatePythonCode(codeEditor.value)').length > 0, 'Guide example is valid simulator syntax');
  }
  element('#codeEditor').value = guideCode;
  await run('runStudentCode()');
  check(run('!running && getMissionStats().attempts === 0'), 'Run is blocked while the guide is open without counting an attempt');
  element('#functionGuideSearch').value = 'flash_color_code';
  element('#functionGuideSearch').dispatchEvent(new Event('input'));
  check(element('#functionGuideList').querySelectorAll('button').length === 1 && element('#functionGuideList').querySelector('button').dataset.guideId === 'flash_colour_code', 'Searching an alternate spelling finds its canonical explanation');
  element('#functionGuideList').querySelector('button').click();
  check(run('selectedGuideId === "flash_colour_code"') && element('#guideAliases').textContent.includes('flash_color_code()'), 'Selecting a function shows its accepted spellings');
  element('#functionGuideSearch').value = 'no-such-command';
  element('#functionGuideSearch').dispatchEvent(new Event('input'));
  check(element('#functionGuideList').querySelectorAll('button').length === 0 && element('#functionGuideList').children[0].textContent.includes('No matches'), 'Unknown searches have a clear empty state');
  element('#closeFunctionGuideBtn').click();
  check(run('!functionGuide.open && document.activeElement === document.querySelector("#openFunctionGuideBtn")'), 'Close returns keyboard focus to the header opener');
  element('#codeFunctionGuideBtn').click();
  check(run('functionGuide.open') && element('#functionGuideSearch').value === '' && element('#functionGuideList').querySelectorAll('button').length > 9, 'Editor button opens the guide with a fresh search and coding structures available');
  let escapeHandled = false;
  element('#functionGuide').dispatchEvent({type:'keydown',key:'Escape',preventDefault(){escapeHandled=true;}});
  check(escapeHandled && !run('functionGuide.open'), 'Escape closes the guide in one press, including while searching');
  check(run('document.activeElement === document.querySelector("#codeFunctionGuideBtn")'), 'Close returns focus to the editor opener');
  check(run('JSON.stringify(getStorageSnapshot())') === beforeGuide && element('#codeEditor').value === guideCode, 'Guide browsing preserves student code, progress, attempts, collisions, hint use, and scores');
  const initialProgram = element('#codeEditor').value;
  element('#viewBriefingBtn').click();
  check(run('!briefingOverlay.hidden && !running') && element('#codeEditor').value === initialProgram, 'Read scenario reopens the briefing without changing student code');
  element('#beginMissionBtn').click();
  check(run('briefingOverlay.hidden && briefedMissionId === currentMission.id'), 'Scenario button returns to the same mission');
  for (let i = 0; i < 16; i++) {
    run(`loadMission(missions[${i}].id); codeEditor.value = currentMission.starter`);
    check(run('!briefingOverlay.hidden && document.querySelector("#briefingStory").textContent === currentMission.story && document.querySelector("#briefingObjectives").children.length === currentMission.beacons.length && document.querySelector("#briefingPlanetName").textContent === currentMission.planet.name'), `Correct scenario and checklist for mission ${i + 1}`);
    await runMissionProgram();
    check(run('robot.visited.size < currentMission.beacons.length && !completedMissions.has(currentMission.id) && !robot.crashed'), `Starter is runnable but incomplete: mission ${i + 1}`);
    check(run('getMissionStats().attempts === 1 && getMissionStats().collisions === 0 && !getMissionStats().best'), `Incomplete run counts once without earning points: mission ${i + 1}`);
  }
  for (let i = 0; i < 16; i++) {
    run(`loadMission(missions[${i}].id)`);
    const mission = JSON.parse(run('JSON.stringify(currentMission)'));
    element('#codeEditor').value = routeProgram(mission);
    await runMissionProgram();
    check(run('completedMissions.has(currentMission.id) && !robot.crashed'), `Complete mission ${i + 1}: ${mission.name}`);
    check(run('getMissionStats().attempts === 2 && getMissionStats().best.points >= 500 && getMissionStats().best.points <= 980 && getMissionStats().lastScore.parts.attempts === 180 && getMissionStats().lastScore.distance > 0 && getMissionStats().lastScore.commands > 0'), `Completion earns bounded points with measured efficiency: mission ${i + 1}`);
    const successfulCode = element('#codeEditor').value;
    run(`loadMission(missions[${(i + 1) % 16}].id); loadMission(missions[${i}].id)`);
    check(element('#codeEditor').value === successfulCode, `Successful code restored on return: mission ${i + 1}`);
  }
  check(run('[0,1,2,3].every(allRankMissionsComplete)'), 'All four certificates unlock');
  run('downloadCurrentCertificate()');
  check(run('awardedCertificates.has(3)'), 'Personalised certificate export');
  run('loadMission(missions[15].id)');
  const completedCode = element('#codeEditor').value;
  element('#resetCodeBtn').click();
  check(element('#codeEditor').value !== completedCode, 'Starter button opens the incomplete scaffold');
  run('loadMission(missions[0].id); loadMission(missions[15].id)');
  check(element('#codeEditor').value === completedCode, 'Starter button does not overwrite the completed program');
  run('codeEditor.value = "# An unfinished edit\\nstop()"; codeEditor.dispatchEvent(new Event("input")); persistProgress(); completedMissions.clear(); savedMissionCode.clear(); missionDrafts.clear(); studentName = ""; hydrateProgress(); loadMission(missions[15].id)');
  check(element('#codeEditor').value === completedCode, 'Completed code survives storage reload and takes priority over later drafts');
  check(run('completedMissions.size === 16 && studentName === "Test Explorer"'), 'Progress and name survive storage round trip');
  const revisedCode = completedCode + '\n# My revised successful program';
  element('#codeEditor').value = revisedCode;
  await runMissionProgram();
  run('loadMission(missions[0].id); loadMission(missions[15].id)');
  check(element('#codeEditor').value === revisedCode, 'A new successful run updates the stored completed code');
  run('completedMissions.delete(missions[0].id); savedMissionCode.delete(missions[0].id); loadMission(missions[0].id); codeEditor.value = ""; codeEditor.dispatchEvent(new Event("input")); loadMission(missions[1].id); loadMission(missions[0].id)');
  check(element('#codeEditor').value === '', 'Unfinished empty drafts remain empty');
  run('codeEditor.value = "# My unfinished route\\nroll(70, 90, 1)"; codeEditor.dispatchEvent(new Event("input")); loadMission(missions[1].id); loadMission(missions[0].id)');
  check(element('#codeEditor').value === '# My unfinished route\nroll(70, 90, 1)', 'Unfinished student drafts remain on return');
  assert.throws(() => run('translatePythonCode("for step in range(3):\\nroll(70,90,1)")'), /indent/); checks++;
  assert.throws(() => run('translatePythonCode("else:\\n  stop()")'), /else must/); checks++;
  assert.throws(() => run('translatePythonCode("unknown_command()")'), /command from/); checks++;
  run('codeEditor.value = "while True:\\n  pass"');
  run('beginMission()');
  const pending = run('runStudentCode()');
  check(run('running && runBtn.disabled && missionSelect.disabled'), 'Run locks concurrent changes');
  run('openFunctionGuide()');
  check(run('!functionGuide.open && document.querySelector("#openFunctionGuideBtn").disabled && document.querySelector("#codeFunctionGuideBtn").disabled'), 'Guide cannot cover run controls while a program is running');
  const previousMission = run('currentMission.id');
  run('loadMission(missions[1].id)');
  check(run('currentMission.id') === previousMission, 'Mission stays fixed during run');
  element('#resetBtn').click();
  await pending;
  check(run('!running && !abortRun && robot.x === currentMission.start.x && !runBtn.disabled'), 'Reset cancels and settles the previous program');
  run('codeEditor.value = "roll(100, 270, 10)"');
  await runMissionProgram();
  check(run('robot.crashed && !running'), 'Boundary collision stops program');
  check(run('sceneAnimation.crash.kind === "boundary" && sceneAnimation.particles.some(p => p.kind === "spark") && sceneAnimation.particles.some(p => p.kind === "smoke")'), 'Boundary collision creates sparks and smoke');
  const crashTime = run('sceneAnimation.crash.started');
  const crashPosition = run('JSON.stringify({x:robot.x,y:robot.y,heading:robot.heading})');
  clock = crashTime + 200;
  run('animateSceneFrame(performance.now())');
  check(run('JSON.stringify({x:robot.x,y:robot.y,heading:robot.heading})') === crashPosition, 'Crash visuals do not change simulator position or heading');
  clock = crashTime + 3000;
  run('animateSceneFrame(performance.now())');
  check(run('sceneAnimation.particles.length === 0 && sceneAnimation.pulses.length === 0'), 'Transient crash effects expire');
  run('resetRobot()');
  check(run('!robot.crashed && sceneAnimation.crash === null && sceneAnimation.frame === null && sceneAnimation.particles.length === 0'), 'Reset clears crash state, particles, and pending frame');
  run('resetRobot(); robot.x = currentMission.hazards[0].x; robot.y = currentMission.hazards[0].y; checkProgress()');
  check(run('robot.crashed'), 'Terrain collision detected');
  check(run('sceneAnimation.crash.kind === "terrain"'), 'Terrain collision triggers the impact sequence');
  const particleCount = run('sceneAnimation.particles.length');
  run('checkProgress()');
  check(run('sceneAnimation.particles.length') === particleCount, 'One impact sequence per crash');
  run('loadMission(missions[1].id)');
  check(run('sceneAnimation.crash === null && sceneAnimation.particles.length === 0'), 'Switching missions clears crash effects');
  run('loadMission(missions[0].id); reducedMotion = true; robot.x = currentMission.hazards[0].x; robot.y = currentMission.hazards[0].y; checkProgress()');
  check(run('robot.crashed && sceneAnimation.crash !== null && sceneAnimation.particles.length === 0'), 'Reduced motion preserves crash feedback without particles');
  run('reducedMotion = false; resetRobot(); codeEditor.value = "roll(70, 90, 0.4)"');
  await runMissionProgram();
  check(run('sceneAnimation.wheelPhase > 0 && sceneAnimation.particles.some(p => p.kind === "dust") && !sceneAnimation.moving'), 'Movement animates wheel treads and dust, then settles');
  const turnPosition = run('JSON.stringify({x:robot.x,y:robot.y})');
  run('sceneAnimation.visualHeading = 0; robot.heading = 90; sceneAnimation.lastTime = null; animateSceneFrame(performance.now())');
  check(run('sceneAnimation.visualHeading > 0 && sceneAnimation.visualHeading < 90 && robot.heading === 90') && run('JSON.stringify({x:robot.x,y:robot.y})') === turnPosition, 'Visual turn interpolates without changing the actual route');
  run('const originalCollisionHazards = currentMission.hazards; currentMission.hazards = [{x:180,y:480,w:10,h:80,kind:"rock"}]; codeEditor.value = "roll(100, 90, 2)"');
  timerExtra = 1800;
  await runMissionProgram();
  timerExtra = 0;
  check(run('robot.crashed && robot.x < 180 && !running'), 'A delayed frame cannot skip a narrow obstacle');
  run('currentMission.hazards = originalCollisionHazards');
  run('abortRun = false; codeEditor.value = "for step in range(1, 3):\\n  say(step)"');
  await runMissionProgram();
  check(run('robot.message === "2" && !running'), 'Loop command arguments evaluated sequentially');
  run('codeEditor.value = "step = 0\\nwhile step < 3:\\n  step = step + 1\\n  say(step)"');
  await runMissionProgram();
  check(run('robot.message === "3" && !running'), 'Numeric variables and while conditions');
  run('codeEditor.value = "stop()\\nsay(99)"');
  await runMissionProgram();
  check(run('robot.message === ""'), 'stop() finishes the program');
  assert.throws(() => run('translatePythonCode("for step in range(3):\\n  say(step)\\n    stop()")'), /indentation/); checks++;
  run('codeEditor.value = "while True:\\n  pass"');
  await runMissionProgram();
  check(run('!running && programSteps === 10001'), 'Empty infinite loops stop at the limit');
  run('loadMission(missions[1].id)');
  const reference = JSON.parse(run('JSON.stringify(getScoringReference(currentMission))'));
  const directDistance = run('currentMission.beacons.reduce((sum, beacon, index) => {const previous = index ? currentMission.beacons[index - 1] : currentMission.start; return sum + Math.hypot(beacon.x - previous.x, beacon.y - previous.y);}, 0)');
  check(reference.distance > directDistance + 20, 'Route efficiency gives allowance for a real obstacle detour');
  run('const idealStats = {attempts:1, collisions:0, hintUsed:false}; const idealAttempt = {distance:getScoringReference(currentMission).distance, commands:getScoringReference(currentMission).commandBudget};');
  check(run('calculateMissionScore(currentMission, idealStats, idealAttempt).points') === 1000, 'First efficient independent safe completion can earn 1000 points');
  check(run('calculateMissionScore(currentMission, {...idealStats, attempts:3, collisions:2, hintUsed:true}, idealAttempt).points') === 900, 'Attempt, collision, and hint deductions add correctly');
  check(run('calculateMissionScore(currentMission, {...idealStats, attempts:100, collisions:100}, idealAttempt).points') === 700, 'Attempt and impact deductions are capped at their bonuses');
  check(run('calculateMissionScore(currentMission, idealStats, {...idealAttempt, distance:idealAttempt.distance*2}).parts.efficiency') === 70, 'Longer route earns fewer route efficiency points');
  check(run('calculateMissionScore(currentMission, idealStats, {...idealAttempt, commands:idealAttempt.commands*2}).parts.efficiency') === 80, 'Redundant executed commands earn fewer command efficiency points');
  const existingBest = run('getMissionStats().best.points');
  run('showHint(); showHint(); resetRobot(); loadMission(missions[2].id); loadMission(missions[1].id)');
  check(run('getMissionStats().hintUsed && getMissionStats().attempts === 2 && getMissionStats().best.points') === existingBest, 'Hint use persists and never lowers an already earned personal best');
  check(run('!getMissionStats(missions[2]).hintUsed'), 'Hint use is independent for each mission');
  run('codeEditor.value = "unknown_command()"');
  await runMissionProgram();
  check(run('getMissionStats().attempts === 3 && getMissionStats().best.points') === existingBest, 'Invalid code counts as one attempt without replacing a best score');
  run('codeEditor.value = "roll(100, 270, 10)"');
  await runMissionProgram();
  check(run('getMissionStats().attempts === 4 && getMissionStats().collisions === 1'), 'Boundary crash counts exactly one impact during a run');
  run('checkProgress(); checkProgress(); resetRobot(); beginMission(); codeEditor.value = "roll(70, 0, 1.5)\\nroll(70, 90, 2)"');
  await run('runStudentCode()');
  check(run('robot.crashed && getMissionStats().attempts === 5 && getMissionStats().collisions === 2'), 'Object crash counts separately from a boundary crash');
  const missionWithScores = JSON.parse(run('JSON.stringify(currentMission)'));
  const workingScoreCode = routeProgram(missionWithScores);
  element('#codeEditor').value = workingScoreCode;
  await runMissionProgram();
  const cleanCommands = run('getMissionStats().lastScore.commands');
  const cleanDistance = run('getMissionStats().lastScore.distance');
  check(run('getMissionStats().lastScore.attempts === 6 && getMissionStats().lastScore.collisions === 2 && getMissionStats().lastScore.hintUsed && getMissionStats().lastScore.parts.attempts === 100 && getMissionStats().lastScore.parts.safety === 60 && getMissionStats().lastScore.parts.independence === 80'), 'Completed score captures cumulative mission history');
  check(run('getMissionStats().best.points') === existingBest, 'A lower later completed score keeps the best result');
  element('#codeEditor').value = '# Comments help explain my route\n\n' + workingScoreCode;
  await runMissionProgram();
  check(run('getMissionStats().lastScore.commands') === cleanCommands && Math.abs(run('getMissionStats().lastScore.distance') - cleanDistance) < .01, 'Comments and whitespace do not reduce efficiency');
  run('codeEditor.value = "while True:\\n  pass"; beginMission()');
  const stoppedScoringRun = run('runStudentCode()');
  element('#resetBtn').click();
  await stoppedScoringRun;
  check(run('getMissionStats().attempts === 8 && getMissionStats().collisions === 2 && !activeAttempt && !running'), 'Reset during a run retains one counted attempt and impact history');
  const totalPoints = run('missions.reduce((total, mission) => total + (missionStats.get(mission.id)?.best?.points || 0), 0)');
  check(element('#expeditionPoints').textContent === `${totalPoints.toLocaleString()} / 16,000 points`, 'Expedition total sums personal bests once per mission');
  check(run('missionOptionLabel(currentMission).includes(getMissionStats().best.points + " pts")'), 'Mission selector displays the saved best score');
  const savedStats = run('JSON.stringify([...missionStats])');
  const reopened = vm.createContext({...context});
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), reopened, {timeout: 5000});
  vm.runInContext('loadMission(missions[15].id)', reopened);
  check(element('#codeEditor').value === revisedCode, 'A fresh app boot restores the completed student program');
  check(vm.runInContext('completedMissions.has(missions[15].id)', reopened), 'Completion status survives a fresh app boot');
  check(vm.runInContext('!briefingOverlay.hidden && briefedMissionId === null', reopened), 'Returning to the app opens the mission scenario again');
  check(vm.runInContext('JSON.stringify(missions.map(m => m.hazards))', reopened) === run('JSON.stringify(missions.map(m => m.hazards))'), 'All obstacle layouts survive a fresh app boot unchanged');
  check(vm.runInContext('JSON.stringify([...missionStats])', reopened) === savedStats, 'Attempts, impacts, hint use, score breakdowns, and best scores survive a fresh app boot');
  check(!vm.runInContext('functionGuide.open', reopened), 'Reference guide stays closed on a fresh boot');
  const legacyData = JSON.parse(storage.get('sphero-mission-control-v2-progress')); delete legacyData.missionStats;
  storage.set('sphero-mission-control-v2-progress', JSON.stringify(legacyData));
  vm.runInContext('hydrateProgress(); loadMission(missions[15].id)', reopened);
  check(vm.runInContext('completedMissions.has(currentMission.id) && !getMissionStats().best && getMissionStats().attempts === 0', reopened) && element('#codeEditor').value === revisedCode, 'Older saves keep achievements and successful code without inventing scores');
  console.log(`${checks} checks passed: searchable function guide, complete command coverage and valid examples, focus return and free reference use, mission points and persistence, 16 obstacle layouts, solvable missions, scenarios, incomplete starters, code retention, certificates, loops, collisions, stop/reset.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
