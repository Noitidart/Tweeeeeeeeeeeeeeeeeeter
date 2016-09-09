// Imports
var {interfaces: Ci, manager: Cm, results: Cr, utils:Cu      , classes:Cc} = Components;
Cm.QueryInterface(Ci.nsIComponentRegistrar);
Cu.importGlobalProperties(['Blob', 'URL']);

// CommAPI import and setup for framescript
var gCommScope = {};
Services.scriptloader.loadSubScript('chrome://tweeeeeeeeeeeeeeeeeeter/content/resources/scripts/comm/Comm.js', gCommScope);
var { callInBootstrap, callInMainworker, callInContent } = gCommScope.CommHelper.framescript;
Object.assign(gCommScope, { callInBootstrap, callInMainworker, callInContent }); // Comm.js requires these be inside it as well

// Globals
var core = {
	addon: {
		id: 'Tweeeeeeeeeeeeeeeeeeter@jetpack'
	}
};
var gBsComm; // need to set this. instead var because otherwise Comm/Comm.js cant access it
var gWinComm; // need to set this. instead var because otherwise Comm/Comm.js cant access it
var gMM = this;
var gAppAboutFactory;

var gSandbox;

var MATCH_APP = 1;
var MATCH_TWITTER = 2;

const TWITTER_HOSTNAME = 'twitter.com';
var gLastReloadDueToError = 0;

const NS_HTML = 'http://www.w3.org/1999/xhtml';
const NS_XUL = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

// start - pageLoader
var pageLoader = {
	// start - devuser editable
	IGNORE_FRAMES: true,
	IGNORE_LOAD: true,
	IGNORE_NONMATCH: true,
	IGNORE_UNLOAD: false,
	IGNORE_CREATED: true,
	matches: function(aHREF, aLocation) {
		// do your tests on aHREF, which is aLocation.href.toLowerCase(), return true if it matches
		var href_lower = aLocation.href.toLowerCase();
		if (href_lower.startsWith('about:tweeter')) {
			return MATCH_APP;
		} else if (aLocation.hostname == TWITTER_HOSTNAME){
			return MATCH_TWITTER;
		}
	},
	ready: function(aContentWindow) {
		// triggered on page ready
		// triggered for each frame if IGNORE_FRAMES is false
		// to test if frame do `if (aContentWindow.frameElement)`

		// console.log('READYYYYYYYYYYYYYYYYYYYYYY');
		var contentWindow = aContentWindow;
		// console.log('PAGE READYYYYYY:', contentWindow.location.href);

		// var match = pageLoader.matches(contentWindow.location.href, contentWindow.location);
		switch (pageLoader.matches(contentWindow.location.href, contentWindow.location)) {
			case MATCH_APP:
					gCommScope.gWinComm = gWinComm = new gCommScope.Comm.server.content(contentWindow);
				break;
			case MATCH_TWITTER:
					gCommScope.gWinComm = gWinComm = new gCommScope.Comm.server.content(contentWindow);

					// MainContentscript.js
					var principal = contentWindow.document.nodePrincipal; // contentWindow.location.origin (this is undefined for about: pages) // docShell.chromeEventHandler.contentPrincipal (chromeEventHandler no longer has contentPrincipal)
					console.log('contentWindow.document.nodePrincipal', contentWindow.document.nodePrincipal);
					// // console.error('principal:', principal);
					gSandbox = Cu.Sandbox(principal, {
						sandboxPrototype: contentWindow,
						wantXrays: true, // only set this to false if you need direct access to the page's javascript. true provides a safer, isolated context.
						sameZoneAs: contentWindow,
						wantComponents: false
					});
					Services.scriptloader.loadSubScript(core.addon.path.scripts + 'comm/Comm.js?' + core.addon.cache_key, gSandbox, 'UTF-8');
					// Services.scriptloader.loadSubScript(core.addon.path.scripts + '3rd/react-with-addons.js?' + core.addon.cache_key, gSandbox, 'UTF-8');
					// Services.scriptloader.loadSubScript(core.addon.path.scripts + '3rd/react-dom.js?' + core.addon.cache_key, gSandbox, 'UTF-8');
					// Services.scriptloader.loadSubScript(core.addon.path.scripts + '3rd/redux.js?' + core.addon.cache_key, gSandbox, 'UTF-8');
					// Services.scriptloader.loadSubScript(core.addon.path.scripts + '3rd/react-redux.js?' + core.addon.cache_key, gSandbox, 'UTF-8');
					// Services.scriptloader.loadSubScript(core.addon.path.scripts + '3rd/react-bootstrap.js?' + core.addon.cache_key, gSandbox, 'UTF-8');
					// Services.scriptloader.loadSubScript(core.addon.path.scripts + 'editor.js?' + core.addon.cache_key, gSandbox, 'UTF-8');
					Services.scriptloader.loadSubScript(core.addon.path.scripts + 'MainContentscript.js?' + core.addon.cache_key, gSandbox, 'UTF-8');
				break;
		}

	},
	load: function(aContentWindow) {
		var contentWindow = aContentWindow;
		console.log('MATCHED LOAD readyyy:', contentWindow.location.href);
	}, // triggered on page load if IGNORE_LOAD is false
	unload: function(aContentWindow) { // triggered on page unload if IGNORE_UNLOAD is false
		var url = aContentWindow.location.href;
		var ready_state = aContentWindow.document.readyState;
		console.warn('PAGE UNLOADING!!!!', 'url:', url, 'ready_state:', ready_state);
		if (gWinComm) {
			console.log('UNREGISTERING gWinComm AS IT WAS EXISTING');
			gWinComm.unregister();
			gCommScope.gWinComm = gWinComm = null;
		}
	},
	error: function(aContentWindow, aDocURI) {
		// triggered when page fails to load due to error
		console.warn('hostname page ready, but an error page loaded, so like offline or something, aHref:', aContentWindow.location.href, 'aDocURI:', aDocURI);
		if (aContentWindow.location.href.startsWith('about:tweeter') && Date.now() - gLastReloadDueToError > 100) {
			gLastReloadDueToError = Date.now();
			console.warn('it is about:tweeter, this connection to load about:tweeter was establishedtweeeeeeeeeeeeeeeeeeter page was setup. which happens on gBrowser.loadOneTab(about:tweeter). sotweeeeeeeeeeeeeeeeeeter, href:', aContentWindow.location.href);
			aContentWindow.location.href = aContentWindow.location.href;
		}
	},
	readyNonmatch: function(aContentWindow) {},
	loadNonmatch: function(aContentWindow) {},
	errorNonmatch: function(aContentWindow, aDocURI) {},
	created: function(aContentWindow) {
		// var win = aContentWindow;
		// var doc = win.document;
		// doc.documentElement.innerHTML.replace('%S', 'history');
	},
	// not yet supported
	// timeout: function(aContentWindow) {
	// 	// triggered on timeout
	// },
	// timeoutNonmatch: function(aContentWindow) {
	// 	// triggered on timeout
	// },
	// end - devuser editable
	// start - BOILERLATE - DO NOT EDIT
	register: function() {
		addEventListener('DOMContentLoaded', pageLoader.onPageReady, false);
		if (!pageLoader.IGNORE_CREATED) {
			addEventListener('DOMWindowCreated', pageLoader.onContentCreated, false);
		}
		if (!pageLoader.IGNORE_UNLOAD) {
			addEventListener('unload', pageLoader.onPageUnload, false); // if use `true` here it will crash, i think only one `addEventListener` with `true` can be in place
		}
		if (!pageLoader.IGNORE_LOAD) {
			addEventListener('load', pageLoader.onLoad, false);
		}
	},
	unregister: function() {
		removeEventListener('DOMContentLoaded', pageLoader.onPageReady, false);
		if (!pageLoader.IGNORE_UNLOAD) {
			removeEventListener('unload', pageLoader.onPageUnload, false);
		}
		if (!pageLoader.IGNORE_LOAD) {
			removeEventListener('load', pageLoader.onLoad, false);
		}
		if (!pageLoader.IGNORE_CREATED) {
			removeEventListener('DOMWindowCreated', pageLoader.onContentCreated, false);
		}
	},
	onContentCreated: function(e) {
		console.log('onContentCreated - e:', e);
		var contentWindow = e.target.defaultView;

		var ready_state = contentWindow.document.readyState;
		var url = contentWindow.location.href;
		var url_lower = url.toLowerCase();
		var webnav = contentWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
		var docuri = webnav.document.documentURI;

		console.log('onContentCreated ready_state:', ready_state, 'url:', url, 'docuri:', docuri);
		if (docuri.indexOf('about:neterror') === 0) {
			// created with error
		} else {
			// our page ready without error
			pageLoader.created(contentWindow);
		}

	},
	onPageReady: function(e) {
		// DO NOT EDIT
		// frames are skipped if IGNORE_FRAMES is true
		// console.error('onPageReady tripped!');

		var contentWindow = e.target.defaultView;
		console.log('page ready, contentWindow.location.href:', contentWindow.location.href);

		// i can skip frames, as DOMContentLoaded is triggered on frames too
		if (pageLoader.IGNORE_FRAMES && contentWindow.frameElement) { return }

		var href = contentWindow.location.href.toLowerCase();
		if (pageLoader.matches(href, contentWindow.location)) {
			// ok its our intended, lets make sure its not an error page
			var webNav = contentWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
			var docURI = webNav.document.documentURI;
			// console.info('docURI:', docURI);

			if (docURI.indexOf('about:neterror') === 0) {
				pageLoader.error(contentWindow, docURI);
			} else {
				// our page ready without error
				pageLoader.ready(contentWindow);
			}
		} else {
			if (!pageLoader.IGNORE_NONMATCH) {
				console.log('page ready, but its not match:', contentWindow.location.href);
				var webNav = contentWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
				var docURI = webNav.document.documentURI;
				// console.info('docURI:', docURI);

				if (docURI.indexOf('about:neterror') === 0) {
					pageLoader.errorNonmatch(contentWindow, docURI);
				} else {
					// our page ready without error

					pageLoader.readyNonmatch(contentWindow);
				}
			}
		}
	},
	onPageLoad: function(e) {
		// DO NOT EDIT
		var contentWindow = e.target.defaultView;
		pageLoader.load(contentWindow);
	},
	onPageLoadNonmatch: function(e) {
		// DO NOT EDIT
		var contentWindow = e.target.defaultView;
		contentWindow.removeEventListener('load', pageLoader.onPageLoadNonmatch, false);
		pageLoader.loadNonmatch(contentWindow);
	},
	onPageUnload: function(e) {
		if (e.target != gMM) {
			var contentWindow = e.target.defaultView;
			if (contentWindow) {
				console.error('target is not gMM it is:', e.target, 'so defaultView is:', contentWindow);
				if (pageLoader.IGNORE_FRAMES && contentWindow.frameElement) {
					return;
				} else {
					pageLoader.unload(contentWindow);
				}
			}
		} // else tab is closing
	}
	// end - BOILERLATE - DO NOT EDIT
};
// end - pageLoader

function aboutRedirectorizer(aURI) {
	// console.log('nativeshot redirectorizer, core.addon.path:', core.addon.path);
	var uripath_lower = aURI.path.toLowerCase();
	if (uripath_lower == 'tweeter') {
		return core.addon.path.pages + 'app_options.xhtml';
	} else if (uripath_lower.includes('?editor')) {
		return core.addon.path.pages + 'editor.html';
	} else {
		return 'data:text/plain,invalid tweeeeeeeeeeeeeeeeeeter page "' + uripath_lower + '"';
	}
}

function init() {
	gBsComm = new gCommScope.Comm.client.framescript(core.addon.id);
	gCommScope.gBsComm = gBsComm;

	console.error('INITING TAB');
	callInBootstrap('fetchCore', undefined, function(aArg, aComm) {
		console.log('got core in fs');
		({ core } = aArg);
		console.log('ok updated core to:', core);

		addEventListener('unload', shutdown, true);
		//
		pageLoader.register(); // pageLoader boilerpate
		// progressListener.register();
		//
		try {
			gAppAboutFactory = registerAbout('tweeter', 'tweeeeeeeeeeeeeeeeeeter options page', '{a7230750-762f-11e6-bdf4-0800200c9a66}', aboutRedirectorizer);
		} catch(ignore) {} // its non-e10s so it will throw saying already registered
		// console.log('gAppAboutFactory:', gAppAboutFactory);

		var webnav = content.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
		var docuri = webnav.document.documentURI;
		console.log('testing matches', content.window.location.href, 'docuri:', docuri);
		var href_lower = content.window.location.href.toLowerCase();
		switch (pageLoader.matches(href_lower, content.window.location)) {
			case MATCH_APP:
					// for about pages, need to reload it, as it it loaded before i registered it
					console.error('MATCHING, RELOADING NATIVESHOT PAGE');
					content.window.location.reload(); //href = content.window.location.href.replace(/https\:\/\/screencastify\/?/i, 'about:screencastify'); // cannot use .reload() as the webNav.document.documentURI is now https://screencastify/
				break;
			case MATCH_TWITTER:
					// for non-about pages, i dont reload, i just initiate the ready of pageLoader
					if (content.document.readyState == 'interactive' || content.document.readyState == 'complete') {
						pageLoader.onPageReady({target:content.document}); // IGNORE_LOAD is true, so no need to worry about triggering load
					}
				break;
		}
	});

	// policy =
	// {
	//   classDescription: "Test content policy",
	//   classID: Components.ID("{12345678-1234-1234-1234-123456789abc}"),
	//   contractID: "@adblockplus.org/test-policy;1",
	//   xpcom_categories: ["content-policy"],
	//
	//   init: function()
	//   {
	//     let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
	//     registrar.registerFactory(this.classID, this.classDescription, this.contractID, this);
	//
	//     let catMan = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
	//     for each (let category in this.xpcom_categories)
	//       catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);
	//
	//     this.uninit = function()
	//     {
	//       for each (let category in this.xpcom_categories)
	//         catMan.deleteCategoryEntry(category, this.contractID, false);
	//
	//       // This needs to run asynchronously, see bug 753687
	//       Services.tm.currentThread.dispatch(function()
	//       {
	//         registrar.unregisterFactory(this.classID, this);
	//       }.bind(this), Ci.nsIEventTarget.DISPATCH_NORMAL);
	//     };
	//   },
	//
	//   // nsIContentPolicy interface implementation
	//   shouldLoad: function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra)
	//   {
	//     console.log("shouldLoad: " + contentType + " " +
	//                           (contentLocation ? contentLocation.spec : "null") + " " +
	//                           (requestOrigin ? requestOrigin.spec : "null") + " " +
	//                           node + " " +
	//                           mimeTypeGuess + "\n");
	//     return Ci.nsIContentPolicy.ACCEPT;
	//   },
	//
	//   shouldProcess: function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra)
	//   {
	//     console.log("shouldProcess: " + contentType + " " +
	//                             (contentLocation ? contentLocation.spec : "null") + " " +
	//                             (requestOrigin ? requestOrigin.spec : "null") + " " +
	//                             node + " " +
	//                             mimeTypeGuess + "\n");
	//     return Ci.nsIContentPolicy.ACCEPT;
	//   },
	//
	//   // nsIFactory interface implementation
	//   createInstance: function(outer, iid)
	//   {
	//     if (outer)
	//       throw Cr.NS_ERROR_NO_AGGREGATION;
	//     return this.QueryInterface(iid);
	//   },
	//
	//   // nsISupports interface implementation
	//   QueryInterface: XPCOMUtils.generateQI([Ci.nsIContentPolicy, Ci.nsIFactory])
	// };
	//
	// try {
	// 	policy.init();
	// 	console.error('SUCCESFULLY REGISTERED POLICY');
	// } catch(err) { console.error('policy failed to register:', err) }
}

// var policy;

function shutdown(e) {
	if (e.target == gMM) {
		// ok this content frame message manager is shutting down
		gCommScope.uninit();
	}
}

gCommScope.uninit = function() { // link4757484773732
	// an issue with this unload is that framescripts are left over, i want to destory them eventually

	console.error('DOING UNINIT');
	pageLoader.unregister(); // pageLoader boilerpate
	// progressListener.unregister();

	if (gWinComm) { // this only should happen if tab is not closing
		callInContent('uninit');
	}

	if (gSandbox) {
		Cu.nukeSandbox(gSandbox);
		console.error('ok nuked sandbox');
		gSandbox = null;
	}

	gCommScope.Comm.server.unregAll('content');
	gCommScope.Comm.client.unregAll('framescript');

	if (gAppAboutFactory) {
		gAppAboutFactory.unregister();
	}

	// if (policy) policy.uninit();

	removeEventListener('unload', shutdown, true);
}

gCommScope.drawWindow = function(aArg={}) {
	var { x=0, y=0, width=0, height=0, attachimg=false } = aArg;
	var doc = content.document;
	var can = doc.createElementNS(NS_HTML, 'canvas');
	var ctx = can.getContext('2d');

	if (!width || !height) {
		height = Math.max( doc.body.scrollHeight, doc.body.offsetHeight, doc.documentElement.clientHeight, doc.documentElement.scrollHeight, doc.documentElement.offsetHeight );
		width = Math.max( doc.body.scrollWidth, doc.body.offsetWidth, doc.documentElement.clientWidth, doc.documentElement.scrollWidth, doc.documentElement.offsetWidth );
	}
	can.width = width;
	can.height = height;
	ctx.drawWindow(content, x, y, width, height, 'red', 0);
	var dataurl = can.toDataURL('image/png', '');

	if (attachimg) {
		callInBootstrap('attachImgInTab', dataurl);
	} else {
		callInBootstrap('copyImg', dataurl);
		console.error('ok copied');
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
// start - about module
function registerAbout(aWhat, aDesc, aUuid, aRedirectorizer) {
	// console.log('in registerAbout');

	function aboutPage() {};
	aboutPage.prototype = Object.freeze({
		classDescription: aDesc,
		contractID: '@mozilla.org/network/protocol/about;1?what=' + aWhat,
		classID: Components.ID(aUuid),
		QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

		getURIFlags: function(aURI) {
			return Ci.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT | Ci.nsIAboutModule.ALLOW_SCRIPT | Ci.nsIAboutModule.URI_MUST_LOAD_IN_CHILD | Ci.nsIAboutModule.HIDE_FROM_ABOUTABOUT;
		},

		newChannel: function(aURI, aSecurity_or_aLoadInfo) {
			var redirUrl = aRedirectorizer(aURI);
			// console.log('redirUrl:', redirUrl, aWhat, aDesc, aUuid);

			var channel;
			if (Services.vc.compare(Services.appinfo.version, '47.*') > 0) {
				var redirURI = Services.io.newURI(redirUrl, 'UTF-8', Services.io.newURI('about:' + aWhat, null, null));
				channel = Services.io.newChannelFromURIWithLoadInfo(redirURI, aSecurity_or_aLoadInfo);
			} else {
				console.log('doing old way');
				channel = Services.io.newChannel(redirUrl, null, null);
			}
			channel.originalURI = aURI;

			return channel;
		}
	});

	// console.log('about to return registerAbout');
	// register it
	return new AboutFactory(aboutPage);
}

function AboutFactory(component) {
	this.createInstance = function(outer, iid) {
		if (outer) {
			throw Cr.NS_ERROR_NO_AGGREGATION;
		}
		return new component();
	};
	this.register = function() {
		Cm.registerFactory(component.prototype.classID, component.prototype.classDescription, component.prototype.contractID, this);
	};
	this.unregister = function() {
		Cm.unregisterFactory(component.prototype.classID, this);
	}
	Object.freeze(this);
	this.register();
	// console.log('registered about');
}
// end - about module
// end - common helper functions

// startup
init();
