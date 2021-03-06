const userConfig = {{{userConfig}}};
const ajaxPromise = {};

const noBodyMethod = {
	get: true,
	head: true
};
const typeValidator = {
	any: () => true,
	string: x => typeof x === 'string',
	number: x => typeof x === 'number',
	boolean: x => typeof x === 'boolean',
	blob: x => Object.prototype.toString.call(x) === '[object Blob]',
	array: Array.isArray,
	object: x => typeof x === 'object' && x !== null,
	null: x => x === null
};

/**
 * @param {Array|Object} needs
 * @param {Object} target
 */
const checkParam = ({needs, target}) => {
	let condMap = {};

	if (Array.isArray(needs)) {
		needs.forEach(key => condMap[key] = 'Any');
	} else {
		condMap = needs;
	}

	for (let key in condMap) {
		let isOptional = false,
			value = target[key];

		if (key.charAt(key.length - 1) === '?') {
			isOptional = true;
			value = target[key.slice(0, -1)];
		}

		if (value === undefined) {
			if (isOptional) continue;
			return '{{errorMissParam}}';
		}

		const keyCondList = Array.isArray(condMap[key]) ? condMap[key] : [ condMap[key] ];

		if (keyCondList.filter(cond => typeValidator[cond.toLowerCase()](value)).length === 0) return '{{errorTypeCheck}}';
	}

	return true;
};

/**
 * @param {Object} config.need
 * @param {Object} config.target
 */
const isSuccess = config => {
	for (var key in config.need) {
		if (!config.need.hasOwnProperty(key)) continue;
		if (config.target[key] !== config.need[key]) {
			return false;
		}
	}

	return true;
};

const getParams = (target, params) => {
	if (params.length === 0) return target;

	var
		result = {},
		len = params.length;

	while (len--) {
		if (target[params[len]] === undefined && !userConfig.ignoreResponse) {
			return false;
		}
		result[params[len]] = target[params[len]];
	}

	return result;
};

const makeRequestData = ({method, dataType, data, headers}) => {
	if (noBodyMethod[method]) return;

	let body;

	switch (dataType) {
		case 'json':
			headers['Content-Type'] = 'application/json;charset=UTF-8';
			return JSON.stringify(data);
		case 'urlsearchparams':
			// For browser with polyfill to implement URLSearchParams which won't add this header automatically
			headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

			body = new URLSearchParams();
			for (const key in data) {
				if (!data.hasOwnProperty(key)) continue;
				body.append(key, data[key]);
			}

			return body.toString();
		case 'formdata':
			body = new FormData();
			for (const key in data) {
				if (!data.hasOwnProperty(key)) continue;
				body.append(key, data[key]);
			}

			return body;
	}

	return data;
};

/**
 * @param {String} config.name
 * @param {Object} config.url
 * @param {Object} config.data
 * @param {String} config.method
 * @param {String} config.cache
 * @param {String} config.mode
 * @param {Object} config.context
 * @param {Number} config.timeout
 * @param {Function} config.resolve
 * @param {Function} config.reject
 * @param {Array} config.successParam
 * @param {Array} config.failParam
 * @param {Array} config.needs
 * @param {Object} config.headers
 * @param {String} config.dataType
 */
const doAjax = config => {
	var checkRes = checkParam({
		needs: config.needs,
		target: config.data
	});

	if (checkRes !== true) {
		config.reject(new Error(checkRes));
		return;
	}

	var sig = config.name + JSON.stringify(config.data);

	if (ajaxPromise[sig]) {
		ajaxPromise[sig].push({
			resolve: config.resolve,
			reject: config.reject
		});
		return;
	}

	ajaxPromise[sig] = [{
		resolve: config.resolve,
		reject: config.reject
	}];

	var paramList = [];

	if (({
		'no-store': true,
		'no-cache': true,
		reload: true
	})[config.cache]) {
		paramList.push({
			key: '_',
			value: Date.now()
		});
	}

	if (noBodyMethod[config.method]) {
		for (var key in config.data) {
			if (!config.data.hasOwnProperty(key)) continue;
			paramList.push({
				key: key,
				value: config.data[key]
			});
		}
	}

	config.url = config.url
		.split('/')
		.map(urlPart => {
			let partName = urlPart.slice(1);
			return config.data[partName] || urlPart;
		})
		.join('/');

	if (paramList.length) {
		config.url += '?' + paramList.map(item => `${item.key}=${item.value}`).join('&');
	}

	{{promise}}.race([
		fetch(config.rootUrl + config.url, {
			method: config.method,
			redirect: 'follow',
			mode: config.mode,
			cache: config.cache,
			body: makeRequestData(config),
			headers: new Headers(config.headers),
			credentials: config.credentials
		}),
		new {{promise}}((resolve, reject) => {
			setTimeout(() => reject('{{errorTimeout}}'), config.timeout);
		})
	]).then(res => {
		if (!res.ok) throw res;
		return res.text();
	}).then(txt => {
		try {
			return JSON.parse(txt);
		} catch (err) {
			return txt;
		}
	}).then(res => {
		var isSucc = isSuccess({
				need: config.isSuccess,
				target: res
			}),
			params = isSucc ? config.successParam : config.failParam,
			result = Array.isArray(res) ? res : getParams(res, params);

		if (result === false) {
			throw '{{errorInconsistentParam}}';
		}

		ajaxPromise[sig].forEach(item => {
			isSucc ? item.resolve(result) : item.reject(result);
		});
	}).catch(res => {
		ajaxPromise[sig].forEach(item => {
			item.reject(res || '{{errorBadNetwork}}');
		});
	}).then(() => {
		delete ajaxPromise[sig];
	});
};

{{{apiList}}}
