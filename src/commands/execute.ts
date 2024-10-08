import { ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command } from "../types/commands/Command.js";

export default {
    data: new SlashCommandBuilder()
        .setName("execute")
        .setDescription("Executes code provided through a modal."),
    isBotAdminOnly: true,
    async execute(interaction, bot) {
        const { languageManager } = bot;

        await interaction.showModal(
            new ModalBuilder()
                .setTitle(languageManager.getMessageByDiscordUser("execute-code", interaction.user))
                .setCustomId("execute")
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel(languageManager.getMessageByDiscordUser("code-to-execute", interaction.user))
                                .setCustomId("code-to-execute")
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        )
                )
        );
    },
} as Command;