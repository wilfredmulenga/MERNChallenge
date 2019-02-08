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
  

  handleSubmit = async ()=>{
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
       try{
         const data = await fetch(`http://localhost:5000/search/?input=${this.state.input}`)
        const res = await data.json()
        await fetch(`http://localhost:5000/addToSearchResults`,{
                 method: 'POST',
                 headers: {
                   "Content-Type": "application/json",
               },
                 body:JSON.stringify({"input":this.state.input,"primeNumber":res.data})
             })
            
            await this.getData()
            if(res.data.length !==0){
              this.setState({
                prompt: "Your prime number is: '" +res.data+ "'"
              })
            }else{
              this.setState({
                prompt: "No Prime Number found"
              })
            }
      
        }catch(err){
           console.log(err)
         }
        break
      default :
      this.setState({
        prompt: "max number is of digits is 3"
      })
    }
   
    
    }
      //try use async await
  getData=  async ()=>{
    try{ 
     const data =  await fetch("http://localhost:5000/searchResults")
     const res = await data.json()
     this.setState({
       searchResults:Object.values(res.data)
     })
     console.log(Object.values(res.data))
    }catch(err){
      console.log(err)
    }
     
  }

  handleInputChange = (e)=>{
   let input= e.target.value
   var inputLetters = /[a-zA-Z]+/;
   let inputSpecialCharacters = /\W/;
   let inputNumbers = /\d+/
    if(input.length>3 && inputNumbers.test(input)){
      this.textInput.current.style.backgroundColor = '#FFCCCC'
     this.setState({
       prompt: 'max number is of digits is 3'
     })
    }else if(inputLetters.test(input)){
      this.textInput.current.style.backgroundColor = '#FFCCCC'
      this.setState({
        prompt: 'sorry, letters are not allowed. Please input numbers only'
      })
    }else if(inputSpecialCharacters.test(input)){
      this.textInput.current.style.backgroundColor = '#FFCCCC'
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
       <div style={{height:'1rem',marginBottom:'2rem'}}><p className='heading'>{this.state.prompt}</p></div>
      <div className='searchField'>
        <input id='numbers'   onChange={this.handleInputChange} value={this.state.input} required name='numbers' placeholder='type in three digits'
          ref={this.textInput}
        ></input>
       
       <div style={{marginTop:30}}>
       <span className='button' onClick={this.handleSubmit}>Search</span>
       </div>
    </div>
        <div style={{textAlign:'center'}}>
        <p className='heading'>Results</p>
         <div className='searchResults' >
         {(this.state.searchResults)?
            <table>
    <thead>
        <tr>
            <th colSpan="1">Date of Search</th>
            <th colSpan="1">Search</th>
            <th colSpan="1">Prime Number</th>
        </tr>
    </thead>
    
     {this.state.searchResults.map((element,i)=><tbody key={i}>
    <tr><td>{element.createdAt.substring(0, 10)}</td><td>{element.input}</td><td>{element.primeNumber}</td></tr>
     </tbody>)}</table>:<p style={{color:'grey'}}>No Search Results</p>}
        </div>
        </div>
      </div>
    );
  }
}

export default App;
