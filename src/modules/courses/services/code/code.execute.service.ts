// src/services/code-execution.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  success: boolean;
}

@Injectable()
export class CodeExecutionService {
  private readonly tempDir = join(process.cwd(), 'temp');

  constructor() {
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async executeCode(
    code: string,
    language: string,
    stdin: string = '',
    timeLimit: number = 5000,
    memoryLimit: number = 128
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const fileId = uuidv4();

    try {
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          return await this.executeJavaScript(code, fileId, stdin, timeLimit);
        case 'python':
        case 'py':
          return await this.executePython(code, fileId, stdin, timeLimit);
        case 'java':
          return await this.executeJava(code, fileId, stdin, timeLimit);
        case 'cpp':
        case 'c++':
          return await this.executeCpp(code, fileId, stdin, timeLimit);
        case 'c':
          return await this.executeC(code, fileId, stdin, timeLimit);
        case 'go':
          return await this.executeGo(code, fileId, stdin, timeLimit);
        default:
          throw new BadRequestException(`Unsupported language: ${language}`);
      }
    } catch (error) {
      return {
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime,
        success: false,
      };
    }
  }

  private async executeJavaScript(
    code: string,
    fileId: string,
    stdin: string,
    timeLimit: number
  ): Promise<ExecutionResult> {
    const fileName = `${fileId}.js`;
    const filePath = join(this.tempDir, fileName);

    try {
      // Wrap the code to handle stdin and capture stdout
      const wrappedCode = `
        const fs = require('fs');
        const readline = require('readline');
        
        // Mock stdin with provided input
        const inputLines = \`${stdin.replace(/`/g, '\\`')}\`.split('\\n').filter(line => line !== '');
        let currentLine = 0;
        
        // Override readline for stdin simulation
        const originalCreateInterface = readline.createInterface;
        readline.createInterface = function() {
          return {
            question: function(query, callback) {
              const input = inputLines[currentLine++] || '';
              callback(input);
            },
            close: function() {}
          };
        };
        
        // Mock process.stdin
        let stdinLines = inputLines.slice();
        const originalStdin = process.stdin;
        process.stdin = {
          ...originalStdin,
          on: function(event, callback) {
            if (event === 'data') {
              for (const line of stdinLines) {
                callback(line + '\\n');
              }
            }
            if (event === 'end') {
              callback();
            }
          },
          read: function() {
            return stdinLines.shift() || null;
          }
        };
        
        const originalLog = console.log;
        const outputs = [];
        console.log = (...args) => {
          outputs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '));
        };
        
        try {
          ${code}
        } catch (error) {
          console.error('Runtime Error:', error.message);
        }
        
        console.log = originalLog;
        console.log(outputs.join('\\n'));
      `;

      writeFileSync(filePath, wrappedCode);

      return await this.runCommand('node', [filePath], timeLimit, stdin);
    } finally {
      this.cleanupFile(filePath);
    }
  }

  private async executePython(
    code: string,
    fileId: string,
    stdin: string,
    timeLimit: number
  ): Promise<ExecutionResult> {
    const fileName = `${fileId}.py`;
    const filePath = join(this.tempDir, fileName);

    try {
      writeFileSync(filePath, code);
      return await this.runCommand('python3', [filePath], timeLimit, stdin);
    } finally {
      this.cleanupFile(filePath);
    }
  }

  private async executeJava(
    code: string,
    fileId: string,
    stdin: string,
    timeLimit: number
  ): Promise<ExecutionResult> {
    const fileName = `${fileId}.java`;
    const filePath = join(this.tempDir, fileName);
    const classPath = join(this.tempDir, `${fileId}.class`);

    try {
      // Extract class name from code
      const classNameMatch = code.match(/public\s+class\s+(\w+)/);
      const className = classNameMatch ? classNameMatch[1] : fileId;

      // Update filename to match class name
      const actualFileName = `${className}.java`;
      const actualFilePath = join(this.tempDir, actualFileName);

      writeFileSync(actualFilePath, code);

      // Compile
      const compileResult = await this.runCommand(
        'javac',
        [actualFilePath],
        timeLimit
      );
      if (!compileResult.success) {
        return compileResult;
      }

      // Execute
      return await this.runCommand(
        'java',
        ['-cp', this.tempDir, className],
        timeLimit,
        stdin
      );
    } finally {
      this.cleanupFile(filePath);
      this.cleanupFile(classPath);
    }
  }

  private async executeCpp(
    code: string,
    fileId: string,
    stdin: string,
    timeLimit: number
  ): Promise<ExecutionResult> {
    const sourceFile = join(this.tempDir, `${fileId}.cpp`);
    const executableFile = join(this.tempDir, fileId);

    try {
      writeFileSync(sourceFile, code);

      // Compile
      const compileResult = await this.runCommand(
        'g++',
        ['-o', executableFile, sourceFile],
        timeLimit
      );
      if (!compileResult.success) {
        return compileResult;
      }

      // Execute
      return await this.runCommand(executableFile, [], timeLimit, stdin);
    } finally {
      this.cleanupFile(sourceFile);
      this.cleanupFile(executableFile);
    }
  }

  private async executeC(
    code: string,
    fileId: string,
    stdin: string,
    timeLimit: number
  ): Promise<ExecutionResult> {
    const sourceFile = join(this.tempDir, `${fileId}.c`);
    const executableFile = join(this.tempDir, fileId);

    try {
      writeFileSync(sourceFile, code);

      // Compile
      const compileResult = await this.runCommand(
        'gcc',
        ['-o', executableFile, sourceFile],
        timeLimit
      );
      if (!compileResult.success) {
        return compileResult;
      }

      // Execute
      return await this.runCommand(executableFile, [], timeLimit, stdin);
    } finally {
      this.cleanupFile(sourceFile);
      this.cleanupFile(executableFile);
    }
  }

  private async executeGo(
    code: string,
    fileId: string,
    stdin: string,
    timeLimit: number
  ): Promise<ExecutionResult> {
    const fileName = `${fileId}.go`;
    const filePath = join(this.tempDir, fileName);

    try {
      writeFileSync(filePath, code);
      return await this.runCommand('go', ['run', filePath], timeLimit, stdin);
    } finally {
      this.cleanupFile(filePath);
    }
  }

  private runCommand(
    command: string,
    args: string[],
    timeLimit: number,
    stdin: string = ''
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const process = spawn(command, args, {
        timeout: timeLimit,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      // Provide stdin input
      if (stdin) {
        process.stdin.write(stdin);
      }
      process.stdin.end();

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        const executionTime = Date.now() - startTime;

        resolve({
          output: stdout.trim(),
          error: stderr.trim() || undefined,
          executionTime,
          success: code === 0 && !stderr.trim(),
        });
      });

      process.on('error', (error) => {
        resolve({
          output: '',
          error: error.message,
          executionTime: Date.now() - startTime,
          success: false,
        });
      });
    });
  }

  private cleanupFile(filePath: string): void {
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (error) {
      console.warn(`Failed to cleanup file ${filePath}:`, error.message);
    }
  }
}
