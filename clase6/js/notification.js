var key = 'AAAAfcz79Y8:APA91bF5L-wdbB47KsW2nRhqOIytS02YCfOuApWzJpTUT-4aNpAYC6foz6-dJLVGuOn-HsD3XsSccovTHv2QU9PAUyL0naw5xHCsAzpQ2T2ntzT79pY9isDJacdoh5DrED0o3Prd8m7M'
var messaging = firebase.messaging();

getId('solicitarpermiso').addEventListener('click', function() {
  messaging.requestPermission()
  .then(function() {
    console.log('Se han aceptado las notificaciones');
    return messaging.getToken();
  })
  .then(function(token){
    if(token) {
      console.log(token);
      guardarToken(token);
      mostrarToken(token);
    } else {

    }
  })
  .catch(function(err) {
    mensajeFeedback(err);
    console.log('No se ha recibido permiso / token: ', err);
  });

});

function guardarToken(token) {
  console.log('guardando el token de este usuario');
  var user = firebase.auth().currentUser;
  var ref = firebase.database().ref('clase6/pushToken').child(user.uid);
  ref.set({
    token: token
  })
    .then(function(){
      console.log('guaddado!!')
    })
    .catch(function(err) {
      console.log('error al guardar', err)
    })
}

function mostrarToken(token) {
  getId('token').textContent = token;
  getId('solicitarpermiso').style.display = 'none';
  getId('comando').style.display = 'block';
  getId('totoken').textContent = token;
  getId('key').textContent = key;
  getId('totoken2').textContent = token;
  getId('key2').textContent = key;
}

messaging.onTokenRefresh(function() {
  console.log('en token refresh');
  messaging.getToken()
    .then(function(token) {
      mostrarToken(token);
      guardarToken(token);
    })
    .catch(function(err) {
      mensajeFeedback(err);
      console.log('No se ha recibido el token: ', err);
    })
});

messaging.onMessage(function(payload) {
  console.log("Mensaje recibido con el sitio activo", payload);
  if(payload.notification) {
    mensajeFeedback(payload.notification.title + ': ' + payload.notification.body);
  }
});