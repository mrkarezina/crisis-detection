import { createStore } from "redux"
import {
    TypedUseSelectorHook,
    useSelector as useReduxSelector
} from "react-redux"

const date = new Date()
date.setHours(0, 0, 0, 0)

const lastWeek = new Date(date.getTime() - 24 * 60 * 60 * 1000 * 7)

const initialState = {
    currentDate: date,
    startDate: lastWeek,
    timeInterval: 24 * 60 * 60,
    endDate: date,
    initialDate: date, // treated as 0 index
    clusters: {}
}

export type AppState = typeof initialState

const rootReducer = (
    state: AppState = initialState,
    action: ActionType
): AppState => {
    switch (action.type) {
        case "INCREMENT_DATE":
            return {
                ...state,
                currentDate: new Date(
                    state.currentDate.getTime() + state.timeInterval * 1000
                )
            }
        case "DECREMENT_DATE":
            return {
                ...state,
                currentDate: new Date(
                    state.currentDate.getTime() - state.timeInterval * 1000
                )
            }
        default:
            return state
    }
}

type RootState = ReturnType<typeof rootReducer>

interface IncrementDateType {
    type: "INCREMENT_DATE"
}
interface DecrementDateType {
    type: "DECREMENT_DATE"
}

type ActionType = IncrementDateType | DecrementDateType

const store = createStore(rootReducer)
export default store

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
