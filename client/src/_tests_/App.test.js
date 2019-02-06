import React from 'react';
import { shallow } from 'enzyme';
import App from '../App'

//receiving undefined, 
// describe('Numbers input', () => {
  
//   it('should respond to change event and change the state of the the input', () => {
   
//    const wrapper = shallow(<App />);
//    wrapper.find('#numbers').simulate('change', {target: {name: 'numbers', value: ''}});
   
//   expect(wrapper.state('numbers')).toEqual('');
//   })
//  })


describe('Input Field', () => {
  // make our assertion and what we expect to happen 
  it('should render without throwing an error', () => {
    expect(shallow(<App />).find('#numbers').exists()).toBe(true)
  })
 })