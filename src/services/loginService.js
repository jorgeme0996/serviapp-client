export default class LoginService {
    constructor(){
        this.url = 'http://localhost:5000'
    }

    async login(userData) {
        const response = await fetch(`${this.url}/api/v1/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        return response.json()
    }

    async signup(userData) {
        const response = await fetch(`${this.url}/api/v1/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        return response.json()
    }
}