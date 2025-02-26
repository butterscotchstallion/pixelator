from dataclasses import dataclass
from enum import Enum


class GameMessageType(str, Enum):
    START = "START"
    MOVE = "MOVE"

@dataclass
class GameMessage:
    message_type: GameMessageType
    data: dict[str, str]