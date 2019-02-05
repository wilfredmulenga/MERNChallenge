import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  constructor(props){
    super(props)
    this.textInput = React.createRef();
    this.state={
      value:'',
      error : ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount(){
    
  }

  handleInputChange = (e)=>{
   let input= e.target.value
    if(input.length>3){
     this.textInput.current.style.backgroundColor = 'red'
     this.setState({
       error: 'max number is of digits is 3'
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
        
        </div>
      </div>
    );
  }
}

export default App;
