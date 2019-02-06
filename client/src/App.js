import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  constructor(props){
    super(props)
    this.textInput = React.createRef();
    this.state={
      value:'',
      error : '',
      data : ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.getData = this.getData.bind(this)
    this.getData()
  }

  getData=()=>{
    console.log('getting data')
    fetch("http://localhost:5000/")
    .then(data => data.json())
      .then(res => this.setState({
        data: res.data
      }));
  }

  handleInputChange = (e)=>{
   let input= e.target.value
   var inputLetters = /[a-zA-Z]+/;
   let inputSpecialCharacters = /\W/;
   let inputNumbers = /\d+/
    if(input.length>3 && inputNumbers.test(input)){
     this.textInput.current.style.backgroundColor = 'red'
     this.setState({
       error: 'max number is of digits is 3'
     })
    }else if(inputLetters.test(input)){
      this.setState({
        error: 'sorry, letters are not allowed. Please input numbers only'
      })
    }else if(inputSpecialCharacters.test(input)){
      this.setState({
        error: 'sorry, special characters are not allowed. Please input numbers only'
      })
    }else{
      this.textInput.current.style.backgroundColor = null 
      this.setState({
        value : input,
        error : ''
      })
    }
    
  }
 
  render() {
    return (
      <div className='text-center'>
      <div className='searchField' style={{
              position: 'absolute', bottom: 0, width: '100%', height: '90%',
              textAlign: 'center', padding: 10
            }}>
            <div>
          <p>{this.state.value}</p>
          </div>
        <input id='numbers' style={{width:100}}  onChange={this.handleInputChange} value={this.state.value} required
         pattern="^[0-9]+$" min='000' max='999'  ref={this.textInput}
        ></input>
        <p>{this.state.error}</p>
       <div style={{marginTop:30}}>
       <button>Search</button>
       </div>
        {(this.state.data!=='')?<p>{this.state.data}</p>:null}
        </div>
      </div>
    );
  }
}

export default App;
