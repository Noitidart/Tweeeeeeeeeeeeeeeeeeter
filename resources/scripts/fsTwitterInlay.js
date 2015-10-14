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
var l10n = {};
const NS_HTML = 'http://www.w3.org/1999/xhtml';
const TWITTER_HOSTNAME = 'twitter.com';
var SANDBOXES = {};
var last_sandbox_id = -1;

// start - addon functionalities
function domInsertOnReady(aContentWindow) {
	var aContentDocument = aContentWindow.document;
	
	var tweetForms = aContentDocument.querySelectorAll('form.tweet-form');
	console.error('tweetForms:', tweetForms);
	
	// var tweetToolbarColl = aContentDocument.querySelectorAll('form.tweet-form .toolbar');
	// console.error('tweetToolbarColl:', tweetToolbarColl);

	var fontFamily = 'arial';
	var fontWeight = 'bold';
	var fontSize = '24px';
	var maxWidth = '600px';
	var backgroundColor = 'white';
	
	aContentDocument.documentElement.appendChild(jsonToDOM(
		['style', {class:'tweeeeeeeeeeeeeeeeeeter'},
			'.tweeeeeeeeeeeeeeeeeeter-TweetBox .Icon::before { color:transparent; background:transparent url("chrome://tweeeeeeeeeeeeeeeeeeter-content-accessible/content/baloons16-dar.png") no-repeat scroll left center}'
		]
	, aContentDocument, {}));
	
	for (var i=0; i<tweetForms.length; i++) {
		// var tweetBtn = teetToolbarColl[i].querySelector('.tweet-button');
		var tweetEditor = tweetForms[i].querySelector('.rich-editor');
		var tweetBoxExtras = tweetForms[i].querySelector('.tweet-box-extras');
		if (!tweetBoxExtras || !tweetEditor) {
			console.warn('an element was not found in tweet from number:', i, 'tweetBoxExtras:', tweetBoxExtras, 'tweetEditor:', tweetEditor)
			continue;
		}
		var myEls = {};
		var tweeeeeeeeeeeeeeeeeeterBtn = jsonToDOM([
			'span', {class:'tweeeeeeeeeeeeeeeeeeter-TweetBox tweeeeeeeeeeeeeeeeeeter'},
				[
					'div', {class:'geo-picker'},
						[
							'button', {key:'rawr', class:'btn icon-btn js-tooltip', 'data-original-title':l10n['btn-tooltip'], type:'button', tabindex:'-1', 'aria-hidden':'true'},
								[
									'span', {class:'tweet-camera Icon Icon--camera'}
								],
								[
									'span', {class:'text add-photo-label u-hideMediumViewport'},
										l10n['btn-label']
								]
						]
				]
		], aContentDocument, myEls);
		
		console.log('myEls:', myEls);
		myEls.rawr.addEventListener('click', function(aTweetEditor) {
			var aMsg = aContentWindow.prompt(l10n['prompt-body'], l10n['prompt-prefill']);
			if (aMsg) {
				
				var myIframe = aContentDocument.createElementNS(NS_HTML, 'iframe');
					myIframe.setAttribute('style', 'position:absolute; top:0; left:0; z-index:999999;visibility:hidden; min-width:' + maxWidth + ';');
					
					myIframe.addEventListener('load', function() {
						console.error('iframe loaded!');

						
						var myDummy = myIframe.contentDocument.createElementNS(NS_HTML, 'div');
						/*
						var myDummy = jsonToDOM([
							'svg', {xmlns:'http://www.w3.org/2000/svg'},
								[
									'foreignObject', {width:'100%', height:'100%'}.
										[
											'div', {xmlns:'http://www.w3.org/1999/xhtml', style:}
										]
								]
						], myIframe.contentDocument, {});
						*/
						myDummy.setAttribute('style', 'display:inline; font-family:' + fontFamily + '; font-weight:' + fontWeight + '; font-size:' + fontSize+ '; max-width:' + maxWidth + '; background-color:' + backgroundColor + '; margin:0; padding:0;');
						myDummy.textContent = aMsg;
						
						myIframe.contentDocument.documentElement.appendChild(myDummy);
						
						console.log('myDummy.boxObject:', myDummy.boxObject);
						
						var blockWidth = myDummy.offsetWidth + 1;
						var blockHeight = myDummy.offsetHeight + 1;
						console.error('blockWidth:', blockWidth);
						console.error('blockHeight:', blockHeight);
						
						// myIframe.contentDocument.documentElement.removeChild(myDummy);
						
						var myCan = myIframe.contentDocument.createElementNS(NS_HTML, 'canvas');
						myCan.width = blockWidth;
						myCan.height = blockHeight;
						var myCtx = myCan.getContext('2d');
						
						
						var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + blockWidth + '" height="' + blockHeight + '" style="margin:0;padding:0;">' +
								   '<foreignObject width="100%" height="100%">' +
								   '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:' + fontFamily + '; font-weight:' + fontWeight + '; font-size:' + fontSize+ '; max-width:' + maxWidth + '; background-color:' + backgroundColor + '; margin:0; padding:0;">' +
									 aMsg.replace(/'/g, '\'')  +
								   '</div>' +
								   '</foreignObject>' +
								   '</svg>';

						var DOMURL = aContentWindow.URL;

						var img = new aContentWindow.Image();
						var svg = new aContentWindow.Blob([data], {type: 'image/svg+xml;charset=utf-8'});
						var url = DOMURL.createObjectURL(svg);

						var attachImg = myIframe.contentDocument.createElementNS(NS_HTML, 'img');
						
						img.onload = function () {
							myCtx.drawImage(img, 0, 0);
							DOMURL.revokeObjectURL(url);
							attachImg.setAttribute('src', myCan.toDataURL('image/png', ''));
							aTweetEditor.appendChild(attachImg);
							// attachImg.setAttribute('src', url);
							console.error('attachImg.src:', attachImg.src);
							myIframe.parentNode.removeChild(myIframe);
						}
						
						img.src = url;
				}, true);
				
				aContentDocument.documentElement.appendChild(myIframe);
			}
			
			aTweetEditor.focus();
		}.bind(myEls.rawr, tweetEditor), false);
		
		tweetBoxExtras.insertBefore(tweeeeeeeeeeeeeeeeeeterBtn, tweetBoxExtras.firstChild);
	}
}

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
				domInsertOnReady(aContentWindow);
				ensureLoaded(aContentWindow); // :note: commented out as not needing content script right now
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
		delete SANDBOXES[aSbId].unloaders.unOnBeforeUnload;
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
		console.log('content.location.hostname:', content.location.hostname);
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
		
		console.log('content.location.hostname:', content.location.hostname);
		if (content.location.hostname == TWITTER_HOSTNAME) {
			console.log('found matching hostname');
			var tweeeeeeeeeeeeeeeeeeter_stuff = content.document.querySelectorAll('.tweeeeeeeeeeeeeeeeeeter');
			console.info('tweeeeeeeeeeeeeeeeeeter_stuff:', tweeeeeeeeeeeeeeeeeeter_stuff);
			for (var i=0; i<tweeeeeeeeeeeeeeeeeeter_stuff.length; i++) {
				tweeeeeeeeeeeeeeeeeeter_stuff[i].parentNode.removeChild(tweeeeeeeeeeeeeeeeeeter_stuff[i]);
				console.log('iter rem:', i);
			}
		}
		console.error('okkkkkkkkkkkkkkkkkkkkkkkkkkkkkk iterated removed');
	}
};
const SAM_CB_PREFIX = '_sam_gen_cb_';
var sam_last_cb_id = -1;
function sendAsyncMessageWithCallback(aMessageManager, aGroupId, aMessageArr, aCallbackScope, aCallback) {
	sam_last_cb_id++;
	var thisCallbackId = SAM_CB_PREFIX + sam_last_cb_id;
	aCallbackScope = aCallbackScope ? aCallbackScope : bootstrap; // :todo: figure out how to get global scope here, as bootstrap is undefined
	console.error('adding to funcScope:', thisCallbackId, content.location.href);
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
		console.error('framescript getting aMsgEvent, unevaled:', aMsgEventData);
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
		else { console.warn('funcName', funcName, 'not in scope of this.funcScope', this.funcScope, content.location.href) } // else is intentionally on same line with console. so on finde replace all console. lines on release it will take this out
		
	}
};
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
function jsonToDOM(json, doc, nodes) {

    var namespaces = {
        html: 'http://www.w3.org/1999/xhtml',
        xul: 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
    };
    var defaultNamespace = namespaces.html;

    function namespace(name) {
        var m = /^(?:(.*):)?(.*)$/.exec(name);        
        return [namespaces[m[1]], m[2]];
    }

    function tag(name, attr) {
        if (Array.isArray(name)) {
            var frag = doc.createDocumentFragment();
            Array.forEach(arguments, function (arg) {
                if (!Array.isArray(arg[0]))
                    frag.appendChild(tag.apply(null, arg));
                else
                    arg.forEach(function (arg) {
                        frag.appendChild(tag.apply(null, arg));
                    });
            });
            return frag;
        }

        var args = Array.slice(arguments, 2);
        var vals = namespace(name);
        var elem = doc.createElementNS(vals[0] || defaultNamespace, vals[1]);

        for (var key in attr) {
            var val = attr[key];
            if (nodes && key == 'key')
                nodes[val] = elem;

            vals = namespace(key);
            if (typeof val == 'function')
                elem.addEventListener(key.replace(/^on/, ''), val, false);
            else
                elem.setAttributeNS(vals[0] || '', vals[1], val);
        }
        args.forEach(function(e) {
            try {
                elem.appendChild(
                                    Object.prototype.toString.call(e) == '[object Array]'
                                    ?
                                        tag.apply(null, e)
                                    :
                                        e instanceof doc.defaultView.Node
                                        ?
                                            e
                                        :
                                            doc.createTextNode(e)
                                );
            } catch (ex) {
                elem.appendChild(doc.createTextNode(ex));
            }
        });
        return elem;
    }
    return tag.apply(null, json);
}
// end - common helper functions

// start - load unload stuff
function fsUnloaded() {
	// framescript on unload
	console.log('fsTwitterInlay.js framworker unloading');
	bootstrapCallbacks.destroySelf();

}
function onPageReady(aEvent) {
	var aContentWindow = aEvent.target.defaultView;
	// console.log('fsTwitterInlay.js page ready, content.location:', content.location.href, 'aContentWindow.location:', aContentWindow.location.href);
	doOnReady(aContentWindow);
}

function init() {
	console.error('in init');
		contentMMFromContentWindow_Method2(content).addMessageListener(core.addon.id, bootstrapMsgListener);
		
		sendAsyncMessageWithCallback(contentMMFromContentWindow_Method2(content), core.addon.id, ['requestInit'], bootstrapMsgListener.funcScope, function(aData) {
			// core = aData.aCore;
			console.error('back in callback', aData, content.location.href);
			l10n = aData.aL10n
			console.error('set l10n to:', aData.aL10n, content.location.href)
			
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
		});
}

init();
// end - load unload stuff