import React,{useState} from 'react'
import axios from "axios";
import Loader from '../components/Loader';
import Error from '../components/Error';
function Loginscreen() {
    
    const[email,setemail] = useState();
    const[password,setpassword]= useState();
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
  async  function Login(){
     
      const user={
        
        email,
        password,
       
      }
      try{
        setloading(true)
        const result = (await axios.post('/api/users/login',user)).data
        setloading(false)
        localStorage.setItem('currentUser',JSON.stringify(result))
        window.location.href='/home'
      }catch (error){
      
      setloading(false)
      seterror(true)
      }
      
    }

    
  return (
    <div2>
      {loading && (<Loader/>)}
    <div2 className="row justify-content-center mt-5">
        <div2 className="col-md-5">
          {error && (<Error message='Invalid Credentials'/>)}
    <div className='bs'>
    <h3>Login</h3>
   
    <input type="text" className='form-control' placeholder='Email'value={email} onChange={(e)=>{setemail(e.target.value)}}/>
    <input type="text" className='form-control' placeholder='Password'value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
    <button1 className='btn btn-primary mt-3' onClick={Login}>Login</button1>
</div>
        </div2>
    </div2>
    </div2>
  )

}
export default Loginscreen