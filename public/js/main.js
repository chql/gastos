const SERVER = "/api/";
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


app.controller('footer', function ($scope, $http, $cookies) {
    var entradas, saidas;
    var getDespesas = function () {
        $http.get(SERVER + "buscas/despesas", {
            params: {
                inicio: data + "01",
                final: data + "31"
            }
        }).then(function (response) {
            if (!response.data['erro']) {
                var desp = response.data['despesas'];
                saidas = 0.0;
                desp.forEach(function (d) {
                    saidas += parseFloat(d.total);
                });
                getReceitas();
            }
        });
    };
    var getReceitas = function () {
        $http.get(SERVER + "buscas/receitas", {
            params: {
                inicio: data + "01",
                final: data + "31"
            }
        }).then(function (response) {
            if(!response.data['erro']){
                var rece = response.data['receitas'];
                entradas = 0.0;
                rece.forEach(function (d) {
                    entradas += parseFloat(d.valor);
                });
                setBal(entradas-saidas);
            }
        });
    };
    var setBal = function (value) {
        $scope.balanco = "Saldo: R$ " + value.toFixed(2);
    };
    if($cookies.get("CUGALogin") !== undefined){
        var data = new Date().toISOString().substring(0,8);
        $scope.referencia = "Referência: " + data.split("-")[1] + "/" + data.split("-")[0];
        getDespesas();
    }
    $scope.$on("updateFooter", function (event) {
        console.log(event);
        getDespesas();
    });
});

app.controller('home', function ($scope, $route, $location, $cookies) {
    if($cookies.get("CUGALogin") === undefined){
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
    if($cookies.get("CUGALogin") === undefined){
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
                if(!response.data['erro']){
                    alert("Receita atualizada com sucesso!");
                    $location.path("/verReceitas");
                }
                else
                    alert("Não foi possível atualizar a receita");
            }
        );
    };
});

app.controller('verReceitas', function ($scope, $route, $http, $location, $cookies, $rootScope) {
    if($cookies.get("CUGALogin") === undefined){
        $location.path('/login');
    }
    $http.get(SERVER + "buscas/receitas", {
        params: {
            inicio: new Date().toISOString().substring(0,8)+"01",
            final: new Date().toISOString().substring(0,8)+"31"
        }
    }).then(
        function (response) {
            //console.log(response);
            if(!response.data['erro']){
                var v = 0.0;
                $scope.dados = response.data['receitas'];
                $scope.dados.reverse();
                for(var i in $scope.dados) {
                    var dd = $scope.dados[i]['data'].split("-");
                    $scope.dados[i]['data'] = dd[2] + "/" + dd[1] + "/" + dd[0];
                    v += parseFloat($scope.dados[i]['valor']);
                    $scope.dados[i]['valor'] = "R$ " + $scope.dados[i]['valor'];
                }
                $scope.soma = "R$ " + v.toFixed(2);
                var d = new Date().toISOString().substring(0,8).split("-");
                $scope.referencia = d[1] + "/" + d[0];
            }
        },
        function (response) {
            //console.log(response);
        }
    );
    $rootScope.$broadcast("updateFooter");
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
    };
    $scope.newItem = function () {
        $location.path("/novaReceita");
    }
});

app.controller('cadReceitas', function ($scope, $route, $location, $http, $cookies) {
    if($cookies.get("CUGALogin") === undefined){
        $location.path('/login');
    }
    $scope.data = new Date();
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
                    $location.path("/verReceitas");
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
    if($cookies.get("CUGALogin") === undefined){
        $location.path('/login');
    }
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
               //console.log($scope.itens);
            }
        },
        function (result) {
            //console.log(result);
        }
    );
    $scope.newItem = function () {
        $scope.itens.unshift({id: ($scope.itens.length+1).toString(), descricao: "", quantidade: "", valor: "", valort: ""});
    };
    $scope.remItem = function () {
        if($scope.itens.length > 1) {
            $scope.itens.splice(0,1);
            $scope.ftotal();
        }
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
                    $location.path("/verDespesas");
                }
            },
            function () {
                alert("Não foi possível realizar a operação");
            }
        )
    };
    var locais = {};
    var cidades = {};
    $http.get(SERVER + "sugestoes/locais").then(
        function (response) {
            if(!response.data['erro']){
                for(var v in response.data.locais){
                    locais[response.data.locais[v]] = null;
                }
               //console.log(locais);
            }
        }
    );
    $http.get(SERVER + "sugestoes/cidades").then(
        function (response) {
            if(!response.data['erro']){
               //console.log(response.data);
                for(var v in response.data.cidades){
                    cidades[response.data.cidades[v]] = null;
                }
               //console.log(cidades);
            }
        }
    );
    $scope.load = function () {
        $('#origem').autocomplete({
            data: locais,
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                $scope.origem = val;
            },
            minLength: 0 // The minimum length of the input for the autocomplete to start. Default: 1.
        });
        $('#local').autocomplete({
            data: cidades,
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                $scope.local = val;
            },
            minLength: 0 // The minimum length of the input for the autocomplete to start. Default: 1.
        });
    };
});

app.controller('verDespesas', function ($scope, $route, $location, $http, $cookies, $rootScope) {
    if($cookies.get("CUGALogin") === undefined){
        $location.path('/login');
    }
    $http.get(SERVER + "buscas/despesas", {
        params: {
            inicio: new Date().toISOString().substring(0,8)+"01",
            final: new Date().toISOString().substring(0,8)+"31"
        }
    }).then(
        function (response) {
            if(!response.data['erro']) {
                var v = 0.0;
                var d = new Date().toISOString().substring(0,8).split("-");
                $scope.referencia = d[1] + "/" + d[0];
                $scope.dados = response.data['despesas'];
                $scope.dados.reverse();
                $scope.itens = $scope.dados['itens'];
                //console.log($scope.dados);
                for(var i in $scope.dados){
                    v += parseFloat($scope.dados[i]['total']);
                    $scope.dados[i]['_id'] = "i" + $scope.dados[i]['_id'];
                    var dd = $scope.dados[i]['data'].split("-");
                    $scope.dados[i]['data'] = dd[2] + "/" + dd[1] + "/" + dd[0];
                    $scope.dados[i]['total'] = "R$ " + $scope.dados[i]['total'];
                }
                $scope.soma = "R$ " + v.toFixed(2);
            }
        },
        function (response) {
            //console.log(response);
        }
    );
    $rootScope.$broadcast("updateFooter");
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
    $scope.modal = function () {
        $(document).ready(function(){
            $('.modal').modal();
        });
    };
    $scope.newItem = function () {
        $location.path("/novaDespesa");
    };
});

app.controller('cadDespesas', function ($scope, $route, $location, $http, $cookies) {
    if($cookies.get("CUGALogin") === undefined){
        $location.path('/login');
    }
    $scope.itens = [{id: "1", descricao: "", quantidade: 1, valor: "", valort: ""}];
    $scope.total = 0.0;
    $scope.data = new Date();
    $scope.newItem = function () {
        $scope.itens.unshift({id: ($scope.itens.length+1).toString(), descricao: "", quantidade: "", valor: "", valort: ""});
    };
    $scope.remItem = function () {
        if($scope.itens.length > 1)
            $scope.itens.splice(0,1);
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
        $http.post(SERVER + "despesas", form).then(
            function (result) {
                //console.log(result);
                if (result.data['erro']) {
                    alert("Não foi possível realizar a operacão");
                }
                else{
                    alert("Despesa armazenada com sucesso");
                    $location.path("/verDespesas");
                }
            },
            function () {
                alert("Não foi possível realizar a operação");
            }
        )
    };
    var locais = {};
    var cidades = {};
    $http.get(SERVER + "sugestoes/locais").then(
        function (response) {
            if(!response.data['erro']){
                for(var v in response.data.locais){
                    locais[response.data.locais[v]] = null;
                }
               //console.log(locais);
            }
        }
    );
    $http.get(SERVER + "sugestoes/cidades").then(
        function (response) {
            if(!response.data['erro']){
               //console.log(response.data);
                $scope.local = response.data.cidades.length === 0 ? "" : response.data.cidades[response.data.cidades.length-1];
                for(var v in response.data.cidades){
                    cidades[response.data.cidades[v]] = null;
                }
               //console.log(cidades);
            }
        }
    );
    $scope.load = function () {
        $('#origem').autocomplete({
            data: locais,
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                $scope.origem = val;
            },
            minLength: 0 // The minimum length of the input for the autocomplete to start. Default: 1.
        });
        $('#local').autocomplete({
            data: cidades,
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                $scope.local = val;
            },
            minLength: 0 // The minimum length of the input for the autocomplete to start. Default: 1.
        });
    };
});

app.controller('main', function ($scope, $route, $location, $cookies) {
    $scope.logado = $cookies.get("CUGALogin") !== undefined;
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
        $cookies.remove("CUGALogin");
        $scope.logado = false;
        location.reload();
    };
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
    $(document).ready(function(){
        $('.slider').slider();
        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrainWidth: false, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stopPropagation: false // Stops event propagation
            }
        );
    });
});

app.controller('usuarios', function ($http, $scope, $route, $location, $cookies) {
    if($cookies.get("CUGALogin") === undefined){
        if($location.path() !== "/usuario")
            $location.path('/login');
    }
    else{
        $location.path('/verDespesas');
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
                    $cookies.put("CUGALogin", "");
                    location.reload();
                }
            },
            function () {
                alert("Não foi possível fazer o login!");
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
