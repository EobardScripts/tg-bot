import { AxiosResponse } from "axios";
import { Scenes } from "telegraf";
import { MyContext } from "./context";
import { HttpService } from '@nestjs/axios';

async function getWeather(): Promise<AxiosResponse<any>> {
    const httpService: HttpService = new HttpService();
    const city: string = "Canada";
    const url: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&units=metric&APPID=${process.env.API_KEY}`;
    let result;
    try {
        result = await httpService.axiosRef.get(url);
    } catch (error) {
        console.error(error);
    }
    return result;
}

export const weather = new Scenes.WizardScene<MyContext>("getWeather",
    async (ctx) => {
        const weather = await getWeather();
        if (weather !== undefined) {
            const weatherInfo = `Погода в городе: ${weather.data?.name}\r\nСегодня: ${weather.data?.weather[0]?.description}\r\nТемпература: ${weather.data?.main?.temp}°C\r\nВлажность: ${weather.data?.main?.humidity}\r\nВетер: ${weather.data?.wind?.speed} км/ч`;
            await ctx.reply(weatherInfo);
            ctx.scene.leave();
        }
        else {
            await ctx.reply("Ошибка при попытке узнать погоду.");
            ctx.scene.leave();
        }
    });