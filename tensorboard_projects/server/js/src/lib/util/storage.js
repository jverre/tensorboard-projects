// @flow
const defaultOptions = {};

export function set(key, value, options) {
    let storage = getStorage()
    
    try {
        var res = {
          value: value
        }

        if (options && options.expiryTime) {
          res['expiryTime'] = options.expiryTime
        }

        if (options && options.requestTime) {
          res['requestTime'] = options.requestTime
        }
        
        storage.setItem(key, JSON.stringify(res));
    } catch (error) {
      console.error(error);
    }
  }

  export function get(key) {
    let storage = getStorage();
    var val;
    
    try {
        var res = JSON.parse(storage.getItem(key));
        if (res.expiryTime) {
          if (res.expiryTime > Date.now()) {
            val = res.value
          } else {
            val = null
          }
        } else {
          val = res.value
        }
    } catch (error) {
      val = null
    }
    return val
  }

export function getStorage(key, options) {
    options              = {...(key || {}).options, ...options};
    let storage = options.session ? window.sessionStorage : window.localStorage;
    return storage ;
}

export function has(key) {
    let storage = getStorage(key);
    return !!storage.getItem(key);
  }

  export function clear(key) {
    let storage = getStorage(key);
    return storage.clear();
  }

export function key(id, defaultValue, options) {
return {
  id,
  defaultValue: defaultValue || null,
  options     : options || defaultOptions,
};
}
export function remove(key) {
  let storage = getStorage(key);
  storage.removeItem(key);
}

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    
    if (serializedState === null) {
      return undefined
    }
    
    return JSON.parse(serializedState).state;
  } catch (err) {
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({state});
    localStorage.setItem('state', serializedState)
    
  } catch (err) {
    // Ingore write errors
  }
}