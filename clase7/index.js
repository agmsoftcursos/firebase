var admin = require("firebase-admin");

var serviceAccount = require("./fir-pruebas-6c535-firebase-adminsdk-epz0x-02542869a4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-pruebas-6c535.firebaseio.com"
    // databaseAuthVariableOverride: {
    //     uid: "firebase-agm-worker"
    // }
});

var db = admin.database();
var ref = db.ref('clase6/users');
ref.on('child_added', function(ss) {
  var user = ss.val();
  var uid = ss.key;
  console.log(user.nombre);
  var privateData = {
    email: user.email
  };

  //console.log(datosPrivados);
  let refPrivate = db.ref('clase6/userprivatedata/'+ uid);
  refPrivate.set(privateData)
    .then(() => {
        data = {
            email: null
        }
        let ref = db.ref('clase6/users/' + uid);
        ref.update(data);
    });
}, function(err) {
  console.log (err);
});