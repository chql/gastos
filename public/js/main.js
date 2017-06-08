const SERVER = "http://localhost:8000/api/";
var LOGADO = false;
var app = angular.module('cuga', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../views/main.html",
            controller: 'main'
        })
        .when("/nova",{
            templateUrl: "../views/nova_transacao.html",
            controller: 'novaTransacao'
        })
        .when("/transacoes",{
            templateUrl: "../views/transacoes.html",
            controller: 'verTransacoes'
        })
        .when("/transacao/:id", {
            templateUrl: "../views/transacao.html",
            controller: 'modTransacao'
        })
        .when("/usuario",{
            templateUrl: "../views/cadastroUsuario.html",
            controller: 'usuarios'
        })
        .when("/login", {
            templateUrl: "../views/login.html",
            controller: 'usuarios'
        })
        .when("/home", {
            templateUrl: "../views/home.html",
            controller: 'home'
        })
        .when("/novaReceita", {
            templateUrl: "../views/receitas/novaReceita.html",
            controller: 'home'
        })
        .when("/novaDespesa", {
            templateUrl: "../views/despesas/novaDespesa.html",
            controller: 'home'
        })
        .when("/verReceitas", {
            templateUrl: "../views/receitas/verReceitas.html",
            controller: 'home'
        })
        .when("/verDespesas", {
            templateUrl: "../views/despesas/verDespesas.html",
            controller: 'home'
        });
});

app.controller('home', function ($scope, $route, $location) {
    $scope.pessoa = "Fulano";
    $scope.logado = true;
    $scope.verDespesas = function () {
        $location.path("/verDespesas")
    };
    $scope.verReceitas = function () {
        $location.path("/verReceitas")
    };
    $scope.novaDespesa = function () {
        $location.path("/novaDespesa")
    };
    $scope.novaReceita = function () {
        $location.path("/novaReceita")
    };
    $(document).ready(function() {
        $('select').material_select();
    });
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        format: 'dd-mm-yyyy'
    });

});

app.controller('receitas', function ($scope, $route, $location) {

});

app.controller('main', function ($scope, $route, $location) {
    if (LOGADO === false)
        $scope.logado = false;
    $scope.home = function (){
        $location.path("/");
    };
    $scope.login = function (){
        $location.path("/login");
    };
    $scope.cadastro = function (){
        $location.path("/usuario");
    };
    $('.carousel.carousel-slider').carousel({fullWidth: true});
});

app.controller('corpo', function($scope, $route, $routeParams, $location) {
    if(!LOGADO)
        $location.path("/login");
    $scope.newTrans = function (){
        $location.path("/nova");
    };
    $scope.showTrans = function () {
        $location.path("/transacoes")
    }
});

app.controller('novaTransacao', function($scope, $route, $routeParams, $location, $http) {
    $scope.ch_adesao = false;
    if(!LOGADO)
        $location.path("/login");
    $scope.$watch('adesao', function() {
        $scope.ch_adesao = $scope.adesao === 'fixa';
    });
    $scope.valida = function () {
        var form = {
            "descricao": $scope.descricao,
            "tipo": $scope.tipo,
            "categoria": $scope.categoria,
            "preco": parseFloat($scope.valor),
            "local": $scope.local,
            "adesao": $scope.adesao,
            "repeticao": $scope.repeticao
        };
        console.log(form);
        $http.put(SERVER + 'gastos', form).then(
            function (result) {
                if(result.data['erro']){
                    alert("Não foi possivel registrar a transação");
                    var erros = result.data['erros'];
                    for(var key in erros){
                        alert("ERRO: " + key + ": " + erros[key]);
                    }
                }
                else{
                    alert("Transação registrada com sucesso");
                    $route.reload();
                }
                //console.log(result.data);
            },
            function (result) {
                alert("Houve uma falha durante o processamento");
                //console.log(result.data);
            }
        );
    }
});

app.controller('verTransacoes', function ($scope, $route, $http, $location) {
    if(!LOGADO)
        $location.path("/login");
    $http.get(SERVER + 'gastos').then(
        function (result) {
            if(!result.data['erro']){
                $scope.existeTran = true;
                $scope.transacoes = result.data['gasto'];
                console.log($scope.transacoes);
            }
        },
        function (result) {
            $scope.existeTran = false;
            alert("Não foi possível consultar as transações");
        }
    );
    $scope.modTrans = function (id) {
        $location.path("transacao/" + id);
    };
    $scope.remTrans = function (id) {
        $http.delete(SERVER + 'gastos/' + id).then(
            function (result) {
                if(result.data['erro'])
                    alert("Não foi possível remover a transação");
                else {
                    alert("Transação removida com sucesso!");
                    $route.reload();
                }
            }
        );
    }
});

app.controller('modTransacao', function ($scope, $http, $route, $routeParams, $location) {
    if(!LOGADO)
        $location.path("/login");
    var id = $routeParams.id;
    $http.get(SERVER + 'gastos/' + id).then(
        function (result) {
            if(!result.data['erro']){
                $scope.existeTran = true;
                $scope.id = result.data['gasto']['id'];
                $scope.descricao = result.data['gasto']['descricao'];
                $scope.categoria = result.data['gasto']['categoria'];
                $scope.valor = result.data['gasto']['preco'];
                $scope.tipo = result.data['gasto']['tipo'];
                $scope.local = result.data['gasto']['local'];
                $scope.adesao = result.data['gasto']['adesao'];
                $scope.repeticao = result.data['gasto']['repeticao'];
                $scope.ch_adesao = result.data['gasto']['adesao'] === 'fixa';
            }
        },
        function (result) {
            $scope.ch_adesao = false;
            $scope.existeTran = false;
            alert("Houve um erro no processamento da requisição")
        }
    );
    decimal();
    $scope.$watch('adesao', function() {
        $scope.ch_adesao = $scope.adesao === 'fixa';
    });
    $scope.valida = function () {
        var form = {
            "id": $scope.id,
            "descricao": $scope.descricao,
            "tipo": $scope.tipo,
            "categoria": $scope.categoria,
            "preco": parseFloat($scope.valor),
            "local": $scope.local,
            "adesao": $scope.adesao,
            "repeticao": $scope.repeticao
        };
        //console.log(form);
        $http.put(SERVER + 'gastos', form).then(
            function (result) {
                if(result.data['erro']){
                    alert("Não foi possivel registrar a transação");
                    var erros = result.data['erros'];
                    for(var key in erros){
                        alert("ERRO: " + key + ": " + erros[key]);
                    }
                }
                else{
                    alert("Transação registrada com sucesso");
                    $route.reload();
                }
                //console.log(result.data);
            },
            function (result) {
                alert("Houve uma falha durante o processamento");
                //console.log(result.data);
            }
        );
    }
});

app.controller('usuarios', function ($http, $scope, $route, $location) {
    $scope.cadUser = function () {
        var user = {
            "login": $scope.username,
            "senha": $scope.senha
        };
        $http.put(SERVER + "usuarios", user).then(
            function (result) {
                if(result.data['erro']){
                    alert("Não foi possível cadastrar o usuário");
                    $location.reload();
                }
                else{
                    alert("Usuário cadastrado com sucesso");
                    $location.path('/login');
                }
            },
            function () {
                alert("Não foi possível cadastrar o usuário");
                $location.reload();
            }
        )

    };
    $scope.login = function () {
        var user = {
            "login": $scope.username,
            "senha": $scope.senha
        };
        $http.post(SERVER + "usuarios/login", user).then(
            function (result) {
                if (result.data['erro']){
                    alert("Não foi possível fazer o login");
                    $location.reload();
                }
                else{
                    LOGADO = true;
                    $location.path('/home');
                }
            },
            function () {
                alert("Não foi possível fazer o login");
                $location.reload();
            }
        )
    }
});

var decimal = function () {
    var v = document.getElementById('valor');
    var x = parseFloat(v.value);
    if(isNaN(x))
        v.value = "";
    else
        v.value = x.toFixed(2);
};

