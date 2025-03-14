from pixelator.game import Game


class GameMaster:
    games: list[Game]
    
    def __init__(self):
        self.games = []

    def get_game_by_session_id(self, session_id: str) -> Game | None:
        for game in self.games:
            if game.session_id == session_id:
                return game
    
    def add_game(self, game: Game):
        self.games.append(game)
    
    def remove_game(self, session_id: str) -> bool:
        for game in self.games:
            if game.session_id == session_id:
                self.games.remove(game)
                return True
        return False