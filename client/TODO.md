# TODOs

- MUST:
  - Add game setup - player names and player order
  - Show active player hints given by other players
  - On game over or game finished, wait for the last turn to finish before quitting the game
  - Show discard pile (allow iterating it through) and draw deck (without iterating through, only render number above)
  - Check all error handling is propagated correctly
- SHOULD:
  - Add a game over overlay darkening the board in the background
  - Allow cards in the hand to be reordered
  - Add rules and hints page
- MAY:
  - Allow player to mark a card with an estimated value (any time)
  - 
  - Switch to Tailwind CSS
  - Enable import of bootstrap dark mode in `src/styles.sass`
  - Add build script to fix @forevolve's bootstrap dark mode
    - The script has to replace `node_modules/` with `~`
    - The replace needs to happen for files `node_modules/@forevolve/bootstrap-dark/scss/**/*`

## v2

### Multiplayer using webRTC

WebRTC is a browser technology allowing a peer2peer conenction between two parties.
This would be ideal for the game as no server would be required for running it.

WebRTC may be limited by network firewalls, in such case a TURN server can be used as fallback (see https://github.com/coturn/coturn).
Supposedly it can handle tens of thousands of connections at the same time (apart from websocket).

Here's the idea:
- One client becomes game host, other connect to him as guests.
- Joining a game (2 options):
  - With a server
    - A dedicated server app with provides a small API for managing a private lobby.
    - Other players may join the lobby using a code (random alphanumeric string).
    - After the game is started, the lobby can be deleted.
  - The host will provide their IP to the guests directly.
    - Should be sufficient.
    - Not sure how this would work with the TURN server.
- Running the game
  - A game host will validate all moves and propagate the game changes to guests.
  - The guests may validate the changes from the host.
    (Could be nice to check if the host hacked the game to perform illegal moves.)
