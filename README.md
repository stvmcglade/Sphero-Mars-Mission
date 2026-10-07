# Sphero Mission Control — Planet Explorer

Open `index.html` in Edge, Chrome, or another modern browser. No installation, account, or internet connection is needed.

This independent second version is based on the original Sphero Missions App. It includes a virtual planetary rover arena, 16 missions across four ranks, a Python-style command editor, collision detection, hints, local progress and code saving, and personalised PNG rank certificates.

Each rank explores a different world: Mars (rocky desert), Glacia (ice planet), Verdantia (forest planet), and Pyron (volcanic planet). The last three are fictional settings for the coding missions. Each world has its own scenery, terrain hazards, mission names, and scenarios.

All 16 missions have distinct obstacle layouts, with different positions, sizes, and at least three terrain types per mission. Mars mixes rocks, sand, dust, and debris; Glacia has crystal ridges, fissures, and snow banks; Verdantia has groves, roots, and thorns; Pyron has lava, obsidian, and ash banks. Layouts stay fixed when retrying or reopening a mission. The terrain report lists the obstacles, and every checkpoint has a clear approach with a solvable route. Existing mission IDs, checkpoints, actions, saved code, and achievements are retained. Programs saved before the obstacle update may need route adjustments for the new terrain.

Enter an explorer name, choose a mission, edit the starter program, and press **Run code** (or Ctrl + Enter). Reach the checkpoints in order and use `collect()` or the required colour signal. Complete all four missions in a rank to download its certificate. All ranks are available from the start.

A scenario pop-up appears whenever a mission is opened, including on returning to the app. Read the story, terrain report, objectives, and coding focus, then choose **Start mission** to open the workspace. This does not run the starter code. Retries in the same mission do not repeat the pop-up; **Read scenario** reopens it whenever needed.

Choose **Function guide** in the header or beside the code controls to open a searchable reference window. Select a command to see what it does, its arguments and limits, a small example, an explanation of that example, and a practical reminder. The guide covers all nine rover commands, accepted alternate spellings, counted and conditional loops, if / else, and numeric variables. Reading it is free and does not count as using a mission hint. Close it with **Close** or Escape to return to your program. The short inline command reference remains available below the editor.

Every starter program is deliberately incomplete. Ranks 1–3 demonstrate the first checkpoint and leave the rest for students to write. Rank 4 provides a loop and branching scaffold with movement and action placeholders to complete.

Each completed mission earns up to **1,000 points**: completion (500), attempts (200 minus 20 per run after the first, minimum 0), safety (100 minus 20 per object or boundary hit, minimum 0), independent work (100, or 80 after using a hint), and efficiency (100). Route efficiency contributes up to 60 points by comparing actual distance with a safe reference route around the obstacles. Command efficiency contributes up to 40 points by comparing executed rover commands with the reference route's movement and checkpoint command budget. Longer routes and redundant commands earn proportionally fewer efficiency points. Comments, blank lines, and movement speed do not affect efficiency.

Every Run after acknowledging the briefing counts, including syntax errors, incomplete runs, and stopped or reset runs. Each collision ends the run and counts one impact. A hint costs 20 points once per mission; reopening it has no extra cost. Attempts, impacts, and hint use persist when resetting, switching missions, or reloading. Scores are awarded only on successful completion, and the mission points card shows the last successful breakdown and lifetime history. Personal best scores are retained, and the expedition total sums those best scores across all 16 missions, up to 16,000 points. Earlier saved completions keep their code and achievements; replay them to earn their first score.

The rover has animated wheel treads, smooth visual turns, suspension movement, and a dust trail. Collisions trigger recoil, sparks, smoke, a brief camera shake, and an impact notice; reset clears the effects. Checkpoints pulse when completed, with a celebratory burst at the final goal. The app respects your device's reduced-motion preference. Effects do not change the rover's route, compass headings, or mission scoring.

Headings follow the compass: 0° north, 90° east, 180° south, 270° west. Movement uses 1.28 arena units per second for each speed point. Programs support the displayed commands, numeric variables, `for … in range(...)`, `while`, and `if` / `else`; this is a teaching subset of Python. There is no connection to a physical Sphero robot.

Progress belongs to this browser profile and this copy of the app. Changing the explorer name renames the current expedition. The original app and its saved progress are unchanged. **Save code** downloads the current program as a `.py` file.

Unfinished missions reopen with their latest draft. Completed missions reopen with the last program that successfully completed them, including after refreshing or reopening the app. The **Starter code** button loads the incomplete scaffold for another attempt; it does not replace the saved successful program. Successfully completing the mission again updates that saved program. Existing student drafts and completed programs are retained when the app is updated.

For a local web preview, run `node server.cjs` in this folder and open http://localhost:5174. Keep using the same address/browser to retain the same progress.

Run `node tests.cjs` for simulator and program checks.
