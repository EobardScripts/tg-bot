import { HttpService } from '@nestjs/axios';
import axios from "axios";
import { Scenes } from "telegraf";
import { MyContext } from "./context";

export const wRead = new Scenes.WizardScene<MyContext>("wantRead",
    async (ctx) => {
        const urlImage = 'https://pythonist.ru/wp-content/uploads/2020/03/photo_2021-02-03_10-47-04-350x2000-1.jpg';
        const pathZip = 'C:\\Users\\Alex\\Desktop\\tg-bot\\src\\files\\karmaniy_spravochnik_po_piton.zip';
        const httpService: HttpService = new HttpService();

        try {
            await ctx.replyWithPhoto({ url: urlImage }, { caption: "Идеальный карманный справочник для быстрого ознакомления с особенностями работы разработчиков на Python. Вы найдете море краткой информации о типах и операторах в Python, именах специальных методов, встроенных функциях, исключениях и других часто используемых стандартных модулях." });
            await ctx.replyWithDocument({ source: pathZip });
        } catch (error) {
            console.error(error);
        }
        ctx.scene.leave();
    });