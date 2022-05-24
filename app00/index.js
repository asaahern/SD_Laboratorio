// Import modules
const express           = require('express')
const mongoose          = require('mongoose')
const { Schema, model } = mongoose
const cors              = require('cors')
const app               = express()
const PORT              = 5000

// Define user entries in database
const userSchema = new Schema({
    nombre        : {type : String},
    apellidos     : {type : String},
    edad          : {type: Number},
    DNI           : {type: String},
    cumpleanos    : {type: Date},
    colorFavorito : {type: String},
    sexo          : {type: String}    
}, {
    timestamps: true,
    versionKey: false
})
const User = model('user',userSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost/nodejs-mongo', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then((db) => console.log('Se ha conectado a la BBDD'))
.catch((err) => console.log(err));

// Launch Node server using Express
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.listen( PORT , ()=>{
    console.log('Servidor corriendo')
})

// Function for validations
function Validation(data) {
    moment().format();
    const errors = [];

    // Define valid regular expressions
    const validtext = /^[a-zA-Z ]*$/;
    const validnum  = /^[0-9]/;
    const validdni  = /^[0-9]{8}[A-Z]$/;

    if (validtext.test(data.nombre) == false || data.nombre.length < 3) {
        errors.push("El nombre debe tener más de 3 caracteres y no puede contener números.");
    }
    if (validtext.test(data.apellidos) == false || data.apellidos.length < 3) {
        errors.push("El apellido debe tener más de 3 caracteres y no puede contener números.");
    } 
    if (validnum.test(data.edad) == false || (data.edad >= 125 || data.edad < 0)) {
        errors.push("La edad debe ser un numero comprendido entre 0 y 125.");
    }
    if (validdni.test(data.DNI) == false) {
        errors.push("El DNI deben tener 8 números y una letra (mayúscula).");
    }
    if (moment(data.cumpleanos, 'YYYY-MM-DD', true).isValid() == false) {
        errors.push("Introduzca una fecha en formato ISO8601: AAAA-MM-DD.");
    } //(source: https://stackoverflow.com/questions/22164541/validating-a-iso-8601-date-using-moment-js)
    if (validtext.test(data.colorFavorito) == false || data.colorFavorito.length < 3) {
        errors.push("El color debe tener más de 3 caracteres y no puede contener números.");
    }
    if (data.sexo != "Hombre" && data.sexo != "Mujer" && data.sexo != "No binario" && data.sexo != "Prefiero no decirlo") {
        errors.push("El sexo puede ser: Mujer, Hombre, No binario o Prefiero no decirlo.");
    }
    return errors;
}


// Define server functionality
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
})

app.post('/user', async ( req , res )=>{
    const nuevoUsuario = new User(req.body)
    await nuevoUsuario.save()
    res.json({ mensaje : "Usuario creado" })
})

app.put('/user/:id', async (req, res) => {
    const userUpdated = await User.findByIdAndUpdate(req.params.id, req.body)
    res.json({ status: "Usuario actualizado" })
})

app.delete('/user/:id', async (req, res) => {
    const userDeleted = await User.findByIdAndDelete(req.params.id)
    res.json({ status: "Usuario eliminado" })
})

app.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.send(user)
})