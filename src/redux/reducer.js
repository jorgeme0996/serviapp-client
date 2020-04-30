const INITIAL_SATATE = {
    isLogged: false,
    role: 'CLIENT_ROLE'
}

export const reducer = (state = INITIAL_SATATE, action) => {
    switch(action.type) {
        case "UPDATE_ISLOGGED":
            return {
                ...state,
                isLogged: action.isLogged
            };
        case "UPDATE_ROLE":
            return {
                ...state,
                role: action.role
            }
        default:
            return state
    }
}