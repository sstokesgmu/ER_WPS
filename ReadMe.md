
## Introduction

I am working on creating a digital mapping and navigation application for *Elden Ring* that tracks the player's real-time position. Additionally, the web app will track completed bosses, completed dungeons, and the status of NPC questlines.

### Tech Stack:
- **Cheat Engine (Lua)**
- **Node Server (Backend)**
- **Frontend:** HTML, CSS, Vanilla JavaScript  
  - **Three.js** (for 3D visualization)

---

## Completed
- [ ] **Accessing Game Data:** Initially, I attempted to extract game data on my own, assuming it would be straightforward, but I was mistaken. Modern games, especially online ones, use dynamic memory allocation, meaning values like HP (Health) can be stored at different memory addresses each time the game starts. Using a mod has simplified the process by focusing solely on data extraction.
  
- [ ] **Setting up Communication Endpoints:** I created a communication stream between the Lua application (via Cheat Engine) and the Node.js application using sockets. The Node app formats and parses the data before sending it to the frontend. However, I realized that Cheat Engine cannot handle my current Lua socket configuration. To resolve this, Cheat Engine will now write data to a file on a timer, which the Node application will access.

---

## TODO
- [ ] **Connect Applications (Cheat Engine & Node)**
- [ ] **Import 3D Model** into the Three.js scene
- [ ] **Adjust Scene Perspective** to align with the player's position
- [ ] **Update 3D Map Model** - The maps need improvements, such as better textures and topology
- [ ] **Create Models** - We need models for the player, dungeon (castle), trees, a Farum Azula piece, NPCs, and bosses

--- 

