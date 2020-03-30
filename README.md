## What it does
- It's just a simple game
- Anyone can go to [this link](https://hoo-hacks-2020.herokuapp.com) and join

## How I built it
- **Node and Express JS** - Web framework boilerplate
- **P5 JS** - graphics framework
- **Socket io** - To implement multiplayer

## Challenges I ran into
- Handling collisions between two separate clients
- The sword swing mechanics needed lots of tweaking to get just right

## Features:
- Homebuilt physics (no engine used)
- Homebuilt collision detection/handling
- Navigable world (with moving camera)
- Multiplayer
- Client predicts what other players' next actions will be (decresing sutter)
- Arrow which points to nearest enemy
- Bar for both health and your sword's velocity
- Sounds
- Environment (simple trees)
- Damage is proportional to velocity of sword upon contact

## Accomplishments that I'm proud of
- The multiplayer is functional (but not perfect)
- The client predicts what other players' next actions will be (decresing sutter)
- Collision detection across multiple clients functions
- Implementing my own physics, no engine used
- Everything interaction in the world is physics based

## What I learned
- The issues and nuances of real-time multiplayer games

## Controls / Instructions
- W, A, S, and D controls player movement
- Mouse cursor controls sword
  - your sword tries to line up with your cursor, use this to swing!
- Health Bar (in green)
- Sword Velocity bar (in blue)
