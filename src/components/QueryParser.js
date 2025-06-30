class QueryParser {
  constructor(commands, searchDelimiter = ':', pathDelimiter = '/') {
    this.commands = commands;
    this.searchDelimiter = searchDelimiter;
    this.pathDelimiter = pathDelimiter;
    this.protocolRegex = /^[a-zA-Z]+:\/\//i;
    this.urlRegex = /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i;
  }

  parse(query) {
    const result = { 
      query: query.trim(), 
      split: null,
      isUrl: false,
      isKey: false,
      isSearch: false,
      isPath: false,
      isSpecialCommand: false,
      redirect: null,
      key: null,
      path: null
    };

    const trimmed = query.trim();

    // Verificar comandos especiais
    if (this.isSpecialCommand(trimmed)) {
      result.isSpecialCommand = true;
      return result;
    }

    // Verificar se é URL
    if (this.urlRegex.test(trimmed)) {
      const hasProtocol = this.protocolRegex.test(trimmed);
      result.isUrl = true;
      result.redirect = hasProtocol ? trimmed : 'http://' + trimmed;
      return result;
    }

    // Verificar comandos
    const splitSearch = trimmed.split(this.searchDelimiter);
    const splitPath = trimmed.split(this.pathDelimiter);

    // Procurar por comandos correspondentes
    for (const command of this.commands) {
      // Comando exato (ex: "g" -> GitHub)
      if (query === command.key) {
        result.key = command.key;
        result.isKey = true;
        result.redirect = command.url;
        result.command = command;
        return result;
      }

      // Comando de busca (ex: "g:react" -> buscar "react" no GitHub)
      if (splitSearch[0] === command.key && command.search && splitSearch.length > 1) {
        result.key = command.key;
        result.isSearch = true;
        result.split = this.searchDelimiter;
        result.query = this.shiftAndTrim(splitSearch, result.split);
        result.redirect = this.prepSearch(command.url, command.search, result.query);
        result.command = command;
        return result;
      }

      // Comando de path (ex: "r/programming" -> reddit.com/r/programming)
      if (splitPath[0] === command.key && splitPath.length > 1) {
        result.key = command.key;
        result.isPath = true;
        result.split = this.pathDelimiter;
        result.path = this.shiftAndTrim(splitPath, result.split);
        result.redirect = this.prepPathWithKey(command.url, command.key, result.path);
        result.command = command;
        return result;
      }

      // Comando padrão (fallback para busca)
      if (command.key === '*') {
        result.redirect = this.prepSearch(command.url, command.search, query);
        result.command = command;
      }
    }

    return result;
  }

  isSpecialCommand(query) {
    const specialCommands = [
      '?', 'q!', 'invert!', 'keys!',
      /^\d!$/, // 1!, 2!, 3!, etc.
    ];

    return specialCommands.some(cmd => {
      if (cmd instanceof RegExp) {
        return cmd.test(query);
      }
      return query === cmd;
    });
  }

  shiftAndTrim(arr, delimiter) {
    return arr.slice(1).join(delimiter).trim();
  }

  prepSearch(url, search, query) {
    return url + search.replace('{}', encodeURIComponent(query));
  }

  prepPath(url, path) {
    return url + (url.endsWith('/') ? '' : '/') + path;
  }

  // Versão melhorada que preserva o prefixo da chave quando necessário
  prepPathWithKey(url, key, path) {
    // Para comandos que precisam preservar o prefixo da chave no path
    const needsKeyPrefix = [
      'r',    // Reddit: r/programming -> reddit.com/r/programming
      'u',    // Reddit User: u/username -> reddit.com/u/username (se existir)
    ];

    if (needsKeyPrefix.includes(key)) {
      return url + (url.endsWith('/') ? '' : '/') + key + '/' + path;
    }

    // Para todos os outros casos, usar path direto
    return url + (url.endsWith('/') ? '' : '/') + path;
  }

  // Método para processar comandos especiais
  processSpecialCommand(query, callbacks = {}) {
    switch (query) {
      case '?':
        if (callbacks.onHelp) callbacks.onHelp();
        break;
      case 'q!':
        if (callbacks.onQuickLaunch) callbacks.onQuickLaunch();
        break;
      case 'invert!':
        if (callbacks.onInvertColors) callbacks.onInvertColors();
        break;
      case 'keys!':
        if (callbacks.onToggleKeys) callbacks.onToggleKeys();
        break;
      default:
        // Verificar se é comando de categoria (1!, 2!, etc.)
        const categoryMatch = query.match(/^(\d)!$/);
        if (categoryMatch && callbacks.onCategoryLaunch) {
          callbacks.onCategoryLaunch(parseInt(categoryMatch[1]) - 1);
        }
        break;
    }
  }

  // Método para obter sugestões baseadas no parsing
  getSuggestions(query, limit = 5) {
    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    // Sugestões de comandos
    this.commands.forEach(command => {
      if (command.key.startsWith(lowerQuery)) {
        suggestions.push({
          type: 'command',
          text: `${command.key} → ${command.name}`,
          value: command.key,
          command: command
        });
      }
    });

    // Sugestões de busca para comandos que suportam
    if (query.includes(this.searchDelimiter)) {
      const [key, searchTerm] = query.split(this.searchDelimiter);
      const command = this.commands.find(cmd => cmd.key === key && cmd.search);
      if (command && searchTerm) {
        suggestions.push({
          type: 'search',
          text: `Buscar "${searchTerm}" em ${command.name}`,
          value: query,
          command: command
        });
      }
    }

    // Sugestões de path para comandos que suportam
    if (query.includes(this.pathDelimiter)) {
      const [key, path] = query.split(this.pathDelimiter);
      const command = this.commands.find(cmd => cmd.key === key);
      if (command && path) {
        suggestions.push({
          type: 'path',
          text: `Ir para ${command.name}/${path}`,
          value: query,
          command: command
        });
      }
    }

    return suggestions.slice(0, limit);
  }
}

export default QueryParser;