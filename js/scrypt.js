
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBK0svcRvD6tDvCl2HAwpTyTAV9mLjnOBM",
    authDomain: "cotacao-for.firebaseapp.com",
    projectId: "cotacao-for",
    storageBucket: "cotacao-for.appspot.com",
    messagingSenderId: "81640818285",
    appId: "1:81640818285:web:b7ef058d2dc2ffdca52164",
    measurementId: "G-HLB64D6QGK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Começamos aqui

var usuario = null;

var formLogin = document.querySelector('form.login-form');
var btnLogout = document.querySelector('.logout');
    
formLogin.addEventListener('submit',(e)=>{
e.preventDefault();
    let email = document.querySelector('[name=email]').value;
    let password = document.querySelector('[name=password]').value;
    //alert(email);
    //alert(password);
        
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        usuario = userCredential.user;
            
        //alert('Logado com sucesso! '+usuario.email);
        document.querySelector('.login, .background-login').style.display = "none";
        document.querySelector('.container-login').style.display = "block";
        document.querySelector('.background-logado').style.display = "flex";

        formLogin.reset();
        
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
    });

const db = firebase.firestore();

firebase.auth().onAuthStateChanged((val)=>{

if(val){
    usuario=val;
    //alert('Bem-vindo de volta '+ usuario.email);

    document.querySelector('.login, .background-login').style.display = "none";
    document.querySelector('.container-login').style.display = "block";
    document.querySelector('.background-logado').style.display = "flex";

    //Ouvir por mudanças no banco de dados.

    db.collection('registros').where("horario","!=",null).onSnapshot((data)=>{
        let list = document.querySelector('#registros');
        list.innerHTML = "";
        let registros = data.docs;
        registros = registros.sort(function(a,b){
            if(a.data().horario < b.data().horario)
                return -1;
            else
                return +1;
            })
        registros.map((val)=>{
            const horarioFormatado = new Date(val.data().horario).toLocaleString();
        
            list.innerHTML+=`<li> 
            <div class="simplesContainer">
                <div class="avaliacao">${val.data().status}</div>
                <div class="colaborador">${val.data().registro}</div>
                <div class="horario">${horarioFormatado}</div>
                <div class="atualizacao">${val.data().atualizar}</div>
                <div class="excluirPonto"><a registro-id="${val.id}" class="excluir-btn" href="javascript:void(0)"><i class="bi bi-trash"></i></a></div>
            </div>
            </li>`
        })


         //Filtro para pesquisar item
  
         const filtroProdutoInput = document.getElementById('filtroProduto');
  
         filtroProdutoInput.addEventListener('input', function () {
             const termoFiltro = filtroProdutoInput.value.toLowerCase();
             const listaRegistros = document.querySelector('#registros');
             
             // Itera sobre os itens da lista e mostra ou esconde com base no filtro
             Array.from(listaRegistros.children).forEach(item => {
                 const textoItem = item.textContent.toLowerCase();
                 const correspondeAoFiltro = textoItem.includes(termoFiltro);
 
                 item.style.display = correspondeAoFiltro ? 'block' : 'none';
             });
         });

        var excluiRegistros = document.querySelectorAll('.excluir-btn');

        excluiRegistros.forEach(element => {
            element.addEventListener('click',function(e){
                e.preventDefault();
                let docId = element.getAttribute('registro-id');

                db.collection('registros').doc(docId).delete();
            })
        });
    })
}
})




btnLogout.addEventListener('click',(e)=>{
e.preventDefault();

    firebase.auth().signOut().then(() => {
        usuario = null;
        document.querySelector('.login').style.display = "block";
        document.querySelector('.background-login').style.display = "Flex";
        document.querySelector('.container-login, .background-logado').style.display = "none";
            
       //alert('Deslogado');
    }).catch((error) => {
        // An error happened.
    });
})

var textareaRegistro = document.querySelector('.form-cadastro-registro textarea');
var submitReg = document.querySelector('.form-cadastro-registroregistros [name=acao]');
var blocos = document.querySelectorAll('.bloco-und');


// Altera a Visibilidade do input de leitura e registro
function alternarVisibilidadeTextarea() {
    
    if (textareaRegistro.style.display === 'block') {
        textareaRegistro.style.display = 'none';
        submitReg.style.display = 'none';
        
    } else {
        textareaRegistro.style.display = 'block';
        submitReg.style.display = 'block';
    }
}
// Retira a class ativado dos botões de entrada, pausa, retorno e saida
function removeAtivado() {
    var blocos = document.getElementsByClassName("bloco-und");
        for (var i = 0; i < blocos.length; i++) {
          blocos[i].classList.remove("ativado");
        }
}




var formCadastro = document.querySelector('.form-cadastro-registro');
var codigosNomes = {
    10003: 'Igor',
    10004: 'Débora',
    10005: 'Carla',
    10006: 'Mário',
    10007: 'Gilson',
    10008: 'Gislaine'
};

document.addEventListener('DOMContentLoaded', function () {

    // Adicione este trecho para registrar ao pressionar Enter
    var inputRegistro = document.querySelector('.form-cadastro-registro [name=codigoNome]');

    inputRegistro.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Chame a função de registro aqui (a mesma lógica que no submit do formulário)
            let codigo = parseInt(inputRegistro.value, 10);
            let status = verificarStatus(codigo);
            let atualizar = verificarAtualizacao(codigo, status);

            if (status && atualizar) {
                // Inserir e criar coleção caso não exista.
                db.collection('registros').add({
                    atualizar: atualizar,
                    registro: codigosNomes[codigo],
                    horario: new Date().getTime(),
                    userId: usuario.uid,
                    status: status
                });

                inputRegistro.value = ''; // Limpar o campo após o registro
                removeAtivado();
            } else {
                alert('Código inválido ou fora do horário permitido!');
            }
        }
    });
   
});

function verificarAtualizacao(codigo) {
    const horarioAtual = new Date();
    const diaSemana = horarioAtual.getDay(); // 0 para Domingo, 1 para Segunda, ..., 6 para Sábado
    const hora = horarioAtual.getHours();

    switch (codigo) {
        case 10003: // Igor
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 7 && hora <= 8) {
                    return "Entrada";
                } else if (hora >= 12 && hora <= 14) {
                    return "Pausa";
                } else if (hora >= 14 && hora <= 15) {
                    return "Retorno";
                } else if (hora >= 17 && hora <= 19) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

        case 10004: // Debora
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 7 && hora <= 8) {
                    return "Entrada";
                } else if (hora >= 12 && hora <= 14) {
                    return "Pausa";
                } else if (hora >= 14 && hora <= 15) {
                    return "Retorno";
                } else if (hora >= 17 && hora <= 19) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

        case 10005: // Carla
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 9 && hora <= 10) {
                    return "Entrada";
                } else if (hora >= 13 && hora <= 15) {
                    return "Pausa";
                } else if (hora >= 16 && hora <= 17) {
                    return "Retorno";
                } else if (hora >= 19 && hora <= 21) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

            case 10006: // Mario
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 12 && hora <= 13) {
                    return "Entrada";
                } else if (hora >= 15 && hora <= 17) {
                    return "Pausa";
                } else if (hora >= 16 && hora <= 17) {
                    return "Retorno";
                } else if (hora >= 21 && hora <= 23) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

            case 10007: // Gilson
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 14 && hora <= 15) {
                    return "Entrada";
                }  else if (hora >= 21 && hora <= 23) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

            case 10008: // Gislaine
            if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a Sexta
                if (hora >= 7 && hora <= 8) {
                    return "Entrada";
                } else if (hora >= 10 && hora <= 12) {
                    return "Pausa";
                } else if (hora >= 12 && hora <= 13) {
                    return "Retorno";
                } else if (hora >= 17 && hora <= 19) {
                    return "Saida";
                } else {
                    return "Anomalia";
                }
            }
            break;

        default:
            return null;
    }
}

function verificarStatus(codigo) {
    const horarioAtual = new Date();
    const hora = horarioAtual.getHours();

    switch (codigo) {
        case 10003: // Igor
            if (hora > 8 || hora < 10 && hora > 15 || hora < 17) {
                return '<i class="bi bi-hand-thumbs-down" style="color: red;"></i>';
            } else if (hora < 8 || hora > 7 && hora < 15 || hora > 14) {
                return '<i class="bi bi-hand-thumbs-up" style="color: green;"></i>';
            }
            break;

        case 10004: // Débora
            if (hora > 8 || hora < 10 && hora > 15 || hora < 17) {
                return '<i class="bi bi-hand-thumbs-down" style="color: red;"></i>';
            } else if (hora < 8 || hora > 7 && hora < 15 || hora > 14) {
                return '<i class="bi bi-hand-thumbs-up" style="color: green;"></i>';
            }
            break;
        
        case 10005: // Carla
            if (hora > 10 || hora < 12 && hora > 14 || hora < 16) {
                return '<i class="bi bi-hand-thumbs-down" style="color: red;"></i>';
            } else if (hora < 10 || hora > 8 && hora < 16 || hora > 15) {
                return '<i class="bi bi-hand-thumbs-up" style="color: green;"></i>';
            }
            break;

        case 10006: // Mário
            if (hora > 13 || hora < 14 && hora > 17 || hora < 18) {
                return '<i class="bi bi-hand-thumbs-down" style="color: red;"></i>';
            } else if (hora < 13 || hora > 12 && hora < 17 || hora > 16) {
                return '<i class="bi bi-hand-thumbs-up" style="color: green;"></i>';
            }
            break;

        case 10007: // Gilson
            if (hora > 15 || hora < 16) {
                return '<i class="bi bi-hand-thumbs-down" style="color: red;"></i>';
            } else if (hora < 15 || hora > 13) {
                return '<i class="bi bi-hand-thumbs-up" style="color: green;"></i>';
            }
            break;

        case 10008: // Gislaine
            if (hora > 8 || hora < 10 && hora > 13 || hora < 14) {
                return '<i class="bi bi-hand-thumbs-down" style="color: red;"></i>';
            } else if (hora < 8 || hora > 7 && hora < 13 || hora > 12) {
                return '<i class="bi bi-hand-thumbs-up" style="color: green;"></i>';
            }
            break;


        // Adicionar casos para outros funcionários conforme necessário

        default:
            return null;
    }
}