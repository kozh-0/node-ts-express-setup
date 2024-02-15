import { Logger, ILogObj } from "tslog";

// LoggerService это абстракиця над TSLOG, для сокрытия настроек извне с помощью private
// Также можно дополнять эти методы, для лаконичности кода в другом месте
// Например можем добавить отправку ошибки в сентри
class LoggerService {
  private logger: Logger<ILogObj>;

  constructor() {
    // Можно внутрь передать настройки https://tslog.js.org/#/?id=settings
    this.logger = new Logger({
      prettyLogTemplate: "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}}    ",
    });
  }

  // Вообще ко всем методам можно приписать static, импортировать в любой файл и вызывать методы без создания инстанса класса
  // Но так нельзя было бы тестировать приложение, поэтому надо делать Dependency Injection = прокидывать пропсы как в реакте
  log(...args: unknown[]) {
    this.logger.info(...args);
  }
  error(...args: unknown[]) {
    this.logger.error(...args);
  }
  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }
}

export const MyLogger = new LoggerService();
