var gToolstates = {};
var core;
var gFsComm;
var callInFramescript, callInMainworker, callInBootstrap;
// document.queryCommandValue('fontSize')
// ""Helvetica Neue",Helvetica,Arial,sans-serif"

function preinit() {

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
				type: string;enum[button,menu] OR react element - if react element then no `func`/`cmd`/`val` applies
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
				name: formatStringFromNameCore('removeformat', 'main'),
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
				name: formatStringFromNameCore('bold', 'main'),
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
				name: formatStringFromNameCore('italic', 'main'),
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
				name: formatStringFromNameCore('underline', 'main'),
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
				name: formatStringFromNameCore('strike', 'main'),
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
				name: formatStringFromNameCore('subscript', 'main'),
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
				name: formatStringFromNameCore('superscript', 'main'),
				type: 'button',
				icon: 'superscript',
				cmd: 'superscript',
				queryState: 'superscript'
			},
			{
				group: 'LISTS',
				name: formatStringFromNameCore('listbullet', 'main'),
				type: 'button',
				icon: 'list',
				cmd: 'insertUnorderedList'
			},
			{
				group: 'LISTS',
				name: formatStringFromNameCore('listnumber', 'main'),
				type: 'button',
				icon: 'list-number',
				cmd: 'insertOrderedList'
			},
			{
				group: 'DENT',
				name: formatStringFromNameCore('indent', 'main'),
				type: 'button',
				icon: 'indent-left',
				cmd: 'indent'
			},
			{
				group: 'DENT',
				name: formatStringFromNameCore('indentless', 'main'),
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
				name: formatStringFromNameCore('alignleft', 'main'),
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
				name: formatStringFromNameCore('aligncenter', 'main'),
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
				name: formatStringFromNameCore('alignright', 'main'),
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
				name: formatStringFromNameCore('alignjustify', 'main'),
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
				name: formatStringFromNameCore('font', 'main'),
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
				name: formatStringFromNameCore('fontcolor', 'main'),
				type: TextToolColorPicker,
				icon: 'text-color'
			},
			{
				state: {
					name: 'fontbackcolor',
					value: '#000000'
				},
				group: 'FONT',
				name: formatStringFromNameCore('fontbackcolor', 'main'),
				type: TextToolColorPicker,
				icon: 'text-background'
			},
			{
				state: {
					name: 'fontsize',
					value: 4 // link492821
				},
				group: 'FONT',
				name: formatStringFromNameCore('fontsize', 'main'),
				type: 'menu',
				cmd: 'fontSize',
				icon: 'text-size',
				// val not set as it is taken from menuitem
				menuitems: [
					{
						label: formatStringFromNameCore('tiny', 'main'),
						rel: 'font',
						robj: { size:1 },
						val: 1
					},
					{
						label: formatStringFromNameCore('small', 'main'),
						rel: 'font',
						robj: { size:2 },
						val: 2
					},
					{
						label: formatStringFromNameCore('smaller', 'main'),
						rel: 'font',
						robj: { size:3 },
						val: 3
					},
					{
						label: formatStringFromNameCore('normal', 'main'),
						rel: 'font',
						robj: { size:4 },
						val: 4
					},
					{
						label: formatStringFromNameCore('large', 'main'),
						rel: 'font',
						robj: { size:5 },
						val: 5
					},
					{
						label: formatStringFromNameCore('larger', 'main'),
						rel: 'font',
						robj: { size:6 },
						val: 6
					},
					{
						label: formatStringFromNameCore('huge', 'main'),
						rel: 'font',
						robj: { size:7 },
						val: 7
					}
				]
			},
			{
				name: formatStringFromNameCore('insertimage', 'main'),
				icon: 'picture',
				type: 'button',
				func: ()=>store.dispatch(showModal('image'))
			},
			{
				state: {
					name: 'smiliedisp',
					value: {filter:'', pg:''}
				},
				name: formatStringFromNameCore('insertemote', 'main'),
				icon: 'smiley',
				type: TextToolSmilies
			},
			{
				state: {
					name: 'canvascolor',
					value: '#FFFFFF' //[255, 255, 255, 1] // rgba
				},
				group: 'CANVAS',
				name: formatStringFromNameCore('canvascolor', 'main'),
				type: TextToolColorPicker,
				icon: 'tint'
			},
			{
				state: {
					name: 'canvassize',
					value: {w:558,h:75}
				},
				group: 'CANVAS',
				name: formatStringFromNameCore('resize', 'main'),
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
				name: formatStringFromNameCore('righttoleft', 'main'),
				type: 'button',
				icon: 'sort'
			},
			{
				group: 'IFRAME',
				name: formatStringFromNameCore('cancelandclose', 'main'),
				icon: 'remove',
				type: 'button',
				func: function() {
					callInBootstrap('destroyEditorInTab');
				}
			},
			{
				group: 'IFRAME',
				name: formatStringFromNameCore('attachtweet', 'main'),
				icon: 'ok',
				type: 'button',
				func: function() {
					// block-link3333
					var editable = document.getElementById('editable');
					editable.removeAttribute('contenteditable');
					callInFramescript('drawWindow', {x:editable.offsetLeft,y:editable.offsetTop,width:editable.offsetWidth,height:editable.offsetHeight,attachimg:true}, function() {
						editable.setAttribute('contenteditable', 'true');
					});
				}
			}
		];

		document.execCommand('styleWithCSS', false, null);
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

		// ctrl + enter for accept and close
		window.addEventListener('keydown', function(e) {
			if (e.ctrlKey && e.key == 'Enter') {
				// copy of block-link3333
				var editable = document.getElementById('editable');
				editable.removeAttribute('contenteditable');
				callInFramescript('drawWindow', {x:editable.offsetLeft,y:editable.offsetTop,width:editable.offsetWidth,height:editable.offsetHeight,attachimg:true}, function() {
					editable.setAttribute('contenteditable', 'true');
				});
			}
		}, false);

		callInBootstrap('displayMe');
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
	componentDidMount: function() {
		document.getElementById('editable').focus();
	},
	render: function() {
		var { toolstates } = this.props; // mapped state
		// var {  } = this.props; // dispatchers

		var editable_style = {
			minHeight: toolstates.canvassize.h + 'px',
			width: toolstates.canvassize.w + 'px',
			backgroundColor: toolstates.canvascolor, // 'rgba(' + toolstates.canvascolor.join(',') + ')',
			direction: !toolstates.direction ? 'ltr' : 'rtl',
			padding: '5px',
		};

		var fontsize_entry = gTools.find(el=>el.icon=='text-size'); // link492821
		// document.execCommand('fontSize', fontsize_entry.state.value);

		// return React.createElement('div', { id:'editable', contentEditable:true, style:editable_style },
		// 	'rawr'
		// );

		return React.createElement('span', { id:'svgthis' },
			React.createElement('font', { size:fontsize_entry.state.value },
				React.createElement('div', { id:'editable', contentEditable:true, style:editable_style },
					''
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
				default:
					// assume it is a react element
					pushtarget.push(
						React.createElement(toolentry.type, { toolentry, toolstates })
					);
			}
		}

		// go through tool_rels and make each array into ReactBootstrap.ButtonGroup
		for (var i=0; i<tool_rels.length; i++) {
			var toolrel_entry = tool_rels[i];
			if (Array.isArray(toolrel_entry)) {
				tool_rels[i] = React.createElement(ReactBootstrap.ButtonGroup, undefined, toolrel_entry);
			}
		}



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
		} else if (toolentry.toggle) {
			store.dispatch(toggleTool(toolentry.state.name))
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
	onMouseDown: function(e) {
		if (e.target.nodeName == 'UL') {
			// this prevents focus from straying, if you put this on `ReactBootstrap.FormControl` then it will keep it from closing
			e.preventDefault();
		}
	},
	render: function() {
		var { toolentry, toolstates } = this.props;

		return React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip(toolentry.tooltip || toolentry.name) },
			React.createElement(ReactBootstrap.Dropdown, { id:toolentry.name.toLowerCase().replace(/[^a-z]/g, '') + '_dropdown' },
				React.createElement(ReactBootstrap.Dropdown.Toggle, { onClick:this.onClick },
					React.createElement(ReactBootstrap.Glyphicon, { glyph:toolentry.icon })
				),
				React.createElement(ReactBootstrap.Dropdown.Menu, { onMouseDown:this.onMouseDown },
					toolentry.menuitems.map( (el, i) => React.createElement(TextToolMenuItem, { toolentry, menuitem_entry:el, eventKey:''+i }))
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

var TextToolSmilies = React.createClass({
	componentDidMount: function() {
		window.addEventListener('keydown', this.onKeyDown, true);
		window.addEventListener('keyup', this.onKeyUp, true);
		window.addEventListener('keypress', this.onKeyPress, true);
	},
	onKeyUp: function(e) {
		if (!this.isOpen) return;

		e.preventDefault();
		e.stopPropagation();
	},
	onKeyPress: function(e) {
		if (!this.isOpen) return;

		e.preventDefault();
		e.stopPropagation();
	},
	onWheel: function(e) {

		if (e.deltaY < 0) {
			e.key = 'ArrowDown';
		} else {
			e.key = 'ArrowUp';
		}
		this.onKeyDown(e);
	},
	onKeyDown: function(e) {
		if (!this.isOpen) return;

		e.preventDefault();
		e.stopPropagation();

		if (e.repeat) return;

		var { toolstates } = this.props;
		var { smiliedisp:state } = toolstates;

		var newstate = Object.assign({}, state);
		if (!newstate.pg || isNaN(newstate.pg)) {
			newstate.pg = 1;
		}

		// get `pgmax`
		var emotes_filtered = gEmote.slice();
		if (state.filter) {
			var filter_patt = new RegExp(escapeRegExp(state.filter), 'i');
			emotes_filtered = emotes_filtered.filter(el=>filter_patt.test(el.Name) || el.Keywords.filter(keyword=>filter_patt.test(keyword)).length);
		}
		var pgmax = Math.ceil(emotes_filtered.length / 77);

		switch (e.key) {
			case 'ArrowUp':
					if (newstate.pg + 1 <= pgmax) newstate.pg++;
				break;
			case 'ArrowDown':
					if (newstate.pg > 1) newstate.pg--;
				break;
			case 'Backspace':
				if (newstate.filter && newstate.filter.length) {
					newstate.filter = newstate.filter.substr(0, newstate.filter.length - 1);
					newstate.pg = 1;
				}
		}
		if (e.key.length == 1) {
			if (!newstate.filter) {
				newstate.filter = '';
			}
			newstate.filter += e.key + '';
			newstate.pg = 1;
		}


		var ischanged = React.addons.shallowCompare({props:state}, newstate);
		if (ischanged) {
			store.dispatch(setToolValues({
				smiliedisp: newstate
			}));
		}
	},
	onMouseDown: function(e) {
		if (e.target.nodeName == 'UL') {
			// this prevents focus from straying, if you put this on `ReactBootstrap.FormControl` then it will keep it from closing
			e.preventDefault();
		}
	},
	doPrevent: function(e) {
		e.preventDefault();
	},
	onToggle: function(isOpen) {
		this.isOpen = isOpen;
	},
	isOpen: false,
	render: function() {
		var { toolentry, toolstates } = this.props;
		var { smiliedisp:state } = toolstates;

		var emotes_filtered = gEmote.slice();

		var filtertxt;
		if (!state.filter) {
			filtertxt = 'Type to search';
		} else {
			var filter_patt = new RegExp(escapeRegExp(state.filter), 'i');
			filtertxt = '"' + state.filter + '"';
			emotes_filtered = emotes_filtered.filter(el=>filter_patt.test(el.Name) || el.Keywords.filter(keyword=>filter_patt.test(keyword)).length);
		}

		var pgtxt;
		var pg = state.pg || 1;
		var pgmax = Math.ceil(emotes_filtered.length / 77);
		pgtxt = pg + ' / ' + pgmax;
		var emotes_disp = emotes_filtered.slice((pg-1)*77, pg*77);

		return React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip(toolentry.tooltip || toolentry.name) },
			React.createElement(ReactBootstrap.Dropdown, { onToggle:this.onToggle, id:toolentry.name.toLowerCase().replace(/[^a-z]/g, '') + '_dropdown' },
				React.createElement(ReactBootstrap.Dropdown.Toggle, undefined,
					React.createElement(ReactBootstrap.Glyphicon, { glyph:toolentry.icon })
				),
				React.createElement(ReactBootstrap.Dropdown.Menu, { onWheel: this.onWheel, onMouseDown:this.onMouseDown },
					React.createElement('div', { onMouseDown:this.doPrevent },
						React.createElement('span', { style:{float:'right'} },
							pgtxt
						),
						React.createElement('span', undefined,
							filtertxt
						)
					),
					emotes_disp.map( (el, i) => React.createElement(TextToolSmilie, { toolentry, smilie:el, eventKey:''+(i) }))
				)
			)
		);
	}
});

var TextToolSmilie = React.createClass({
	onClick: function() {
		var { toolentry, smilie } = this.props;

		var fontsize = document.queryCommandValue('fontsize');
		var imgsize;
		switch (parseInt(fontsize)) {
			case 1:
					imgsize = 11;
				break;
			case 2:
					imgsize = 16;
				break;
			case 3:
					imgsize = 24;
				break;
			case 4:
					imgsize = 32;
				break;
			case 5:
					imgsize = 48;
				break;
			case 6:
					imgsize = 60;
				break;
			case 7:
					imgsize = 72;
				break;
			default:
				imgsize = 24;
		}

		document.execCommand('insertHTML', false, '<img src="' + core.addon.path.images + '3rd/twemoji-svg/' + convertCodeToTwemoji(smilie.Code) + '.svg' + '" width="' + imgsize + '" height="' + imgsize + '" />');

		document.getElementById('editable').focus();
	},
	render: function() {
		var { smilie, eventKey } = this.props;

		return React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip(smilie.Name) },
			React.createElement(ReactBootstrap.MenuItem, { eventKey, onClick:this.onClick, style:{backgroundImage:'url("' + core.addon.path.images + '3rd/twemoji-svg/' + convertCodeToTwemoji(smilie.Code) + '.svg")'} })
		);
	}
});

function convertCodeToTwemoji(aCode) {
	// aCode must be a string like "U+0023 U+FE0F U+20E3"
	var name = aCode;
	name = name.replace(/U\+FE0F/g, '-');
	name = name.replace(/U\+/g, '');
	name = name.replace(/^0+/, ''); // strip leading 0's
	name = name.replace(/ /g, '-');
	// name = name.replace(/-FE0F-/gi, ''); // i cant do this, it messes up the "man heart" stuff
	var feofsplit = name.split('-fe0f-');
	if (feofsplit.length === 2) {
		if (!feofsplit[0].includes('-') && !feofsplit[1].includes('-')) {
			name = name.replace('-fe0f-', '-');
		}
	}
	return name;

	// return grabTheRightIcon(JSON.parse('["' + aCode.replace(/ /g, '').replace(/U\+/g, '\\u') + '"]')[0]);
}

function toCodePoint(unicodeSurrogates, sep) {
  var
	r = [],
	c = 0,
	p = 0,
	i = 0;
  while (i < unicodeSurrogates.length) {
	c = unicodeSurrogates.charCodeAt(i++);
	if (p) {
	  r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
	  p = 0;
	} else if (0xD800 <= c && c <= 0xDBFF) {
	  p = c;
	} else {
	  r.push(c.toString(16));
	}
  }
  return r.join(sep || '-');
}
function grabTheRightIcon(icon, variant) {
  // if variant is present as \uFE0F
  return toCodePoint(
	variant === '\uFE0F' ?
	  // the icon should not contain it
	  icon.slice(0, -1) :
	  // fix non standard OSX behavior
	  (icon.length === 3 && icon.charAt(1) === '\uFE0F' ?
		icon.charAt(0) + icon.charAt(2) : icon)
  );
}

var gColors = ['#000000', '#FFFFFF', '#4A90E2', '#D0021B', '#F5A623', '#F8E71C', '#00B050', '#9013FE'];
var TextToolColorPicker = React.createClass({
	onMouseDown: function(e) {
		if (e.target.nodeName == 'UL') {
			// this prevents focus from straying, if you put this on `ReactBootstrap.FormControl` then it will keep it from closing
			e.preventDefault();
		}
	},
	render: function() {
		var { toolentry, toolstates } = this.props;

		// return React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip(toolentry.tooltip || toolentry.name) },
		// 	React.createElement(ReactBootstrap.Dropdown, { id:toolentry.name.toLowerCase().replace(/[^a-z]/g, '') + '_dropdown' },
		// 		React.createElement(ReactBootstrap.Button, { bsRole:'toggle' },
		// 			React.createElement(ReactBootstrap.Glyphicon, { glyph:toolentry.icon })
		// 		),
		// 		React.createElement(ReactBootstrap.Dropdown.Menu, { bsRole:'menu' },
		// 			React.createElement('div', { eventKey:'1', style:{display:'inline-block', width:'16px', height:'16px', border:'1px solid #999', margin:'2px', backgroundColor:'steelblue'} }),
		// 			React.createElement('div', { eventKey:'2', style:{display:'inline-block', width:'16px', height:'16px', border:'1px solid #999', margin:'2px', backgroundColor:'green'} })
		// 		)
		// 	)
		// );
		return React.createElement(ReactBootstrap.OverlayTrigger, { placement:'top', overlay:Tooltip(toolentry.tooltip || toolentry.name) },
			React.createElement(ReactBootstrap.Dropdown, { id:toolentry.name.toLowerCase().replace(/[^a-z]/g, '') + '_dropdown' },
				React.createElement(ReactBootstrap.Dropdown.Toggle, undefined,
					React.createElement(ReactBootstrap.Glyphicon, { glyph:toolentry.icon })
				),
				React.createElement(ReactBootstrap.Dropdown.Menu, { onMouseDown:this.onMouseDown },
					gColors.map( (el, i) => React.createElement(TextToolColor, { toolentry, color:el, eventKey:''+i }))
				)
			)
		);
	}
});

var TextToolColor = React.createClass({
	onClick: function() {
		var { toolentry, color } = this.props;

		// var { cmd } = toolentry;
		// if (cmd) {
		// 	var { val } = menuitem_entry;
		// 	document.execCommand(cmd, false, val || null);
		// }

		store.dispatch(setToolValues({
			[toolentry.state.name]: color
		}));

		switch (toolentry.state.name) {
			case 'fontcolor':
					document.execCommand('foreColor', false, color);
				break;
			case 'fontbackcolor':
					document.execCommand('hiliteColor', false, color);
				break;
		}

		document.getElementById('editable').focus();
	},
	render: function() {
		var { color, eventKey } = this.props;

		return React.createElement(ReactBootstrap.MenuItem, { eventKey, onClick:this.onClick, style:{backgroundColor:color} })
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
	onSubmit: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.doApply();
	},
	onEntering: function() {
		// focus the first input field. my assumption is i as devuser only put refs on input fields. and i also assume that ref will itearate in order with for..in

		for (var refkey in this.refs) {
			var ref = this.refs[refkey];
			ReactDOM.findDOMNode(ref).select();
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
			case 'image':
					contents = [
						React.createElement(ReactBootstrap.Modal.Header, { closeButton:true },
							React.createElement(ReactBootstrap.Modal.Title, undefined,
								formatStringFromNameCore('imagemodal_title', 'main')
							)
						),
						React.createElement(ReactBootstrap.Modal.Body, undefined,
							formatStringFromNameCore('imagemodal_body', 'main')
						),
						React.createElement(ReactBootstrap.Modal.Footer, undefined,
							React.createElement(ReactBootstrap.Button, { onClick:doClose },
								formatStringFromNameCore('ok', 'main')
							)
						)
					];
				break;
			case 'canvassize':
					var { canvassize={h:1,w:2} } = this.props; // mapped state ex
					contents = [
						React.createElement(ReactBootstrap.Modal.Header, { closeButton:true },
							React.createElement(ReactBootstrap.Modal.Title, undefined,
								formatStringFromNameCore('resizecanvas', 'main')
							)
						),
						React.createElement(ReactBootstrap.Modal.Body, undefined,
							React.createElement(ReactBootstrap.Form, { onSubmit:this.onSubmit, inline:true },
								React.createElement(ReactBootstrap.ControlLabel, undefined,
									formatStringFromNameCore('width', 'main')
								),
								React.createElement(ReactBootstrap.FormControl, { type:'text', ref:'width', defaultValue:canvassize.w })
							),
							React.createElement(ReactBootstrap.Form, { onSubmit:this.onSubmit, inline:true },
								React.createElement(ReactBootstrap.ControlLabel, undefined,
									formatStringFromNameCore('minheight', 'main')
								),
								React.createElement(ReactBootstrap.FormControl, { type:'text', ref:'height', defaultValue:canvassize.h })
							)
						),
						React.createElement(ReactBootstrap.Modal.Footer, undefined,
							React.createElement(ReactBootstrap.Button, { onClick:doClose },
								formatStringFromNameCore('cancel', 'main')
							),
							React.createElement(ReactBootstrap.Button, { onClick:this.doApply, bsStyle:'primary' },
								formatStringFromNameCore('apply', 'main')
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
		return React.createElement(ReactBootstrap.Modal, { onEntering:this.onEntering, show:!!modal, onHide:doClose },
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
			var toolentry = gTools.find(el=>el.state && el.state.name == action.tool);
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



	var cLocalizedStr = core.addon.l10n[aLoalizedKeyInCoreAddonL10n][aLocalizableStr];

    if (aReplacements) {
        for (var i=0; i<aReplacements.length; i++) {
            cLocalizedStr = cLocalizedStr.replace('%S', aReplacements[i]);
        }
    }

    return cLocalizedStr;
}

function escapeRegExp(text) {
	if (!arguments.callee.sRE) {
		var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
		arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
	}
	return text.replace(arguments.callee.sRE, '\\$1');
}
