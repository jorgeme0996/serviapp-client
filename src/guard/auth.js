export default class Auth {
    constructor(){
        this.url = 'http://localhost:5000'
    }

    async auth(token) {
        const response = await fetch(`${this.url}/api/v1/auth/`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })
        return response.json()
    }
}