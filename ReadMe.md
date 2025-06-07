
## Introduction

I am working on creating a digital mapping and navigation application for *Elden Ring* that tracks the player's real-time position. Additionally, the web app will track completed bosses, completed dungeons, and the status of NPC questlines.

### Tech Stack:
- **Cheat Engine (Lua)**
- **Node Server (Backend)**
- **Frontend:** HTML, CSS, Vanilla JavaScript  
  - **Three.js** (for 3D visualization)

---
## ToDo: 6/7
- [X] The KD tree is not working as exprected, the nearest neighbor is way of that what it should be, so I need to fix that
    **So it turns out after I send message to the node endpoint I was send the object and forgot to access the property of the object**
   - [ ] First we can use Jest.js to set up a testing environment
   - [ ] Test various cases to see the result
   - Refectoring
      - [ ] Even though the KD Tree works I still fell that we can rewrite some things to make it easier to understand
      - [ ] Need to start throwing type checks 

- [ ] I just realizrd the locations provided by the elden ring API; or at least the version I have, does places like Calied or Volcano Manor wo I will need to add that manually
   - Use this resource to to pick keep points
   - In game with Cheat Engine find the best possible X and y for each point of interest
   - Add the the MondoDB table or create a script to automate adding all those areas


- [ ] **Build the Factory** The factory will be the class used to open and re pack the data from the Lua Game Server or the Front end so I need to make sure that at least it can
   - Build a player object
   - Build a location and sub location object      
--
## Completed

--- 

