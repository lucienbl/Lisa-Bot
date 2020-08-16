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

interface Parameters {
  [key: string]: "stringValue" | "numberValue";
}

interface Options {
  name: string;
  parameters?: Parameters;
}

class Action {

  private _options: Options;
  private _message: Message;
  private _parameters: any;

  constructor(options: Options) {
    this._options = options;
  }

  protected get message(): Message {
    return this._message;
  }

  protected get parameters(): any {
    const params = {};
    Object.keys(this._parameters.fields).forEach(key => params[key] = this._parameters.fields[key][this._options.parameters[key]]);
    return params;
  }

  public execute = async (message: Message, parameters: any, successAnswer: string) => {
    this._message = message;
    this._parameters = parameters;

    // TODO check if authorized
  
    try {
      await this.executer();
      await this._message.reply(successAnswer);
    } catch (e) {
      await this._message.reply(e.message);
    }

    this._message.channel.stopTyping();
  }

  // @ts-ignore
  protected executer = async () => {
    // nothing
  }
}

export default Action;