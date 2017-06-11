<?php namespace Core;

/**
 * Garante que uma sessao foi iniciada para a solicitacao
 * e assegura que existe um 'login' associado a essa sessao.
 * Retorna status 403 (Forbidden) caso uma das condicoes nao
 * for satisfeita.
 */
class AutenticacaoMiddleware
{
    /**
     * Singleton instance
     */
    private static $_instance = null;

    /**
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \Psr\Http\message\ResponseInterface      $response
     * @param callable                                 $next
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function __invoke($request, $response, $next)
    {
        if(session_status() !== PHP_SESSION_ACTIVE OR 
            isset($_SESSION['login']) === FALSE) {
            return $response->withJson([
                'erro' => true,
                'erros' => [
                    'autenticacao' => ['Sessao nao encontrada']
                ]
            ])->withStatus(403);
        }

        $response = $next($request, $response);

        return $response;
    }

    /**
     * Obtem a instancia do Middleware
     *
     * @return \Core\AutenticacaoMiddleware
     */
    public static function getInstance()
    {
        if(self::$_instance === null)
            self::$_instance = new static;
        return self::$_instance;
    }
}

