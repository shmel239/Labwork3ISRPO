import * as vscode from 'vscode';

/**
 * Функция активации расширения.
 * @param context Контекст расширения, который позволяет управлять его жизненным циклом.
 */
export function activate(context: vscode.ExtensionContext) {
    // Регистрация команды 'extension.showTodoList'
    let disposable = vscode.commands.registerCommand('extension.showTodoList', async () => {
        // Получаем активный текстовый редактор
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Откройте файл для анализа.');
            return;
        }

        const document = editor.document;
        const todoList: string[] = [];

        // Ищем комментарии с TODO и FIXME
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            // Проверяем наличие TODO или FIXME в строке
            if (text.includes('TODO') || text.includes('FIXME')) {
                // Добавляем строку с номером и текстом комментария в список
                todoList.push(`${line.lineNumber + 1}: ${text.trim()}`);
            }
        }

        // Если список пуст, уведомляем пользователя
        if (todoList.length === 0) {
            vscode.window.showInformationMessage('Нет комментариев TODO или FIXME.');
            return;
        }

        // Отображаем список комментариев в веб-панели
        const todoListString = todoList.join('\n');
        const panel = vscode.window.createWebviewPanel(
            'todoList', // Идентификатор веб-панели
            'Список TODO и FIXME', // Заголовок веб-панели
            vscode.ViewColumn.One, // Колонка, в которой будет открыта панель
            {} // Опции веб-панели
        );

        // Устанавливаем HTML-контент для веб-панели
        panel.webview.html = getWebviewContent(todoListString);
    });

    // Добавляем команду в список подписок контекста
    context.subscriptions.push(disposable);
}

/**
 * Генерирует HTML-контент для веб-панели.
 * @param todoList Список комментариев TODO и FIXME.
 * @returns HTML-код для отображения в веб-панели.
 */
function getWebviewContent(todoList: string) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Список TODO и FIXME</title>
    </head>
    <body>
        <h1>Список TODO и FIXME</h1>
        <pre>${todoList}</pre>
    </body>
    </html>`;
}

/**
 * Функция деактивации расширения.
 * Вызывается при отключении расширения.
 */
export function deactivate() {}