import json
import logging

import pytest
from aiohttp import web

from pixelator.game_master import GameMaster
from pixelator.game_message import GameMessageType
from pixelator.message_handler import MessageHandler

log = logging.getLogger(__name__)


@pytest.mark.asyncio
async def test_game_start(aiohttp_client):
    app = web.Application()
    game_master = GameMaster()
    handler = MessageHandler(game_master)
    app.add_routes([web.get("/ws/game", handler.handle)])

    log.info("Created routes...connecting")

    client = await aiohttp_client(app)
    ws = await client.ws_connect("/ws/game", timeout=5)
    await ws.send_json({"message_type": GameMessageType.START})
    response = await ws.receive()
    assert response.type == web.WSMsgType.text

    data = json.loads(response.data)
    assert "message_type" in data
    assert "data" in data
    assert "session_id" in data["data"]
    assert response["message_type"] == GameMessageType.GAME_STARTED
    assert response["data"]["session_id"]
    assert (
        len(response["data"]["session_id"]) == 36
    ), "session_id doesn't look like a UUID!"

    await ws.close()
