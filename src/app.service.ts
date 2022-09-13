import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Context, Markup, Scenes, session, Telegraf } from 'telegraf';
import { CreateUserInput } from './users/dto/create-user.input';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';
import { MyContext } from './wizards/context';
import { newsletter } from './wizards/newsletter.wizard';
import { wRead } from './wizards/read.wizard';
import { weather } from './wizards/weather.wizard';

const Stage = Scenes.Stage
const WizardScene = Scenes.WizardScene
const Scene = Scenes.BaseScene

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService, private readonly usersService: UsersService) { }

  private sceneRegistration(bot: Telegraf<MyContext>) {
    const stage = new Stage([weather, wRead, newsletter]);

    bot.use(session());
    bot.use((ctx, next) => {
      ctx.service = this.usersService;
      return next();
    });
    bot.use(stage.middleware());
  }

  runBot() {
    const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN);
    const weatherButton = { text: "Погода в Канаде", callback_data: "getWeather" };
    const wantRead = { text: "Хочу почитать!", callback_data: "wantRead" };
    const makeNewsletter = { text: "Сделать рассылку", callback_data: "newsletter" };

    this.sceneRegistration(bot);

    bot.start(async (ctx, next) => {
        await ctx.reply("Здравствуйте. Нажмите на любую интересующую Вас кнопку", Markup.inlineKeyboard([weatherButton, wantRead, makeNewsletter]));
        //записываем нового юзера в таблицу
        const user_id = ctx.message.from.id.toString();
        const chat_id = ctx.message.chat.id.toString();
        let user: CreateUserInput = new User();
        user.user_id = user_id;
        user.chat_id = chat_id;
        try {
          const newUser = await this.usersService.create(user);
        } catch (error) {
          console.error(error);
        }
        return next();
      });

      bot.launch();
      //actions
      bot.action("getWeather", (ctx) => { ctx.scene.enter('getWeather'); });
      bot.action("wantRead", (ctx) => { ctx.scene.enter('wantRead'); });
      bot.action("newsletter", (ctx) => { ctx.scene.enter('newsletter'); });
      //
      process.once('SIGINT', () => bot.stop('SIGINT'))
      process.once('SIGTERM', () => bot.stop('SIGTERM'))
    }
}
