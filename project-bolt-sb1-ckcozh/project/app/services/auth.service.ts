import { Biometrics } from '@nativescript/biometrics';

export class AuthService {
    private biometrics: Biometrics;

    constructor() {
        this.biometrics = new Biometrics();
    }

    async authenticateWithBiometrics(): Promise<boolean> {
        try {
            const result = await this.biometrics.verifyFingerprintWithCustomFallback({
                message: 'Scan your fingerprint to continue',
                fallbackMessage: 'Enter PIN',
                title: 'Biometric Authentication'
            });
            return result.code === 0;
        } catch (error) {
            console.error('Biometric authentication failed:', error);
            return false;
        }
    }

    async isBiometricsAvailable(): Promise<boolean> {
        try {
            const result = await this.biometrics.available();
            return result.biometrics;
        } catch {
            return false;
        }
    }
}