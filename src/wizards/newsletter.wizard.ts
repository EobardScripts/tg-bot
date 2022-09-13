import { User } from "src/users/entities/user.entity";
import { Markup, Scenes, Telegraf } from "telegraf";
import { MyContext } from "./context";

export const newsletter = new Scenes.WizardScene<MyContext>("newsletter",
    async (ctx) => {
        const yesButton = Markup.button.callback("Уверен", "yes");
        const noButton = Markup.button.callback("Отмена", "cancel");
        await ctx.reply("Вы выбрали рассылку всем пользователям. Вы уверен что хотите это сделать?", Markup.inlineKeyboard([yesButton, noButton]));
        ctx.wizard.next();
    },
    async (ctx) => {
        const callback = ctx.callbackQuery.data;
        if (callback === 'yes') {
            await ctx.reply("Введите сообщение, которое хотите отправить всем пользователям.");
            ctx.wizard.next();
        } else if (callback === 'cancel') {
            console.log('leave');
            ctx.scene.leave();
        }
    },
    async (ctx) => {
        try {
            if ('text' in ctx.message) {
                const message: string = ctx.message?.text;
                const users: [User] = await ctx.service.findAll();
                let countSend: number = 0;
                if (!users) {
                    await ctx.reply("Нет пользователей для рассылки.");
                    ctx.scene.leave();
                } else {
                    users.forEach(async user => {
                        try {
                            if (+user.chat_id !== ctx.message.chat.id) {
                                ctx.telegram.sendMessage(user.chat_id, message).catch(async error => {
                                    if (error.response.error_code === 403) {
                                        ctx.service.remove(user.id);
                                    }
                                });
                                countSend++;
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    });

                    if (countSend > 0) {
                        ctx.reply(`Успешно сделали рассылку для ${countSend} пользователей.`);
                        ctx.scene.leave();
                    } else {
                        ctx.reply('К сожалению, кроме Вас не для кого делать рассылку.');
                        ctx.scene.leave();
                    }
                };
            }
        } catch (error) {
            console.error(error);
        }
    }
);