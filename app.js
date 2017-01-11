var NoteEditor = React.createClass({
	getInitialState: function () {
		return {
			text: '',
			color: '#ffe600'
		};
	},

	handleTextChange: function (e) {
		this.setState({
			text: e.target.value
		});
	},

	handleColorChange: function (e) {
		this.setState({
			color: e.target.value
		})
	},

	handleNoteAdd: function () {
		var newNote = {
			text: this.state.text,
			id: Date.now(),
			color: this.state.color
		};

		if (newNote.text != '') {
			this.props.addNote(newNote);
		} else {
			alert('Enter text please');
		}

		this.setState({ text: '' });
	},

	render: function () {
		return (
			<div>
				<div className="wrap">
					<textarea
						value={this.state.text}
						onChange={this.handleTextChange}
						placeholder="Enter your text and choose note color :-)"
					>
					</textarea>
					<input
						id="btn-color"
						type="color"
						style={{ 'backgroundColor': this.state.color }}
						value={this.state.color}
						onChange={this.handleColorChange}
						title="Color of the note"
					/>
					<button className="btn" onClick={this.handleNoteAdd}>ADD</button>
				</div>
				<input
					type="text"
					onChange={this.props.search}
					placeholder="LIVE SEARCH"
				/>
			</div>
		);
	}
});



var NotesGrid = React.createClass({
	render: function () {

		var onNoteDelete = this.props.onNoteDelete;

		return (
			<div>
				{
					this.props.notes.map(function (note) {
						return <Note key={note.id} color={note.color} onDelete={onNoteDelete.bind(null, note)}> {note.text} </Note>
					})
				}
			</div>
		);
	}
});



var Note = React.createClass({
	render: function () {
		return (
			<div className="note" style={{ 'backgroundColor': this.props.color }}> {this.props.children}
				<span className="note-delete" onClick={this.props.onDelete}> × </span>
			</div>
		);
	}
});



var NoteApp = React.createClass({
	getInitialState: function () {
		return {
			notes: []
		};
	},

	componentDidMount: function () {
		var localNotes = JSON.parse(localStorage.getItem('notes'));
		if (localNotes) {
			this.setState({ notes: localNotes });
		}
	},

	//componentDidUpdate: function() {
	//	return this._updateLocalStorage;
	//},

	_updateLocalStorage: function () {
		var notes = JSON.stringify(this.state.notes);
		localStorage.setItem('notes', notes);
	},

	handleNoteAdd: function (newNote) {
		var newNotes = this.state.notes.slice();
		newNotes.unshift(newNote);
		// , this._updateLocalStorage - это колбэк что бы обновлялась страничка при добавлении данных
		this.setState({ notes: newNotes }, this._updateLocalStorage);
	},

	handleNoteDelete: function (note) {
		var noteID = note.id;
		var newNotes = this.state.notes.filter(function (note) {
			return note.id !== noteID;
		});
		this.setState({ notes: newNotes }, this._updateLocalStorage);
	},

	handleSearch: function (e) {
		var searchData = e.target.value.toLowerCase();
		var displayData = this.state.notes.filter(function (res) {
			var searchValue = res.text.toLowerCase();
			return searchValue.indexOf(searchData) !== -1;

			console.log(searchValue);
		});
		console.log(searchData, displayData);
		//console.log(this.state.notes);
		this.setState({ notes: displayData }/*, this._updateLocalStorage*/);
	},

	render: function () {
		return (
			<div>
				App have some bugs, but I am working on it :)
				<h1>Note App</h1>
				<NoteEditor addNote={this.handleNoteAdd} search={this.handleSearch} />
				<NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
			</div>
		);
	}
});



ReactDOM.render(
	<NoteApp />,
	document.getElementById('content')
);