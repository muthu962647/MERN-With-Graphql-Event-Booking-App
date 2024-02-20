import React , { useContext, useState}from 'react'
import { useNavigate } from 'react-router-dom';
import './Auth.css'
import AuthContext from '../context/auth-context';
import {  useSnackbar } from 'notistack'

function Authpage(props){

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [email , SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [isLoggedin,SetLogin] = useState(true);
    const { login } = useContext(AuthContext);


    const ModifyLogin = () => {
        SetLogin(!isLoggedin);
    }

    let requestBody = {
        query: `
        mutation {
            createUser(userInput: {
              email: "${email}",
              password: "${password}"
            }) {
              _id
              email
              password
            }
          }
        `
    }

    if(isLoggedin)  {
        requestBody = {
            query:`
            query {
                login(Credentials: {
                    email: "${email}",
                    password: "${password}"
                }) {
                    userId
                    token
                    tokenExpiration
                }
            }         `
        }
        
    }


    const handleSubmit = (event) => {
 
        event.preventDefault();

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }


        const options = {

            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'   
            }
        }


        fetch(`https://backend-5kak.onrender.com/graphql`,options)
        .then(res => {
        
            if(res.status !== 200 && res.status !==201){
                throw new Error('Failed!')
            }
            return res.json();
            
        }).then(resData => {

            if(isLoggedin){
                const {token, userId, tokenExpiration } = resData.data.login;

                if(resData.data.login.token){
                    login(token, userId, tokenExpiration);
                }

                enqueueSnackbar("Logged in Successfully",{variant: "success", style: { backgroundColor: '#9b5ff5', color: 'white' }})
                navigate('/events')

                
            }else{
            
                SetLogin(!isLoggedin);
                enqueueSnackbar("Switched to " + (isLoggedin ? "SIGN UP" : "LOG IN") + " mode", { variant: "info" });

            }

            
        }
        )
        .catch(err => {
            console.log(err);

            enqueueSnackbar("Invalid Credentials",{variant: "error"})
        })
    }

    return (
        
        <form className='auth-form' onSubmit={handleSubmit}>
            <h3>{isLoggedin?"LOG IN":"SIGN UP"} your Account</h3>
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id='email' value={email}  onChange={(e) => SetEmail(e.target.value)}/>
                <i class='bx bxs-user'></i>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id='password' value={password} onChange={(e) => SetPassword(e.target.value)}/>
                <i class='bx bxs-lock-alt'></i>
            </div>
            <div className="form-actions">
                <button type='button' onClick={ModifyLogin}>Switch to {isLoggedin?"SIGN UP":"LOG IN"}</button>
                <button type='submit'>Submit</button>
            </div>
        </form>
    )
}

export default Authpage;