import { Observable, BehaviorSubject } from 'rxjs';
import { Password, Vault } from '../models/password.model';
import { CryptoService } from './crypto.service';
import { SecureStorage } from '@nativescript/secure-storage';

export class PasswordService {
    private vault: BehaviorSubject<Vault>;
    private secureStorage: SecureStorage;
    private cryptoService: CryptoService;
    private readonly VAULT_KEY = 'encrypted_vault';

    constructor() {
        this.secureStorage = new SecureStorage();
        this.cryptoService = new CryptoService();
        this.vault = new BehaviorSubject<Vault>({ passwords: [], lastSync: new Date() });
        this.loadVault();
    }

    private async loadVault(): Promise<void> {
        try {
            const encryptedVault = await this.secureStorage.get({ key: this.VAULT_KEY });
            if (encryptedVault) {
                const masterKey = await this.cryptoService.getMasterKey();
                const decryptedData = await this.cryptoService.decrypt(encryptedVault, masterKey);
                this.vault.next(JSON.parse(decryptedData));
            }
        } catch (error) {
            console.error('Error loading vault:', error);
        }
    }

    async savePassword(password: Password): Promise<void> {
        const currentVault = this.vault.value;
        const updatedPasswords = [...currentVault.passwords, password];
        const updatedVault = { ...currentVault, passwords: updatedPasswords };
        
        await this.saveVault(updatedVault);
    }

    private async saveVault(vault: Vault): Promise<void> {
        try {
            const masterKey = await this.cryptoService.getMasterKey();
            const encryptedVault = await this.cryptoService.encrypt(
                JSON.stringify(vault),
                masterKey
            );
            await this.secureStorage.set({
                key: this.VAULT_KEY,
                value: encryptedVault
            });
            this.vault.next(vault);
        } catch (error) {
            console.error('Error saving vault:', error);
            throw error;
        }
    }

    getPasswords(): Observable<Password[]> {
        return new Observable(subscriber => {
            this.vault.subscribe(vault => {
                subscriber.next(vault.passwords);
            });
        });
    }

    generatePassword(length: number = 16): string {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    calculatePasswordStrength(password: string): number {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.match(/[a-z]+/)) strength += 1;
        if (password.match(/[A-Z]+/)) strength += 1;
        if (password.match(/[0-9]+/)) strength += 1;
        if (password.match(/[!@#$%^&*()_+]+/)) strength += 1;
        return strength;
    }
}