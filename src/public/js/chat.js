console.log('cargo chat.js .....')

const socket = io() //inicializamos cliente socket
let inputMensaje = document.getElementById('mensaje');
let divMensajes = document.getElementById('mensajes')


Swal.fire({
    title:"Identifiquese",
    input:"text",
    text:"Ingrese su nickname",
    inputValidator: (value)=>{
        return !value && "Debe ingresar un nombre...!!!"
    },
    allowOutsideClick:false
}).then(resultado=>{
    console.log(resultado)
    socket.emit('id', resultado.value) //emite un mensaje de id
    inputMensaje.focus() // para posicionar  el cursor en el input 
    document.title = resultado.value
    socket.on('nuevoUsuario', nombre=>{
        //popup TODO despues despues 

        Swal.fire({
            text:`${nombre} se ha conectado...!!!`,
            toast:true,
            position:"top-right"
        })
    })

    inputMensaje.addEventListener("keyup",(e)=>{
        // console.log(e, e.target.value)
        if (e.code === "Enter" && e.target.value.trim().length>0) {
          socket.emit('mensaje', {emisor:resultado.value, mensaje:e.target.value.trim()})  
          e.target.value = ''
        }
    })

    
    socket.on('nuevoMensaje', datos=>{ //Se configuro aca pero deberia ser abajo de  inputMensaje.addEventListener
        let parrafo = document.createElement('p')
        parrafo.innerHTML= `<strong>${datos.emisor} </strong> dice:<i>${datos.mensaje}</i>`
        parrafo.classList.add('mensaje')
        let br = document.createElement('br')
        divMensajes.append(parrafo, br);
        divMensajes.scrollTop = divMensajes.scrollHeight; // Para que el scrool siempre se pueda ver al escribir mas elementos

    })

    socket.on("hello", mensajes=>{
       mensajes.forEach(mensaje => {
        let parrafo = document.createElement('p')
        parrafo.innerHTML= `<strong>${mensaje.emisor} </strong> dice:<i>${mensaje.mensaje}</i>`
        parrafo.classList.add('mensaje')
        let br = document.createElement('br')
        divMensajes.append(parrafo, br);
        divMensajes.scrollTop = divMensajes.scrollHeight;
       });
    })

    socket.on("usuarioDesconectado",nombre=>{
        Swal.fire({
            text:`${nombre} se ha desconectado...!!!`,
            toast:true,
            position:"top-right"
        })
    } )
})