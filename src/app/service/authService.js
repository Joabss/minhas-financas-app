import ApiService from "../api-service";
import LocalStorageService from "./localStorageService";

import jwt from "jsonwebtoken";

export const USUARIO_LOGADO = '_usuario_logado';
export const TOKEN = 'access_token';

export default class AuthService {

    static isUsuarioAutenticado() {
        const token = LocalStorageService.obterItem(TOKEN);

        if(token){
            const decodedToken = jwt.decode(token);
            const expiration = decodedToken.exp;
            const isTokenInvalid = Date.now() >= (expiration * 1000);
    
            return !isTokenInvalid;
        } else {
            return false;
        }
    }

    static removerUsuarioAutenticado(chave) {
        LocalStorageService.removerItem(USUARIO_LOGADO);
        LocalStorageService.removerItem(TOKEN);

    }

    static logar(usuario, token) {
        LocalStorageService.adicionarItem(USUARIO_LOGADO, usuario);
        LocalStorageService.adicionarItem(TOKEN, token);
        ApiService.registrarToken(token);
    }

    static obterUsuarioAutenticado() {
        return LocalStorageService.obterItem(USUARIO_LOGADO);
    }

    static refreshSession() {
         const token = LocalStorageService.obterItem(TOKEN);
         const usuario = AuthService.obterUsuarioAutenticado();
         AuthService.logar(usuario, token);
         return usuario;
    }
}