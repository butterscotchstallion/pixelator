import logging
from uuid import uuid4

class Game:
    session_id: str
    board: dict[int, str]
    log: logging
    
    def __init__(self):
        self.session_id = str(uuid4())
        self.board = {}
        self.log = logging.getLogger(__name__)

    def update_board(self, index: int, player: str):
        if index in self.board:
            self.log.error(f"Ignoring already filled board position: {index} ({player}")
        else:
            self.board[index] = player
            self.log.info(f"Setting board index {index} to {player}")
    
    def __eq__(self, other):
        return self.session_id == other.session_id