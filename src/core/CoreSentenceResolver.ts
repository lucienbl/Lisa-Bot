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
import { container } from 'tsyringe';
import DialogFlow from './DialogFlow';
import ActionsMapper from './ActionsMapper';

class CoreSentenceResolver {

  static resolve = (message: Message, sentence: string) => {
    new CoreSentenceResolver(message, sentence).process();
  }

  _message: Message;
  _sentence: string;
  _dialogFlow: DialogFlow;

  constructor(message: Message, sentence: string) {
    this._message = message;
    this._sentence = sentence;
    this._dialogFlow = container.resolve(DialogFlow);
  }
  
  process = async () => {
    this._message.channel.startTyping();
    const response = await this._dialogFlow.getResponse(this._message.channel.id, this._sentence);

    const answer = response.fulfillmentText.replace(/\\n/g, '\n');

    if (response.allRequiredParamsPresent && response.action) {
      this.parseAction(response.action, response.parameters, answer);
    } else {
      await this._message.reply(answer);
      this._message.channel.stopTyping();
    }
  }

  parseAction = async (action: string, parameters: any, successAnswer: string) => {
    try {
      ActionsMapper.mapAndExecuteAction(action, this._message, parameters, successAnswer);
    } catch (e) {
      // fallback
      await this._message.reply(successAnswer);
      this._message.channel.stopTyping();
    }
  }
}

export default CoreSentenceResolver;
