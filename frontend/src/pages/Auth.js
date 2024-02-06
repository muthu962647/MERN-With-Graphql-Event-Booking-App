import React , { useContext, useState}from 'react'
import './Auth.css'
import AuthContext from '../context/auth-context';

function Authpage(props){

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


        fetch(`http://localhost:8000/graphql`,options)
        .then(res => {
        
            if(res.status !== 200 && res.status !==201){
                throw new Error('Failed!')
            }
            return res.json();
            
        }).then(resData => {

            const {token, userId, tokenExpiration } = resData.data.login;

            if(isLoggedin){

                if(resData.data.login.token){
                    login(token, userId, tokenExpiration);
                }
            }
        }
        )
        .catch(err => {
            console.log(err);
        })
    }

    return (
        
        <form className='auth-form' onSubmit={handleSubmit}>
            <h3>{isLoggedin?"LOG IN":"SIGN UP"} your Account</h3>
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id='email' value={email}  onChange={(e) => SetEmail(e.target.value)}/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id='password' value={password} onChange={(e) => SetPassword(e.target.value)}/>
            </div>
            <div className="form-actions">
                <button type='button' onClick={ModifyLogin}>Switch to {isLoggedin?"SIGN UP":"LOG IN"}</button>
                <button type='submit'>Submit</button>
            </div>
        </form>
    )
}

export default Authpage;