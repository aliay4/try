import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { PasswordService } from '../../services/password.service';

export class AddPasswordViewModel extends Observable {
    private passwordService: PasswordService;
    
    public title: string = '';
    public username: string = '';
    public password: string = '';
    public website: string = '';
    public notes: string = '';
    public showPassword: boolean = false;
    public strengthLevel: number = 0;

    constructor() {
        super();
        this.passwordService = new PasswordService();
    }

    togglePasswordVisibility() {
        this.set('showPassword', !this.showPassword);
    }

    generatePassword() {
        const newPassword = this.passwordService.generatePassword();
        this.set('password', newPassword);
        this.updatePasswordStrength();
    }

    updatePasswordStrength() {
        const strength = this.passwordService.calculatePasswordStrength(this.password);
        this.set('strengthLevel', strength);
    }

    async savePassword() {
        if (!this.title || !this.username || !this.password) {
            // Show error message
            return;
        }

        const newPassword = {
            id: Date.now().toString(),
            title: this.title,
            username: this.username,
            password: this.password,
            website: this.website,
            notes: this.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            strength: this.strengthLevel,
            category: 'default'
        };

        try {
            await this.passwordService.savePassword(newPassword);
            Frame.topmost().goBack();
        } catch (error) {
            console.error('Error saving password:', error);
            // Show error message
        }
    }
}