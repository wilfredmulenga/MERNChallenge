import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  constructor(props){
    super(props)
    this.textInput = React.createRef();
    this.state={
      input:'',
      prompt : 'Welcome',
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
  componentDidUpdate(){
    console.log('update')
  }

  handleSubmit = ()=>{
    let lengthOfInput = this.state.input.length
    switch(lengthOfInput){
      case 0 :
      this.setState({
      prompt: "Please type in three digits"
      })
      break
      case 1:
      this.setState({
        prompt: "Please type in two more digits"
        })
        break
        case 2:
      this.setState({
        prompt: "Please type in one more digit"
        })
        break
        case 3:
        fetch(`http://localhost:5000/search/?input=${this.state.input}`)
        .then(data => data.json())
          .then(res =>
             {
             
              return res.data
             }
          ).then( primeNumber=>{
            if(primeNumber.length>0){
              fetch(`http://localhost:5000/addToSearchResults`,{
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
            },
              body:JSON.stringify({"input":this.state.input,"primeNumber":primeNumber})
          })
          this.setState({
            prompt: "Your prime number is: '" +primeNumber+ "'"
          })
          this.getData()
          //Incase there is no match found
            }else{
              this.setState({
                prompt: "No Prime Number found"
              })
            }
        }
          );
        break
      default :
      this.setState({
        prompt: "max number is of digits is 3"
      })
    }
   
    
    }
      //try use async await
  getData=  ()=>{
     fetch("http://localhost:5000/searchResults")
    .then(res => res.json())
    .then(res=> //console.log(Object.values(res.data))
      this.setState({
        searchResults : Object.values(res.data)
    })
    )
    console.log("get data")
  }

  handleInputChange = (e)=>{
   let input= e.target.value
   var inputLetters = /[a-zA-Z]+/;
   let inputSpecialCharacters = /\W/;
   let inputNumbers = /\d+/
    if(input.length>3 && inputNumbers.test(input)){
    //  this.textInput.current.style.backgroundColor = 'red'
     this.setState({
       prompt: 'max number is of digits is 3'
     })
    }else if(inputLetters.test(input)){
      this.textInput.current.style.backgroundColor = 'red'
      this.setState({
        prompt: 'sorry, letters are not allowed. Please input numbers only'
      })
    }else if(inputSpecialCharacters.test(input)){
      this.textInput.current.style.backgroundColor = 'red'
      this.setState({
        prompt: 'sorry, special characters are not allowed. Please input numbers only'
      })
    }else{
     this.textInput.current.style.backgroundColor = null 
      this.setState({
        input : input,
        prompt : ''
      })
    }
    
  }
 
  render() {
    return (
      <div className='App'>
       <div style={{height:'1rem',marginBottom:'2rem'}}><p>{this.state.prompt}</p></div>
      <div className='searchField'>
            <div>
          
          </div>
        <input id='numbers'   onChange={this.handleInputChange} value={this.state.input} required name='numbers' placeholder='type in three digits'
          ref={this.textInput}
        ></input>
       
       <div style={{marginTop:30}}>
       <span className='button' onClick={this.handleSubmit}>Search</span>
       </div>
    </div>
        <div style={{textAlign:'center'}}>
         <div className='searchResults' style={{marginTop:50}}>
         
            <table>
    <thead>
        <tr>
            <th colSpan="1">Search</th>
            <th colSpan="1">Prime Number</th>
            <th colSpan="1">Date of Search</th>
        </tr>
    </thead>
    <tbody>
    {(this.state.searchResults)? this.state.searchResults.map((element,i)=>
    <tr key={i}><td>{element.input}</td><td>{element.primeNumber}</td><td>{element.createdAt.substring(0, 10)}</td></tr>
    )
    :<tr>No Search Results</tr>}
    </tbody>
</table>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
