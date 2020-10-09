/*
 *   Copyright (c) 2020 Lucien Blunk-Lallet

 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.

 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.

 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Message } from 'discord.js';
import { BanMemberAction, CreateChannelAction, DeleteMessageAction } from '../actions';
import * as ActionKeys from "./ActionKeys";

class ActionsMapper {
  public static mapAndExecuteAction = (action: string, message: Message, parameters: any, successAnswer: string) => {
    return new ActionsMapper(message, parameters, successAnswer)._handleAction()[action]();
  };

  private _message: Message;
  private _parameters: any;
  private _successAnswer: string;

  constructor(message: Message, parameters: any, successAnswer: string) {
    this._message = message;
    this._parameters = parameters;
    this._successAnswer = successAnswer;
  }

  private _executeAction = (action: any) => new action().execute(this._message, this._parameters, this._successAnswer); 

  // Actions come here
  private _handleAction = () => ({
    [ActionKeys.ACTION_MESSAGE_DELETE]: () => {
      return this._executeAction(DeleteMessageAction);
    },
    [ActionKeys.ACTION_MEMBER_BAN]: () => {
      return this._executeAction(BanMemberAction);
    },
    [ActionKeys.ACTION_CHANNEL_CREATE]: () => {
      return this._executeAction(CreateChannelAction);
    }
  })
}

export default ActionsMapper; 