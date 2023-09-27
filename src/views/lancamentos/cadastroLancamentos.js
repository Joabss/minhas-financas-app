import React from 'react';

import Card from '../../components/card';
import FormGroup from '../../components/formgroup';
import SelectMenu from '../../components/selectmenu';

import { withRouter } from 'react-router-dom';
import * as messages from '../../components/toastr';

import LancamentoService from '../../app/service/lancamentoService';
import { AuthContext } from '../../main/authProvider';

class CadastroLancamentos extends React.Component {
    state = {
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false,
    };

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    componentDidMount() {
        const params = this.props.match.params;

        if (params.id) {
            this.service
                .obterPorId(params.id)
                .then((response) => {
                    this.setState({ ...response.data, atualizando: true });
                })
                .catch((error) => {
                    messages.mensagemErro(error.response.data);
                });
        }
    }

    submit = () => {
        const usuarioLogado = this.context.usuarioAutenticado;

        const { descricao, valor, mes, ano, tipo } = this.state;
        const lancamento = {
            descricao,
            valor,
            mes,
            ano,
            tipo,
            usuario: usuarioLogado.id,
        };

        try {
            this.service.validar(lancamento);
        } catch (error) {
            const mensagens = error.mensagens;
            mensagens.forEach((msg) => messages.mensagemErro(msg));
            return false;
        }

        this.service
            .salvar(lancamento)
            .then((resposta) => {
                this.props.history.push('/consulta-lancamentos');
                messages.mensagemSucesso('Lançamento cadastrado com sucesso!');
            })
            .catch((error) => {
                messages.mensagemErro(error.response.data);
            });
    };

    atualizar = () => {
        const { descricao, valor, mes, ano, tipo, status, usuario, id } =
            this.state;
        const lancamento = {
            descricao,
            valor,
            mes,
            ano,
            tipo,
            status,
            usuario,
            id,
        };

        this.service
            .atualizar(lancamento)
            .then((resposta) => {
                this.props.history.push('/consulta-lancamentos');
                messages.mensagemSucesso('Lançamento atualizado com sucesso');
            })
            .catch((error) => {
                messages.mensagemErro(error.response.data);
            });
    };

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    };

    render() {
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        return (
            <Card
                title={
                    this.state.atualizando
                        ? 'Atualização de Lançamento'
                        : 'Cadastro de Lançamento'
                }
            >
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup htmlFor="inputDesc" label="Descricao: *">
                            <input
                                id="inputDesc"
                                type="text"
                                className="form-control"
                                value={this.state.descricao}
                                name="descricao"
                                onChange={this.handleChange}
                                placeholder="Digite a descricao"
                            />
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <FormGroup htmlFor="inputAno" label="Ano: *">
                            <input
                                id="inputAno"
                                type="text"
                                className="form-control"
                                value={this.state.ano}
                                name="ano"
                                onChange={this.handleChange}
                                placeholder="Digite o Ano"
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup htmlFor="inputMes" label="Mes: *">
                            <SelectMenu
                                id="inputMes"
                                value={this.state.mes}
                                name="mes"
                                onChange={this.handleChange}
                                className="form-control"
                                lista={meses}
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputValor" label="Valor: *">
                            <input
                                id="inputValor"
                                type="text"
                                className="form-control"
                                value={this.state.valor}
                                name="valor"
                                onChange={this.handleChange}
                                placeholder="Digite o Vlaor"
                            />
                        </FormGroup>
                    </div>

                    <div className="col-md-4">
                        <FormGroup
                            htmlFor="inputTipo"
                            label="Tipo Lançamento: *"
                        >
                            <SelectMenu
                                id="inputTipo"
                                value={this.state.tipo}
                                name="tipo"
                                onChange={this.handleChange}
                                className="form-control"
                                lista={tipos}
                            />
                        </FormGroup>
                    </div>

                    <div className="col-md-4">
                        <FormGroup htmlFor="inputStatus" label="Status: ">
                            <input
                                id="inputStatus"
                                type="text"
                                value={this.state.status}
                                name="status"
                                className="form-control"
                                disabled
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="col-md-6">
                    {this.state.atualizando ? (
                        <button
                            onClick={this.atualizar}
                            type="button"
                            className="btn btn-primary"
                        >
                            <i className="pi pi-refresh"></i> Atualizar
                        </button>
                    ) : (
                        <button
                            onClick={this.submit}
                            type="button"
                            className="btn btn-success"
                        >
                            <i className="pi pi-save"></i> Salvar
                        </button>
                    )}
                    <button
                        onClick={(e) =>
                            this.props.history.push('/consulta-lancamentos')
                        }
                        type="button"
                        className="btn btn-danger"
                    >
                        <i className="pi pi-times"></i>Cancelar
                    </button>
                </div>
            </Card>
        );
    }
}

CadastroLancamentos.contextType = AuthContext;

export default withRouter(CadastroLancamentos);
