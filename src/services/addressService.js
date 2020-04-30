export default class AddressesService {
    constructor(){
        this.url = 'http://localhost:5000'
    }

    async getAddresses(token) {
        const response = await fetch(`${this.url}/api/v1/address/user`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': token
            })
        })
        return response.json()
    }
}