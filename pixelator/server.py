from aiohttp import web
from aiohttp.web_ws import WebSocketResponse


async def wshandle(request) -> WebSocketResponse:
    ws: WebSocketResponse = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        if msg.type == web.WSMsgType.text:
            await ws.send_str("Hello, {}".format(msg.data))
        elif msg.type == web.WSMsgType.binary:
            await ws.send_bytes(msg.data)
        elif msg.type == web.WSMsgType.close:
            break
    return ws


app = web.Application()
app.add_routes([web.get('/echo', wshandle)])

if __name__ == '__main__':
    web.run_app(app, host="localhost", port=8080)