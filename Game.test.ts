import { Game } from "./Game";

function playRow(game: Game, player: string, row: number) {
    for (let col = 0; col < 3; col++) {
        game.Play(player, row, col);
        if (col < 2) game.Play(player === 'X' ? 'O' : 'X', (row + 1) % 3, col);
    }
}

describe('TicTacToe game', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game();
    });

    it('should not allow player O to play first', () => {
        expect(() => game.Play('O', 0, 0)).toThrow();
    });

    it('should not allow player X to play twice in a row', () => {
        game.Play('X', 0, 0);
        expect(() => game.Play('X', 1, 0)).toThrow();
    });

    it('should not allow a player to play in last played position', () => {
        game.Play('X', 0, 0);
        expect(() => game.Play('O', 0, 0)).toThrow();
    });

    it('should not allow a player to play in any played position', () => {
        game.Play('X', 0, 0);
        game.Play('O', 1, 0);
        expect(() => game.Play('X', 0, 0)).toThrow();
    });

    it('should declare player X as winner if it plays three in top row', () => {
        playRow(game, 'X', 0);
        expect(game.Winner()).toBe("X");
    });

    it('should declare player O as winner if it plays three in top row', () => {
        const moves = [
            ['X', 1, 0], ['O', 0, 0],
            ['X', 1, 1], ['O', 0, 1],
            ['X', 2, 2], ['O', 0, 2],
        ];
        moves.forEach(([p, r, c]) => game.Play(p, r, c));
        expect(game.Winner()).toBe("O");
    });

    it('should declare player X as winner if it plays three in middle row', () => {
        playRow(game, 'X', 1);
        expect(game.Winner()).toBe("X");
    });

    it('should declare player O as winner if it plays three in middle row', () => {
        const moves = [
            ['X', 0, 0], ['O', 1, 0],
            ['X', 2, 1], ['O', 1, 1],
            ['X', 2, 2], ['O', 1, 2],
        ];
        moves.forEach(([p, r, c]) => game.Play(p, r, c));
        expect(game.Winner()).toBe("O");
    });

    it('should declare player X as winner if it plays three in bottom row', () => {
        playRow(game, 'X', 2);
        expect(game.Winner()).toBe("X");
    });

    it('should declare player O as winner if it plays three in bottom row', () => {
        const moves = [
            ['X', 0, 0], ['O', 2, 0],
            ['X', 1, 1], ['O', 2, 1],
            ['X', 0, 1], ['O', 2, 2],
        ];
        moves.forEach(([p, r, c]) => game.Play(p, r, c));
        expect(game.Winner()).toBe("O");
    });
});
