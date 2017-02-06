import React, { Component } from 'react';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='push' width='thin' visible={true} icon='labeled' vertical inverted>
            <Menu.Item name='settings' href="http://localhost:3000">
              <Icon name='settings' />
              Settings
            </Menu.Item>
            <Menu.Item name='SSH' href="http://localhost:3001">
              <Icon name='terminal' />
              SSH
            </Menu.Item>
            <Menu.Item name='VNC' href="http://localhost:3001">
              <Icon name='desktop' />
              VNC
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
              <div>
                <div className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h2>Welcome to React</h2>
                </div>
              </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default App;
