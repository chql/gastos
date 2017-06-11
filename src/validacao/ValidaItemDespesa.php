<?php namespace Validacao;

use \Aura\Input\Form;
use \Aura\Input\Builder;
use \Aura\Input\Filter;

class ValidaItemDespesa extends Form
{
    public function __construct()
    {
        parent::__construct(new Builder, new Filter);

        $this->setField('descricao');
        $this->setField('valor');
        $this->setField('quantidade');

        $filter = $this->getFilter();

        $filter->setRule(
            'descricao',
            'Tipo inválido para descrição de item.',
            function($descricao) {
                return is_string($descricao);
            }
        );

        $filter->setRule(
            'valor',
            'Tipo inválido para valor de item.',
            function($valor) {
                return is_int($valor) or is_float($valor);
            }
        );

        $filter->setRule(
            'quantidade',
            'Tipo inválido para quantidade de item.',
            function($quantidade) {
                return is_int($quantidade);
            }
        );
    }
}
