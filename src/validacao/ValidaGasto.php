<?php namespace Validacao;

use \Aura\Input\Form;
use \Aura\Input\Builder;
use \Aura\Input\Filter;

class ValidaGasto extends Form
{
    public function __construct()
    {
        parent::__construct(new Builder, new Filter);

        $this->setField('descricao');
        $this->setField('tipo');
        $this->setField('categoria');
        $this->setField('preco');
        $this->setField('local');
        $this->setField('adesao');

        $filter = $this->getFilter();

        $filter->setRule(
            'descricao',
            'Descrição deve ser texto.',
            function($descricao) {
                return is_string($descricao);
            }
        );

        $filter->setRule(
            'tipo',
            'Tipo deve ser receita ou despesa.',
            function($tipo) {
                return in_array($tipo, ['receita','despesa']);
            }
        );

        $filter->setRule(
            'categoria',
            'Categoria deve ser texto.',
            function($categoria) {
                return is_string($categoria);
            }
        );

        $filter->setRule(
            'preco',
            'Preço deve ser valor numérico.',
            function($preco) {
                return is_int($preco) OR is_float($preco);
            }
        );

        $filter->setRule(
            'local',
            'Local deve ser texto.',
            function($local) {
                return is_string($local);
            }
        );

        $filter->setRule(
            'adesao',
            'Adesao deve ser fixa, mensal ou variável.',
            function($adesao) {
                return in_array($adesao, ['fixa','mensal','variavel']);
            }
        );
    }
}

