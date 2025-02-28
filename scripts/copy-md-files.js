const fs = require('fs');
const path = require('path');

function copyDirectory(source, destination) {
  // 确保目标目录存在
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // 读取源目录
  const files = fs.readdirSync(source);

  // 复制每个文件
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      // 如果是目录，递归复制
      copyDirectory(sourcePath, destPath);
    } else {
      // 如果是文件，直接复制
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

try {
  const sourceDir = path.join(__dirname, '../public/md');
  const destDir = path.join(__dirname, '../dist/md');

  if (fs.existsSync(sourceDir)) {
    copyDirectory(sourceDir, destDir);
    console.log('✅ MD文件复制成功！');
  } else {
    console.log('⚠️ MD文件夹不存在，跳过复制');
  }
} catch (error) {
  console.error('❌ 复制过程中发生错误：', error);
  process.exit(1);
}
