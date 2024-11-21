import { Application } from '@nativescript/core';
import { AuthService } from './services/auth.service';

const authService = new AuthService();

Application.run({ moduleName: 'app-root' });