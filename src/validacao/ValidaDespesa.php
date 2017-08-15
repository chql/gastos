<?php namespace Validacao;

use \Aura\Input\Form;
use \Aura\Input\Builder;
use \Aura\Input\Filter;

class ValidaDespesa extends Form
{
    public function __construct()
    {
        parent::__construct(new Builder, new Filter);

        $this->setField('origem');
        $this->setField('local');
        // $this->setField('repeticao');
        $this->setField('data');
        // $this->setField('valor');

        $filter = $this->getFilter();

        $filter->setRule(
            'origem',
            'Origem inválida.',
            function($origem) {
                return is_string($origem);
            }
        );

        $filter->setRule(
            'local',
            'Local inválido.',
            function($local) {
                return is_string($local);
            }
        );

        /*
        $filter->setRule(
            'repeticao',
            'Tipo inválido para repetição.',
            function($tipo) {
                $tipos = ['variavel','dia','semana','quinzena','mes','ano'];
                return in_array($tipo, $tipos);
            }
        );
        */

        $filter->setRule(
            'data',
            'Formato inválido para data.',
            function($data) {
                return strlen($data) == 10 and
                    (date_create_from_format("Y-m-d", $data) !== FALSE);
            }
        );
    }
}

