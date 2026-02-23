// @/lib/controllers/index.ts
import { loginController } from './loginController';
//import { registerController } from './registerController';

export interface BaseController {
  executeChange?: (params: any) => void;
  executeClick?: (params: any) => void;
  [key: string]: any; // Index signature to allow dynamic access
}

export const controllers: Record<string, BaseController> = {
  'login': loginController,
 // 'register': registerController,
};