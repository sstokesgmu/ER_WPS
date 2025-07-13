
## Introduction

I am working on creating a digital mapping and navigation application for *Elden Ring* that tracks the player's real-time position. Additionally, the web app will track completed bosses, completed dungeons, and the status of NPC questlines.

### Tech Stack:
- **Cheat Engine (Lua)**
- **Node Server (Backend)**
- **Frontend:** HTML, CSS, Vanilla JavaScript  
  - **Three.js** (for 3D visualization)

---
## ToDo: 7/12
- [ ] I just realized the locations provided by the elden ring API; or at least the version I have, does places like Calied or Volcano Manor wo I will need to add that manually
- [ ] Create a script to scan the address space of the game to find the player, mapId, and other useful data, after that we can work on the Frontend

  
---
## Mistakes 

---

## Completed

--- 
- [X] **Build the Factory** The factory functions as a class constructor handling data sent from packets, this functions on the Node server
    - [X] Build a location object
- [X] The KD tree is used to approximate the current position of the character is world space
    - [ ] The tree works, however it is not the result that we want, to get a better source of truth we should find the map id while in game. 
