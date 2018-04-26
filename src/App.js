import React, { Component } from 'react';
import constants from './includes/Constants';
import CryptoJs from 'crypto-js';

const CredentialsContext = React.createContext();

class CredentialsProvider extends Component {
    state = {
        password: '',
        referral: '',
        note: '',
        screen: 1
    };
    render() {
        return(
            <CredentialsContext.Provider value = {{
                state: this.state,
                addReferral: (val) => {
                    this.setState({ referral: val });
                },
                addPassword: (val) => {
                    this.setState({ password: val });
                },
                checkReferral: () => {
                    if(this.state.referral === constants.credentials.referral) {
                        this.setState({ screen: this.state.screen + 1 })
                    }
                },
                checkPassword: () => {
                    if(this.state.password === constants.credentials.password) {
                        this.setState({ screen: this.state.screen + 1 })
                    }
                },
                addNote: (val) => {
                    this.setState({ note: val });
                },
                encryptNote: () => {
                    let enc = CryptoJs.AES.encrypt(this.state.note, constants.encryptKey);
                    this.setState({note: enc});
                }
            }}>
                {this.props.children}
            </CredentialsContext.Provider>
        )
    }
}

const Referral = () => (
    <div className="referralMain">
        <CredentialsContext.Consumer>
            {
                (context) => {
                    if(context.state.screen === 1) {
                        return(
                            <React.Fragment>
                                <input type="text" placeholder="Please enter referral name" onChange={ (event) => context.addReferral(event.target.value)} key={context.state.screen}/>
                                <button onClick={() => context.checkReferral()} key={'btn' + context.state.screen}>Enter</button>
                            </React.Fragment>
                        )
                    }
                    else if(context.state.screen === 2) {
                        return(
                            <React.Fragment>
                                <input type="text" placeholder="Please enter password" onChange={ (event) => context.addPassword(event.target.value)} key={context.state.screen} />
                                <button onClick={() => context.checkPassword()} key={'btn' + context.state.screen}>Enter Password</button>
                            </React.Fragment>
                        )
                    }
                    else if(context.state.screen === 3) {
                        return(
                            <React.Fragment>
                                <textarea key={context.screen} onChange={(event) => context.addNote(event.target.value)}/>
                                <button key={'btn' + context.state.screen} onClick={() => context.encryptNote()} >Encrypt message</button>
                                <button onClick={() => alert(context.state.note)} key='enc'>Show encrypted</button>
                                <button onClick={() => {
                                    let decrypted = CryptoJs.AES.decrypt(context.state.note, constants.encryptKey);
                                    alert(decrypted.toString(CryptoJs.enc.Utf8));
                                }} key='dec'>Show decrypted message</button>
                            </React.Fragment>
                        )
                    }
                }
            }
        </CredentialsContext.Consumer>
    </div>
);

class App extends Component {
  render() {
    return (
        <CredentialsProvider>
            <Referral />
        </CredentialsProvider>
    );
  }
}

export default App;
