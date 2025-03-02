import json
import logging
from json import JSONDecodeError

from websockets import ConnectionClosedOK
from websockets.sync.server import ServerConnection

from pixelator.game import Game
from pixelator.game_master import GameMaster
from pixelator.game_message import GameMessageType


class MessageHandler:
    log: logging
    game_master: GameMaster

    def __init__(self, game_master: GameMaster):
        self.log = logging.getLogger(__name__)
        self.game_master = game_master

    async def handle(self, websocket):
        while True:
            try:
                message = await websocket.recv()
                decoded_message = json.loads(message)
                if "message_type" in decoded_message:
                    if decoded_message["message_type"] == GameMessageType.START:
                        await self.handle_game_start(websocket)
                    elif decoded_message["message_type"] == GameMessageType.MOVE:
                        await self.handle_game_move(websocket, decoded_message)
                    else:
                        self.log.error(
                            f"Unknown message type: {decoded_message["message_type"]}"
                        )
                else:
                    self.log.error("Message did not have message_type!")
            except ConnectionClosedOK:
                break
            except JSONDecodeError as decode_error:
                self.log.error(f"Error decoding incoming message: {decode_error}")
            except Exception as unknown_error:
                self.log.error(
                    f"Unexpected exception handling message: {unknown_error}"
                )
    async def handle_game_start(self, ws):
        game = Game()
        self.game_master.add_game(game)
        await ws.send(
            json.dumps(
                {
                    "message_type": GameMessageType.GAME_STARTED,
                    "data": {"session_id": game.session_id},
                }
            )
        )
        self.log.info(f"Sent game started message with session_id: {game.session_id}")

    async def handle_game_move(self, ws, msg: dict):
        try:
            session_id: str = msg["data"]["session_id"]
            game: Game | None = self.game_master.get_game_by_session_id(session_id)
            if game:
                if "player" in msg["data"] and "index" in msg["data"]:
                    player = msg["data"]["player"]
                    index = msg["data"]["index"]
                    game.update_board(index, player)
                    self.log.info(
                        f"Updated game {session_id} with index {index} for player {player}"
                    )
                    await ws.broadcast(
                        json.dumps(
                            {
                                "message_type": GameMessageType.MOVE_SUCCESSFUL,
                                "data": {"index": index, "player": player},
                            }
                        )
                    )
                else:
                    self.log.error("Malformed move payload")
            else:
                self.log.error(f"No game with session_id {session_id} found!")
        except KeyError as missing_key:
            self.log.error(f"Missing expected key: {missing_key}")
        except Exception as unknown_exception:
            self.log.error(
                f"Unexpected exception in handle_game_move: {unknown_exception}"
            )
