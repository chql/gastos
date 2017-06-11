<?php namespace Validacao;

use \Aura\Input\Form;
use \Aura\Input\Builder;
use \Aura\Input\Filter;

class ValidaLocal extends Form
{
    public function __construct()
    {
        parent::__construct(new Builder, new Filter);

        $this->setField('nome');

        $filter = $this->getFilter();

        $filter->setRule(
            'nome',
            'Nome inválido para local',
            function($nome) {
                return is_string($nome);
            }
        );
    }
}

