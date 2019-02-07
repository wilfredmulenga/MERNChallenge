import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  constructor(props){
    super(props)
    this.textInput = React.createRef();
    this.state={
      input:'',
      error : '',
      data : '',
      searchValue: '',
      searchResults: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.getData = this.getData.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
   
  }


  componentDidMount(){
    this.getData()
  }

  handleSubmit = ()=>{

    fetch(`http://localhost:5000/search/?input=${this.state.input}`)
    .then(data => data.json())
      .then(res =>
         {
         
          return res.data
         }
      ).then( primeNumber=>
        fetch(`http://localhost:5000/addToSearchResults`,{
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
        },
          body:JSON.stringify({"input":this.state.input,"primeNumber":primeNumber})
      })
      );}
      //try use async await
  getData=  ()=>{
     fetch("http://localhost:5000/searchResults")
    .then(res => res.json())
    .then(res=> //console.log(Object.values(res.data))
      this.setState({
        searchResults : Object.values(res.data)
    })
    )
  }

  handleInputChange = (e)=>{
   let input= e.target.value
   var inputLetters = /[a-zA-Z]+/;
   let inputSpecialCharacters = /\W/;
   let inputNumbers = /\d+/
    if(input.length>3 && inputNumbers.test(input)){
    //  this.textInput.current.style.backgroundColor = 'red'
     this.setState({
       error: 'max number is of digits is 3'
     })
    }else if(inputLetters.test(input)){
      this.textInput.current.style.backgroundColor = 'red'
      this.setState({
        error: 'sorry, letters are not allowed. Please input numbers only'
      })
    }else if(inputSpecialCharacters.test(input)){
      this.textInput.current.style.backgroundColor = 'red'
      this.setState({
        error: 'sorry, special characters are not allowed. Please input numbers only'
      })
    }else{
     this.textInput.current.style.backgroundColor = null 
      this.setState({
        input : input,
        error : ''
      })
    }
    
  }
 
  render() {
    return (
      <div className='App'>
       <div style={{height:'1rem'}}><p>{this.state.error}</p></div>
      <div className='searchField'>
            <div>
          <p>{this.state.input}</p>
          </div>
        <input id='numbers'   onChange={this.handleInputChange} value={this.state.input} required name='numbers'
         pattern="^[0-9]+$" 
        //  min='000' max='999' 
          ref={this.textInput}
        ></input>
       
       <div style={{marginTop:30}}>
       <button onClick={this.handleSubmit}>Search</button>
       </div>
    </div>
         <div className='searchResults text-center' style={{marginTop:50}}>
         
            <table>
    <thead>
        <tr>
            <th colSpan="1">Input Data</th>
            <th colSpan="1">Search Results</th>
            <th colSpan="1">Date of Search</th>
        </tr>
    </thead>
    <tbody>
    {(this.state.searchResults)? this.state.searchResults.map((element,i)=>
    <tr key={i}>
    <td>{element.input}</td>
    <td>{element.primeNumber}</td>
    <td>{element.createdAt}</td>
</tr>
    )
    :<tr>No Search Results</tr>}
    </tbody>
</table>
        </div>
      </div>
    );
  }
}

export default App;
