#!/usr/bin/env node

/**
 * GitHub Trending 数据采集脚本
 */

import 'dotenv/config';
import { existsSync, mkdirSync } from "fs";

// 确保 output 目录存在
if (!existsSync("output")) {
  mkdirSync("output", { recursive: true });
}
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const TRENDING_URL = 'https://github.com/trending';

// 确保 output 目录存在
if (!existsSync('output')) {
  mkdirSync('output', { recursive: true });
  console.log('📁 Created output directory');
}

// ... 其余代码保持不变
