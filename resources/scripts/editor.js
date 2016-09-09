var gToolstates = {};
var core;
var gFsComm;
var callInFramescript, callInMainworker, callInBootstrap;
// document.queryCommandValue('fontSize')
// ""Helvetica Neue",Helvetica,Arial,sans-serif"

function preinit() {
	console.log('in iprenit');
	({ callInFramescript, callInMainworker, callInBootstrap } = CommHelper.contentinframescript);
	gFsComm = new Comm.client.content(init);
}
window.addEventListener('DOMContentLoaded', preinit, false);

function init() {
	callInBootstrap('fetchCore', undefined, aArg => {
		core = aArg.core;

		gTools = [
			/*
			{
				name: string - its identifier in the redux state
				state: {
					isdefault - set to true if multiple tools share same name
					value: - default value, // if toggle is set to true, then if value is `typeof() == 'boolean'` then it is toggled to opposite, else it is toggled to null
					name: - the name to refer to this in the state object (store) - if value is true/false then this acts like radio
				}
				value: - default value
				group: null - undefined or something common. if not null, if any others match, they will be grouped
				icon: string - glyphicon style
				type: string;enum[button,menu]
				toggle: bool/undefined - if should be `active` or not
				queryCommandState - only for `toggle:true` on caret move in form, if should set to active or not based on this
				queryCommandValue - same as above
				queryFunc - same as above but it runs this func, you can do like `window.getSelection().focusNode` stuff or your own custom queryCommandValue like for font
				menuitems: [ // only if `type:menu`
					{
						label - string
						rel - string-React.createElement 1st arg if the menuitem should be wrapped
						robj - object-React.creeatElement 2nd arg - only if `rel` is set
						val - execCommand 3rd arg - only if `cmd` is set
					}
				]
				cmd - execCommand 1st arg - only if `type:button`
				val - execCommand 3rd arg - only if `type:button` and `cmd` is set IFFFF type is menu, then value is val in menuitem and thus this should not be set
				func - alternative to execCommand. all func should end with execCommand.
			}
			*/
			{
				name: formatStringFromNameCore('style', 'main'),
				icon: 'menu-hamburger',
				type: 'menu',
				cmd: 'formatBlock',
				menuitems: [
					{
						label: formatStringFromNameCore('code', 'main'),
						rel: 'pre',
						val: 'pre'
					},
					{
						label: formatStringFromNameCore('quote', 'main'),
						rel: 'blockquote',
						val: 'blockquote'
					},
					{
						label: formatStringFromNameCore('headingX', 'main', [1]),
						rel: 'h1',
						val: 'h1'
					},
					{
						label: formatStringFromNameCore('headingX', 'main', [2]),
						rel: 'h2',
						val: 'h2'
					},
					{
						label: formatStringFromNameCore('headingX', 'main', [3]),
						rel: 'h3',
						val: 'h3'
					},
					{
						label: formatStringFromNameCore('headingX', 'main', [4]),
						rel: 'h4',
						val: 'h4'
					},
					{
						label: formatStringFromNameCore('headingX', 'main', [5]),
						rel: 'h5',
						val: 'h5'
					},
					{
						label: formatStringFromNameCore('headingX', 'main', [6]),
						rel: 'h6',
						val: 'h6'
					},
					{
						label: formatStringFromNameCore('headingX', 'main', [7]),
						rel: 'h7',
						val: 'h7'
					}
				]
			},
			{
				name: 'Remove Formating',
				type: 'button',
				icon: 'erase',
				cmd: 'removeFormat'
			},
			{
				state: {
					value: false,
					name: 'bold'
				},
				group: 'BOLD',
				name: 'Bold',
				type: 'button',
				icon: 'bold',
				cmd: 'bold',
				queryState: 'bold',
				toggle: true
			},
			{
				state: {
					value: false,
					name: 'italic'
				},
				group: 'BOLD',
				name: 'Italic',
				type: 'button',
				icon: 'italic',
				cmd: 'italic',
				queryState: 'italic',
				toggle: true
			},
			{
				state: {
					value: false,
					name: 'underline'
				},
				group: 'BOLD',
				name: 'Underline',
				type: 'button',
				icon: 'underline',
				cmd: 'underline',
				queryState: 'underline',
				toggle: true
			},
			{
				state: {
					value: false,
					name: 'strike'
				},
				group: 'BOLD',
				name: 'Strike',
				type: 'button',
				icon: 'strikethrough',
				cmd: 'strikeThrough',
				queryState: 'strikeThrough',
				toggle: true
			},
			{
				state: {
					value: 'sub',
					name: 'subsup',
				},
				toggle: true,
				group: 'BOLD',
				name: 'Subscript',
				type: 'button',
				icon: 'subscript',
				cmd: 'subscript',
				queryState: 'subscript'
			},
			{
				state: {
					value: 'sup',
					name: 'subsup'
				},
				toggle: true,
				group: 'BOLD',
				name: 'Superscript',
				type: 'button',
				icon: 'superscript',
				cmd: 'superscript',
				queryState: 'superscript'
			},
			{
				group: 'LISTS',
				name: 'Bulleted List',
				type: 'button',
				icon: 'list',
				cmd: 'insertUnorderedList'
			},
			{
				group: 'LISTS',
				name: 'Numbered List',
				type: 'button',
				icon: 'list-alt',
				cmd: 'insertOrderedList'
			},
			{
				group: 'DENT',
				name: 'Indent More',
				type: 'button',
				icon: 'indent-left',
				cmd: 'indent'
			},
			{
				group: 'DENT',
				name: 'Indent Less',
				type: 'button',
				icon: 'indent-right',
				cmd: 'outdent'
			},
			{
				state: {
					value: 'left',
					name: 'align',
					isdefault: true
				},
				group: 'ALIGN',
				name: 'Align Left',
				type: 'button',
				icon: 'align-left',
				cmd: 'justifyLeft'
			},
			{
				state: {
					value: 'center',
					name: 'align'
				},
				group: 'ALIGN',
				name: 'Align Center',
				type: 'button',
				icon: 'align-center',
				cmd: 'justifyCenter'
			},
			{
				state: {
					value: 'right',
					name: 'align'
				},
				group: 'ALIGN',
				name: 'Align Right',
				type: 'button',
				icon: 'align-right',
				cmd: 'justifyRight'
			},
			{
				state: {
					value: 'justify',
					name: 'align'
				},
				group: 'ALIGN',
				name: 'Justify',
				type: 'button',
				icon: 'align-justify',
				cmd: 'justifyFull'
			},
			{
				state: {
					name: 'fontfamily',
					value: 'Arial' // link49282
				},
				group: 'FONT',
				name: 'Font',
				type: 'menu',
				icon: 'font',
				menuitems: [],
				cmd: 'fontName'
				// val not set as it is taken from menuitem
			},
			{
				state: {
					name: 'fontcolor',
					value: '#000000'
				},
				group: 'FONT',
				name: 'Font Color',
				type: 'button',
				icon: 'text-color',
				func: function() {
					alert('opening color palete, if user presses ok then execCommand that and set state.name `fontcolor` in `store`');
				}
			},
			{
				state: {
					name: 'fontbackcolor',
					value: '#000000'
				},
				group: 'FONT',
				name: 'Font Backing Color',
				type: 'button',
				icon: 'text-background',
				func: function() {
					alert('opening color palete, if user presses ok then execCommand that and set state.name `fontbackcolor` in `store`');
				}
			},
			{
				state: {
					name: 'fontsize',
					value: 4 // link492821
				},
				group: 'FONT',
				name: 'Font Size',
				type: 'menu',
				cmd: 'fontSize',
				icon: 'text-size',
				// val not set as it is taken from menuitem
				menuitems: [
					{
						label: 'Tiny',
						rel: 'font',
						robj: { size:1 },
						val: 1
					},
					{
						label: 'Small',
						rel: 'font',
						robj: { size:2 },
						val: 2
					},
					{
						label: 'Samller',
						rel: 'font',
						robj: { size:3 },
						val: 3
					},
					{
						label: 'Normal',
						rel: 'font',
						robj: { size:4 },
						val: 4
					},
					{
						label: 'Large',
						rel: 'font',
						robj: { size:5 },
						val: 5
					},
					{
						label: 'Larger',
						rel: 'font',
						robj: { size:6 },
						val: 6
					},
					{
						label: 'Huge',
						rel: 'font',
						robj: { size:7 },
						val: 7
					}
				]
			},
			{
				name: 'Insert Image',
				icon: 'picture',
				type: 'button',
				func: ()=>showModal('image')
			},
			{
				state: {
					name: 'canvascolor',
					value: [255, 255, 255, 1] // rgba
				},
				group: 'CANVAS',
				name: 'Background Color',
				type: 'button',
				icon: 'tint',
				func: function() {
					alert('show color palete')
				}
			},
			{
				state: {
					name: 'canvassize',
					value: {w:300,h:250}
				},
				group: 'CANVAS',
				name: 'Resize',
				type: 'button',
				icon: 'fullscreen',
				func: ()=>store.dispatch(showModal('canvassize'))
			},
			{
				state: {
					name: 'direction',
					value: false
				},
				toggle: true,
				group: 'CANVAS',
				name: 'Right-to-Left',
				type: 'button',
				icon: 'sort'
			},
			{
				group: 'IFRAME',
				name: 'Cancel & Close',
				icon: 'remove',
				type: 'button',
				func: function() {
					callInBootstrap('destroyEditorInTab');
				}
			},
			{
				group: 'IFRAME',
				name: 'Attach to Tweet',
				icon: 'ok',
				type: 'button',
				func: function() {
					var editable = document.getElementById('editable');
					editable.removeAttribute('contenteditable');
					callInFramescript('drawWindow', {x:editable.offsetLeft,y:editable.offsetTop,width:editable.offsetWidth,height:editable.offsetHeight,attachimg:true}, function() {
						editable.setAttribute('contenteditable', 'true');
					});
				}
			}
		];

		// set default font size
		// var fontsize_entry = gTools.find(el=>el.icon=='text-size'); // link492821
		// document.execCommand('fontSize', fontsize_entry.state.value);

		// populate `menuitems` field of the `font` entry
		var fontname_entry = gTools.find(el=>el.icon=='font');
		document.execCommand('fontName', false, fontname_entry.state.value); // set default font link49282
		var fontname_menuitems = fontname_entry.menuitems;
		for (var font of fonts) {
			var fontname_menuitem = {
				label: font,
				rel: 'span',
				robj: { style:{fontFamily:font} },
				val: font
			};
			fontname_menuitems.push(fontname_menuitem);
		}

		// create default `gToolstates` entry for state
		for (var toolentry of gTools) {
			var { state } = toolentry;
			if (state) {
				if (!(state.name in gToolstates) || state.isdefault) {
					gToolstates[state.name] = state.value;
				}
			}
		}
		//
		app = Redux.combineReducers({
			toolstates,
			modal
		});

		store = Redux.createStore(app);

		var div = document.createElement('div');
		div.setAttribute('style', 'position:fixed;top:0;left:0;height:100vh;width;100vw;z-index:99999;');
		div.setAttribute('class', 'tweeeeeeeeeeeeeeeeeeter');
		document.documentElement.appendChild(div);

		var stylesheets = [
			{
				el: 'link',
				rel: 'stylesheet',
				type: 'text/css',
				media: 'screen',
				class: 'tweeeeeeeeeeeeeeeeeeter',
				href: core.addon.path.styles + 'fonts.css'
			},
			{
				el: 'link',
				rel: 'stylesheet',
				type: 'text/css',
				media: 'screen',
				class: 'tweeeeeeeeeeeeeeeeeeter',
				href: core.addon.path.styles + 'bootstrap.css'
			},
			{
				el: 'link',
				rel: 'stylesheet',
				type: 'text/css',
				media: 'screen',
				class: 'tweeeeeeeeeeeeeeeeeeter',
				href: core.addon.path.styles + 'editor.css'
			}
			/////////////////////// scripts
			// {
			// 	el: 'script',
			// 	src: core.addon.path.scripts + '3rd/react-with-addons.js'
			// },
			// {
			// 	el: 'script',
			// 	src: core.addon.path.scripts + '3rd/react-dom.js'
			// },
			// {
			// 	el: 'script',
			// 	src: core.addon.path.scripts + '3rd/redux.js'
			// },
			// {
			// 	el: 'script',
			// 	src: core.addon.path.scripts + '3rd/react-redux.js'
			// },
			// {
			// 	el: 'script',
			// 	src: core.addon.path.scripts + '3rd/react-bootstrap.js'
			// },
			// {
			// 	el: 'script',
			// 	src: core.addon.path.scripts + '3rd/editor.js'
			// }
		];

		// for (var sheet of stylesheets) {
		// 	var domel = document.createElement(sheet.el);
		// 	for (var p in sheet) {
		// 		if (p == 'el') continue;
		// 		domel.setAttribute(p, sheet[p]);
		// 	}
		// 	document.documentElement.appendChild(domel)
		// }

		// render react
		ReactDOM.render(
			React.createElement(ReactRedux.Provider, { store },
				React.createElement(App)
			),
			document.getElementById('root')
		);
	});
}

var gTools;
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
		var { toolstates } = this.props; // mapped state
		// var {  } = this.props; // dispatchers

		var editable_style = {
			height: toolstates.canvassize.h + 'px',
			width: toolstates.canvassize.w + 'px',
			backgroundColor: 'rgba(' + toolstates.canvascolor.join(',') + ')',
			direction: !toolstates.direction ? 'ltr' : 'rtl',
			padding: '5px'
		};

		var fontsize_entry = gTools.find(el=>el.icon=='text-size'); // link492821
		// document.execCommand('fontSize', fontsize_entry.state.value);

		// return React.createElement('div', { id:'editable', contentEditable:true, style:editable_style },
		// 	'rawr'
		// );

		return React.createElement('span', { id:'svgthis' },
			React.createElement('font', { size:fontsize_entry.state.value },
				React.createElement('div', { id:'editable', contentEditable:true, style:editable_style },
					'rawr'
				)
			)
		);
	}
});

var Tools = React.createClass({
	render: function() {
		var { toolstates } = this.props; // mapped state
		// var { } = this.props; // dispatchers

		var tool_rels = [];
		var toolgroup_ref = {};
		for (var toolentry of gTools) {

			// figure out `pushtarget`
			var pushtarget;
			if (!toolentry.group) {
				pushtarget = tool_rels;
			} else {
				var ref = toolgroup_ref[toolentry.group];
				if (!ref) {
					ref = [];
					toolgroup_ref[toolentry.group] = ref;
					tool_rels.push(ref);
				}
				pushtarget = ref;
			}

			switch (toolentry.type) {
				case 'button':
						pushtarget.push(
							React.createElement(TextToolButton, { toolentry, toolstates })
						);
					break;
				case 'menu':
						pushtarget.push(
							React.createElement(TextToolMenu, { toolentry, toolstates })
						);
					break;
			}
		}

		// go through tool_rels and make each array into ReactBootstrap.ButtonGroup
		for (var i=0; i<tool_rels.length; i++) {
			var toolrel_entry = tool_rels[i];
			if (Array.isArray(toolrel_entry)) {
				tool_rels[i] = React.createElement(ReactBootstrap.ButtonGroup, undefined, toolrel_entry);
			}
		}

		// console.log('tool_rels:', tool_rels);

		return React.createElement(ReactBootstrap.ButtonToolbar, undefined,
			tool_rels
		);
	}
});

var TextToolButton = React.createClass({
	onClick: function() {
		var { toolentry, toolstates } = this.props;

		var { cmd, val, func} = toolentry;
		if (cmd) {
			document.execCommand(cmd, false, val || null);
		} else if (func) {
			func();
		}

		document.getElementById('editable').focus();
	},
	render: function() {
		var { toolentry, toolstates } = this.props;

		return React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip(toolentry.tooltip || toolentry.name) },
			React.createElement(ReactBootstrap.Button, { onClick:this.onClick },
				React.createElement(ReactBootstrap.Glyphicon, { glyph:toolentry.icon })
			)
		);
	}
});

var TextToolMenu = React.createClass({
	onClick: function() {
		var { toolentry, toolstates } = this.props;

		document.getElementById('editable').focus();
	},
	render: function() {
		var { toolentry, toolstates } = this.props;

		return React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip(toolentry.tooltip || toolentry.name) },
			React.createElement(ReactBootstrap.Dropdown, { id:toolentry.name.toLowerCase().replace(/[^a-z]/g, '') + '_dropdown' },
				React.createElement(ReactBootstrap.Dropdown.Toggle, { onClick:this.onClick },
					React.createElement(ReactBootstrap.Glyphicon, { glyph:toolentry.icon })
				),
				React.createElement(ReactBootstrap.Dropdown.Menu, undefined,
					toolentry.menuitems.map( (el, i) => React.createElement(TextToolMenuItem, { toolentry, menuitem_entry:el, eventKey:i }))
				)
			)
		);
	}
});

var TextToolMenuItem = React.createClass({
	onClick: function() {
		var { toolentry, menuitem_entry } = this.props;

		var { cmd } = toolentry;
		if (cmd) {
			var { val } = menuitem_entry;
			document.execCommand(cmd, false, val || null);
		}

		document.getElementById('editable').focus();
	},
	render: function() {
		var { menuitem_entry, eventKey } = this.props;

		return React.createElement(ReactBootstrap.MenuItem, { eventKey, onClick:this.onClick },
			!menuitem_entry.rel ? menuitem_entry.label : React.createElement(menuitem_entry.rel, menuitem_entry.robj, menuitem_entry.label)
		)
	}
});

const Tooltip = txt => React.createElement(ReactBootstrap.Tooltip, undefined, txt);

var Modals = React.createClass({
	showing_for_name: null,
	doApply: function() {
		var { modal } = this.props; // mapped state
		var { doApply } = this.props; // dispatchers

		switch (modal) {
			case 'canvassize':
					doApply( { h:parseInt(ReactDOM.findDOMNode(this.refs.height).value), w:parseInt(ReactDOM.findDOMNode(this.refs.width).value) });
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
			case 'canvassize':
					var { canvassize={h:1,w:2} } = this.props; // mapped state ex
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
								React.createElement(ReactBootstrap.FormControl, { type:'text', ref:'width', defaultValue:canvassize.w })
							),
							React.createElement(ReactBootstrap.Form, { inline:true },
								React.createElement(ReactBootstrap.ControlLabel, undefined,
									'Height:'
								),
								React.createElement(ReactBootstrap.FormControl, { type:'text', ref:'height', defaultValue:canvassize.h })
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
			toolstates: state.toolstates
		};
	}
	// function mapDispatchToProps(dispatch, ownProps) {}
)(Editable);

var ToolsContainer = ReactRedux.connect(
	function mapStateToProps(state, ownProps) {
		return {
			toolstates: state.toolstates
		};
	},
	function mapDispatchToProps(dispatch, ownProps) {
		return {

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
			case 'canvassize':
					rez.canvassize = state.toolstates.canvassize;
				break;
		}

		return rez;
	},
	function mapDispatchToProps(dispatch, ownProps) {
		var rez = {
			doClose: ()=>dispatch(closeModal())
		};

		switch (ownProps.modal) {
			case 'canvassize':
					rez.doApply = canvassize => {
						dispatch(setToolValues( {canvassize} ));
						rez.doClose();
					};
				break;
		}

		return rez;
	}
)(Modals);

// ACTIONS
const TOGGLE_TOOL = 'TOGGLE_TOOL';
const SET_TOOL_VALUES = 'SET_TOOL_VALUES';

const CLOSE_MODAL = 'CLOSE_MODAL';
const SHOW_MODAL = 'SHOW_MODAL';

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

function setToolValues(obj) {
	return {
		type: SET_TOOL_VALUES,
		obj
	}
}
// REDUCERS
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

function toolstates(state=gToolstates, action) {
	switch (action.type) {
		case SET_TOOL_VALUES:
			return Object.assign({}, state, action.obj);
		case TOGGLE_TOOL:
			var toolentry = gTools.find(el=>el.state.name == action.tool);
			var newstate;
			if (typeof(toolentry.state.value) == 'boolean') {
				newstate = !state[action.tool];
			} else {
				// its a string
				if (state[action.tool]) {
					newstate = null;
				} else {
					// find `isdefault` value
					var toolentry_withdefault = gTools.find(el=>el.state && el.state.name == action.tool && el.state.isdefault);
					newstate = toolentry_withdefault.state.value;
				}
			}
			return Object.assign({}, state, {
				[action.tool]: newstate
			});
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
// start - common helper functions
function formatStringFromNameCore(aLocalizableStr, aLoalizedKeyInCoreAddonL10n, aReplacements) {
	// 051916 update - made it core.addon.l10n based
    // formatStringFromNameCore is formating only version of the worker version of formatStringFromName, it is based on core.addon.l10n cache

	try { var cLocalizedStr = core.addon.l10n[aLoalizedKeyInCoreAddonL10n][aLocalizableStr]; if (!cLocalizedStr) { throw new Error('localized is undefined'); } } catch (ex) { console.error('formatStringFromNameCore error:', ex, 'args:', aLocalizableStr, aLoalizedKeyInCoreAddonL10n, aReplacements); } // remove on production

	var cLocalizedStr = core.addon.l10n[aLoalizedKeyInCoreAddonL10n][aLocalizableStr];
	// console.log('cLocalizedStr:', cLocalizedStr, 'args:', aLocalizableStr, aLoalizedKeyInCoreAddonL10n, aReplacements);
    if (aReplacements) {
        for (var i=0; i<aReplacements.length; i++) {
            cLocalizedStr = cLocalizedStr.replace('%S', aReplacements[i]);
        }
    }

    return cLocalizedStr;
}
