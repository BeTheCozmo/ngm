#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const boxen = require('boxen');
const figlet = require('figlet');

class AngularModuleGenerator {
  constructor() {
    this.moduleName = '';
    this.modulePath = '';
    this.spinner = null;
  }

  // Exibe o banner inicial
  showBanner() {
    console.clear();
    const title = figlet.textSync('modularizer', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });

    console.log(chalk.cyan(title));
    console.log(chalk.gray('Angular Module Generator - Versão 1.0.0'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log();
  }

  // Valida se está em um projeto Angular
  validateAngularProject() {
    const spinner = ora('Validando projeto Angular...').start();

    try {
      if (!fs.existsSync('angular.json')) {
        spinner.fail('Erro: Este comando deve ser executado na raiz de um projeto Angular');
        process.exit(1);
      }

      if (!fs.existsSync('src/app')) {
        spinner.fail('Erro: Diretório src/app não encontrado');
        process.exit(1);
      }

      spinner.succeed('Projeto Angular válido encontrado');
    } catch (error) {
      spinner.fail('Erro ao validar projeto');
      process.exit(1);
    }
  }

  // Capitaliza a primeira letra
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Converte para camelCase
  toCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  // Converte para kebab-case
  toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // Coleta informações do usuário
  async collectUserInput() {
    const questions = [
      {
        type: 'input',
        name: 'moduleName',
        message: chalk.cyan('📦 Nome do módulo:'),
        validate: (input) => {
          if (!input.trim()) {
            return 'Nome do módulo é obrigatório';
          }
          if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(input)) {
            return 'Nome deve começar com letra e conter apenas letras, números e hífens';
          }
          return true;
        }
      },
      {
        type: 'confirm',
        name: 'generateService',
        message: chalk.cyan('🔧 Gerar service?'),
        default: true
      },
      {
        type: 'confirm',
        name: 'generateGuard',
        message: chalk.cyan('🛡️  Gerar guard?'),
        default: true
      },
      {
        type: 'confirm',
        name: 'generateLayout',
        message: chalk.cyan('🎨 Gerar layout?'),
        default: true
      },
      {
        type: 'confirm',
        name: 'generateModels',
        message: chalk.cyan('📋 Gerar models?'),
        default: true
      }
    ];

    return await inquirer.prompt(questions);
  }

  // Cria estrutura de diretórios
  createDirectoryStructure(moduleName) {
    const spinner = ora('📁 Criando estrutura de diretórios...').start();

    try {
      this.modulePath = path.join('src', 'app', moduleName);

      const directories = [
        this.modulePath,
        path.join(this.modulePath, 'services'),
        path.join(this.modulePath, 'layouts'),
        path.join(this.modulePath, 'components'),
        path.join(this.modulePath, 'models')
      ];

      directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      spinner.succeed('Estrutura de diretórios criada com sucesso');
      this.showDirectoryTree();
    } catch (error) {
      spinner.fail('Erro ao criar estrutura de diretórios');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }

  // Mostra a árvore de diretórios criada
  showDirectoryTree() {
    const tree = `
${chalk.gray('src/app/')}${chalk.cyan(this.moduleName)}
├── ${chalk.yellow('services/')}
├── ${chalk.yellow('layouts/')}
├── ${chalk.yellow('components/')}
└── ${chalk.yellow('models/')}`;

    console.log(boxen(tree, {
      padding: 1,
      borderColor: 'gray',
      title: 'Estrutura Criada',
      titleAlignment: 'center'
    }));
  }

  // Gera service usando Angular CLI
  generateService(moduleName) {
    const spinner = ora('🔧 Gerando service...').start();

    try {
      const servicePath = `${moduleName}/services/${moduleName}`;
      execSync(`ng generate service ${servicePath} --skip-tests=true`, { stdio: 'pipe' });

      // Melhora o conteúdo do service gerado
      this.enhanceServiceContent(moduleName);

      spinner.succeed(`Service ${moduleName}.service.ts criado`);
    } catch (error) {
      spinner.fail('Erro ao gerar service');
      console.error(chalk.red(error.message));
    }
  }

  // Melhora o conteúdo do service com métodos básicos
  enhanceServiceContent(moduleName) {
    const servicePath = path.join(this.modulePath, 'services', `${moduleName}.service.ts`);
    const capitalizedName = this.capitalize(this.toCamelCase(moduleName));

    const serviceContent = `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ${capitalizedName}, 
  ${capitalizedName}CreateRequest, 
  ${capitalizedName}UpdateRequest,
  ${capitalizedName}Response,
  ${capitalizedName}ListResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ${capitalizedName}Service {
  private readonly apiUrl = '/api/${moduleName}';

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os ${moduleName}s
   */
  getAll(page: number = 1, limit: number = 10): Observable<${capitalizedName}ListResponse> {
    return this.http.get<${capitalizedName}ListResponse>(
      \`\${this.apiUrl}?page=\${page}&limit=\${limit}\`
    );
  }

  /**
   * Busca ${moduleName} por ID
   */
  getById(id: string): Observable<${capitalizedName}Response> {
    return this.http.get<${capitalizedName}Response>(\`\${this.apiUrl}/\${id}\`);
  }

  /**
   * Cria novo ${moduleName}
   */
  create(data: ${capitalizedName}CreateRequest): Observable<${capitalizedName}Response> {
    return this.http.post<${capitalizedName}Response>(this.apiUrl, data);
  }

  /**
   * Atualiza ${moduleName} existente
   */
  update(id: string, data: ${capitalizedName}UpdateRequest): Observable<${capitalizedName}Response> {
    return this.http.put<${capitalizedName}Response>(\`\${this.apiUrl}/\${id}\`, data);
  }

  /**
   * Remove ${moduleName}
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}
`;

    fs.writeFileSync(servicePath, serviceContent);
  }

  // Gera guard usando Angular CLI
  generateGuard(moduleName) {
    const spinner = ora('🛡️ Gerando guard...').start();

    try {
      const guardPath = `${moduleName}/services/${moduleName}`;
      execSync(`ng generate guard ${guardPath} --skip-tests=true`, { stdio: 'pipe' });
      spinner.succeed(`Guard ${moduleName}.guard.ts criado`);
    } catch (error) {
      spinner.fail('Erro ao gerar guard');
      console.error(chalk.red(error.message));
    }
  }

  // Gera layout usando Angular CLI
  generateLayout(moduleName) {
    const spinner = ora('🎨 Gerando layout...').start();

    try {
      const layoutPath = `${moduleName}/layouts/${moduleName}`;
      execSync(`ng generate component ${layoutPath} --type=layout --skip-tests=true --flat=true`, { stdio: 'pipe' });
      spinner.succeed(`Layout ${moduleName}.layout.ts criado`);
    } catch (error) {
      spinner.fail('Erro ao gerar layout');
      console.error(chalk.red(error.message));
    }
  }

  // Gera models TypeScript
  generateModels(moduleName) {
    const spinner = ora('📋 Gerando models...').start();

    try {
      const capitalizedName = this.capitalize(this.toCamelCase(moduleName));
      const modelsPath = path.join(this.modulePath, 'models');

      // Arquivo principal do model
      const modelFile = path.join(modelsPath, `${moduleName}.model.ts`);
      const modelContent = `export interface ${capitalizedName} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // Adicione aqui os campos específicos do ${moduleName}
}

export interface ${capitalizedName}CreateRequest {
  // Adicione aqui os campos necessários para criação
  // Exemplo:
  // name: string;
  // description?: string;
}

export interface ${capitalizedName}UpdateRequest {
  id: string;
  // Adicione aqui os campos necessários para atualização
  // Exemplo:
  // name?: string;
  // description?: string;
}

export interface ${capitalizedName}Response {
  data: ${capitalizedName};
  message?: string;
}

export interface ${capitalizedName}ListResponse {
  data: ${capitalizedName}[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Enums relacionados (se necessário)
export enum ${capitalizedName}Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}
`;

      // Arquivo index.ts para exports
      const indexFile = path.join(modelsPath, 'index.ts');
      const indexContent = `export * from './${moduleName}.model';\n`;

      fs.writeFileSync(modelFile, modelContent);
      fs.writeFileSync(indexFile, indexContent);

      spinner.succeed('Models criados com sucesso');
    } catch (error) {
      spinner.fail('Erro ao gerar models');
      console.error(chalk.red(error.message));
    }
  }

  // Mostra resumo final
  showSummary(options) {
    const generated = [];
    if (options.generateService) generated.push('✅ Service');
    if (options.generateGuard) generated.push('✅ Guard');
    if (options.generateLayout) generated.push('✅ Layout');
    if (options.generateModels) generated.push('✅ Models');

    const summary = `
${chalk.green.bold('🎉 Módulo')} ${chalk.cyan.bold(this.moduleName)} ${chalk.green.bold('gerado com sucesso!')}

${chalk.yellow.bold('Arquivos gerados:')}
${generated.join('\n')}

${chalk.blue.bold('💡 Próximos passos:')}
${chalk.gray('1.')} Configure as rotas em seu módulo de roteamento
${chalk.gray('2.')} Importe os serviços necessários nos componentes
${chalk.gray('3.')} Configure o layout conforme sua arquitetura
${chalk.gray('4.')} Personalize os models em ${this.moduleName}/models/
${chalk.gray('5.')} Use: ${chalk.cyan(`import { ${this.capitalize(this.toCamelCase(this.moduleName))} } from './${this.moduleName}/models'`)}
`;

    console.log(boxen(summary, {
      padding: 1,
      borderColor: 'green',
      borderStyle: 'double'
    }));
  }

  // Método principal
  async run() {
    try {
      this.showBanner();
      this.validateAngularProject();

      const options = await this.collectUserInput();
      this.moduleName = this.toKebabCase(options.moduleName);

      console.log(); // Espaço
      this.createDirectoryStructure(this.moduleName);
      console.log(); // Espaço

      // Gera arquivos conforme opções selecionadas
      if (options.generateService) {
        this.generateService(this.moduleName);
      }

      if (options.generateGuard) {
        this.generateGuard(this.moduleName);
      }

      if (options.generateLayout) {
        this.generateLayout(this.moduleName);
      }

      if (options.generateModels) {
        this.generateModels(this.moduleName);
      }

      console.log(); // Espaço
      this.showSummary(options);

    } catch (error) {
      console.error(chalk.red.bold('❌ Erro inesperado:'), error.message);
      process.exit(1);
    }
  }
}

// Verifica se foi executado diretamente
if (require.main === module) {
  const generator = new AngularModuleGenerator();
  generator.run();
}

module.exports = AngularModuleGenerator;