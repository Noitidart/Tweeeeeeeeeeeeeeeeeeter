function init() {
	app = Redux.combineReducers({
		background_rgba,
		bold,
		height,
		width
	});

	store = Redux.createStore(app);

	// render react
	ReactDOM.render(
		React.createElement(ReactRedux.Provider, { store },
			React.createElement(App)
		),
		document.getElementById('root')
	);
}
window.addEventListener('DOMContentLoaded', init, false);

// STORE
var store;
var app;

// REACT COMPONENTS - PRESENTATIONAL
var App = React.createClass({
	render: function() {

		return React.createElement('div', { id:'app_wrap', className:'app-wrap' },
			React.createElement(EditorWrap)
		);
	}
});

var EditorWrap = React.createClass({
	render: function() {
		return React.createElement('div', { className:'panel panel-default' },
			React.createElement(ToolsContainer),
			React.createElement(EditableContainer)
		);
	}
});

var Editable = React.createClass({
	render: function() {
		var { width, height, background_rgba } = this.props; // mapped state
		// var {  } = this.props; // dispatchers

		var editable_style = {
			width: width + 'px',
			height: height + 'px',
			backgroundColor: 'rgba(' + background_rgba.join(',') + ')'
		};

		return React.createElement('div', { id:'editable', contentEditable:true, style:editable_style },
			'rawr'
		);
	}
});

var Tools = React.createClass({
	render: function() {
		// var {  } = this.props; // mapped state
		var { toggleBold } = this.props; // dispatchers

		return React.createElement(ReactBootstrap.ButtonToolbar, undefined,
			React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Style') },
				React.createElement(ReactBootstrap.Button, undefined,
					React.createElement(ReactBootstrap.Glyphicon, { glyph:'menu-hamburger' })
				)
			),
			React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Unstyle') },
				React.createElement(ReactBootstrap.Button, undefined,
					React.createElement(ReactBootstrap.Glyphicon, { glyph:'erase' })
				)
			),
			React.createElement(ReactBootstrap.ButtonGroup, undefined,
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Bold') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'bold' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Italics') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'italic' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Underline') },
					React.createElement(ReactBootstrap.Button, undefined,
						// React.createElement(ReactBootstrap.Glyphicon, { glyph:'underline' })
						'U'
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Strikethrough') },
					React.createElement(ReactBootstrap.Button, undefined,
						// React.createElement(ReactBootstrap.Glyphicon, { glyph:'strike' })
						'S'
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Subscript') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'subscript' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Superscript') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'superscript' })
					)
				)
			),
			React.createElement(ReactBootstrap.ButtonGroup, undefined,
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Bullet List') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'list' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Numbered List') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'list-alt' })
					)
				)
			),
			React.createElement(ReactBootstrap.ButtonGroup, undefined,
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Indent') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'indent-left' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Reduce Indent') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'indent-right' })
					)
				)
			),
			React.createElement(ReactBootstrap.ButtonGroup, undefined,
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Align Left') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'align-left' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Center') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'align-center' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Align Right') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'align-right' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Justify') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'align-justify' })
					)
				)
			),
			React.createElement(ReactBootstrap.ButtonGroup, undefined,
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Font') },
					React.createElement(ReactBootstrap.Dropdown, { id:'font_dropdown' },
						React.createElement(ReactBootstrap.Dropdown.Toggle, undefined,
							React.createElement(ReactBootstrap.Glyphicon, { glyph:'font' })
						),
						React.createElement(ReactBootstrap.Dropdown.Menu, undefined,
							fonts.map( (fontFamily, eventKey) => React.createElement(ReactBootstrap.MenuItem, { eventKey, style:{fontFamily} }, fontFamily) )
						)
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Font Color') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'text-color' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Font Backcolor') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'text-background' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Font Size') },
					React.createElement(ReactBootstrap.Dropdown, { id:'fontsize_dropdown' },
						React.createElement(ReactBootstrap.Dropdown.Toggle, undefined,
							React.createElement(ReactBootstrap.Glyphicon, { glyph:'text-size' })
						),
						React.createElement(ReactBootstrap.Dropdown.Menu, undefined,
							React.createElement(ReactBootstrap.MenuItem, { eventKey:1, style:{fontSize:'1.5em'} }, 'Huge'),
							React.createElement(ReactBootstrap.MenuItem, { eventKey:2 }, 'Normal'),
							React.createElement(ReactBootstrap.MenuItem, { eventKey:3, style:{fontSize:'0.75em'} }, 'Tiny')
						)
					)
				)
			),
			React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Image') },
				React.createElement(ReactBootstrap.Button, undefined,
					React.createElement(ReactBootstrap.Glyphicon, { glyph:'picture' })
				)
			),
			React.createElement(ReactBootstrap.ButtonGroup, undefined,
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Background Color') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'tint' })
					)
				),
				React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Resize') },
					React.createElement(ReactBootstrap.Button, undefined,
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'fullscreen' })
					)
				)
			)
		);
	}
});

const Tooltip = txt => React.createElement(ReactBootstrap.Tooltip, undefined, txt);

// REACT COMPONENTS - CONTAINER
var EditableContainer = ReactRedux.connect(
	function mapStateToProps(state, ownProps) {
		return {
			background_rgba: state.background_rgba,
			bold: state.bold,
			height: state.height,
			width: state.width
		};
	}
	// function mapDispatchToProps(dispatch, ownProps) {}
)(Editable);

var ToolsContainer = ReactRedux.connect(
	function mapStateToProps(state, ownProps) {
		return {

		};
	},
	function mapDispatchToProps(dispatch, ownProps) {
		return {
			toggleBold: ()=>dispatch(toggleTool('bold'))
		};
	}
)(Tools);

// ACTIONS
const TOGGLE_TOOL = 'TOGGLE_TOOL';

// ACTION CREATORS
function toggleTool(tool) {
	// tool - string;enum[bold]
	return {
		type: TOGGLE_TOOL,
		tool
	}
}

// REDUCERS
var hydrant = {
	background_rgba: [255, 255, 255, 1],
	bold: false,
	height: 250,
	width: 300
}
var fonts = [
	'Arial',
	'Comic Sans MS',
	'Courier New',
	'Helvetica',
	'Impact',
	'Tahoma',
	'Times New Roman',
	'Verdana'
];
function background_rgba(state=hydrant.background_rgba, action) {
	switch (action.type) {
		default:
			return state;
	}
}
function bold(state=hydrant.bold, action) {
	switch (action.type) {
		case TOGGLE_TOOL:
			var { tool } = action;
			if (tool == 'bold') {
				return !state;
			} else {
				return state;
			}
		default:
			return state;
	}
}
function height(state=hydrant.height, action) {
	switch (action.type) {
		default:
			return state;
	}
}
function width(state=hydrant.width, action) {
	switch (action.type) {
		default:
			return state;
	}
}
