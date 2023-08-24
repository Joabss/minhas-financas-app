import React from 'react';

import currencyFormatter from 'currency-formatter';
import { Tooltip } from 'primereact/tooltip';


export default props => {

    const rows = props.lancamentos.map((lancamento, index) => {
        return (
            <tr key={lancamento.id}>
                <td>{lancamento.descricao}</td>
                <td>{currencyFormatter.format(lancamento.valor, { locale: 'pt-BR' })}</td>
                <td>{lancamento.tipo}</td>
                <td>{lancamento.mes}</td>
                <td>{lancamento.status}</td>
                <td>
                    <Tooltip target=".pi" />

                    <button className='btn btn-success'
                        disabled={lancamento.status !== 'PENDENTE'}
                        onClick={e => props.alterarStatus(lancamento, 'EFETIVADO')}
                        type='button'>
                        <i className="pi pi-check" data-pr-tooltip="Efetivar"></i>
                    </button>

                    <button className='btn btn-warning'
                        disabled={lancamento.status !== 'PENDENTE'}
                        onClick={e => props.alterarStatus(lancamento, 'CANCELADO')}
                        type='button'>
                        <i className="pi pi-times" data-pr-tooltip="Cancelar"></i>
                    </button>

                    <button className="btn btn-primary"
                        onClick={e => props.editAction(lancamento.id)}
                        type='button'>
                        <i className="pi pi-pencil" data-pr-tooltip='Editar'></i>
                    </button>

                    <button className="btn btn-danger"
                        onClick={e => props.deleteAction(lancamento)}
                        type='button'>
                        <i className="pi pi-trash" data-pr-tooltip='Excluir'></i>
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <table className='table table-hover'>
            <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}