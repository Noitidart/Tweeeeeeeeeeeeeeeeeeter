// FRAMESCRIPT
const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

// Globals
var core = {
	addon: {
		id: 'Tweeeeeeeeeeeeeeeeeeter@jetpack',
		path: {
			name: 'tweeeeeeeeeeeeeeeeeeter',
			scripts: 'chrome://tweeeeeeeeeeeeeeeeeeter/content/resources/scripts/'
		},
		cache_key: Math.random() // set to version on release
	}
};
var l10n;
const NS_HTML = 'http://www.w3.org/1999/xhtml';
const TWITTER_HOSTNAME = 'twitter.com';
var SANDBOXES = {};
var last_sandbox_id = -1;

// start - addon functionalities
function doOnReady(aContentWindow) {

	if (aContentWindow.frameElement) {
		// console.warn('frame element DOMContentLoaded, so dont respond yet:', aContentWindow.location.href);
		return;
	} else {
		// parent window loaded (not frame)
		if (aContentWindow.location.hostname == TWITTER_HOSTNAME) {
			// ok twitter page ready, lets make sure its not an error page
			// check if got error loading page:
			var webnav = aContentWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
			var docuri = webnav.document.documentURI;
			// console.info('docuri:', docuri);
			if (docuri.indexOf('about:') == 0) {
				// twitter didnt really load, it was an error page
				console.log('twitter hostname page ready, but an error page loaded, so like offline or something:', aContentWindow.location, 'docuri:', docuri);
				// unregReason = 'error-loading';
				return;
			} else {
				// twitter actually loaded
				// twitterReady = true;
				console.error('ok twitter page ready, lets ensure page loaded finished');
				ensureLoaded(aContentWindow);
			}
		} else {
			// console.log('page ready, but its not twitter so do nothing:', uneval(aContentWindow.location));
			return;
		}
	}
}

function onFullLoad(aSbId, aEvent) {
	var aContentWindow = aEvent.target.defaultView;
	if (aContentWindow == SANDBOXES[aSbId].contentWindowWeak.get()) {
		console.error('OK aContentWindow::LOAD triggered and its a match');
		SANDBOXES[aSbId].unloaders.unFullLoader();
		injectContentScript(aSbId, aContentWindow);
	} else {
		console.error('aContentWindow::LOAD triggered but the cContentWindow does not equal SANDBOX[aSbId].contentWindow');
		return;
	}
}

function ensureLoaded(aContentWindow) {
	// only attached to twitter pages once idented as twitter
	// need to ensure loaded because jquery is needed by the content script
	
	console.log('in ensureLoaded');
	
	last_sandbox_id++;
	var cSbId = last_sandbox_id;
	
	SANDBOXES[cSbId] = {
		unloaders: {}
	};
	SANDBOXES[cSbId].contentWindowWeak = Cu.getWeakReference(aContentWindow);
	
	var aContentDocument = aContentWindow.document;
	
	console.log('in ensureLoaded STEP 2');
	
	if (aContentDocument.readyState == 'complete') {
		console.log('ok twitter was ALREADY fully loaded, so lets inject content script');
		injectContentScript(cSbId, aContentWindow);
	} else {
		console.log('twitter not yet FULLY LOADEd so attaching listener to listen for full load');
		var fullLoader = onFullLoad.bind(null, cSbId);
		SANDBOXES[cSbId].unloaders.unFullLoader = function() {
			delete SANDBOXES[cSbId].unloaders.unFullLoader;
			aContentWindow.removeEventListener('load', fullLoader, true);
		};
		aContentWindow.addEventListener('load', fullLoader, true); // need to wait for load, as need to wait for jquery $ to come in // need to use true otherwise load doesnt trigger
	}
}

function injectContentScript(aSbId, aContentWindow) {
	
	console.log('executing injectContentScript');
	
	var aContentDocument = aContentWindow.document;
	
	var options = {
		sandboxPrototype: aContentWindow,
		wantXrays: false
	};
	var principal = docShell.chromeEventHandler.contentPrincipal; // aContentWindow.location.origin;

	
	SANDBOXES[aSbId].sb = Cu.Sandbox(principal, options);
	SANDBOXES[aSbId].unloaders.unSandbox = function() {

		delete SANDBOXES[aSbId].unloaders.unSandbox;
		
		console.log('nuked sandbox with id:', aSbId);
		
		Cu.nukeSandbox(SANDBOXES[aSbId].sb);
		
		
		for (var p in SANDBOXES[aSbId].unloaders) {
			SANDBOXES[aSbId].unloaders[p]();
		}
		
		delete SANDBOXES[aSbId];
	};
	
	var onBeforeUnload = function() {
		console.log('triggered onBeforeUnload for id:', aSbId);
		SANDBOXES[aSbId].unloaders.unOnBeforeUnload(); // i dont have to do this, as unSandbox runs all the unloaders, but i just do it for consistency so if i revisit this code in future i dont get confused
		SANDBOXES[aSbId].unloaders.unSandbox();
	};
	
	SANDBOXES[aSbId].unloaders.unOnBeforeUnload = function() {
		delete SANDBOXES[cSbId].unloaders.unOnBeforeUnload;
		aContentWindow.removeEventListener('beforeunload', onBeforeUnload, false);
	};
	
	aContentWindow.addEventListener('beforeunload', onBeforeUnload, false);
	
	console.log('will now load jquery crap');
	Services.scriptloader.loadSubScript(core.addon.path.scripts + 'csTwitterInlay.js?' + core.addon.cache_key, SANDBOXES[aSbId].sb, 'UTF-8');
}
// end - addon functionalities

// start - server/framescript comm layer
// sendAsyncMessageWithCallback - rev3
var bootstrapCallbacks = { // can use whatever, but by default it uses this
	// put functions you want called by bootstrap/server here
	destroySelf: function() {
		removeEventListener('unload', fsUnloaded, false);
		removeEventListener('DOMContentLoaded', onPageReady, false);
		
		for (var aSbId in SANDBOXES) {
			if (SANDBOXES[aSbId].unloaders.unSandbox) {
				SANDBOXES[aSbId].unloaders.unSandbox(); // as this will run all the unloaders
			} else {
				for (var aUnloaderName in SANDBOXES[aSbId].unloaders) {
					SANDBOXES[aSbId].unloaders[aUnloaderName]();
				}
			}
		}
		
		contentMMFromContentWindow_Method2(content).removeMessageListener(core.addon.id, bootstrapMsgListener);
	}
};
const SAM_CB_PREFIX = '_sam_gen_cb_';
var sam_last_cb_id = -1;
function sendAsyncMessageWithCallback(aMessageManager, aGroupId, aMessageArr, aCallbackScope, aCallback) {
	sam_last_cb_id++;
	var thisCallbackId = SAM_CB_PREFIX + sam_last_cb_id;
	aCallbackScope = aCallbackScope ? aCallbackScope : bootstrap; // :todo: figure out how to get global scope here, as bootstrap is undefined
	aCallbackScope[thisCallbackId] = function(aMessageArr) {
		delete aCallbackScope[thisCallbackId];
		aCallback.apply(null, aMessageArr);
	}
	aMessageArr.push(thisCallbackId);
	aMessageManager.sendAsyncMessage(aGroupId, aMessageArr);
}
var bootstrapMsgListener = {
	funcScope: bootstrapCallbacks,
	receiveMessage: function(aMsgEvent) {
		var aMsgEventData = aMsgEvent.data;
		console.log('framescript getting aMsgEvent, unevaled:', uneval(aMsgEventData));
		// aMsgEvent.data should be an array, with first item being the unfction name in this.funcScope
		
		var callbackPendingId;
		if (typeof aMsgEventData[aMsgEventData.length-1] == 'string' && aMsgEventData[aMsgEventData.length-1].indexOf(SAM_CB_PREFIX) == 0) {
			callbackPendingId = aMsgEventData.pop();
		}
		
		var funcName = aMsgEventData.shift();
		if (funcName in this.funcScope) {
			var rez_fs_call = this.funcScope[funcName].apply(null, aMsgEventData);
			
			if (callbackPendingId) {
				// rez_fs_call must be an array or promise that resolves with an array
				if (rez_fs_call.constructor.name == 'Promise') {
					rez_fs_call.then(
						function(aVal) {
							// aVal must be an array
							contentMMFromContentWindow_Method2(content).sendAsyncMessage(core.addon.id, [callbackPendingId, aVal]);
						},
						function(aReason) {
							console.error('aReject:', aReason);
							contentMMFromContentWindow_Method2(content).sendAsyncMessage(core.addon.id, [callbackPendingId, ['promise_rejected', aReason]]);
						}
					).catch(
						function(aCatch) {
							console.error('aCatch:', aCatch);
							contentMMFromContentWindow_Method2(content).sendAsyncMessage(core.addon.id, [callbackPendingId, ['promise_rejected', aCatch]]);
						}
					);
				} else {
					// assume array
					contentMMFromContentWindow_Method2(content).sendAsyncMessage(core.addon.id, [callbackPendingId, rez_fs_call]);
				}
			}
		}
		else { console.warn('funcName', funcName, 'not in scope of this.funcScope') } // else is intentionally on same line with console. so on finde replace all console. lines on release it will take this out
		
	}
};
contentMMFromContentWindow_Method2(content).addMessageListener(core.addon.id, bootstrapMsgListener);
// end - server/framescript comm layer
// start - common helper functions
var gCFMM;
function contentMMFromContentWindow_Method2(aContentWindow) {
	if (!gCFMM) {
		gCFMM = aContentWindow.QueryInterface(Ci.nsIInterfaceRequestor)
							  .getInterface(Ci.nsIDocShell)
							  .QueryInterface(Ci.nsIInterfaceRequestor)
							  .getInterface(Ci.nsIContentFrameMessageManager);
	}
	return gCFMM;

}
function Deferred() {
	try {
		/* A method to resolve the associated Promise with the value passed.
		 * If the promise is already settled it does nothing.
		 *
		 * @param {anything} value : This value is used to resolve the promise
		 * If the value is a Promise then the associated promise assumes the state
		 * of Promise passed as value.
		 */
		this.resolve = null;

		/* A method to reject the assocaited Promise with the value passed.
		 * If the promise is already settled it does nothing.
		 *
		 * @param {anything} reason: The reason for the rejection of the Promise.
		 * Generally its an Error object. If however a Promise is passed, then the Promise
		 * itself will be the reason for rejection no matter the state of the Promise.
		 */
		this.reject = null;

		/* A newly created Pomise object.
		 * Initially in pending state.
		 */
		this.promise = new Promise(function(resolve, reject) {
			this.resolve = resolve;
			this.reject = reject;
		}.bind(this));
		Object.freeze(this);
	} catch (ex) {
		console.log('Promise not available!', ex);
		throw new Error('Promise not available!');
	}
}
// end - common helper functions

// start - load unload stuff
function fsUnloaded() {
	// framescript on unload
	console.log('fsTwitterInlay.js framworker unloading');
	contentMMFromContentWindow_Method2(content).removeMessageListener(core.addon.id, bootstrapMsgListener); // framescript comm

}
function onPageReady(aEvent) {
	var aContentWindow = aEvent.target.defaultView;
	// console.log('fsTwitterInlay.js page ready, content.location:', content.location.href, 'aContentWindow.location:', aContentWindow.location.href);
	doOnReady(aContentWindow);
}

sendAsyncMessageWithCallback(contentMMFromContentWindow_Method2(content), core.addon.id, ['requestInit'], bootstrapMsgListener.funcScope, function(aData) {
	// core = aData.aCore;
	l10n = aData.aL10n
});
addEventListener('unload', fsUnloaded, false);
addEventListener('DOMContentLoaded', onPageReady, false);
if (content.document.readyState == 'complete') {
	var fakeEvent = {
		target: {
			defaultView: content
		}
	}
	onPageReady(fakeEvent);
}
console.log('added DOMContentLoaded event, current location is:', content.location.href);
// end - load unload stuff