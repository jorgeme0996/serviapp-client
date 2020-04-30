export default class UserService {
    constructor(){
        this.url = 'http://localhost:5000'
    }

    async updateUser(token, body) {
        const response = await fetch(`${this.url}/api/v1/user/update`, {
            method: 'PUT',
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body)
        })
        return response.json()
    }

    async updatePassword(token, body) {
        const response = await fetch(`${this.url}/v1/user/update/password`, {
            method: 'PATCH',
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: JSON.stringify(body)
        })
        return response.json()
    }
}