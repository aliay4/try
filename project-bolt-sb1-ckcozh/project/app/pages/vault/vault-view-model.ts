import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { PasswordService } from '../../services/password.service';
import { Password } from '../../models/password.model';

export class VaultViewModel extends Observable {
    private passwordService: PasswordService;
    public passwords: Password[] = [];

    constructor() {
        super();
        this.passwordService = new PasswordService();
        this.loadPasswords();
    }

    private loadPasswords() {
        this.passwordService.getPasswords().subscribe(passwords => {
            this.set('passwords', passwords);
        });
    }

    onAddPassword() {
        Frame.topmost().navigate({
            moduleName: 'pages/password/add-password-page'
        });
    }

    onViewPassword(args) {
        const password = args.object.bindingContext;
        Frame.topmost().navigate({
            moduleName: 'pages/password/password-details-page',
            context: { password }
        });
    }
}