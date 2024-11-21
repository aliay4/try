import * as CryptoJS from 'crypto-js';
import { SecureStorage } from '@nativescript/secure-storage';

export class CryptoService {
    private secureStorage: SecureStorage;
    private readonly MASTER_KEY_ID = 'master_key';

    constructor() {
        this.secureStorage = new SecureStorage();
    }

    async encrypt(data: string, key: string): Promise<string> {
        return CryptoJS.AES.encrypt(data, key).toString();
    }

    async decrypt(encryptedData: string, key: string): Promise<string> {
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    async setMasterKey(key: string): Promise<void> {
        await this.secureStorage.set({
            key: this.MASTER_KEY_ID,
            value: key
        });
    }

    async getMasterKey(): Promise<string> {
        return await this.secureStorage.get({
            key: this.MASTER_KEY_ID
        });
    }
}