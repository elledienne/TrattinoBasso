// Take a collection (that can be an array or and object) and a callback function;
// Each iterates over the collection and applies the callback to every item.
function each(collection, callback){
	if(Array.isArray(collection)){
		for(var i = 0; i<collection.length; i++){
			callback(collection[i]);
		}
	} else {
		for(key in collection){
			callback(collection[key]);
		}
	}
}

// Produces a new array of values by mapping each value in the collection through a transformation callback function.
function map(collection, callback){
	var arr = [];
	each(collection, function(item){
		arr.push(callback(item));
	});
	return arr;
}

// boils down a collection of values (array or object) into a single value.
function reduce(collection, iterator, initialValue){
	initialValue = initialValue || 0;
	each(collection, function(e){
		initialValue = iterator(initialValue, e);
	});
	return initialValue;
}

// Same as reduce but boils down starting from the latest elem to the first (from the right, as the name says).
// Considering the nature of objects (unordered collections) it's not surprising that reduceRight works only on arrays; if an object is passed reduce is called instead.
function reduceRight(collection, iterator, initialValue){
	if(Array.isArray(collection)){
		collection.sort(function(a,b){ return b-a;});
	}
	return reduce(collection,iterator, initialValue);
}

// Looks through each value in the collection (arr or obj), returning the first one that passes a truth test (callback), or undefined if no value passes the test.
// The function returns as soon as it finds an acceptable element, and doesn't traverse the entire collection.
function find(collection, callback){
	if(Array.isArray(collection)){
		for(var i = 0, result; i<collection.length; i++){
			if(callback(collection[i])){
				return collection[i];
				//break;
			}
		}
	} else {
		for(var key in collection){
			if(callback(collection[key])){
				return collection[key];
				//break;
			}
		}
	}
	return undefined;
}

//Looks through each value in the collection, returning an array of all the values that pass a truth test (callback).
function filter(collection, callback){
	var arr = [];
	each(collection, function(itm){
		if(callback(itm)){
			arr.push(itm);
		}
	});
	return arr;
}

// Looks through each value in the collection, returning an array of all the values that contain all of the key-value pairs listed in properties.
function where(collection, properties){
	var arr = [];
	each(collection, function(itm){
		for(key in properties){
			if(!(itm[key]) || itm[key] !== properties[key]) return;
		}
		arr.push(itm);
	});
	return arr;
}

// Looks through the list and returns the first value that matches all of the key-value pairs listed in properties.
// If no match is found, or if list is empty, undefined will be returned.
function findWhere(collection, properties){
	var arr = [];
	return find(collection, function(itm){
		for(key in properties){
			if(!(itm[key]) || itm[key] !== properties[key]) return;
		}
		return true;
	});	
}

// The opposite of filter
function reject(collection, callback){
	var arr = [];
	each(collection, function(itm){
		if(!(callback(itm))) arr.push(itm);
	});
	return arr;
}

// Returns true if all of the values in the collection pass the callback truth test
function every(collection, callback){
	var result = true;
	each(collection, function(itm){
		if(!callback(itm)){
			result = false;
		}
	});
	return result;
}

// Returns true if any of the values in the collection pass the callback truth test. Short-circuits and stops traversing the collection if a true element is found.
function some(collection, callback){
	var result = find(collection, function(itm){
		return callback(e);
	});
	return (result !== undefined) ? true : false;
}

// Returns true if the value is present in the collection. Uses indexOf internally, if list is an Array. Use fromIndex to start your search at a given index.
function contains(collection, value, fromIndex){
	var result;
	fromIndex = fromIndex || 0;
	if(Array.isArray(collection)){
		result = collection.indexOf(value, fromIndex);
	} else {
		result = find(collection, function(itm){
			return itm === value;
		});
	}
	return (result !== -1 && result !== undefined) ? true : false;
}

// A convenient version of what is perhaps the most common use-case for map: extracting a list of property values.
function pluck(collection, propertyName){
	return map(collection, function(itm){
		return itm[propertyName];
	});
}

// Returns the maximum value in collection. If a callback function is provided, it will be used on each value to generate the criterion by which the value is ranked.
// -Infinity is returned if collection is empty.
function max(collection, callback){
	var result = -Infinity
	if(callback === undefined){
		result = reduce(collection, function(max, nextItm){
			return (nextItm > max) ? nextItm : max;
		}, -Infinity);
	} else {
		result = reduce(collection, function(max, nextItm){
			return (callback(nextItm) > max) ? nextItm : max;
		}, -Infinity);
	}
	return result;
}

// Returns the minimum value in collection. If a callback function is provided, it will be used on each value to generate the criterion by which the value is ranked.
// Infinity is returned if collection is empty.
function min(collection, callback){
	var result = Infinity;
	result = reduce(collection, function(min, nextItm){
		nextItm = (callback === undefined) ? nextItm : callback(nextItm);
		return (nextItm < min) ? nextItm : min;
	}, Infinity);
	return result;
}

// Returns a (stably) sorted copy of collection, ranked in ascending order by the results of running each value through callbackiiiuuiiui.
function sortBy(collection, callback){
	var result = [];
	var mappedItms = map(collection, function(itm){ 
		return (typeof callback === 'function') ? {ref: itm, mappedItm: callback(itm)} : {ref: itm, mappedItm: itm[callback]};
	}).sort(function(a, b){
		if(a.mappedItm > b.mappedItm) return 1;
		if(a.mappedItm < b.mappedItm) return -1;
		return 0;
	});
	return map(mappedItms, function(itm){ return itm.ref;});
}

// Returns an array containing all the keys of the passed object
function keys(obj){
	var arr = [];
	for(var key in obj){
		arr.push(key);
	}
	return arr;
}

// Once returns a function that is called only one time, next calls returns the result without executing the fn again.
function once(fn){
	var firstExecution = true;
	var result;
	return function(){
		if(firstExecution){
			result = fn();
			firstExecution = false;
			return result;
		} else {
			return result;
		}
	}
}