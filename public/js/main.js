const SERVER = "http://localhost:8000/api/";
var app = angular.module('cuga', ['ngRoute', 'ngCookies']);
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

app.controller('home', function ($scope, $route, $location, $cookies) {
    if($cookies.get("PHPSESSID") === undefined){
        $location.path('/login');
    }
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

app.controller('upReceita', function ($scope, $location, $http, $routeParams, $cookies) {
    if($cookies.get("PHPSESSID") === undefined){
        $location.path('/login');
    }
    $http.get(SERVER + "receitas/" + $routeParams.id).then(
        function (response) {
            //console.log(response);
            if(!response.data['erro']){
                $scope.origem = response.data['receita'].origem;
                $scope.valor = response.data['receita'].valor;
                var d = new Date(response.data['receita'].data);
                d.setMinutes(d.getTimezoneOffset());
                $scope.data = d;
                $scope.repeticao = response.data['receita'].repeticao;
            }
        }
    );

    $scope.upReceita = function () {
        var form = {
            origem: $scope.origem,
            repeticao: $scope.repeticao,
            valor: $scope.valor,
            data: $scope.data.toISOString().substring(0,10)
        };
        //console.log(form);
        $http.put(SERVER + "receitas/" + $routeParams.id, form).then(
            function (response) {
                if(!response.data['erro'])
                    alert("Receita atualizada com sucesso!");
                else
                    alert("Não foi possível atualizar a receita");
            }
        );
    }
});

app.controller('verReceitas', function ($scope, $route, $http, $location, $cookies) {
    if($cookies.get("PHPSESSID") === undefined){
        $location.path('/login');
    }
    $http.get(SERVER + "receitas").then(
        function (response) {
            //console.log(response);
            if(!response.data['erro'])
                $scope.dados = response.data['receitas'];
        },
        function (response) {
            //console.log(response);
        }
    );
    $scope.remove = function (id) {
        //console.log("Remove o " + id);
        var ans = confirm("Tem certeza que deseja excluir este registro?");
        if(ans){
            $http.delete(SERVER + "receitas/" + id).then(
                function (response) {
                    if(!response.data['erro'])
                        alert("Registro excluido com sucesso!");
                    else
                        alert("Não foi possivel excluir o registro");
                },
                function () {
                    alert("Não foi possivel excluir o registro");
                }
            );
            $route.reload();
        }
    };
    $scope.edit = function (id) {
        //console.log("Edita o " + id);
        $location.path("/verReceitas/" + id);
    }
});

app.controller('cadReceitas', function ($scope, $route, $location, $http, $cookies) {
    if($cookies.get("PHPSESSID") === undefined){
        $location.path('/login');
    }
    $scope.cadReceita = function () {
        var dados = {
            origem: $scope.origem,
            repeticao: $scope.repeticao,
            valor: $scope.valor,
            data: $scope.data.toISOString().substring(0,10)
        };
        //console.log(dados);
        $http.post(SERVER + "receitas", dados).then(
            function (result) {
                //console.log(result);
                if (result.data['erro']) {
                    alert("Não foi possível realizar a operacão");
                }
                else{
                    alert("Receita armazenada com sucesso");
                    $location.path("/home");
                }
            },
            function (result) {
                //console.log(result);
                alert("Não foi possível realizar a operação");
            }
        )
    };
});

app.controller('upDespesa', function ($scope, $route, $routeParams, $location, $http, $cookies) {
    if($cookies.get("PHPSESSID") === undefined){
        $location.path('/login');
    }
    $scope.itens = [];
    $http.get(SERVER + "despesas/" + $routeParams.id).then(
        function (result) {
            //console.log(result);
            if(!result.data['erro']) {
                $scope.origem = result.data['despesa'].origem;
                $scope.local = result.data['despesa'].local;
                $scope.total = result.data['despesa'].total;
                var d = new Date(result.data['despesa'].data);
                d.setMinutes(d.getTimezoneOffset());
                $scope.data = d;
                $scope.repeticao = result.data['despesa'].repeticao;
                $scope.itens = result.data['despesa'].itens;
            }
        },
        function (result) {
            //console.log(result);
        }
    );
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
        for(var i in $scope.itens){
            c += parseFloat($scope.itens[i]['valort']);
        }
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
        //console.log(form);
        $http.put(SERVER + "despesas/" + $routeParams.id, form).then(
            function (result) {
                if (result.data['erro']) {
                    alert("Não foi possível realizar a operacão");
                }
                else{
                    alert("Despesa atualizada com sucesso");
                    $location.path("/home");
                }
            },
            function () {
                alert("Não foi possível realizar a operação");
            }
        )
    };
    
});

app.controller('verDespesas', function ($scope, $route, $location, $http, $cookies) {
    if($cookies.get("PHPSESSID") === undefined){
        $location.path('/login');
    }
    $http.get(SERVER + "despesas").then(
        function (response) {
            if(!response.data['erro']) {
                $scope.dados = response.data['despesas'];
                $scope.itens = $scope.dados['itens'];
                //console.log($scope.dados);
                for(var i in $scope.dados){
                    $scope.dados[i]['_id'] = "i" + $scope.dados[i]['_id'];
                }
            }
        },
        function (response) {
            //console.log(response);
        }
    );
    $scope.remove = function (id) {
        //console.log("Remove o " + id);
        var ans = confirm("Tem certeza que deseja excluir este registro?");
        if(ans){
            $http.delete(SERVER + "despesas/" + id.substring(1, id.length)).then(
                function (response) {
                    if(!response.data['erro'])
                        alert("Registro excluido com sucesso!");
                    else
                        alert("Não foi possivel excluir o registro");
                },
                function () {
                    alert("Não foi possivel excluir o registro");
                }
            );
            $route.reload();
        }
    };
    $scope.edit = function (id) {
        //console.log("Edita o " + id.substring(1, id.length));
        $location.path("/verDespesas/" + id.substring(1, id.length));
    };
    $(document).ready(function(){
        $('.modal').modal();
    });
});

app.controller('cadDespesas', function ($scope, $route, $location, $http, $cookies) {
    if($cookies.get("PHPSESSID") === undefined){
        $location.path('/login');
    }
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
        //console.log(form);
        $http.post(SERVER + "despesas", form).then(
            function (result) {
                //console.log(result);
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

app.controller('main', function ($scope, $route, $location, $cookies) {
    $scope.logado = $cookies.get("PHPSESSID") !== undefined;
    $scope.home = function (){
        if($scope.logado)
            $location.path("/home");
        else
            $location.path("/");
    };
    $scope.login = function (){
        $location.path("/login");
    };
    $scope.cadastro = function (){
        $location.path("/usuario");
    };
    $scope.logout = function () {
        $cookies.remove("PHPSESSID");
        $scope.logado = false;
        $scope.home();
    };
    $(document).ready(function(){
        $('.slider').slider();
    });
});

app.controller('usuarios', function ($http, $scope, $route, $location, $cookies, $templateCache) {
    if($cookies.get("PHPSESSID") === undefined){
        $location.path('/login');
    }
    else{
        $location.path('/home');
    }
    $scope.cadUser = function () {
        var user = {
            "nome": $scope.nome,
            "login": $scope.username,
            "senha": $scope.senha
        };
        $http.post(SERVER + "usuarios", user).then(
            function (result) {
                //console.log(result);
                if(result.data['erro']){
                    alert("Não foi possível cadastrar o usuário");
                    $route.reload();
                }
                else{
                    alert("Usuário cadastrado com sucesso");
                    $location.path('/login');
                }
            },
            function () {
                alert("Não foi possível cadastrar o usuário");
                $route.reload();
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
                }
                else{
                    location.reload();
                }
            },
            function () {
                alert("Não foi possível fazer o login");
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
