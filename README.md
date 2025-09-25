# Modularizer CLI

Uma interface de linha de comando (CLI) poderosa para gerar módulos Angular padronizados e modulares. O `Modularizer` simplifica a criação de módulos Angular com uma estrutura consistente, incluindo serviços, guards, layouts e models, promovendo modularidade e reutilização de código em projetos Angular.

## Funcionalidades

- **Geração de Módulos Padronizados**: Cria módulos Angular com uma estrutura de diretórios predefinida (`services`, `layouts`, `components`, `models`).
- **Componentes Personalizáveis**: Gera automaticamente serviços, guards, layouts e models TypeScript com base nas opções do usuário.
- **Integração com Angular CLI**: Usa comandos `ng generate` para criar arquivos compatíveis com o ecossistema Angular.
- **Interatividade**: Prompts intuitivos para coletar o nome do módulo e opções de geração (usando `inquirer`).
- **Feedback Visual**: Interface amigável com banners (`figlet`), spinners (`ora`), caixas de texto (`boxen`) e cores (`chalk`) para uma experiência de usuário agradável.
- **Validação Robusta**: Verifica se o comando está sendo executado em um projeto Angular válido e valida nomes de módulos.
- **Estrutura Extensível**: Gera serviços com operações CRUD básicas e models com interfaces TypeScript prontas para personalização.

## Propósito

O `Modularizer` foi projetado para:
- **Padronizar a Estrutura de Módulos**: Garante que todos os módulos Angular sigam uma convenção consistente, facilitando a manutenção e escalabilidade.
- **Promover Modularidade**: Organiza o código em pastas específicas (`services`, `layouts`, `components`, `models`), incentivando a separação de responsabilidades.
- **Acelerar o Desenvolvimento**: Automatiza a criação de boilerplate, reduzindo o tempo gasto em configurações manuais.
- **Facilitar a Reutilização**: Fornece uma base sólida para módulos que podem ser facilmente compartilhados ou reutilizados em outros projetos.

## Pré-requisitos

- **Node.js**: Versão 18.x ou superior (testado com v22.18.0).
- **npm**: Incluído com o Node.js.
- **Angular CLI**: Instalado globalmente (`npm install -g @angular/cli`).
- **Projeto Angular**: Um projeto Angular válido com `angular.json` e diretório `src/app`.

## Instalação

Instale o `Modularizer` globalmente via npm:

```bash
npm install -g @bethecozmo/modularizer
```

Isso registra o comando `modularizer` para uso em qualquer diretório.

## Configuração

Certifique-se de estar na raiz de um projeto Angular (onde existe o arquivo `angular.json`). O `Modularizer` valida automaticamente a presença do projeto Angular antes de executar.

Se desejar personalizar a estrutura de diretórios ou templates, você pode contribuir com o projeto (veja [Contribuindo](#contribuindo)).

## Comandos

```bash
modularizer
```

Executar o comando `modularizer` inicia o processo interativo, que inclui:

1. **Validação do Projeto**: Verifica se você está em um projeto Angular.
2. **Prompts Interativos**: Solicita o nome do módulo e opções para gerar:
   - Service (`services/${moduleName}.service.ts`)
   - Guard (`services/${moduleName}.guard.ts`)
   - Layout (`layouts/${moduleName}.layout.ts`)
   - Models (`models/${moduleName}.model.ts` e `models/index.ts`)
3. **Criação de Estrutura**: Gera a seguinte estrutura de diretórios:
   ```
   src/app/<module-name>/
   ├── services/
   ├── layouts/
   ├── components/
   └── models/
   ```
4. **Resumo Final**: Exibe um resumo dos arquivos gerados e próximos passos.

Use `modularizer --help` para mais detalhes (futuro suporte planejado).

## Exemplo de Uso

1. **Iniciar o Modularizer**:
   ```bash
   modularizer
   ```

2. **Responda aos Prompts**:
   - Nome do módulo: `meu-modulo`
   - Gerar service? [Sim/Não]
   - Gerar guard? [Sim/Não]
   - Gerar layout? [Sim/Não]
   - Gerar models? [Sim/Não]

3. **Estrutura Gerada** (exemplo para `meu-modulo`):
   ```
   src/app/meu-modulo/
   ├── services/
   │   └── meu-modulo.service.ts
   ├── layouts/
   │   └── meu-modulo.layout.ts
   ├── components/
   └── models/
       ├── meu-modulo.model.ts
       └── index.ts
   ```

4. **Exemplo de Service Gerado**:
   ```typescript
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { MeuModulo, MeuModuloCreateRequest, MeuModuloUpdateRequest, MeuModuloResponse, MeuModuloListResponse } from '../models';

   @Injectable({
     providedIn: 'root'
   })
   export class MeuModuloService {
     private readonly apiUrl = '/api/meu-modulo';

     constructor(private http: HttpClient) {}

     getAll(page: number = 1, limit: number = 10): Observable<MeuModuloListResponse> {
       return this.http.get<MeuModuloListResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
     }
     // ... outros métodos CRUD
   }
   ```

5. **Exemplo de Model Gerado**:
   ```typescript
   export interface MeuModulo {
     id: string;
     createdAt: Date;
     updatedAt: Date;
     // Adicione aqui os campos específicos do meu-modulo
   }

   export interface MeuModuloCreateRequest {
     // Adicione aqui os campos necessários para criação
   }
   // ... outras interfaces
   ```

## Estrutura do Módulo Gerado

Os módulos gerados seguem o formato:

```
src/app/<module-name>/
├── services/
│   └── <module-name>.service.ts (se selecionado)
├── layouts/
│   └── <module-name>.layout.ts (se selecionado)
├── components/
└── models/
    ├── <module-name>.model.ts (se selecionado)
    └── index.ts (se selecionado)
```

- **Services**: Incluem métodos CRUD prontos para integração com APIs REST.
- **Layouts**: Componentes Angular para layouts reutilizáveis.
- **Models**: Interfaces TypeScript para tipagem de dados (create, update, response, list).
- **Components**: Diretório vazio para adicionar componentes manualmente.

## Notas

- **Validação**: O comando só funciona na raiz de um projeto Angular (com `angular.json` e `src/app`).
- **Personalização**: Os arquivos gerados são boilerplates. Personalize os models e serviços conforme necessário.
- **Dependências do Angular CLI**: Certifique-se de que o Angular CLI está instalado e compatível com sua versão do Angular.

## Solução de Problemas

- **Erro: "Este comando deve ser executado na raiz de um projeto Angular"**:
  - Verifique se você está no diretório correto do projeto Angular.
  - Confirme a presença de `angular.json` e `src/app`.

- **Erro: "command not found: modularizer"**:
  - Instale globalmente com `npm install -g @bethecozmo/modularizer`.
  - Verifique se o npm global está no PATH: `npm bin -g`.

- **Erro ao executar `ng generate`**:
  - Confirme que o Angular CLI está instalado (`npm install -g @angular/cli`).
  - Verifique a compatibilidade entre o Angular CLI e a versão do seu projeto Angular.

## Publicação no npm (para mantenedores)

1. Crie uma conta no [npmjs.com](https://www.npmjs.com/).
2. No diretório do projeto, faça login:
   ```bash
   npm login
   ```
3. Publique o pacote:
   ```bash
   npm publish --access public
   ```
   - Nota: Use um nome único ou escopo (ex.: `@seu-nome/modularizer`) para evitar conflitos.

## Contribuindo

Sinta-se à vontade para abrir *issues* ou *pull requests* no repositório oficial. Sugestões de melhorias incluem:
- Suporte para geração de módulos de roteamento.
- Opção para incluir testes unitários.
- Configuração via arquivo `.modularizer.config.json`.

Para feedback, entre em contato com a equipe de desenvolvimento.

## Licença

MIT License. Veja [LICENSE](LICENSE) para detalhes.