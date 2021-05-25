const initialState = {
    user: {
        uid: 'guest',
        email: 'guest'
    },
    amount: 0,
    basket: 0,
    tokens: 0,
    slot: [],
    date: '',
    bookedSlots: [],
    contact: 0
}

export const rootReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {...state, user: action.payload}
        case 'SET_AMOUNT':
            return {...state, amount: action.payload}
        case 'SET_BASKET':
            return {...state, basket: action.payload}
        case 'SET_TOKENS':
            return {...state, tokens: state.tokens+action.payload}
        case 'RETRIEVE_TOKENS':
            return {...state, tokens: action.payload}
        case 'SET_SLOT':
            return {...state, slot: action.payload}
        case 'ADD_SLOT':
            return {...state, slot: [...state.slot, action.payload]}
        case 'ADD_BOOKED_SLOT':
            return {...state, bookedSlots: [...state.bookedSlots, action.payload]}
        case 'SET_DATE':
            return {...state, date: action.payload}
        case 'RETRIEVE_DATE':
            return state.date
        case 'RETRIEVE_CONTACT':
            return {...state, contact: action.payload}
        default:
            return state
    }
}