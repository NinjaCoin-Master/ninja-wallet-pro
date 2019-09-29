// @flow
//
// Copyright (C) 2019 ExtraHash
//
// Please see the included LICENSE file for more information.
import React, { Component } from 'react';
import { remote } from 'electron';
import ReactTooltip from 'react-tooltip';
import { session, daemonLogger, eventEmitter } from '../index';
import NavBar from './NavBar';
import BottomBar from './BottomBar';
import Redirector from './Redirector';
import Modal from './Modal';
import uiType from '../utils/uitype';

type Props = {};

type State = {
  darkMode: boolean,
  daemonLog: string[]
};

export default class Receive extends Component<Props, State> {
  props: Props;

  state: State;

  daemonLog: string[];

  constructor(props?: Props) {
    super(props);
    this.daemonLog = daemonLogger ? daemonLogger.daemonLog : [];
    const { darkMode } = session;

    this.state = {
      darkMode,
      daemonLog: this.daemonLog
    };

    this.refreshConsole = this.refreshConsole.bind(this);
  }

  componentDidMount() {
    eventEmitter.on('refreshConsole', this.refreshConsole);
  }

  componentWillUnmount() {
    eventEmitter.off('refreshConsole', this.refreshConsole);
  }

  refreshConsole = () => {
    if (daemonLogger) {
      const { daemonLog } = daemonLogger;
      this.setState({
        daemonLog
      });
    }
  };

  render() {
    const { darkMode, daemonLog } = this.state;
    const { backgroundColor, textColor, fillColor, toolTipColor } = uiType(
      darkMode
    );

    // note: the css uses flexbox to reverse this DIV (it treats the top as the bottom)
    return (
      <div>
        <Redirector />
        <ReactTooltip
          effect="solid"
          type={toolTipColor}
          multiline
          place="top"
        />
        <Modal darkMode={darkMode} />
        <div className={`wholescreen ${backgroundColor}`}>
          <NavBar darkMode={darkMode} />
          <div className={`maincontent ${fillColor} ${textColor} terminal`}>
            {false && (
              <input
                className="bash-prompt has-text-weight-bold has-icons-left has-text-success is-family-monospace"
                ref={input => input && input.focus()}
                type="text"
              />
            )}
            {daemonLog.map(consoleOut => {
              let logColor = textColor;
              const isProtocol = consoleOut.includes('NinjaCoin');
              const isCheckpoints = consoleOut.includes('[checkpoints]');
              const addedToMainChain = consoleOut.includes(
                'added to main chain'
              );
              const stopSignalSent = consoleOut.includes('Stop signal sent');
              const isError = consoleOut.includes('ERROR');
              const isViolet = consoleOut.includes('===');
              const isAscii =
                consoleOut.includes('█') ||
                consoleOut.includes('═') ||
                consoleOut.includes('_') ||
                consoleOut.includes('|');

              const isLink = consoleOut.includes(
                'https://github.com/ninjacoin-master/ninjacoin/blob/master/LICENSE'
              );
              const isChatLink = consoleOut.includes(
                'https://discord.gg/VaKtsXt'
              );

              let logText = consoleOut.replace('[protocol]', '');
              logText = logText.replace('[Core]', '');
              logText = logText.replace('[daemon]', '');
              logText = logText.replace('[node_server]', '');
              logText = logText.replace('[RocksDBWrapper]', '');
              logText = logText.replace('https://discord.gg/VaKtsXt', '');

              if (isProtocol || isCheckpoints || addedToMainChain) {
                logColor = 'has-text-success has-text-weight-bold';
              }

              if (stopSignalSent) {
                logColor = 'has-text-primary has-text-weight-bold';
              }

              if (isError) {
                logColor = 'has-text-danger has-text-weight-bold';
              }

              if (isViolet) {
                logColor = 'has-text-violet has-text-weight-bold';
              }

              if (isAscii) {
                return null;
              }

              if (isLink) {
                return (
                  <a
                    className="has-text-link is-family-monospace"
                    onClick={() => remote.shell.openExternal(logText)}
                    onKeyPress={() => remote.shell.openExternal(logText)}
                    role="button"
                    tabIndex={0}
                    onMouseDown={event => event.preventDefault()}
                  >
                    {logText}
                  </a>
                );
              }

              if (isChatLink) {
                return (
                  <p key={consoleOut} className="is-family-monospace">
                    {logText}{' '}
                    <a
                      className="has-text-link is-family-monospace"
                      onClick={() =>
                        remote.shell.openExternal('https://discord.gg/VaKtsXt')
                      }
                      onKeyPress={() =>
                        remote.shell.openExternal('https://discord.gg/VaKtsXt')
                      }
                      role="button"
                      tabIndex={0}
                      onMouseDown={event => event.preventDefault()}
                    >
                      https://discord.gg/VaKtsXt
                    </a>
                  </p>
                );
              }

              return (
                <p
                  key={consoleOut}
                  className={`is-family-monospace ${logColor}`}
                >
                  {logText}
                </p>
              );
            })}
          </div>
          <BottomBar darkMode={darkMode} />
        </div>
      </div>
    );
  }
}
