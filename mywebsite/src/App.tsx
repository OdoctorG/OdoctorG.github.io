import { useState, useEffect } from 'react'
import bankIDlogo from './assets/BankID_logo_white.svg'
import './App.css'
import { AppData } from './AppData';


function App() {
  

  const [count, setCount] = useState(0)
  var connect_string = "https://link.tink.com/1.0/transactions/connect-accounts?client_id=bfdc43265bac4643bed9e8607d47c170&redirect_uri=http://localhost:5173/callback&market=SE" 
  //var connect_string = "https://link.tink.com/1.0/transactions/connect-accounts/?client_id=39e981ab00b042b0ae4731e51619079b&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcallback&market=SE&locale=en_US"
  connect_string +=  "&state=" + AppData.getSessionId()
  return (
    <>
      <div>
        <a href={connect_string} target="_blank" className="login">
          <p> <h2>Log In with BankID </h2> </p>
          <p> <img src={bankIDlogo} className="logo" alt="Vite logo" /> </p>
        </a>
      </div>
      <h1>Get a list of transactions from your bank!</h1>
      <p className="read-the-docs">
        Using the Tink API this website is able to fetch your bank details! Its totally safe!
      </p>
    </>
  )
}

export default App

