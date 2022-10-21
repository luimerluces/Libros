import React, { useState } from "react"
import axios from "axios"
import { TextField, FormControl, InputLabel, OutlinedInput, IconButton, Button, Container, Box, InputAdornment, FormHelperText, Modal, FormLabel, FormControlLabel, FormGroup, Checkbox } from "@mui/material"
import { VisibilityOff, Visibility, EmailOutlined } from "@mui/icons-material"
import './login.css'
import ReCAPTCHA from "react-google-recaptcha"
import { NavLink } from "react-router-dom"
import { useAuthContext } from "../../context/authContext"

export default function Login (){
  const {login}=useAuthContext()
  const recaptchaRef = React.createRef()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [formErrors, setFormErrors] = useState({Email: '', Password: '', EmailRecovery:''})
  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [formValidValid, setFormValid] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const withdScreen = window.innerWidth
  const [open,setOpen] = useState(false)
  const [checked, setChecked] = React.useState(false);
  const [emailRecovery,setEmailRecovery] = useState('')
  const [emailValidRecovery, setEmailValidRecovery] = useState(false)


  const validateField = (fieldName, value) => {
    let fieldValidationErrors = formErrors;
    let EmailValid = emailValid;
    let PasswordValid = passwordValid;
    let EmailValidRecovery = emailValidRecovery;
    
    switch(fieldName) {
      case 'Email':
        EmailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.Email = EmailValid ? '' : 'Correo invalido';
        setFormErrors({Email: fieldValidationErrors.Email})
        break;
      case 'Password':
        PasswordValid = value.length >= 6;
        fieldValidationErrors.Password = PasswordValid ? '': 'Clave demasiado corta';
        setFormErrors({Password: fieldValidationErrors.Password})
        break;
      case 'EmailRecovery':
        EmailValidRecovery = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.EmailRecovery = EmailValidRecovery ? '' : 'Correo invalido';
        setFormErrors({EmailRecovery: fieldValidationErrors.EmailRecovery})
        break;
      default:
        break;
    }
    setFormErrors(fieldValidationErrors)
    setEmailValid(emailValid)
    setPasswordValid(passwordValid)
    setEmailValidRecovery(EmailValidRecovery)
    console.log(formErrors)
  }
  const handleUserEmail = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    validateField(name, value)
    setEmail(value)
  } 
  const handleUserPassword = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    validateField(name, value)
    setPassword(value)
  } 
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword) 
  };
  const enviarDatos=(e)=>{ 
    var datosEnviar={
      Login:email,
      Password:password
    } 
    axios.post("http://localhost:3001/api/Login",datosEnviar).then(result => {
      sessionStorage.setItem('token', result.data.token);
      sessionStorage.setItem('success', result.data.success);
console.log(result.data.success)
      if (result.data.success === true) {
        login();
      }
    }).catch(err => {
        if(err.response) {
          console.log(err.response)
          console.log(err.response.data.message);
          console.log(err.response.status);
          console.log(err.response.headers);        
        
        }       
    })
  }
    /* Validación Google */
  
  const handleChangeLogin = value => {
    if (value !== null) {
      isHuman()
    }
  }

  const isHuman=async()=>{
    var responseKey = {captcha: recaptchaRef.current.getValue()};
    console.log(responseKey)
    axios.post(process.env.REACT_APP_API_ENDPOINT+"ValidationCaptcha",responseKey)
    .then(result => { console.log(result.data)
    switch (result.data.success) {
      case true:
        setValidToken(true)
        break;
      case false:
        setValidToken(false)
        break;
      default:
        break;
    }
    }).catch(err => {
      console.log(err)
    })
  }
  const [openModal, setOpenModal]=useState(false)
  const [consolaSeleccionada, setConsolaSeleccionada]=useState({
    Nombres:'',
    Apellidos:'',
    Edad:'',
    Login:'',
    Password:'',
    Email:'',
  })
  const handleModal=()=>{
    setOpenModal(!openModal)
  }
  const handleChange=e=>{
    const {name, value}=e.target;
    setConsolaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
  }
  const registro = async () => {
    const datosEnviar={
      Nombres:consolaSeleccionada.Nombres,
      Apellidos:consolaSeleccionada.Apellidos,
      Edad:consolaSeleccionada.Edad,
      Login:consolaSeleccionada.Login,
      Password:consolaSeleccionada.Password,
      Email:consolaSeleccionada.Email,
    }
    const urlISBN =  `http://localhost:3001/api/RegistrarUsuario`;
    
    const { data } = await axios.post(
      urlISBN, datosEnviar
    );
    console.log(data)
  };
  const handleConfirm=()=>{
    registro()
  }
    return(
      <section className="login">
        <Box className="card-login">
          <FormControl className="Form">
            <TextField error={formErrors.Email === ''? false: true} helperText={formErrors.Email} className='email' 
              variant="outlined" label="Email" type='text' name='Email' value={email} onChange={(e)=>handleUserEmail(e)}/>
            <TextField error={formErrors.Password === ''? false: true}
              helperText={formErrors.Password} className={formErrors.Password === ''? 'password': 'password error'} type={showPassword?  'text' : 'password'} 
              variant="outlined" label="Password" name='Password' value={password} onChange={(e)=>handleUserPassword(e)}
            InputProps={{
              endAdornment:(
                <IconButton style={{width:'10%',height:'100%'}} aria-label="toggle password visibility" onClick={handleClickShowPassword}  edge="end">
                  {showPassword ? <VisibilityOff className="icon"/> : <Visibility className="icon"/>}
                </IconButton>
                )
            }}
            />
            <Button className="button" variant="outlined" onClick={enviarDatos}>Log In</Button>
            <Button className="button" variant="outlined" component="label" onClick={handleModal}>Sign In</Button>

          </FormControl>

            <ReCAPTCHA 
              className="recaptcha"
              onChange={handleChangeLogin}
              sitekey={process.env.REACT_APP_PUBLIC_KEY}
              badge='bottomleft'
              ref={recaptchaRef}
            />
            <Modal open={openModal}
                onClose={handleModal}>
            <Box sx={{background:'#fff', width:'50%', height:'50%', left:'25%', top:'25%', position:'relative'}}>
              <h3 style={{textAlign:'center'}}>User Register</h3>
              <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around'}} className='agruparEdit'>
                  <div style={{width:'40%',display: 'flex', flexDirection: 'column'}} className='grupoEdit'>
                  <TextField name="Nombres" onChange={handleChange} type='text' label="Names"  value={consolaSeleccionada && consolaSeleccionada.Nombres}/>
                  <br />
                  <TextField name="Apellidos" onChange={handleChange} type='text' label="Last Names" value={consolaSeleccionada && consolaSeleccionada.Apellidos}/>
                  <br />
                  <TextField name="Edad" onChange={handleChange} label="Age" type='number' value={consolaSeleccionada && consolaSeleccionada.Edad}/>
                  <br />
                  <TextField name="Login" onChange={handleChange} label="Login" value={consolaSeleccionada && consolaSeleccionada.Login}/>
                  <br />
                  </div>
                  <div style={{width:'40%',display: 'flex', flexDirection: 'column'}} className='grupoEdit'>
                  <TextField name="Email" onChange={handleChange} label="Email" value={consolaSeleccionada && consolaSeleccionada.Email}/>
                  <br />
                  <TextField error={formErrors.Password === ''? false: true}
                    type={showPassword?  'text' : 'password'} variant="outlined" label="Password" name='Password' value={consolaSeleccionada && consolaSeleccionada.Password} onChange={handleChange}
                  InputProps={{
                    endAdornment:(
                      <IconButton style={{width:'10%',height:'100%'}} aria-label="toggle password visibility" onClick={handleClickShowPassword}  edge="end">
                        {showPassword ? <VisibilityOff className="icon"/> : <Visibility className="icon"/>}
                      </IconButton>
                      )
                  }}/>
                  
              <div align="bottom">
                  <Button color="primary" onClick={handleConfirm}>Save</Button>
                  <Button onClick={()=>{setOpenModal(false)}}>Cancel</Button>
              </div>
                  </div>
              </div>
            </Box>
            </Modal>
        </Box>
      </section>
    )
}