var gSandbox = this; // Sandbox, init: init(), uninit: uninit(), unload: unload(), csWinMsgListener: csWinMsgListener(), initPrefs: initPrefs(), window: Window → smart-zoom, document: HTMLDocument → smart-zoom, location: Location → smart-zoom, 63 more… }
var core;
var gFsComm;
var { callInFramescript, callInMainworker, callInBootstrap } = CommHelper.contentinframescript;

function init() {
	// alert('initing');
	callInBootstrap('fetchCore', undefined, function(aArg, aComm) {
		core = aArg;
		alert('got core:', uneval(core));
		domInsertOnReady(window);
	});
}

gFsComm = new Comm.client.content(init);

function uninit() {
	// alert('uniniting');
	var mystuff = content.document.querySelectorAll('.tweeeeeeeeeeeeeeeeeeter');
	console.info('mystuff:', mystuff);
	for (var el of mystuff) {
		el.parentNode.removeChild(el);
	}
}

function unload() {

}

function stopEvent(e) {
	e.stopPropagation();
	e.preventDefault();
}

function domInsertOnReady() {

	var tweetForms = document.querySelectorAll('form.tweet-form');
	console.error('tweetForms:', tweetForms);

	// var tweetToolbarColl = aContentDocument.querySelectorAll('form.tweet-form .toolbar');
	// console.error('tweetToolbarColl:', tweetToolbarColl);

	var fontFamily = 'arial';
	var fontWeight = 'bold';
	var fontSize = '24px';
	var maxWidth = '600px';
	var backgroundColor = 'white';

	document.documentElement.appendChild(jsonToDOM(
		['style', {class:'tweeeeeeeeeeeeeeeeeeter'},
			`
				.tweeeeeeeeeeeeeeeeeeter-TweetBox .Icon::before {
				    color: transparent;
				    background: transparent url("chrome://tweeeeeeeeeeeeeeeeeeter/content/resources/images/baloons16-dar.png") no-repeat scroll left center
				}
			`
		]
	, document, {}));

	var extraitem = document.querySelector('#global-tweet-dialog-dialog .TweetBoxExtras-item:not(.TweetBox-mediaPicker)');

	console.log('extraitem:', extraitem);
	var saymore = extraitem.cloneNode(true);
	saymore.classList.add('tweeeeeeeeeeeeeeeeeeter');
	console.log('saymore:', saymore);

	extraitem.parentNode.insertBefore(saymore, extraitem.parentNode.firstChild);
	alert('ok inserted');

	return;
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

init();


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
