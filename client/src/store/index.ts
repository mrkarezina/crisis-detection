import { createStore } from "redux"
import {
    TypedUseSelectorHook,
    useSelector as useReduxSelector
} from "react-redux"

const date = new Date()
date.setHours(0, 0, 0, 0)

const lastWeek = new Date(date.getTime() - 24 * 60 * 60 * 1000 * 7)

const initialState = {
    startDate: lastWeek,
    timeInterval: 24 * 60 * 60,
    endDate: date,
    clusters: {}
}

type AppState = typeof initialState

const rootReducer = (
    state: AppState = initialState,
    action: ActionType
): AppState => {
    switch (action) {
        default:
            return state
    }
}

type RootState = ReturnType<typeof rootReducer>

type ActionType = {}

const store = createStore(rootReducer)
export default store

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
