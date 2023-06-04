import React from 'react'
import { AppState, Action } from './types/App'
import initialState from './stateMgmt/initialState'
import combineReducers from './stateMgmt/reducers/combineReducers'

const defaultDispatch: React.Dispatch<Action> = () => initialState

const Store = React.createContext({
	state: initialState,
	dispatch: defaultDispatch,
})

function StoreProvider(props: React.PropsWithChildren<{}>) {
	const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
		combineReducers, initialState
	)

	return <Store.Provider value={{ state, dispatch }} {...props} />
}

export { Store, StoreProvider }
