import React from 'react';
import { withRouter } from 'react-router-dom';

import Card from '../../components/card';
import FormGroup from '../../components/formgroup';
import SelectMenu from '../../components/selectmenu';
import LancamentoTable from './lancamentoTable';
import lancamentoService from '../../app/service/lancamentoService';
import { AuthContext } from '../../main/authProvider';

import * as messages from '../../components/toastr';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

class ConsultaLancamentos extends React.Component {
    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: [],
    };

    constructor() {
        super();
        this.service = new lancamentoService();
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`);
    };

    deletar = (lancamento) => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then((resposta) => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index, 1);
                this.setState({
                    lancamentos: lancamentos,
                    showConfirmDialog: false,
                });
                messages.mensagemSucesso('Lançamento deletado com sucesso!');
            })
            .catch((error) => {
                messages.mensagemErro(error.response.data);
            });
    };

    abrirConfirmacao = (lancamento) => {
        this.setState({
            showConfirmDialog: true,
            lancamentoDeletar: lancamento,
        });
    };

    cancelarDelecao = (lancamento) => {
        this.setState({ showConfirmDialog: false, lancamentoDeletar: {} });
    };

    buscar = () => {
        if (!this.state.ano) {
            messages.mensagemErro(
                'O preenchimento do campo Ano é Obrigatório.'
            );
            return false;
        }

        const usuarioLogado = this.context.usuarioAutenticado;

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id,
        };

        this.service
            .consultar(lancamentoFiltro)
            .then((resposta) => {
                const lista = resposta.data;
                if (lista.length < 1) {
                    messages.mensagemAlerta('Nenhum resultado encontrado');
                }
                this.setState({ lancamentos: resposta.data });
            })
            .catch((error) => {
                messages.mensagemErro(error.response.data);
            });
    };

    preparaFormularioCadastrao = () => {
        this.props.history.push('/cadastro-lancamentos');
    };

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then((response) => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if (index !== -1) {
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento;
                    this.setState({ lancamentos });
                }
                messages.mensagemSucesso('Status atualizado com sucesso!');
            })
            .catch((error) => {});
    };

    render() {
        const confirmDialogFooter = (
            <div>
                <Button
                    label="Confirma"
                    icon="pi pi-check"
                    onClick={this.deletar}
                    autoFocus
                />
                <Button
                    label="Cancela"
                    icon="pi pi-times"
                    onClick={this.cancelarDelecao}
                    className="p-button-text"
                />
            </div>
        );

        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        return (
            <Card title="Consulta Lançamentos">
                <Tooltip target=".pi" />
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input
                                    id="inputAno"
                                    type="text"
                                    className="form-control"
                                    value={this.state.ano}
                                    onChange={(e) =>
                                        this.setState({ ano: e.target.value })
                                    }
                                    placeholder="Digite o Ano"
                                />
                            </FormGroup>

                            <FormGroup htmlFor="inputMes" label="Mes: ">
                                <SelectMenu
                                    id="inputMes"
                                    value={this.state.mes}
                                    onChange={(e) =>
                                        this.setState({ mes: e.target.value })
                                    }
                                    className="form-control"
                                    lista={meses}
                                />
                            </FormGroup>

                            <FormGroup htmlFor="inputDesc" label="Descricao: ">
                                <input
                                    id="inputDesc"
                                    type="text"
                                    className="form-control"
                                    value={this.state.descricao}
                                    onChange={(e) =>
                                        this.setState({
                                            descricao: e.target.value,
                                        })
                                    }
                                    placeholder="Digite a descricao"
                                />
                            </FormGroup>

                            <FormGroup
                                htmlFor="inputTipo"
                                label="Tipo Lançamento: "
                            >
                                <SelectMenu
                                    id="inputTipo"
                                    value={this.state.tipo}
                                    onChange={(e) =>
                                        this.setState({ tipo: e.target.value })
                                    }
                                    className="form-control"
                                    lista={tipos}
                                />
                            </FormGroup>

                            <button
                                onClick={this.buscar}
                                type="button"
                                className="btn btn-success"
                            >
                                <i className="pi pi-search">Buscar</i>
                            </button>

                            <button
                                onClick={this.preparaFormularioCadastrao}
                                type="button"
                                className="btn btn-danger"
                            >
                                <i className="pi pi-plus">Cadastrar</i>
                            </button>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentoTable
                                lancamentos={this.state.lancamentos}
                                deleteAction={this.abrirConfirmacao}
                                editAction={this.editar}
                                alterarStatus={this.alterarStatus}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog
                        header="Confirmação"
                        visible={this.state.showConfirmDialog}
                        style={{ width: '50vw' }}
                        modal={true}
                        footer={confirmDialogFooter}
                        onHide={() =>
                            this.setState({ showConfirmDialog: false })
                        }
                    >
                        Confirma a exclusão deste Lançamento?
                    </Dialog>
                </div>
            </Card>
        );
    }
}

ConsultaLancamentos.contextType = AuthContext;

export default withRouter(ConsultaLancamentos);
