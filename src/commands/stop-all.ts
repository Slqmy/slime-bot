import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/commands/Command.js";

export default {
    data: new SlashCommandBuilder()
        .setName("stop-all")
        .setDescription("Stops all bots currently running.")
        .addBooleanOption((option) => option.setName("permanently").setDescription("Whether the bots should be stopped permanently.")),
    isBotAdminOnly: true,
    async execute(interaction, bot) {
        const isPermanentStop = interaction.options.getBoolean("permanently") ?? true;

        await interaction.reply({content: bot.languageManager.getMessageByDiscordUser("stopping-all-bots", interaction.user), ephemeral: true});

        await bot.botManager.stop(isPermanentStop);
    },
} as Command;