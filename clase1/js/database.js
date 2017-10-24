// Accedo al servicio de la base de datos
var database = firebase.database();

//Acceso a un documento
var ref = database.ref('clase1/encuesta');
ref.on('value', function(ss) {
  var encuesta = ss.val();
  getId('preg').innerHTML = encuesta.pregunta;
  getId('desc').innerHTML = encuesta.descripcion;
}, function(err) {
  console.log('error: ', err);
});

//acceso a una colección
var refRespuestas = database.ref('clase1/respuestas');
refRespuestas.on('child_added', function(ss) {
  var respuesta = ss.val();
  var item = document.createElement('li');
  item.innerHTML = '<input name="respuesta" type="radio" value="' + respuesta.valor + '"> ' + respuesta.respuesta;
  getId('lista').appendChild(item);
});

//escritura en una colección
getId('votar').addEventListener('click', function() {
  /* var user = auth.currentUser;
  if(!user) {
    mensajeFeedback('Haz login para votar la encuesta');
    return false;
  } */
  var res = getRadioValue('respuesta');
  if(!res) {
    mensajeFeedback('Escoge una de las posibles respuestas');
    return false;
  }
  var objResultado = {
    user: "Anónimo",
    respuesta: res
  };
  console.log(objResultado);
  var refResultados = database.ref('clase1/resultados').push();
  refResultados.set(objResultado)
    .then(function(){
      mensajeFeedback('Tu respuesta se ha almacenado');
    })
    .catch(function(err) {
      mensajeFeedback('Error al almacenar: ' + err);
    });
});

// testando real time
var refResultados = database.ref('clase1/resultados');
refResultados.on('child_added', function(ss) {
  var respuesta = ss.val();
  var elem = document.createElement('article');
  elem.innerHTML = '<b>' + respuesta.user + ' <span>dice:</span> </b>' + '<i>' + respuesta.respuesta + '</i>';
  preppend(elem);
});