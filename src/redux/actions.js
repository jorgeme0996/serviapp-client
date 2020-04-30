export const updateIsLogged = isLogged => {
    return {
        type: 'UPDATE_ISLOGGED',
        isLogged
    }
}

export const updateRole = role => {
    return {
        type: 'UPDATE_ROLE',
        role
    }
}