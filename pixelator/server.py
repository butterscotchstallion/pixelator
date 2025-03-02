import logging

import asyncio
from websockets.asyncio.server import serve

from pixelator.game_master import GameMaster
from pixelator.message_handler import MessageHandler

logging.basicConfig(level=logging.DEBUG)

async def main():
    handler = MessageHandler(GameMaster())
    async with serve(handler.handle, "127.0.0.1", 8001) as server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())
