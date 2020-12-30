let instance;
class MetaMaskConnector {
    constructor () {
        if (!instance) instance = this;
        this.status = null;
        this.data = null;
        this.onChange = null;
        this.eth = (window.ethereum !== 'undefined') ? window.ethereum : null;
        this.init();
        return instance;
    }

    init () {
        this.status = (!this.eth) ? 'NOT_INSTALLED' : 'INSTALLED';
        if (!this.eth) return false;

        this.eth.on('accountsChanged', (accounts) => {
            if (typeof this.onChange === 'function') {
                try {
                    this.data = accounts;
                    this.onChange(this.makeResponse());
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    async getAccounts () {
        if (!this.eth) return this.makeResponse();
        try {
            const accounts = await this.eth.request({ method: 'eth_requestAccounts' });
            if (accounts.length === 0) {
                this.status = 'LOCKED';
            } else {
                this.status = 'CONNECTED';
                this.data = accounts;
            }
        } catch (error) {
            console.log(error.code);
            if (error.code === -32002) {
                this.status = 'AWAITING PASSWORD INPUT'
                this.data = null;
            }
            if (error.code === 4001) {
                this.status = 'DENIED'
                this.data = null;
            }
        }
        return this.makeResponse();
    }

    async sendTransaction (transactionObject, onErr, onComplete) {
        const req = {
            method: 'eth_sendTransaction',
            params: [transactionObject]
        }

        this.eth.sendAsync(req, (err, result) => {
            if (err) {
                onErr(err);
            } else {
                onComplete(result);
            }
        });
    }

    makeResponse () {
        return {
            status: this.status,
            data: this.data
        }
    }
}

export default MetaMaskConnector;
