var enlazarcuentabtn = getId('enlazargoogle');
if(enlazarcuentabtn){
  enlazarcuentabtn.addEventListener('click', function(){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    var userActual = auth.currentUser;
    var usuarioanonimo = userActual.isAnonymous;
    userActual.linkWithPopup(provider)
      .then(function(result){
        console.log('enlazadas cuentas. El usuario:', result);
        // voy a guardar el perfil del usuario
        if(!usuarioanonimo){
            //Merjearíamos los datos de los dos usuarios
        }
        else{
          try {
            //guaramos el usuario en la base de datos
            var usuObj = generarObjPerfil();
            guardarPerfil(result.user.uid, usuObj);
            mostrarUsuarioActual(usuObj);
          } catch (error) {
            console.log("error al guardar pertil:" + error);
          }
        }
      })
      .catch(function(err) {
        console.log('error al enlazar las cuentas, hay que fusionar', err.code);
        if(err.code == 'auth/credential-already-in-use') {
          if(confirm('Esa credencial pertenece a un usuario.\n¿Deseas fusionar las cuentas?')) {
            //fusionarCuentas(userActual, err.credential);
            fusionarCuentas2(userActual, err.credential);
          }
        }
      })
  });
}

function fusionarCuentas2(user, credential){
  // Get reference to the currently signed-in user
  //var prevUser = auth.currentUser;
  var prevUser = user;
  var usuarioanonimo = user.isAnonymous;
  // Sign in user with another account
  auth.signInWithCredential(credential).then(function(usernew) {
    console.log("Sign In Success", usernew);
    var currentUser = usernew;
    // Merge prevUser and currentUser data stored in Firebase.
    // Note: How you handle this is specific to your application

    // After data is migrated delete the duplicate user
    return usernew.delete().then(function() {
      // Link the OAuth Credential to original account
      return prevUser.link(credential);
    }).then(function() {
      // Sign in with the newly linked credential
      return auth.signInWithCredential(credential);
    });
  }).catch(function(error) {
    console.log("Sign In Error", error);
  });
}


function fusionarCuentas(userActual, credential) {
  //autentico con la credencial recibida
  auth.signInWithCredential(credential)
    .then(function(userNuevo) {
      //debería guardar/fusionar todos los datos de este usuario en el userActual
      //esa operativa dependería de la lógica del negocio de cada aplicación
      //...
      //borro el user nuevo
      userNuevo.delete();
      //al userActual le enlazo el userNuevo con su credencial
      userActual.link(credential)
        .then(function() {
          console.log('Usuarios unidos', userActual);
          auth.signInWithCredential(credential)
        })
        .catch(function(err) {
          console.log('Usuarios no unidos', err);
        })
    });
}
