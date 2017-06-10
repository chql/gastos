const SERVER = "http://localhost:8000/api/";
var LOGADO = false;
var app = angular.module('cuga', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../views/main.html",
            controller: 'main'
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
            controller: 'cadReceitas'
        })
        .when("/novaDespesa", {
            templateUrl: "../views/despesas/novaDespesa.html",
            controller: 'cadDespesas'
        })
        .when("/verReceitas", {
            templateUrl: "../views/receitas/verReceitas.html",
            controller: 'verReceitas'
        })
        .when("/verDespesas", {
            templateUrl: "../views/despesas/verDespesas.html",
            controller: 'verDespesas'
        })
        .when("/verReceitas/:id/", {
            templateUrl: "../views/receitas/verReceita.html",
            controller: 'upReceita'
        })
        .when("/verDespesas/:id/", {
            templateUrl: "../views/despesas/verDespesa.html",
            controller: 'upDespesa'
        });
});

app.controller('home', function ($scope, $route, $location) {
    $scope.pessoa = "Fulano";
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
});

app.controller('upReceita', function ($scope, $location, $http, $routeParams) {
    var dados = [
        {id: "123", origem: "asd123", valor: 245.45, data: "2017-06-30", repeticao: "dia"},
        {id: "456", origem: "asd456", valor: 246.45, data: "2017-06-30", repeticao: "dia"},
        {id: "789", origem: "asd789", valor: 246.45, data: "2017-06-10", repeticao: "dia"},
        {id: "000", origem: "asd000", valor: 246.45, data: "2017-06-10", repeticao: "dia"}
    ];
    // TODO: RECEBER DADOS DA API
    for(var i = 0; i<dados.length; i++){
        if(dados[i]['id'] === $routeParams.id){
            console.log(dados[i]);
            $scope.origem = dados[i].origem;
            $scope.valor = dados[i].valor;
            var d = new Date(dados[i].data);
            d.setMinutes(d.getTimezoneOffset());
            $scope.data = d;
            $scope.repeticao = "dia";
        }
    }
    $scope.upReceita = function () {
        var form = {
            id: $routeParams.id,
            origem: $scope.origem,
            repeticao: $scope.repeticao,
            valor: $scope.valor,
            data: $scope.data.toISOString().substring(0,10)
        };
        console.log(form);
        // TODO: ENVIAR PARA A API
    }
});

app.controller('verReceitas', function ($scope, $route, $http, $location) {
    $scope.dados = [
        {id: "123", origem: "asd123", valor: 245.45, data: "2017-06-10", repeticao: "dia"},
        {id: "456", origem: "asd456", valor: 246.45, data: "2017-06-10", repeticao: "dia"},
        {id: "789", origem: "asd789", valor: 246.45, data: "2017-06-10", repeticao: "dia"},
        {id: "000", origem: "asd000", valor: 246.45, data: "2017-06-10", repeticao: "dia"}
    ]; //TODO: RECEBER RECEITAS DA API
    $scope.remove = function (id) {
        console.log("Remove o " + id);
        var ans = confirm("Tem certeza que deseja excluir este registro?");
        if(ans){
            for(var i = 0; i<$scope.dados.length; i++){
                if($scope.dados[i]['id'] === id){
                    $scope.dados.splice(i, 1);
                }
            }
        }// TODO: REMOVER COM A API
    };
    $scope.edit = function (id) {
        console.log("Edita o " + id);
        $location.path("/verReceitas/" + id);
    }
});

app.controller('cadReceitas', function ($scope, $route, $location, $http) {
    $scope.cadReceita = function () {
        var dados = {
            origem: $scope.origem,
            repeticao: $scope.repeticao,
            valor: $scope.valor,
            data: $scope.data.toISOString().substring(0,10)
        };
        console.log(dados);
        //TODO: CONFERIR ENDPOINT
        $http.post(SERVER + "receitas", dados).then(
            function (result) {
                if (result.data['erro']) {
                    alert("Não foi possível realizar a operacão");
                }
                else{
                    alert("Receita armazenada com sucesso");
                    $location.path("/home");
                }
            },
            function () {
                alert("Não foi possível realizar a operação");
            }
        )
    };
});

app.controller('upDespesa', function ($scope, $route, $routeParams, $location, $http) {
    var dados = [
        {
            id: 1,
            origem: "Sao Luiz",
            local: "Crato",
            repeticao: "dia",
            data: "2017-06-10",
            itens: [
                {id: "1", descricao: "Leite", quantidade: 1, valor: 3.99, valort: "3.99"},
                {id: "2", descricao: "Pao", quantidade: 5, valor: 1, valort: "5.00"}
            ],
            total: "8.99"
        },
        {
            id: 2,
            origem: "Sao Luiz",
            local: "Crato",
            repeticao: "mes",
            data: "2017-06-18",
            itens: [
                {id: "1", descricao: "Leite", quantidade: 1, valor: 3.99, valort: "3.99"},
                {id: "2", descricao: "Pao", quantidade: 5, valor: 1, valort: "5.00"}
            ],
            total: "8.99"
        }
    ];
    for(var i = 0; i<dados.length; i++){
        if(dados[i]['id'] == $routeParams.id){
            console.log(dados[i]);
            $scope.origem = dados[i].origem;
            $scope.local = dados[i].local;
            $scope.total = dados[i].total;
            var d = new Date(dados[i].data);
            d.setMinutes(d.getTimezoneOffset());
            $scope.data = d;
            $scope.repeticao = dados[i].repeticao;
            $scope.itens =  dados[i].itens;
        }
    }

    $scope.newItem = function () {
        $scope.itens.push({id: ($scope.itens.length+1).toString(), descricao: "", quantidade: "", valor: "", valort: ""});
    };
    $scope.remItem = function () {
        if($scope.itens.length > 1)
            $scope.itens.splice($scope.itens.length - 1);
        else
            alert("Deve haver pelo menos um item");
    };
    $scope.ftotal = function () {
        var c = 0;
        $scope.itens.forEach(function (v) {
            c += parseFloat(v.valort);
        });
        $scope.total = c.toFixed(2);
    };
    $scope.upDespesa = function () {
        var form = {
            origem: $scope.origem,
            local: $scope.local,
            repeticao: $scope.repeticao,
            data: $scope.data.toISOString().substring(0,10),
            itens: $scope.itens,
            total: $scope.total
        };
        console.log(form);
        //TODO: CONFERIR ENDPOINT
        $http.post(SERVER + "despesas", form).then(
            function (result) {
                if (result.data['erro']) {
                    alert("Não foi possível realizar a operacão");
                }
                else{
                    alert("Despesa armazenada com sucesso");
                    $location.path("/home");
                }
            },
            function () {
                alert("Não foi possível realizar a operação");
            }
        )
    };
    
});

app.controller('verDespesas', function ($scope, $route, $location, $http) {
    $(document).ready(function(){
        // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
    });
    $scope.dados = [
        {
            id: 1,
            origem: "Sao Luiz",
            local: "Crato",
            repeticao: "dia",
            data: "2017-06-10",
            itens: [
                {id: "1", descricao: "Leite", quantidade: 1, valor: 3.99, valort: "3.99"},
                {id: "2", descricao: "Pao", quantidade: 5, valor: 1, valort: "5.00"}
                ],
            total: "8.99"
        },
        {
            id: 2,
            origem: "Sao Luiz",
            local: "Crato",
            repeticao: "mes",
            data: "2017-06-18",
            itens: [
                {id: "1", descricao: "Leite", quantidade: 1, valor: 3.99, valort: "3.99"},
                {id: "2", descricao: "Pao", quantidade: 5, valor: 1, valort: "5.00"}
            ],
            total: "8.99"
        }
    ];
    $scope.remove = function (id) {
        console.log("Remove o " + id);
        var ans = confirm("Tem certeza que deseja excluir este registro?");
        if(ans){
            for(var i = 0; i<$scope.dados.length; i++){
                if($scope.dados[i]['id'] === id){
                    $scope.dados.splice(i, 1);
                }
            }
        }// TODO: REMOVER COM A API
    };
    $scope.edit = function (id) {
        console.log("Edita o " + id);
        $location.path("/verDespesas/" + id);
    }
});

app.controller('cadDespesas', function ($scope, $route, $location, $http) {
    $scope.itens = [{id: "1", descricao: "", quantidade: 1, valor: 0, valort: ""}];
    $scope.total = 0.0;
    $scope.newItem = function () {
        $scope.itens.push({id: ($scope.itens.length+1).toString(), descricao: "", quantidade: "", valor: "", valort: ""});
    };
    $scope.remItem = function () {
        if($scope.itens.length > 1)
            $scope.itens.splice($scope.itens.length - 1);
        else
            alert("Deve haver pelo menos um item");
    };
    $scope.ftotal = function () {
        var c = 0;
        $scope.itens.forEach(function (v) {
            c += parseFloat(v.valort);
        });
        $scope.total = c.toFixed(2);
    };
    $scope.cadDespesa = function () {
        var form = {
            origem: $scope.origem,
            local: $scope.local,
            repeticao: $scope.repeticao,
            data: $scope.data.toISOString().substring(0,10),
            itens: $scope.itens,
            total: $scope.total
        };
        console.log(form);
        //TODO: CONFERIR ENDPOINT
        $http.post(SERVER + "despesas", form).then(
            function (result) {
                if (result.data['erro']) {
                    alert("Não foi possível realizar a operacão");
                }
                else{
                    alert("Despesa armazenada com sucesso");
                    $location.path("/home");
                }
            },
            function () {
                alert("Não foi possível realizar a operação");
            }
        )
    };
});

app.controller('main', function ($scope, $route, $location) {
    if (LOGADO === false)
        $scope.logado = true;
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
    $(document).ready(function(){
        $('.slider').slider();
    });

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
