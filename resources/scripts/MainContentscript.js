var gSandbox = this; // Sandbox, init: init(), uninit: uninit(), unload: unload(), csWinMsgListener: csWinMsgListener(), initPrefs: initPrefs(), window: Window → smart-zoom, document: HTMLDocument → smart-zoom, location: Location → smart-zoom, 63 more… }
var core;
var gFsComm;
var { callInFramescript, callInMainworker, callInBootstrap } = CommHelper.contentinframescript;

function init() {
	alert('initing');
	callInBootstrap('fetchCore', undefined, function(aArg, aComm) {
		core = aArg;


	});
}

gFsComm = new Comm.client.content(init);

function uninit() {
	alert('uniniting');
}

function unload() {

}

function stopEvent(e) {
	e.stopPropagation();
	e.preventDefault();
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
