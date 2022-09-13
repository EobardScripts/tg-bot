import { Context, Scenes, Telegram } from "telegraf";
import { Update, UserFromGetMe } from "typegram";

export interface iService {
    [name: string]: any
}

export class MyContext extends Context {
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<MyContext>;
    service: iService;

    constructor(update: Update, telegram: Telegram, botInfo: UserFromGetMe) {
        super(update, telegram, botInfo);
    }
}