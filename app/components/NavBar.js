// @flow

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import routes from '../constants/routes';
import { session, eventEmitter, il8n, loginCounter } from '../index';
import uiType from '../utils/uitype';

type Location = {
  hash: string,
  pathname: string,
  search: string
};

type Props = {
  location: Location
};

type State = {
  darkMode: boolean,
  navBarCount: number
};

class NavBar extends Component<Props, State> {
  props: Props;

  state: State;

  activityTimer: IntervalID;

  constructor(props?: Props) {
    super(props);
    this.state = {
      darkMode: session.darkMode,
      navBarCount: loginCounter.navBarCount
    };
    this.darkModeOn = this.darkModeOn.bind(this);
    this.darkModeOff = this.darkModeOff.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    eventEmitter.on('darkmodeon', this.darkModeOn);
    eventEmitter.on('darkmodeoff', this.darkModeOff);
    loginCounter.navBarCount++;
  }

  componentWillUnmount() {
    if (session.walletPassword !== '') {
      clearInterval(this.activityTimer);
    }
    eventEmitter.off('darkmodeon', this.darkModeOn);
    eventEmitter.off('darkmodeoff', this.darkModeOff);
  }

  darkModeOn = () => {
    this.setState({
      darkMode: true
    });
  };

  darkModeOff = () => {
    this.setState({
      darkMode: false
    });
  };

  logOut = () => {
    eventEmitter.emit('logOut');
  };

  render() {
    // prettier-ignore
    const { location: { pathname } } = this.props;
    const { darkMode, navBarCount } = this.state;
    const { fillColor, elementBaseColor, settingsCogColor } = uiType(darkMode);

    return (
      <div>
        <div
          className={
            navBarCount > 0
              ? `headerbar ${fillColor}`
              : `headerbar-slidedown ${fillColor}`
          }
        >
          {loginCounter.isLoggedIn && (
            <nav
              className={`navbar ${elementBaseColor}`}
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-menu">
                <div className="navbar-brand">
                  <div className="navbar-item">
                    <img
                      src="images/icon_color_64x64.png"
                      alt="coin ninja wallet pro logo in orange"
                    />
                  </div>
                </div>
                <div className="navbar-start">
                  <Link to={routes.HOME} className="navbar-item">
                    <i className="fa fa-credit-card" />
                    {pathname === '/' && (
                      <strong>&nbsp;&nbsp;{il8n.wallet}</strong>
                    )}
                    {pathname !== '/' && <p>&nbsp;&nbsp;{il8n.wallet}</p>}
                  </Link>

                  <Link className="navbar-item" to={routes.SEND}>
                    <i className="fa fa-paper-plane" />
                    {pathname === '/send' && (
                      <strong>&nbsp;&nbsp;{il8n.send}</strong>
                    )}
                    {pathname !== '/send' && <p>&nbsp;&nbsp;{il8n.send}</p>}
                  </Link>

                  <Link className="navbar-item" to={routes.RECEIVE}>
                    <i className="fa fa-arrow-circle-down" />
                    {pathname === '/receive' && (
                      <strong>&nbsp;&nbsp;{il8n.receive}</strong>
                    )}
                    {pathname !== '/receive' && (
                      <p>&nbsp;&nbsp;{il8n.receive}</p>
                    )}
                  </Link>
                </div>
                <div className="navbar-end">
                  {session.walletPassword !== '' && (
                    <div className="navbar-item">
                      <Link className="buttons" to={routes.LOGIN}>
                        <span
                          className="button icon is-large is-danger"
                          onClick={this.logOut}
                          onKeyPress={this.logOut}
                          role="button"
                          tabIndex={0}
                        >
                          <i className="fa fa-lock" />
                        </span>
                      </Link>
                    </div>
                  )}
                  <div className="navbar-item">
                    <Link className="buttons" to={routes.SETTINGS}>
                      <span
                        className={`button icon is-large ${settingsCogColor}`}
                      >
                        <i className="fa fa-cog" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          )}
          {!loginCounter.isLoggedIn && (
            <nav
              className={`navbar ${elementBaseColor}`}
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-menu">
                <div className="navbar-brand" />
                <div className="navbar-end">
                  <div className="navbar-item">
                    <Link className="buttons" to={routes.SETTINGS}>
                      <span className="icon button is-large is-danger">
                        <i className="fas fa-chevron-left" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    );
  }
}

// $FlowFixMe
export default withRouter(NavBar);
