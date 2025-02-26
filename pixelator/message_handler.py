import json
import logging
from json import JSONDecodeError

from aiohttp import web
from aiohttp.web_ws import WebSocketResponse

from pixelator.game import Game
from pixelator.game_master import GameMaster
from pixelator.game_message import GameMessage, GameMessageType


class MessageHandler:
    ws: WebSocketResponse
    log: logging
    game_master: GameMaster
    
    def __init(self, game_master: GameMaster):
        self.log = logging.getLogger(__name__)
        self.game_master = game_master

    async def handle(self, request) -> WebSocketResponse:
        ws: WebSocketResponse = web.WebSocketResponse()
        await ws.prepare(request)

        async for msg in ws:
            if msg.type == web.WSMsgType.text:
                try:
                    decoded_message = json.load(msg.data)
                    if "message_type" in decoded_message:
                        if decoded_message["message_type"] == GameMessageType.START:
                            self.handle_game_start(decoded_message["data"])
                        else:
                            self.log.error(f"Unknown message type: {decoded_message["message_type"]}")
                except JSONDecodeError as decode_error:
                    self.log.error(f"Error decoding incoming message: {decode_error}")
                except Exception as unknown_error:
                    self.log.error(
                        f"Unexpected exception handling message: {unknown_error}"
                    )
            elif msg.type == web.WSMsgType.close:
                break
        return ws

    def handle_game_start(self, data: dict):
        game = Game()
        self.game_master.add_game(game)