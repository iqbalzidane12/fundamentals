enum PlayerSymbol {
    X = 'X',
    O = 'O',
    Empty = ' '
}

interface Tile {
    X: number;
    Y: number;
    Symbol: PlayerSymbol;
}

class Board {
    private _plays: Tile[] = [];

    constructor() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this._plays.push({ X: i, Y: j, Symbol: PlayerSymbol.Empty });
            }
        }
    }

    public TileAt(x: number, y: number): Tile {
        return this._plays.find(t => t.X === x && t.Y === y)!;
    }

    public addTileAt(symbol: PlayerSymbol, x: number, y: number): void {
        const tile = this.TileAt(x, y);
        tile.Symbol = symbol;
    }

    public isPositionEmpty(x: number, y: number): boolean {
        return this.TileAt(x, y).Symbol === PlayerSymbol.Empty;
    }
}

export class Game {
    private _lastSymbol: PlayerSymbol = PlayerSymbol.Empty;
    private _board: Board = new Board();

    private validateFirstPlayer(symbol: PlayerSymbol): void {
        if (this._lastSymbol === PlayerSymbol.Empty && symbol === PlayerSymbol.O)
            throw new Error("Invalid first player");
    }

    private validateNextPlayer(symbol: PlayerSymbol): void {
        if (symbol === this._lastSymbol)
            throw new Error("Invalid next player");
    }

    private validatePosition(x: number, y: number): void {
        if (!this._board.isPositionEmpty(x, y))
            throw new Error("Invalid position");
    }

    public Play(symbol: PlayerSymbol, x: number, y: number): void {
        this.validateFirstPlayer(symbol);
        this.validateNextPlayer(symbol);
        this.validatePosition(x, y);

        this._lastSymbol = symbol;
        this._board.addTileAt(symbol, x, y);
    }

    private checkRow(row: number): PlayerSymbol {
        const symbols = [0, 1, 2].map(col => this._board.TileAt(row, col).Symbol);
        if (symbols.every(s => s !== PlayerSymbol.Empty) && new Set(symbols).size === 1)
            return symbols[0];
        return PlayerSymbol.Empty;
    }

    private checkColumn(col: number): PlayerSymbol {
        const symbols = [0, 1, 2].map(row => this._board.TileAt(row, col).Symbol);
        if (symbols.every(s => s !== PlayerSymbol.Empty) && new Set(symbols).size === 1)
            return symbols[0];
        return PlayerSymbol.Empty;
    }

    private checkDiagonals(): PlayerSymbol {
        const mainDiag = [0, 1, 2].map(i => this._board.TileAt(i, i).Symbol);
        const antiDiag = [0, 1, 2].map(i => this._board.TileAt(i, 2 - i).Symbol);

        if (mainDiag.every(s => s !== PlayerSymbol.Empty) && new Set(mainDiag).size === 1)
            return mainDiag[0];
        if (antiDiag.every(s => s !== PlayerSymbol.Empty) && new Set(antiDiag).size === 1)
            return antiDiag[0];

        return PlayerSymbol.Empty;
    }

    public Winner(): PlayerSymbol {
        for (let i = 0; i < 3; i++) {
            const rowWinner = this.checkRow(i);
            if (rowWinner !== PlayerSymbol.Empty) return rowWinner;

            const colWinner = this.checkColumn(i);
            if (colWinner !== PlayerSymbol.Empty) return colWinner;
        }

        const diagonalWinner = this.checkDiagonals();
        if (diagonalWinner !== PlayerSymbol.Empty) return diagonalWinner;

        return PlayerSymbol.Empty;
    }
}
