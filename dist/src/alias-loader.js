import moduleAlias from 'module-alias';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '../');
moduleAlias.addAliases({
    '@utils': path.join(baseDir, 'utils'),
    '@r': baseDir
});
