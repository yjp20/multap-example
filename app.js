const multap = require("multap")

class State {
	constructor() {
		this.board = []
		this.turn = 0
		this.winner = -1

		for (let i=0; i<3; i++) {
			let row = []
			board.push(row)
			for (let j=0; j<3; j++) {
				row.push(-1)
			}
		}
	}

	isFinished() {
		return false
	}
}

var game = multap.newGame({
	autoJSON: true,
	name: "Tic Tac Toe",
	desc: "Ancient game of logic where the best play from both players results in a draw",
	files: "src",
	events: {
		"start": function(m) {
			m.room.state = new State()
		},
		"move": function(m) {
			var msg = m.msg
			var state = m.room.state
			if (m.user != state.turn) {
				m.send("error", "Cannot move in opponent's turn")
				return
			}
			if (state.board[msg.x][msg.y] != -1) {
				m.send("error", "Cannot move on claimed square")
				return
			}
			state.board[msg.x][msg.y] = m.user
			m.sendAll("update", state)
			if (state.isFinished()) {
				m.room.end()
			}
			state.turn = state.turn == 1 ? 0 : 1;
		},
		"end": function(m) {
			m.room.setWinner(m.room.state.winner)
		},
	},
})

var server = multap.newServer({
	name: "Multap Example",
	desc: "Simple tic tac toe game made with the multap library",
	conn: "sqlite::memory",
	game: game,
	modules: [ multap.modules.auth_guest ],
})

server.listen(3000)
