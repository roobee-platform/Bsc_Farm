import WalletConnect from '@walletconnect/browser';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import Web3 from 'web3';
import { getGasPrice } from '../api/ethApi';


const statuses = {
    connected: 'connected',
    disconnected: 'disconnected'
}

let instance;

class WCConnector {
    constructor () {
        if (!instance) instance = this;
        this.status = null;
        this.accounts = [];
        this.onChange = () => {};
        this.walletConnector = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org'
        });
        return instance;
    }


    async createConnection () {
        if (!this.walletConnector.connected) {
            await this.walletConnector.createSession();
            const { uri } = this.walletConnector;
            WalletConnectQRCodeModal.open(uri, () => {});
        }
        this.subscribeToEvents();
    }


    async sendTransaction (transactionObject, onErr, onComplete) {
        if (!this.walletConnector.connected) return false;

        // Gas Price
        const _prices = await getGasPrice();
        const gasPrice = Web3.utils.toHex(Web3.utils.toWei(_prices.slow.price.toString(), 'gwei'));

        // Gas Limit
        const _gasLimit = 21000;
        const gasLimit = Web3.utils.toHex(_gasLimit);

        const tx = {
            ...transactionObject,
            gasPrice,
            gasLimit
        }

        try {
            const result = await this.walletConnector.sendTransaction(tx);
            onComplete(result);
        } catch (err) {
            onErr(err);
        }
    }


    subscribeToEvents () {
        this.onConnect();
        this.onSessionUpdate();
        this.onDisconnect();

        if (this.walletConnector.connected) {
            const { accounts } = this.walletConnector;
            const out = {
                status: statuses.connected,
                accounts: accounts
            }
            this.onChange(out);
            WalletConnectQRCodeModal.open(this.walletConnector.uri);
        }
    }


    onConnect () {
        this.walletConnector.on('connect', (err, payload) => {
            if (err) throw err;
            this.status = statuses.connected;
            WalletConnectQRCodeModal.close();
            const { accounts } = payload.params[0];
            this.accounts = accounts;
            this.onStateChange();
        });
    }

    onSessionUpdate () {
        this.walletConnector.on('session_update', (error, payload) => {
            if (error) throw error;
            const { accounts } = payload.params[0];
            this.accounts = accounts;
            this.onStateChange();
        });
    }

    onDisconnect () {
        this.walletConnector.on('disconnect', (error, payload) => {
            if (error) throw error;
            this.status = statuses.disconnected;
            this.accounts = [];
            this.onStateChange();
            WalletConnectQRCodeModal.close();
        });
    }

    onStateChange () {
        const out = {
            status: this.status,
            accounts: this.accounts
        }
        this.onChange(out);
    }
}

export default WCConnector;