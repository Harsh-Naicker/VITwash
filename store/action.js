export const setUser = (user) => {
    return {
        type: 'SET_USER',
        payload: user
    }
}
export const setAmount = (n) => {
    return {
        type: 'SET_AMOUNT',
        payload: n
    }
}
export const setBasket = (n) => {
    return {
        type: 'SET_BASKET',
        payload: n
    }
}
export const setTokens = (n) => {
    return {
        type: 'SET_TOKENS',
        payload: n
    }
}
export const retrieveTokens = (n) => {
    return {
        type: 'RETRIEVE_TOKENS',
        payload: n
    }
}
export const setSlot = (n) => {
    return {
        type: 'SET_SLOT',
        payload: n
    }
}
export const addSlot = (n) => {
    return {
        type: 'ADD_SLOT',
        payload: n
    }
}
export const setDate = (n) => {
    return {
        type: 'SET_DATE',
        payload: n
    }
}
export const retrieveDate = () => {
    return {
        type: 'RETRIEVE_DATE'
    }
}
export const addBookedSlot = (n) => {
    return {
        type: 'ADD_BOOKED_SLOT',
        payload: n
    }
}
export const retrieveContact = (n) => {
    return {
        type: 'RETRIEVE_CONTACT',
        payload: n
    }
}