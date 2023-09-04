import React from "react";

import Home from '../views/home';
import Login from '../views/login';

import CadastroUsuarios from '../views/cadastroUsuarios';
import ConsultaLancamentos from "../views/lancamentos/consultaLancamentos";
import CadastroLancamentos from "../views/lancamentos/cadastroLancamentos";
import LandingPage from "../views/landingPage";
import { AuthConsumer } from "./authProvider";
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'

function RotaAutenticada({ component: Component, isUsuarioAutenticado, ...props }) {
    return (
        <Route exact {...props} render={(componentProps) => {
            if (isUsuarioAutenticado) {
                return (
                    <Component {...componentProps} />
                )
            } else {
                return (
                    <Redirect to={{ pathname: '/login', state: { from: componentProps.location } }} />
                )
            }
        }} />
    )
}

function Rotas(props) {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/cadastro-usuarios" component={CadastroUsuarios} />

                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/home" component={Home} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/consulta-lancamentos" component={ConsultaLancamentos} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/cadastro-Lancamentos/:id?" component={CadastroLancamentos} />
            </Switch>
        </BrowserRouter>
    )
}

export default () => (
    <AuthConsumer>
        {(context) =>
            (<Rotas isUsuarioAutenticado={context.isAutenticado} />)
        }
    </AuthConsumer>
)