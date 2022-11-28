import React, { useState ,useEffect} from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { gapi } from 'gapi-script';
import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import {signin,signup}from '../../actions/auth'
const initialState={ firstName:'',lastName:'',email:'',password:'',confirmPassword:''}

const Auth = () => {
  const[formData,setFormData]=useState(initialState)
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [user,setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    if(isSignup){
      dispatch(signup(formData,history))
    }else{
      dispatch(signin(formData,history))
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData,[e.target.name]:e.target.value});
  };
  useEffect(() => {
    function start() {
    gapi.client.init({
    clientId:"332000412139-7u788viavh0oupim30ngi78tkqvoti20.apps.googleusercontent.com",
    scope: 'email',
      });
       }
       setUser(JSON.parse(localStorage.getItem('profile')))
      gapi.load('client:auth2', start);
       }, []);

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
      dispatch({ type: 'AUTH', data: { result, token } });

      history.push('/')
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const googleFailure = (error) => {
    console.log(error);
    console.log("Google Sign In was unsuccessful!, Try Again Later")
  };
  const validName =()=>{
    let regex =/^[a-zA-Z]([a-zA-Z0-9]){1,10}/;
    let str = name1.value
    if(regex.test(str)){
        console.log("right")
        name1.classList.remove('is-invalid');

    }
    else{
        console.log("wrong")
        name1.classList.add('is-invalid');

    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            { isSignup && (
              <>
                <Input name="firstName" id ="firstName" class="form-control" label="First Name" handleChange={handleChange} onblur={validName} autoFocus half />
                <Input name="lastName" label="lastName" handleChange={handleChange} class="form-control" onblur={validName} half />

              </>
            )}
            
            <Input name="email" id="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name ="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          <GoogleLogin 
            clientId="332000412139-7u788viavh0oupim30ngi78tkqvoti20.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          <Grid container justify="flex-end">
            <Button onClick={switchMode}>
              { isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
};

export default Auth;
