import logging

from aiohttp import web

from pixelator.game_master import GameMaster
from pixelator.message_handler import MessageHandler

logging.basicConfig(level=logging.DEBUG)

app = web.Application()
game_master = GameMaster()
handler = MessageHandler(game_master)
app.add_routes([web.get("/ws/game", handler.handle)])

if __name__ == "__main__":
    web.run_app(app, host="localhost", port=8080)
