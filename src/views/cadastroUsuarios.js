import React from 'react';

import { withRouter } from 'react-router-dom';
import Card from '../components/card';
import FormGroup from '../components/formgroup';

import usuarioService from '../app/service/usuarioService';

import * as messages from '../components/toastr';

class CadastroUsuarios extends React.Component {
    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: '',
    };

    constructor() {
        super();
        this.service = new usuarioService();
    }

    cadastrar = () => {
        const { nome, email, mes, senha, senhaRepeticao } = this.state;
        const usuario = { nome, email, mes, senha, senhaRepeticao };

        try {
            this.service.validar(usuario);
        } catch (error) {
            const msgs = error.mensagens;
            msgs.forEach((msg) => messages.mensagemErro(msg));
            return false;
        }

        this.service
            .salvar(usuario)
            .then((response) => {
                messages.mensagemSucesso(
                    'Usuario cadastrado com sucesso! Faça o login para acessar o sistema.'
                );
                this.props.history.push('/login');
            })
            .catch((error) => {
                messages.mensagemErro(error.response.data);
            });
    };

    cancelar = () => {
        this.props.history.push('/login');
    };

    render() {
        return (
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label="Nome: *" htmlFor="inputNome">
                                <input
                                    type="text"
                                    id="inputNome"
                                    className="form-control"
                                    name="nome"
                                    onChange={(e) =>
                                        this.setState({ nome: e.target.value })
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="Email: *" htmlFor="inputEmail">
                                <input
                                    type="email"
                                    id="inputEmail"
                                    className="form-control"
                                    name="email"
                                    onChange={(e) =>
                                        this.setState({ email: e.target.value })
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="Senha: *" htmlFor="inputSenha">
                                <input
                                    type="password"
                                    id="inputSenha"
                                    className="form-control"
                                    name="senha"
                                    onChange={(e) =>
                                        this.setState({ senha: e.target.value })
                                    }
                                />
                            </FormGroup>
                            <FormGroup
                                label="Repita a Senha: *"
                                htmlFor="inputRepitaSenha"
                            >
                                <input
                                    type="password"
                                    id="inputRepitaSenha"
                                    className="form-control"
                                    name="senha"
                                    onChange={(e) =>
                                        this.setState({
                                            senhaRepeticao: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>

                            <button
                                onClick={this.cadastrar}
                                type="button"
                                className="btn btn-success"
                            >
                                <i className="pi pi-save"></i> Salvar
                            </button>
                            <button
                                onClick={this.cancelar}
                                type="button"
                                className="btn btn-danger"
                            >
                                <i className="pi pi-times"></i>Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
}

export default withRouter(CadastroUsuarios);
