import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class LoginViewModel extends Observable {
    private authService: AuthService;
    public masterPassword: string = '';

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async onBiometricLogin() {
        const authenticated = await this.authService.authenticateWithBiometrics();
        if (authenticated) {
            Frame.topmost().navigate({
                moduleName: 'pages/vault/vault-page',
                clearHistory: true
            });
        }
    }

    async onLogin() {
        if (this.masterPassword) {
            // In a real app, validate master password here
            Frame.topmost().navigate({
                moduleName: 'pages/vault/vault-page',
                clearHistory: true
            });
        }
    }
}