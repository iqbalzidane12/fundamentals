# Code Smell Refactoring Report – TicTacToe Tests
## 1. Repeated Setup Code (Lines ~13–116)
### Smelly Code Each test repeats a long, similar sequence of moves using `game.Play()`.  
This violates the **DRY (Don't Repeat Yourself)** principle.
Example from multiple tests
game.Play('X', 0, 0);
game.Play('O', 1, 0);
game.Play('X', 0, 1);
game.Play('O', 1, 1);
game.Play('X', 0, 2);
Refactored code:
function playRow(game: Game, player: string, row: number) {
    for (let col = 0; col < 3; col++) {
        game.Play(player, row, col);
        if (col < 2) game.Play(player === 'X' ? 'O' : 'X', (row + 1) % 3, col);
    }
}

it('declares X as winner when X completes the top row', () => {
    playRow(game, 'X', 0);
    expect(game.Winner()).toBe("X");
});
2) MIxed responsibility in test
Each test mixes setup, actions, and assertions inline — this makes it hard to follow and maintain.
It lacks a clear structure separating Arrange, Act, and Assert stages.
game.Play('X', 2, 0);
game.Play('O', 0, 0);
game.Play('X', 2, 1);
game.Play('O', 0, 1);
game.Play('X', 2, 2);

const winner = game.Winner();
expect(winner).toBe("X");

I refactor the test to follow the Arrange–Act–Assert pattern clearly.
it('declares X as winner when completing the bottom row', () => {
    // Arrange
    const moves = [
        ['X', 2, 0], ['O', 0, 0],
        ['X', 2, 1], ['O', 0, 1],
        ['X', 2, 2]
    ]
    moves.forEach(([p, r, c]) => game.Play(p, r, c));
    expect(game.Winner()).toBe("X");
});
3) Smelly code from game.ts
before:
if (this._board.TileAt(0, 0)!.Symbol != ' ' &&
    this._board.TileAt(0, 1)!.Symbol != ' ' &&
    this._board.TileAt(0, 2)!.Symbol != ' ') {
    if (this._board.TileAt(0, 0)!.Symbol ==
        this._board.TileAt(0, 1)!.Symbol &&
        this._board.TileAt(0, 2)!.Symbol == this._board.TileAt(0, 1)!.Symbol) {
        return this._board.TileAt(0, 0)!.Symbol;
    }
}

if (this._board.TileAt(1, 0)!.Symbol != ' ' &&
    this._board.TileAt(1, 1)!.Symbol != ' ' &&
    this._board.TileAt(1, 2)!.Symbol != ' ') {
    if (this._board.TileAt(1, 0)!.Symbol ==
        this._board.TileAt(1, 1)!.Symbol &&
        this._board.TileAt(1, 2)!.Symbol ==
        this._board.TileAt(1, 1)!.Symbol) {
        return this._board.TileAt(1, 0)!.Symbol;
    }
}
It is seriuosly repeting row checking I am using a loop instead of copy-paste logic → less code, same result.
for (let row = 0; row < 3; row++) {
    const a = this._board.TileAt(row, 0).Symbol;
    const b = this._board.TileAt(row, 1).Symbol;
    const c = this._board.TileAt(row, 2).Symbol;

    if (a !== ' ' && a === b && b === c) {
        return a;
    }
}
4)
Magic Strings
Here:
if (this._lastSymbol == ' ') {
    if (symbol == 'O') {
        throw new Error("Invalid first player");
    }
}
Now I am using the symbols are type-safe, easier to maintain, and you avoid bugs from typos (like 'x' vs 'X').
else if (this._board.TileAt(x, y).Symbol != ' ') {
    throw new Error("Invalid position");
}
5)
Tight Coupling (Game handles board logic)
Here Game doesn’t directly check tile internals —
the Board class after refactring owns its own state validation → more modular and reusable.
public IsPositionEmpty(x: number, y: number): boolean {
    return this.TileAt(x, y).Symbol === PlayerSymbol.Empty;
}



