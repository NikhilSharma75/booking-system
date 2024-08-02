import React, { useState } from 'react'
import axios from 'axios'
import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';

function Registerscreen() {
    const[name,setname]=useState("");
    const[email,setemail]=useState("");
    const[password,setpassword]=useState("");
    const[cpassword,setcpassword]=useState("");
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    const[success,setsuccess]=useState();
    async function register()
    {
       if(password==cpassword)
       {
        const user={
            name,
            email,
            password,
            cpassword
        }
        try{  
            setloading(true)
            const result=(await axios.post('/api/users/register',user)).data
            setloading(false)
            setsuccess(true)

            setname('')
            setemail('')
            setpassword('')
            setcpassword('')
        }
        catch(error)
        {
            console.log(error)
            setloading(false)
            seterror(true)
        }
       }
       else
       {
         alert('Passwords not matched');
       }
    }
  return (
    <div className='justify-center'>
      {loading && (<Loader/>)}
      {error && (<Error/>)}
       <div className='row justify-content-center mt-5'>
          <div className='col-md-5 mt-5'>
          {success && (<Success message="Registration Success"/>)}
               <div className='bs'>
                  <h3>Register</h3>
                  <input type='text' className='form-control' placeholder='Name' value={name} onChange={(e)=>{setname(e.target.value)}}/>
                  <input type='text' className='form-control' placeholder='Email' value={email} onChange={(e)=>{setemail(e.target.value)}}/>
                  <input type='text' className='form-control' placeholder='Password' value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
                  <input type='text' className='form-control' placeholder='Confirmpassword' value={cpassword} onChange={(e)=>{setcpassword(e.target.value)}}/>

                  <button3 className='btn btn-primary mt-3' onClick={register}>
                      Register
                  </button3>
               </div>
          </div>
       </div>
    </div>
  )
}

export default Registerscreen