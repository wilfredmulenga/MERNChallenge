import React from 'react';
import { shallow } from 'enzyme';
import App from '../App'

describe('App Component ',()=>{
  it('renders without crashing`', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists())
  });
})

 describe('input state',()=>{
  it('should have value of string',()=>{
    const wrapper = shallow(<App/>);
    wrapper.setState({input:'123'})
    expect(wrapper.state('input')).toEqual('123')
  })
})

