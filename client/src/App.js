import React, { Component } from "react";
import AviumTokenContract from "./build/contracts/AviumToken.json";
import AviumTokenSaleContract from "./build/contracts/AviumTokenSale.json";
import getWeb3 from "./utils/getWeb3";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import QRTX from "./QRTX.js"
import './style.css'
import UnitFormModal from "./UnitFormModal.js"

import "./App.css";

class App extends Component {
  state = {
     web3: null,
     accounts: null,
     contractToken: null,
     contractSale: null,
     symbol: "" ,
     amount: "",
     totalSupply: "",
     balance: "",
     success: "",
     unitModal: false,
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = AviumTokenContract.networks[networkId];
      const instanceToken = new web3.eth.Contract(
        AviumTokenContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const instanceTokenSale = new web3.eth.Contract(
        AviumTokenSaleContract.abi,
        deployedNetwork && deployedNetwork.address,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log(AviumTokenContract.abi)
      this.setState({ web3, accounts, contractToken: instanceToken, contractSale: instanceTokenSale }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contractToken, contractSale } = this.state;
    contractToken.methods.balanceOf(this.state.accounts[0]).call().then(res=>{this.setState({balance: parseInt(res)})})
    contractToken.methods.balanceOf(contractSale.address).call().then(res=>{this.setState({totalSupply: parseInt(res)})})
    console.log(this.state.web3.eth.getBalance(accounts[0]))
  };

  handlePurchase = async (e) => {
    e.preventDefault()
    const { accounts, contractToken, contractSale } = this.state;
    var tokenPrice = 1000000000000000
    contractSale.methods.buyTokens(this.state.amount).send({from: accounts[0], value: (this.state.amount * tokenPrice) , gas: 500000 })
    .then(res =>{
      let newBalance = (parseFloat(this.state.balance) + parseFloat(this.state.amount))
      let newSupply = (parseFloat(this.state.totalSupply) - parseFloat(this.state.amount))
      this.setState({success: res, balance: newBalance, totalSupply: newSupply})})
    console.log(this.state.success)
  }

  handleAmount = (e) =>{
    this.setState({ amount: e.target.value})
  }

  handleUnit = (e) =>{
    e.preventDefault(e)
    const { accounts, contractToken, contractSale } = this.state;
    contractToken.methods._pendingPayment("0xc91033ed07DA0A4664ab58c69441F3e6180492F7", 10).send({from: accounts[0]}).then(res => console.log(res))
  }

  handleApproval = (e) => {
    e.preventDefault(e)
    const { accounts, contractToken, contractSale } = this.state;
    contractToken.methods._makePayment(accounts[0], "0xc91033ed07DA0A4664ab58c69441F3e6180492F7").send({from: accounts[0]}).then(res => console.log(res))

  }

  closeModal = () =>{
    this.setState({openUnitModal: !this.state.unitModal})
    console.log("hi")
  }

  openUnitModal = () => {
    this.setState({unitModal: !this.state.unitModal})
  }

  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="bkg" />
        <div className="me" />
        <h1 style={{fontfamily:"Open Sans"}}>AVEMCOIN</h1>
        <h2>Purchase Token</h2>
        <h5>
          Total AVM Available: {this.state.totalSupply}
        </h5>
        <Form style={{width: "50%", justifyContent: "center"}} onChange={this.handleAmount}>
        <Form.Group md="4" controlId="TokenPurchase">
          <Form.Label>Purchase Amount</Form.Label>
          <Form.Control type="number" placeholder="Token Amount" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={this.handlePurchase}>
          Submit
        </Button>
      </Form>
      <div>
       <Button variant="dark" onClick={this.openUnitModal}>Manual Unit Entry</Button>
        {this.state.unitModal ? <UnitFormModal closeModal={this.closeModal} /> : null }
         <Button variant="dark" onClick={this.handleApproval}>Approve</Button>
        </div>
        <div>
          <ul>
            <p>
            Your account: {this.state.accounts[0]}
            </p>
            <p>
              Your balance: {this.state.balance}
            </p>
          </ul>

        </div>
        <QRTX account={this.state.accounts[0]}/>
      </div>
    );
  }
}


export default App;


// if contract error run a truffle migrate --reset
// AviumTokenSale.deployed().then(function(i){tokenSale=i})
// truffle(development)> AviumToken.deployed().then(function(i){token=i})
// undefined
// truffle(development)> web3.eth.getAccounts().then(function(accounts){ acc1 = accounts[0]})
// undefined
// truffle(development)> tokensAvailable = 750000
// 750000
// truffle(development)> token.transfer(tokenSale.address, tokensAvailable, { from: acc1})

// build folder needs to be dragged into client folder


// blockHash: "0x8e2e13cf060a851e9815f7a2fde6843b7ebb680d4f5cb9af81d556633a7974e7"
// blockNumber: 17
// contractAddress: null
// cumulativeGasUsed: 46374
// events: {0: {…}, Sell: {…}}
// gasUsed: 46374
// logsBloom: "0x04000000000000000000000000800000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000008000000000000000000002000000000000000000000000800000000000000000000040000000000000000100000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000010000000000000000000000000000002000000000000000000000000000000000000000000000001000000000100000000000010000002000000004000000000000000000000000000000000"
// status: true
// transactionHash: "0x14947c261c6cfbd5e0121b8bf18871949c872ecb80759a54e2b74610404509ea"
// transactionIndex: 0
