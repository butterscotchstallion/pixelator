from dataclasses import dataclass
from enum import Enum


class GameMessageType(str, Enum):
    START = "START"
    GAME_STARTED = "GAME_STARTED"
    MOVE = "MOVE"
    MOVE_SUCCESSFUL = "MOVE_SUCCESSFUL"

@dataclass
class GameMessage:
    message_type: GameMessageType
    data: dict[str, str]