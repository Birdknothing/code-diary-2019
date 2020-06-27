const mkReducer = syncMethods => (state, action) => {
    const { type, payload } = action;
    try {
        return syncMethods[type](state, payload);
    } catch (error) {
        return state;
    }
};
const mkState = (defaultState, defaultReducer) => {
    let state = JSON.parse(JSON.stringify(defaultState));
    // Object.assign(state,{is})
    let listeners = [];
    let reducer = mkReducer(defaultReducer);
    const getState = () => state;
    const dispatch = action => {
        state = reducer(state, action) || state;
        listeners.forEach(listener => listener());
    };
    const subscribe = listener => {
        listeners.indexOf(listener) === -1 && listeners.push(listener);
    };
    return { getState, dispatch, subscribe };
};
const { getState, dispatch, subscribe } = mkState(
    { x: 1 },
    {
        add(state, payload) {
            state.x += payload;
        }
    }
);

const log = () => console.log(getState());
const m = () => {
    return function() {
        
        console.log(this);
    };
};
m()();
dispatch({ type: "add", payload: 1 });
log();
