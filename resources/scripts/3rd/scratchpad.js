/* jshint esversion:6 */
// http://unicode.org/emoji/charts/full-emoji-list.html
function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

var table = document.querySelector('table');
var tr = [...document.querySelectorAll('tr')];


var trh = tr.splice(0, 1)[0];
var keys = [...trh.querySelectorAll('th')].map(el => el.textContent.trim());

var emotes = [];

tr.forEach((el, i) => {
	let anyimg = el.querySelector('img');
	if (!anyimg) return;
	let td = [...el.querySelectorAll('td')];
	let entry = {};
	let vals = td.forEach((el, i) => {
		let key = keys[i];
		let val;
		switch (key) {
			case 'Twtr.':
				val = el.querySelector('img').getAttribute('src');
				break;
			case 'Name':
				val = toTitleCase(el.textContent.trim());
				if (val.includes('≊')) {
					val = val.substr(0, val.indexOf('≊')).trim();
				}
				break;
			case 'Keywords':
				val = el.textContent.trim().split('|').map(el => el.trim());
				break;
			default:
				return;
		}
		entry[key] = val;
	});
	emotes.push(entry);
});
var blob = new Blob(['var gEmote = ' + JSON.stringify(emotes) + ';'], {
	mimeType: 'text/pliain'
});
alert(URL.createObjectURL(blob));