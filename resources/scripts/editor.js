function init() {
	app = Redux.combineReducers({
		// tools
		background_rgba,
		bold,
		height,
		width,
		// other
		modal
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
			React.createElement(EditorWrapContainer)
		);
	}
});

var EditorWrap = React.createClass({
	render: function() {
		var { modal } = this.props; // mapped state

		return React.createElement('div', { className:'panel panel-default' },
			React.createElement(ToolsContainer),
			React.createElement(EditableContainer),
			React.createElement(ModalsContainer, { modal })
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
		var { toggleBold, showResizeModal } = this.props; // dispatchers

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
			React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip('Direction') },
				React.createElement(ReactBootstrap.Button, undefined,
					React.createElement(ReactBootstrap.Glyphicon, { glyph:'sort', style:{transform:'rotate(90deg)'} })
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
					React.createElement(ReactBootstrap.Button, { onClick:showResizeModal },
						React.createElement(ReactBootstrap.Glyphicon, { glyph:'fullscreen' })
					)
				)
			)
		);
	}
});

const Tooltip = txt => React.createElement(ReactBootstrap.Tooltip, undefined, txt);

var Modals = React.createClass({
	showing_for_name: null,
	doApply: function() {
		var { modal } = this.props; // mapped state
		var { doApply } = this.props; // dispatchers

		switch (modal) {
			case 'resize':
					doApply(ReactDOM.findDOMNode(this.refs.height).value, ReactDOM.findDOMNode(this.refs.width).value);
				break;
		}
	},
	render: function() {
		var { modal } = this.props; // mapped state
		var { doClose } = this.props; // dispatchers

		if (modal) {
			this.showing_for_name = modal;
		}

		// determine `contents` based on name
		var contents;
		switch(this.showing_for_name) {
			case 'resize':
					var { height, width } = this.props; // mapped state ex
					contents = [
						React.createElement(ReactBootstrap.Modal.Header, { closeButton:true },
							React.createElement(ReactBootstrap.Modal.Title, undefined,
								'Resize Canvas'
							)
						),
						React.createElement(ReactBootstrap.Modal.Body, undefined,
							React.createElement(ReactBootstrap.Form, { inline:true },
								React.createElement(ReactBootstrap.ControlLabel, undefined,
									'Width:'
								),
								React.createElement(ReactBootstrap.FormControl, { type:'text', ref:'width', defaultValue:width })
							),
							React.createElement(ReactBootstrap.Form, { inline:true },
								React.createElement(ReactBootstrap.ControlLabel, undefined,
									'Height:'
								),
								React.createElement(ReactBootstrap.FormControl, { type:'text', ref:'height', defaultValue:height })
							)
						),
						React.createElement(ReactBootstrap.Modal.Footer, undefined,
							React.createElement(ReactBootstrap.Button, { onClick:doClose },
								'Cancel'
							),
							React.createElement(ReactBootstrap.Button, { onClick:this.doApply, bsStyle:'primary' },
								'Apply'
							)
						)
					];
				break;
			default:
				contents = [
					React.createElement(ReactBootstrap.Modal.Header, { closeButton:true },
						React.createElement(ReactBootstrap.Modal.Title, undefined,
							'Modal not yet shown'
						)
					),
					React.createElement(ReactBootstrap.Modal.Body, undefined,
						'(not yet shown)'
					),
					React.createElement(ReactBootstrap.Modal.Footer, undefined,
						React.createElement(ReactBootstrap.Button, { onClick:doClose },
							'Cancel'
						)
					)
				];
		}
		return React.createElement(ReactBootstrap.Modal, { show:!!modal, onHide:doClose },
			contents
		)
	}
});

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
			toggleBold: ()=>dispatch(toggleTool('bold')),
			showResizeModal: ()=>dispatch(showModal('resize'))
		};
	}
)(Tools);

var EditorWrapContainer = ReactRedux.connect(
	function mapStateToProps(state, ownProps) {
		return {
			modal: state.modal
		}
	}
)(EditorWrap);

var ModalsContainer = ReactRedux.connect(
	function mapStateToProps(state, ownProps) {
		var rez = {};

		switch (ownProps.modal) {
			case 'resize':
					rez.height = state.height;
					rez.width = state.width;
				break;
		}

		return rez;
	},
	function mapDispatchToProps(dispatch, ownProps) {
		var rez = {
			doClose: ()=>dispatch(closeModal())
		};

		switch (ownProps.modal) {
			case 'resize':
					rez.doApply = (height, width)=> {
						dispatch(setValues({height, width}));
						rez.doClose();
					};
				break;
		}

		return rez;
	}
)(Modals);

// ACTIONS
const TOGGLE_TOOL = 'TOGGLE_TOOL';

const CLOSE_MODAL = 'CLOSE_MODAL';
const SHOW_MODAL = 'SHOW_MODAL';

const SET_VALUES = 'SET_VALUES';

// ACTION CREATORS
function toggleTool(tool) {
	// tool - string;enum[bold]
	return {
		type: TOGGLE_TOOL,
		tool
	}
}

function showModal(name) {
	return {
		type: SHOW_MODAL,
		name
	}
}

function closeModal() {
	return {
		type: CLOSE_MODAL
	}
}

function setValues(obj) {
	return {
		type: SET_VALUES,
		obj
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
		case SET_VALUES:
			return ('background_rgba' in action.obj) ? action.obj.background_rgba : state;
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
		case SET_VALUES:
			return ('bold' in action.obj) ? action.obj.bold : state;
		default:
			return state;
	}
}
function height(state=hydrant.height, action) {
	switch (action.type) {
		case SET_VALUES:
			return ('height' in action.obj) ? action.obj.height : state;
		default:
			return state;
	}
}
function modal(state=null, action) {
	switch (action.type) {
		case SHOW_MODAL:
				return action.name;
			break;
		case CLOSE_MODAL:
				return null;
			break;
		default:
			return state;
	}
}
function width(state=hydrant.width, action) {
	switch (action.type) {
		case SET_VALUES:
			return ('width' in action.obj) ? action.obj.width : state;
		default:
			return state;
	}
}
