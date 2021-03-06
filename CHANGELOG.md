# CHANGELOG

- Ver 1.10.2
	- Return all response when no `success` param.
	- Bump dependencies version.
- Ver 1.9.11
	- Fix array response.
- Ver 1.9.10
	- Fix cache condition for same request.
- Ver 1.9.8
	- Fix json response parse
	- Fix body for browsers no native URLSearchParams
	- Add eslint in test flow
	- Use eslint-config-handsome instead of xo
- Ver 1.9.7
	- Fix [issue 1](https://github.com/poppinlp/js-api-generator/issues/1)
- Ver 1.9.6
	- Fix body init type bug
- Ver 1.9.5
	- Fix chrome version for send body polyfill
- Ver 1.9.4
	- Add `rootUrl` option to set prefix path for all api `url`.
- Ver 1.9.3
  - Do `toString` for `URLSearchParams` when chrome version under 47.
- Ver 1.9.2
  - Force add `x-www-form-urlencoded` for `URLSearchParams` body.
- Ver 1.9.1
	- Add `JSON` format for `dataType` option.
- Ver 1.8.2
	- Fix check param bug.
- Ver 1.8.0
	- Add `headers` option to add custom request headers. See [detail][opt-headers].
	- Add `dataType` option to format passed data. See [detail][opt-dataType].
	- Add `method` option as a alias for `type`.
	- `needs` data would be optional if it ends with `?`.
	- Add `blob` in variable type check list.
	- Deprecated `type` option. Will be removed in 2.0.0.
	- Deprecated array for `needs` option. Will be removed in 2.0.0.
- Ver 1.7.0
	- Add `errorMessage` option as custom error message which will overwrite default error message.
	- Use xo instead of eslint for dev js lint.
- Ver 1.6.0
	- Throw response instead of msg when status is not 200.
- Ver 1.5.0
	- Support type check for `needs` data. See [detail][opt-needs].
- Ver 1.4.0
	- Support variables in url whose value comes from data object.
- Ver 1.3.0
	- Support `timeout` for fetch.
	- The output for `es2015` module option is in es2015 syntax now.
	- Remove `uglify` option. You should do uglify yourself if you want.
- Ver 1.2.1
	- Auto create dir when output path not exists.
- Ver 1.2.0
	- Support request data for GET method.
- Ver 1.1.0
	- Add `cache` option.
- Ver 1.0.2
	- Fix `TypeMismatch` error in edge.
- Ver 1.0.1
	- Fix use URLSearchParams work with [fetch polyfill][fetch-polyfill].
- Ver 1.0.0
	- Use [fetch API][fetch-api] instead of XMLHttpRequest.
	- Remove global option `jQuery`.
	- Put `isSuccess` option to every api not only global.
	- Remove global option `context`.
	- Add global option `encoding`.
	- Use `browser` option instead of `browserify` option.

[opt-headers]:https://github.com/poppinlp/js-api-generator#headers-object
[opt-dataType]:https://github.com/poppinlp/js-api-generator#datatype-string
[opt-needs]:https://github.com/poppinlp/js-api-generator#needs-array--object
[fetch-polyfill]:https://github.com/github/fetch
[fetch-api]:https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
