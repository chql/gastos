<?php namespace Validacao;

use \Aura\Input\Form;
use \Aura\Input\Builder;
use \Aura\Input\Filter;

class ValidaUsuario extends Form
{
    public function __construct()
    {
        parent::__construct(new Builder, new Filter);

        $this->setField('login');
        $this->setField('senha');

        $filter = $this->getFilter();

        $filter->setRule(
            'login',
            'Login inválido.',
            function($login) use ($filter) {
                $pass = true;
                if(is_string($login) === false)
                    return false;
                if(strlen($login) < 4) {
                    $filter->addMessages('login', 'Login deve conter pelo menos 4 caracteres.');
                    $pass = false;
                }
                return $pass;
            }
        );

        $filter->setRule(
            'senha',
            'Senha inválida.',
            function($senha) {
                $pass = true;
                if(is_string($senha) === false)
                    return false;
                if(strlen($senha) < 4) {
                    $filter->addMessages('senha', 'Senha deve conter pelo menos 4 caracteres.');
                    $pass = false;
                }
                return $pass;
            }
        );
    }
}
