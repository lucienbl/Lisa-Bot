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

import { Message, MessageEmbed } from "discord.js";
import CoreSentenceResolver from './CoreSentenceResolver';

class MessageDispatcher {

  static async dispatch(message: Message) {
    try {
      await new MessageDispatcher(message).parseAndDispatchMessage();
    } catch (e) {
      message.channel.send(new MessageEmbed({
        title: "An error occurred",
        color: "#F52244",
        description: e.message
      }));
    }
  }

  _message: Message;

  constructor(message: Message) {
    this._message = message;
  }

  private async parseAndDispatchMessage() {
    const { content, channel, client, author } = this._message;
  
    if (!content.toLowerCase().startsWith("lisa") && channel.type !== "dm" && !content.startsWith(`<@!${client.user.id}>`) && !content.startsWith(`<@${client.user.id}>`) && channel.name !== "lisa-bot") return;
    if (author.bot) return;

    let sentence = content;

    if (content.toLowerCase().startsWith(process.env.BOT_PREFIX)) {
      sentence = sentence.replace(process.env.BOT_PREFIX + " ", "");
    } else if (content.startsWith(`<@!${client.user.id}>`)) {
      sentence = sentence.replace(`<@!${client.user.id}>` + " ", "");
    } else if (content.startsWith(`<@${client.user.id}>`)) {
      sentence = sentence.replace(`<@${client.user.id}>` + " ", "");
    }

    CoreSentenceResolver.resolve(this._message, sentence);
  }
}

export default MessageDispatcher;