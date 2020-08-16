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

import Action from "../Action";
import { DiscordUtils } from '../../utils';

class DeleteMessageAction extends Action {
  constructor() {
    super({
      name: "message.delete",
      parameters: {
        user: 'stringValue',
        amount: "numberValue"
      }
    });
  }

  executer = async () => {
    if (this.parameters.user) {
      await this.message.channel.bulkDelete((await this.message.channel.messages.fetch()).filter(msg => msg.author.id === DiscordUtils.getIdFromMention(this.parameters.user)).first(this.parameters.amount).map(msg => msg.id));
    } else {
      await this.message.channel.bulkDelete(this.parameters.amount);
    }
  }
}

export default DeleteMessageAction;