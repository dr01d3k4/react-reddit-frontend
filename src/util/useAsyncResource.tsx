// https://dev.to/andreiduca/practical-implementation-of-data-fetching-with-react-suspense-that-you-can-use-today-273m

// Based on article
// TODO: Caching?

import React from 'react';

export type DataReader<T> = () => T;

type Params = any[];
type FetchFunc = (...params: Params) => Promise<Response>;
type AsyncResource<T> = [DataReader<T>, (...params: Params) => void];

const initializeDataReader = <T extends any>(func: FetchFunc, ...params: Params): DataReader<T> =>
{
	type Status = "init" | "done" | "error";

	let data: T;
	let status: Status = "init";
	let error: any;

	const fetchingPromise = func(...params)
		.then((response: Response) => {
			response.json().then((result: T) => {
				data = result;
				status = "done";
			});
		})
		.catch(e => {
			error = e;
			status = "error";
		});

	const dataReader: DataReader<T> = () => {
		if (status === "init")
		{
			throw fetchingPromise;
		}
		else if (status === "error")
		{
			throw error;
		}

		return data;
	};

	return dataReader;
}

export const useAsyncResource = <T extends any>(func: FetchFunc, ...params: Params): AsyncResource<T> =>
{
	const [dataReader, updateDataReader] = React.useState<DataReader<T>>(
		() => {
			// No params given, don't call the fetch func yet
			if (!params.length)
			{
				return (() => undefined) as DataReader<T>;
			}

			// Function doesn't take arguments and user gave empty array for param
			if (!func.length
				&& params.length === 1
				&& Array.isArray(params[0])
				&& params[0].length === 0)
			{
				return initializeDataReader<T>(func);
			}

			return initializeDataReader<T>(func, ...params);
		}
	);

	const update = React.useCallback((...newParams: Params) =>
		updateDataReader(
			() => initializeDataReader<T>(func, ...newParams)
		)
	, [func]);

	return [dataReader, update];
}

// export {useAsyncResource, DataReader};


// Below: mostly code from the article with some modifications to get it to work
/*import {useState, useCallback} from 'react';

// a typical api function: takes an arbitrary number of arguments of type A
// and returns a Promise which resolves with a specific response type of R
type ApiFn<R, A extends any[] = []> = (...args: A) => Promise<R>;

// an updater function: has a similar signature with the original api function,
// but doesn't return anything because it only triggers new api calls
type UpdaterFn<A extends any[] = []> = (...args: A) => void;

// a simple data reader function: just returns the response type R
type DataFn<R> = () => R;
// a lazy data reader function: might also return `undefined`
type LazyDataFn<R> = () => (R | undefined);

// we know we can also transform the data with a modifier function
// which takes as only argument the response type R and returns a different type M
type ModifierFn<R, M = any> = (response: R) => M;

// therefore, our data reader functions might behave differently
// when we pass a modifier function, returning the modified type M
type ModifiedDataFn<R> = <M>(modifier: ModifierFn<R, M>) => M;
type LazyModifiedDataFn<R> = <M>(modifier: ModifierFn<R, M>) => (M | undefined);

// finally, our actual eager and lazy implementations will use
// both versions (with and without a modifier function),
// so we need overloaded types that will satisfy them simultaneously
type DataOrModifiedFn<R> = DataFn<R> & ModifiedDataFn<R>;
type LazyDataOrModifiedFn<R> = LazyDataFn<R> & LazyModifiedDataFn<R>;

// overload for wrapping an apiFunction without params:
// it only takes the api function as an argument
// it returns a data reader with an optional modifier function
function initializeDataReader<ResponseType>(
	apiFn: ApiFn<ResponseType>,
): DataOrModifiedFn<ResponseType>;

// overload for wrapping an apiFunction with params:
// it takes the api function and all its expected arguments
// also returns a data reader with an optional modifier function
function initializeDataReader<ResponseType, ArgTypes extends any[]>(
	apiFn: ApiFn<ResponseType, ArgTypes>,
	...parameters: ArgTypes
): DataOrModifiedFn<ResponseType>;

// implementation that covers the above overloads
function initializeDataReader<ResponseType, ArgTypes extends any[] = []>(
	apiFn: ApiFn<ResponseType, ArgTypes>,
	...parameters: ArgTypes
) {
	type AsyncStatus = 'init' | 'done' | 'error';

	let data: ResponseType;
	let status: AsyncStatus = 'init';
	let error: any;

	const fetchingPromise = apiFn(...parameters)
		.then((response) => {
			console.log("fetchingPromise got response");
			console.log(response);
			data = response; // (response as any).json();
			console.log("data =");
			console.log(data);
			status = 'done';
		})
		.catch((e) => {
			error = e;
			status = 'error';
		});

	// overload for a simple data reader that just returns the data
	function dataReaderFn(): ResponseType;
	// overload for a data reader with a modifier function
	function dataReaderFn<M>(modifier: ModifierFn<ResponseType, M>): M;
	// implementation to satisfy both overloads
	function dataReaderFn<M>(modifier?: ModifierFn<ResponseType, M>) {
		if (status === 'init') {
			throw fetchingPromise;
		} else if (status === 'error') {
			throw error;
		}

		return typeof modifier === "function"
			? modifier(data) as M
			: data as ResponseType;
	}

	return dataReaderFn;
}

// overload for a lazy initializer:
// the only param passed is the api function that will be wrapped
// the returned data reader LazyDataOrModifiedFn<ResponseType> is "lazy",
//   meaning it can return `undefined` if the api call hasn't started
// the returned updater function UpdaterFn<ArgTypes>
//   can take any number of arguments, just like the wrapped api function
function useAsyncResource<ResponseType, ArgTypes extends any[]>(
	apiFunction: ApiFn<ResponseType, ArgTypes>,
): [LazyDataOrModifiedFn<ResponseType>, UpdaterFn<ArgTypes>];

// overload for an eager initializer for an api function without params:
// the second param must be `[]` to indicate we want to start the api call immediately
// the returned data reader DataOrModifiedFn<ResponseType> is "eager",
//   meaning it will always return the ResponseType
//   (or a modified version of it, if requested)
// the returned updater function doesn't take any arguments,
//   just like the wrapped api function
function useAsyncResource<ResponseType>(
	apiFunction: ApiFn<ResponseType>,
	eagerLoading: never[], // the type of an empty array `[]` is `never[]`
): [DataOrModifiedFn<ResponseType>, UpdaterFn];

// overload for an eager initializer for an api function with params
// the returned data reader is "eager", meaning it will return the ResponseType
//   (or a modified version of it, if requested)
// the returned updater function can take any number of arguments,
//   just like the wrapped api function
function useAsyncResource<ResponseType, ArgTypes extends any[]>(
	apiFunction: ApiFn<ResponseType, ArgTypes>,
	...parameters: ArgTypes
): [DataOrModifiedFn<ResponseType>, UpdaterFn<ArgTypes>];

function useAsyncResource<ResponseType, ArgTypes extends any[]>(
	apiFunction: ApiFn<ResponseType> | ApiFn<ResponseType, ArgTypes>,
	...parameters: ArgTypes
) {
	// initially defined data reader
	const [dataReader, updateDataReader] = useState(() => {
		// lazy initialization, when no parameters are passed
		if (!parameters.length) {
			// we return an empty data reader function
			return (() => undefined) as LazyDataOrModifiedFn<ResponseType>;
		}

		// eager initialization for api functions that don't accept arguments
		if (
			// check that the api function doesn't take any arguments
			!apiFunction.length
			// but the user passed an empty array as the only parameter
			&& parameters.length === 1
			&& Array.isArray(parameters[0])
			&& parameters[0].length === 0
		) {
			return initializeDataReader(apiFunction as ApiFn<ResponseType>);
		}

		// eager initialization for all other cases
		return initializeDataReader(apiFunction as ApiFn<ResponseType, ArgTypes >, ...parameters);
	});

	// the updater function
	const updater = useCallback((...newParameters: ArgTypes) => {
		updateDataReader(() =>
			initializeDataReader(apiFunction as ApiFn<ResponseType, ArgTypes >, ...newParameters)
		);
	}, [apiFunction]);

	return [dataReader, updater];
};

export default useAsyncResource;
*/
